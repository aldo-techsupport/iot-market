<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Device;
use App\Models\Subscription;
use App\Models\SubscriptionSensor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['user', 'sensors'])
            ->latest()
            ->paginate(20);

        $stats = [
            'pending' => Order::where('status', 'pending')->count(),
            'approved' => Order::where('status', 'approved')->count(),
            'rejected' => Order::where('status', 'rejected')->count(),
            'total' => Order::count(),
        ];

        return inertia('admin/orders/index', [
            'orders' => $orders,
            'stats' => $stats,
        ]);
    }

    public function show($id)
    {
        $order = Order::with(['user', 'sensors'])
            ->findOrFail($id);

        return inertia('admin/orders/show', [
            'order' => $order,
        ]);
    }

    public function approve(Request $request, $id)
    {
        $order = Order::with(['sensors', 'package'])->findOrFail($id);

        if ($order->status !== 'pending') {
            return back()->with('error', 'Order sudah diproses sebelumnya.');
        }

        // Cek apakah order sudah punya device configuration
        $hasDeviceConfig = !empty($order->device_name) && $order->sensors->count() > 0;

        if ($hasDeviceConfig) {
            // Flow lama: Order sudah ada device config, langsung create device
            return $this->approveWithDeviceCreation($order);
        } else {
            // Flow baru: Order belum ada device config, hanya approve order
            // User akan setup device setelah order approved
            $order->update([
                'status' => 'approved',
                'paid_at' => now(),
            ]);

            Log::info('Order approved, waiting for device setup', [
                'order_id' => $order->id,
                'user_id' => $order->user_id,
            ]);

            return redirect()->route('admin.orders.index')
                ->with('success', 'Order berhasil disetujui! User dapat melakukan setup device sekarang.');
        }
    }

    /**
     * Approve order dan create device (untuk order yang sudah ada device config)
     */
    private function approveWithDeviceCreation($order)
    {
        // Generate device code
        $deviceCode = 'DEV' . str_pad($order->id, 4, '0', STR_PAD_LEFT) . strtoupper(\Illuminate\Support\Str::random(4));

        // Prepare sensor configuration for IoT API V2
        $sensorConfigs = $order->sensors->map(function($sensor) {
            return [
                'variable' => $sensor->pivot->variable_name,
                'custom_name' => $this->sanitizeString($sensor->pivot->custom_name),
                'unit' => $this->sanitizeString($sensor->pivot->unit ?? ''),
            ];
        })->toArray();

        $deviceData = [
            'device_id' => $deviceCode,
            'device_name' => $this->sanitizeString($order->device_name),
            'sensors' => $sensorConfigs,
            'description' => $this->sanitizeString($order->device_description ?? ''),
        ];

        Log::info('Creating device in IoT API', [
            'order_id' => $order->id,
            'device_data' => $deviceData
        ]);

        // Check if device already exists
        $device = Device::where('device_code', $deviceCode)->first();
        
        if (!$device) {
            // Create device via IoT API V2
            $iotResponse = iot_api()->createDevice($deviceData);

            if (!$iotResponse['success']) {
                $errorMessage = $iotResponse['message'] ?? 'Unknown error';
                
                Log::error('IoT API device creation failed', [
                    'order_id' => $order->id,
                    'device_data' => $deviceData,
                    'response' => $iotResponse
                ]);
                
                return back()->with('error', 'Gagal membuat device di IoT API: ' . $errorMessage);
            }

            // Buat device di database lokal
            $device = Device::create([
                'user_id' => $order->user_id,
                'name' => $order->device_name,
                'device_code' => $deviceCode,
                'api_key' => $iotResponse['data']['api_key'] ?? null,
                'location' => $order->device_location,
                'description' => $order->device_description,
                'status' => 'active',
                'activated_at' => now(),
            ]);
            
            Log::info('Device created successfully', [
                'order_id' => $order->id,
                'device_id' => $device->id,
                'device_code' => $deviceCode
            ]);
        }

        // Buat subscription
        $subscription = Subscription::create([
            'user_id' => $order->user_id,
            'device_id' => $device->id,
            'monitoring_package_id' => $order->monitoring_package_id,
            'total_price' => $order->total_amount,
            'status' => 'active',
            'start_date' => now(),
            'end_date' => now()->addMonth(),
        ]);

        // Attach sensors ke subscription
        foreach ($order->sensors as $sensor) {
            SubscriptionSensor::create([
                'subscription_id' => $subscription->id,
                'sensor_id' => $sensor->id,
                'variable_name' => $sensor->pivot->variable_name,
                'custom_name' => $sensor->pivot->custom_name,
                'unit' => $sensor->pivot->unit,
                'price' => $sensor->pivot->price,
            ]);
        }

        // Update order
        $order->update([
            'status' => 'approved',
            'subscription_id' => $subscription->id,
            'device_id' => $device->id,
            'paid_at' => now(),
        ]);

        return redirect()->route('admin.orders.index')
            ->with('success', 'Order berhasil disetujui! Device telah dibuat di IoT API dengan code: ' . $deviceCode);
    }

    public function reject(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        if ($order->status !== 'pending') {
            return back()->with('error', 'Order sudah diproses sebelumnya.');
        }

        $validated = $request->validate([
            'rejection_reason' => 'nullable|string',
        ]);

        $order->update([
            'status' => 'rejected',
        ]);

        return redirect()->route('admin.orders.index')
            ->with('success', 'Order telah ditolak.');
    }

    /**
     * Sanitize string to prevent regex validation errors in IoT API
     * Removes special characters that might cause issues
     */
    private function sanitizeString(?string $string): string
    {
        if (empty($string)) {
            return '';
        }

        // Remove special characters that might cause regex issues
        // Keep: letters, numbers, spaces, and common symbols used in sensor names/units
        return preg_replace('/[^\p{L}\p{N}\s\-\_\.\,\(\)\%\°\³\²\/]/u', '', $string);
    }
}
