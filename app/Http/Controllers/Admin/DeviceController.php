<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Device;
use App\Models\Subscription;
use App\Models\SubscriptionSensor;
use App\Models\Order;
use App\Services\IoTApiService;
use Illuminate\Http\Request;

class DeviceController extends Controller
{
    public function __construct(private IoTApiService $iotService) {}
    public function index(Request $request)
    {
        $search = $request->input('search');
        $filter = $request->input('filter', 'all'); // all, active, expired

        $devices = Device::with(['user', 'subscriptions' => fn($q) => $q->latest()])
            ->when($search, fn($q) => $q->where(fn($q2) =>
                $q2->where('name', 'like', "%{$search}%")
                    ->orWhere('device_code', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhereHas('user', fn($q3) => $q3->where('name', 'like', "%{$search}%"))
            ))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        // Map with subscription info
        $devices->getCollection()->transform(function ($device) {
            $sub = $device->subscriptions->first();
            $device->subscription_info = $sub ? [
                'id'             => $sub->id,
                'status'         => $sub->status,
                'start_date'     => $sub->start_date?->toDateString(),
                'end_date'       => $sub->end_date?->toDateString(),
                'days_remaining' => $sub->daysRemaining(),
                'expiry_status'  => $sub->expiryStatus(),
                'is_expired'     => $sub->isExpired(),
            ] : null;
            return $device;
        });

        return inertia('admin/devices/index', [
            'devices' => $devices,
            'search'  => $search,
        ]);
    }

    public function show($id)
    {
        $device = Device::with(['user'])->findOrFail($id);

        $subscription = Subscription::where('device_id', $id)
            ->with(['package'])
            ->orderBy('end_date', 'desc')
            ->first();

        $sensors = SubscriptionSensor::where(
            'subscription_id',
            $subscription?->id
        )->get();

        // Fallback: ambil dari order sensors
        if ($sensors->isEmpty()) {
            $order = Order::with(['sensors'])
                ->where('device_id', $id)
                ->where('status', 'approved')
                ->latest()
                ->first();
            $orderSensors = $order?->sensors ?? collect();
        } else {
            $orderSensors = collect();
        }

        $subscriptionInfo = null;
        if ($subscription) {
            $subscriptionInfo = [
                'id'             => $subscription->id,
                'status'         => $subscription->status,
                'start_date'     => $subscription->start_date?->toDateString(),
                'end_date'       => $subscription->end_date?->toDateString(),
                'days_remaining' => $subscription->daysRemaining(),
                'expiry_status'  => $subscription->expiryStatus(),
                'is_expired'     => $subscription->isExpired(),
                'package'        => $subscription->package ? [
                    'id'   => $subscription->package->id,
                    'name' => $subscription->package->name,
                ] : null,
            ];
        }

        return inertia('admin/devices/show', [
            'device'       => $device,
            'subscription' => $subscriptionInfo,
            'sensors'      => $sensors,
            'orderSensors' => $orderSensors,
        ]);
    }

    public function update(Request $request, $id)
    {
        $device = Device::findOrFail($id);

        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'location'    => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
        ]);

        $device->update($validated);

        return back()->with('success', 'Data perangkat berhasil diperbarui!');
    }

    public function updateSubscription(Request $request, $id)
    {
        $subscription = Subscription::where('device_id', $id)
            ->orderBy('end_date', 'desc')
            ->firstOrFail();

        $validated = $request->validate([
            'end_date' => 'required|date|after:today',
            'status'   => 'required|in:active,expired,cancelled',
        ]);

        // Jika diaktifkan kembali, set start_date jika kosong
        if ($validated['status'] === 'active' && $subscription->start_date === null) {
            $subscription->start_date = now();
        }

        $subscription->update([
            'end_date' => $validated['end_date'],
            'status'   => $validated['status'],
        ]);

        // Bersihkan cache IoT saat subscription diperbarui/diperpanjang
        // supaya data langsung bisa diakses kembali
        $device = Device::find($id);
        if ($device && $device->device_code) {
            $this->iotService->clearDeviceCache($device->device_code);
        }

        return back()->with('success', 'Durasi subscription berhasil diperbarui! Cache data telah dibersihkan.');
    }

    public function updateSensor(Request $request, $deviceId, $sensorId)
    {
        $sensor = SubscriptionSensor::findOrFail($sensorId);

        // Verifikasi sensor milik subscription device ini
        $subscription = Subscription::where('device_id', $deviceId)->firstOrFail();
        if ($sensor->subscription_id !== $subscription->id) {
            return back()->with('error', 'Sensor tidak ditemukan!');
        }

        $validated = $request->validate([
            'custom_name'   => 'required|string|max:255',
            'unit'          => 'nullable|string|max:50',
            'variable_name' => 'required|string|in:V1,V2,V3,V4,V5,V6,V7,V8,V9,V10,V11,V12,V13,V14,V15,V16,V17,V18,V19,V20',
        ]);

        $sensor->update($validated);

        return back()->with('success', 'Sensor berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $device = Device::findOrFail($id);

        Subscription::where('device_id', $device->id)->delete();
        Order::where('device_id', $device->id)->update(['device_id' => null]);

        $device->delete();

        return redirect()->route('admin.devices.index')
            ->with('success', 'Perangkat berhasil dihapus!');
    }
}
