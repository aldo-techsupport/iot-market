<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\MonitoringPackage;
use App\Models\PricingPackage;
use App\Models\Sensor;
use App\Models\Device;
use App\Models\Subscription;
use App\Models\SubscriptionSensor;
use App\Services\IoTApiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class MemberAreaController extends Controller
{
    protected IoTApiService $iotService;

    public function __construct(IoTApiService $iotService)
    {
        $this->iotService = $iotService;
    }

    /**
     * User Dashboard - list semua device milik user
     */
    public function userDashboard()
    {
        $userId = auth()->id();

        // Ambil semua device milik user
        $dbDevices = Device::where('user_id', $userId)
            ->latest()
            ->get();

        $devices = $dbDevices->map(function ($device) {
            // Ambil data terakhir dari IoT API untuk menentukan status real
            $dynamicStatus = 'offline';
            $lastSeen       = null;

            if ($device->device_code) {
                $latestResponse = $this->iotService->getLatestData($device->device_code);

                if (isset($latestResponse['success']) && $latestResponse['success']) {
                    $latestData = $latestResponse['data'] ?? null;
                    $timestamp  = $latestData['timestamp'] ?? $latestData['created_at'] ?? null;

                    if ($timestamp) {
                        $lastDataTime = Carbon::parse($timestamp);
                        $minutesAgo   = $lastDataTime->diffInMinutes(now());

                        if ($minutesAgo <= 1) {
                            $dynamicStatus = 'online';
                        } elseif ($minutesAgo <= 5) {
                            $dynamicStatus = 'idle';
                        } else {
                            $dynamicStatus = 'offline';
                        }

                        $lastSeen = $lastDataTime->diffForHumans();
                    }
                }
            }

            // Hitung jumlah sensor dari order yang approved
            $sensorsCount = Order::where('device_id', $device->id)
                ->where('status', 'approved')
                ->withCount('sensors')
                ->latest()
                ->first()?->sensors_count ?? 0;

            return [
                'id'            => $device->id,
                'name'          => $device->name,
                'device_code'   => $device->device_code,
                'location'      => $device->location,
                'description'   => $device->description,
                'status'        => $dynamicStatus,
                'api_key'       => $device->api_key,
                'activated_at'  => $device->activated_at?->toDateString(),
                'last_seen'     => $lastSeen,
                'sensors_count' => $sensorsCount,
            ];
        })->toArray();

        $hasActiveOrder = Order::where('user_id', $userId)
            ->where('status', 'approved')
            ->whereNotNull('device_id')
            ->exists();

        $stats = [
            'total'   => count($devices),
            'online'  => collect($devices)->where('status', 'online')->count(),
            'idle'    => collect($devices)->where('status', 'idle')->count(),
            'offline' => collect($devices)->where('status', 'offline')->count(),
        ];

        return inertia('user/dashboard', [
            'devices'        => $devices,
            'stats'          => $stats,
            'hasActiveOrder' => $hasActiveOrder,
        ]);
    }

    /**
     * Update device info (from user dashboard)
     */
    public function updateDevice(Request $request, $id)
    {
        $device = Device::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'location'    => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
        ]);

        $device->update([
            'name'        => $validated['name'],
            'location'    => $validated['location'],
            'description' => $validated['description'],
        ]);

        return redirect()->route('dashboard')
            ->with('success', 'Perangkat berhasil diperbarui!');
    }

    /**
     * Delete device (from user dashboard)
     */
    public function deleteDevice($id)
    {
        $device = Device::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        // Hapus data terkait
        Subscription::where('device_id', $device->id)->delete();
        Order::where('device_id', $device->id)->update(['device_id' => null]);

        $device->delete();

        return redirect()->route('dashboard')
            ->with('success', 'Perangkat berhasil dihapus!');
    }

    /**
     * Show monitoring per device (by local device ID)
     */
    public function monitoringDevice($id)
    {
        // Pastikan device milik user ini
        $device = Device::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        // Ambil order yang terkait dengan device ini
        $order = Order::with(['sensors'])
            ->where('device_id', $device->id)
            ->where('status', 'approved')
            ->latest()
            ->first();

        if (!$order) {
            return redirect()->route('dashboard')
                ->with('error', 'Tidak ada data order untuk perangkat ini.');
        }

        $latestData = null;
        $statistics = null;

        if ($device->device_code) {
            $latestDataResponse = $this->iotService->getLatestData($device->device_code);
            $statisticsResponse = $this->iotService->getStatistics($device->device_code);

            if (isset($latestDataResponse['success']) && $latestDataResponse['success']) {
                $latestData = $latestDataResponse['data'] ?? null;
            }

            if (isset($statisticsResponse['success']) && $statisticsResponse['success']) {
                $statistics = $statisticsResponse['data'] ?? null;
            }
        }

        return inertia('member/monitoring', [
            'device'     => $device,
            'order'      => $order,
            'sensors'    => $order->sensors,
            'latestData' => $latestData,
            'statistics' => $statistics,
        ]);
    }

    /**
     * Show monitoring log per device (by local device ID)
     */
    public function monitoringLog($id)
    {
        // Pastikan device milik user ini
        $device = Device::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        // Ambil order yang terkait dengan device ini
        $order = Order::with(['sensors'])
            ->where('device_id', $device->id)
            ->where('status', 'approved')
            ->latest()
            ->first();

        if (!$order) {
            return redirect()->route('dashboard')
                ->with('error', 'Tidak ada data order untuk perangkat ini.');
        }

        return inertia('member/monitoring-log', [
            'device'     => $device,
            'sensors'    => $order->sensors,
        ]);
    }

    /**
     * Show monitoring dashboard (latest device - fallback)
     */
    public function monitoring()
    {
        // Get user's approved order with device
        $order = Order::with(['sensors', 'device'])
            ->where('user_id', auth()->id())
            ->where('status', 'approved')
            ->whereNotNull('device_id')
            ->latest()
            ->first();

        if (!$order || !$order->device) {
            return redirect()->route('member.area')
                ->with('error', 'Anda belum memiliki device aktif. Silakan buat order terlebih dahulu.');
        }

        $device = $order->device;
        
        // Get latest sensor data from IoT API
        $latestData = null;
        $statistics = null;
        
        if ($device->device_code) {
            $latestDataResponse = $this->iotService->getLatestData($device->device_code);
            $statisticsResponse = $this->iotService->getStatistics($device->device_code);
            
            if (isset($latestDataResponse['success']) && $latestDataResponse['success']) {
                $latestData = $latestDataResponse['data'] ?? null;
            }
            
            if (isset($statisticsResponse['success']) && $statisticsResponse['success']) {
                $statistics = $statisticsResponse['data'] ?? null;
            }
        }

        return inertia('member/monitoring', [
            'device' => $device,
            'order' => $order,
            'sensors' => $order->sensors,
            'latestData' => $latestData,
            'statistics' => $statistics,
        ]);
    }

    /**
     * Get real-time sensor data (API endpoint)
     * Supports optional ?device_id= for per-device monitoring
     */
    public function getSensorData(Request $request)
    {
        $userId   = auth()->id();
        $deviceId = $request->input('device_id'); // local DB device ID

        if ($deviceId) {
            // Per-device fetch: hanya milik user ini
            $device = Device::where('id', $deviceId)
                ->where('user_id', $userId)
                ->first();
        } else {
            // Fallback: device dari order approved terbaru
            $order = Order::with(['device'])
                ->where('user_id', $userId)
                ->where('status', 'approved')
                ->whereNotNull('device_id')
                ->latest()
                ->first();
            $device = $order?->device;
        }

        if (!$device) {
            return response()->json(['success' => false, 'message' => 'Device not found'], 404);
        }

        if (!$device->device_code) {
            return response()->json(['success' => false, 'message' => 'Device code not configured'], 400);
        }

        $latestData = $this->iotService->getLatestData($device->device_code);

        return response()->json($latestData);
    }

    /**
     * Get sensor history data
     * Supports optional ?device_id= for per-device monitoring
     */
    public function getSensorHistory(Request $request)
    {
        $userId   = auth()->id();
        $deviceId = $request->input('device_id');

        if ($deviceId) {
            $device = Device::where('id', $deviceId)->where('user_id', $userId)->first();
        } else {
            $order  = Order::with(['device'])
                ->where('user_id', $userId)
                ->where('status', 'approved')
                ->whereNotNull('device_id')
                ->latest()
                ->first();
            $device = $order?->device;
        }

        if (!$device) {
            return response()->json(['success' => false, 'message' => 'Device not found'], 404);
        }

        if (!$device->device_code) {
            return response()->json(['success' => false, 'message' => 'Device code not configured'], 400);
        }

        $perPage     = $request->input('per_page', 50);
        $historyData = $this->iotService->getDataHistory($device->device_code, $perPage);

        return response()->json($historyData);
    }

    /**
     * Show checkout page for selected package
     */
    public function checkout(Request $request)
    {
        $packageId = $request->input('package_id');
        
        if (!$packageId) {
            return redirect()->route('member.area')
                ->with('error', 'Pilih paket terlebih dahulu!');
        }

        $package = MonitoringPackage::findOrFail($packageId);

        return inertia('member/checkout', [
            'package' => $package,
        ]);
    }

    /**
     * Create order (payment) - device setup comes AFTER approval
     */
    public function createOrder(Request $request)
    {
        $validated = $request->validate([
            'package_id' => 'required|exists:monitoring_packages,id',
            'payment_method' => 'nullable|string',
        ]);

        $package = MonitoringPackage::findOrFail($validated['package_id']);

        // Buat order untuk pembayaran (belum ada device)
        $order = Order::create([
            'user_id' => auth()->id(),
            'monitoring_package_id' => $package->id,
            'order_number' => Order::generateOrderNumber(),
            'total_amount' => $package->base_price,
            'status' => 'pending',
            'payment_method' => $validated['payment_method'] ?? null,
        ]);

        return redirect()->route('member.order.show', $order->id)
            ->with('success', 'Order berhasil dibuat! Silakan tunggu verifikasi admin dalam 1x24 jam. Setelah approved, Anda bisa setup device.');
    }

    /**
     * Show device setup page (only accessible AFTER order approved)
     */
    public function setupDevice(Request $request)
    {
        $orderId = $request->input('order_id');
        
        if (!$orderId) {
            return redirect()->route('member.orders')
                ->with('error', 'Order ID tidak ditemukan!');
        }

        // Cek apakah order sudah approved
        $order = Order::where('id', $orderId)
            ->where('user_id', auth()->id())
            ->where('status', 'approved')
            ->whereNull('device_id') // Belum punya device
            ->first();

        if (!$order) {
            return redirect()->route('member.orders')
                ->with('error', 'Order tidak ditemukan atau belum diapprove admin!');
        }

        $package = $order->package;

        $sensors = Sensor::where('is_active', true)
            ->orderBy('name')
            ->get();

        // Generate available variables based on package limit
        $maxSensors = min($package->max_sensors, 20);
        $availableVariables = [];
        for ($i = 1; $i <= $maxSensors; $i++) {
            $availableVariables[] = 'V' . $i;
        }

        return inertia('member/device-setup', [
            'order' => $order,
            'package' => $package,
            'sensors' => $sensors,
            'availableVariables' => $availableVariables,
        ]);
    }

    /**
     * Save device configuration to existing approved order
     */
    public function saveDeviceSetup(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'device_name' => 'required|string|max:255',
            'device_location' => 'required|string|max:255',
            'device_description' => 'nullable|string',
            'sensors' => 'required|array|min:1|max:20',
            'sensors.*.sensor_id' => 'nullable|exists:sensors,id',
            'sensors.*.variable_name' => 'required|string|in:V1,V2,V3,V4,V5,V6,V7,V8,V9,V10,V11,V12,V13,V14,V15,V16,V17,V18,V19,V20',
            'sensors.*.custom_name' => 'required|string|max:255',
            'sensors.*.unit' => 'nullable|string|max:50',
        ]);

        // Get order and verify
        $order = Order::where('id', $validated['order_id'])
            ->where('user_id', auth()->id())
            ->where('status', 'approved')
            ->whereNull('device_id')
            ->firstOrFail();

        $package = $order->package;

        // Validasi jumlah sensor tidak melebihi limit paket
        if (count($validated['sensors']) > $package->max_sensors) {
            return back()->withErrors(['sensors' => "Paket {$package->name} maksimal {$package->max_sensors} sensor!"]);
        }

        // Validasi unique variable names
        $variableNames = collect($validated['sensors'])->pluck('variable_name');
        if ($variableNames->count() !== $variableNames->unique()->count()) {
            return back()->withErrors(['sensors' => 'Variable names must be unique!']);
        }

        // Update order dengan device info
        $order->update([
            'device_name' => $validated['device_name'],
            'device_location' => $validated['device_location'],
            'device_description' => $validated['device_description'],
        ]);

        // Simpan sensor configuration
        foreach ($validated['sensors'] as $sensorConfig) {
            $order->sensors()->attach($sensorConfig['sensor_id'] ?? null, [
                'variable_name' => $sensorConfig['variable_name'],
                'custom_name' => $sensorConfig['custom_name'],
                'unit' => $sensorConfig['unit'] ?? null,
                'price' => 0,
            ]);
        }

        // Sekarang create device di IoT API
        $deviceCode = 'DEV' . str_pad($order->id, 4, '0', STR_PAD_LEFT) . strtoupper(\Illuminate\Support\Str::random(4));

        // Prepare sensor configuration for IoT API V2
        $sensorConfigs = collect($validated['sensors'])->map(function($sensor) {
            return [
                'variable' => $sensor['variable_name'],
                'custom_name' => $this->sanitizeString($sensor['custom_name']),
                'unit' => $this->sanitizeString($sensor['unit'] ?? ''),
            ];
        })->toArray();

        $deviceData = [
            'device_id' => $deviceCode,
            'device_name' => $this->sanitizeString($validated['device_name']),
            'sensors' => $sensorConfigs,
            'description' => $this->sanitizeString($validated['device_description'] ?? ''),
        ];

        Log::info('Creating device in IoT API after user setup', [
            'order_id' => $order->id,
            'device_data' => $deviceData
        ]);

        // Create device via IoT API V2
        $iotResponse = $this->iotService->createDevice($deviceData);

        if (!$iotResponse['success']) {
            $errorMessage = $iotResponse['message'] ?? 'Unknown error';
            
            Log::error('IoT API device creation failed', [
                'order_id' => $order->id,
                'device_data' => $deviceData,
                'response' => $iotResponse
            ]);
            
            return back()->with('error', 'Device configuration tersimpan, tapi gagal membuat device di IoT API: ' . $errorMessage . '. Admin akan segera memprosesnya.');
        }

        // Buat device di database lokal
        $device = Device::create([
            'user_id' => $order->user_id,
            'name' => $validated['device_name'],
            'device_code' => $deviceCode,
            'api_key' => $iotResponse['data']['api_key'] ?? null,
            'location' => $validated['device_location'],
            'description' => $validated['device_description'],
            'status' => 'active',
            'activated_at' => now(),
        ]);

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
                'price' => 0,
            ]);
        }

        // Update order dengan device_id dan subscription_id
        $order->update([
            'device_id' => $device->id,
            'subscription_id' => $subscription->id,
        ]);

        Log::info('Device created successfully after user setup', [
            'order_id' => $order->id,
            'device_id' => $device->id,
            'device_code' => $deviceCode,
            'api_key' => $device->api_key,
        ]);

        $examplePayload = [
            'device_id' => $deviceCode
        ];
        foreach ($validated['sensors'] as $index => $sensorConfig) {
            // Assign some dummy continuous values just for the example
            $examplePayload[strtolower($sensorConfig['variable_name'])] = 25.5 + ($index * 5); 
        }
        $exampleJson = json_encode($examplePayload, JSON_UNESCAPED_SLASHES);

        $endpointUrl = config('iot-api.base_url') . '/api/iot/data';
        $apiKey = $device->api_key;
        $curlCommand = "curl -X POST {$endpointUrl} \\\n" .
                       "  -H \"Content-Type: application/json\" \\\n" .
                       "  -H \"X-Device-Key: {$apiKey}\" \\\n" .
                       "  -d '{$exampleJson}'";

        return redirect()->route('member.order.show', $order->id)
            ->with('success', 'Device berhasil dikonfigurasi dan dibuat!')
            ->with('new_device', [
                'name' => $device->name,
                'api_key' => $device->api_key,
                'endpoint' => "POST {$endpointUrl}",
                'curl' => $curlCommand
            ]);
    }

    /**
     * Sanitize string to prevent regex validation errors in IoT API
     */
    private function sanitizeString(?string $string): string
    {
        if (empty($string)) {
            return '';
        }
        return preg_replace('/[^\p{L}\p{N}\s\-\_\.\,\(\)\%\°\³\²\/]/u', '', $string);
    }

    public function showOrder($id)
    {
        $order = Order::with(['sensors', 'user', 'package'])
            ->where('user_id', auth()->id())
            ->findOrFail($id);

        return inertia('member/order', [
            'order' => $order,
        ]);
    }

    public function orders()
    {
        $orders = Order::with(['sensors'])
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return inertia('member/orders', [
            'orders' => $orders,
        ]);
    }
}
