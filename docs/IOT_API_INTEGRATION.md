# IoT API Integration Guide - V2

## 🆕 V2 Update - Variable System

API IoT telah diupgrade ke V2 dengan sistem variable V1-V20 yang fleksibel:
- 20 variable yang dapat dikustomisasi (V1-V20)
- Custom name untuk setiap variable
- Custom unit untuk setiap variable
- Data disimpan sebagai string untuk fleksibilitas maksimal

**Dokumentasi Migrasi:** Lihat `docs/IOT_API_V2_MIGRATION.md`

## 📡 Base URL Configuration

API IoT terpisah dari aplikasi utama dan berjalan di:
```
https://api-iot.digitaltekno.cloud
```

## ⚙️ Setup

### 1. Environment Variables

Tambahkan di `.env`:
```env
IOT_API_URL=https://api-iot.digitaltekno.cloud
IOT_API_TIMEOUT=30
IOT_API_VERSION=v2
```

### 2. CORS Configuration

CORS sudah dikonfigurasi untuk:
- `https://digitaltekno.cloud`
- `https://api-iot.digitaltekno.cloud`
- `http://localhost:8000` (development)

File: `config/cors.php`

## 🔧 Cara Penggunaan

### Method 1: Menggunakan Helper Function

```php
// Get available sensors (V2 - returns V1-V20 variables)
$variables = iot_api()->getAvailableSensors();

// Create device with V2 format
$device = iot_api()->createDevice([
    'device_id' => 'TEMP001',
    'device_name' => 'Sensor Suhu Ruangan',
    'description' => 'Monitoring ruang server',
    'sensors' => [
        ['variable' => 'V1', 'custom_name' => 'Suhu', 'unit' => '°C'],
        ['variable' => 'V2', 'custom_name' => 'Kelembaban', 'unit' => '%'],
        ['variable' => 'V3', 'custom_name' => 'Kualitas Udara', 'unit' => 'AQI']
    ]
]);

// Get latest data
$latestData = iot_api()->getLatestData('TEMP001');

// Get statistics
$stats = iot_api()->getStatistics('TEMP001');

// Get aggregate data (V2 - using variable)
$aggregate = iot_api()->getAggregate('TEMP001', 'v1', '2026-02-01', '2026-02-26');
```

### Method 2: Menggunakan Service Class

```php
use App\Services\IoTApiService;

class MonitoringController extends Controller
{
    protected IoTApiService $iotApi;

    public function __construct(IoTApiService $iotApi)
    {
        $this->iotApi = $iotApi;
    }

    public function index()
    {
        $devices = $this->iotApi->getDevices();
        return view('monitoring.index', compact('devices'));
    }
}
```

### Method 3: Direct URL Helper

```php
// Get full URL
$apiUrl = iot_api_url('/api/devices');
// Result: https://api-iot.digitaltekno.cloud/api/devices
```

## 📚 Available Methods

### Device Management

```php
// Get available variables (V2 - returns V1-V20)
iot_api()->getAvailableSensors();

// Create device with V2 format (custom name & unit)
iot_api()->createDevice([
    'device_id' => 'DEVICE001',
    'device_name' => 'My Device',
    'description' => 'Device description',
    'sensors' => [
        ['variable' => 'V1', 'custom_name' => 'Temperature', 'unit' => '°C'],
        ['variable' => 'V2', 'custom_name' => 'Humidity', 'unit' => '%']
    ]
]);

// Get all devices
iot_api()->getDevices();

// Get device detail
iot_api()->getDevice($id);

// Update device with V2 format
iot_api()->updateDevice($id, [
    'device_name' => 'Updated Name',
    'sensors' => [
        ['variable' => 'V1', 'custom_name' => 'Suhu', 'unit' => '°C'],
        ['variable' => 'V2', 'custom_name' => 'Kelembaban', 'unit' => '%']
    ]
]);

// Delete device
iot_api()->deleteDevice($id);

// Regenerate API Key
iot_api()->regenerateApiKey($id);
```

### Sensor Data

```php
// Get latest sensor data
iot_api()->getLatestData('DEVICE001');

// Get data history (with pagination)
iot_api()->getDataHistory('DEVICE001', $perPage = 50);

// Get data by date range
iot_api()->getDataRange('DEVICE001', '2026-02-01', '2026-02-25');

// Send sensor data (V2 format - using v1, v2, etc)
iot_api()->sendData([
    'device_id' => 'DEVICE001',
    'v1' => '25.5',
    'v2' => '60.0'
]);

// Send batch data (V2 format)
iot_api()->sendBatchData([
    ['device_id' => 'DEVICE001', 'v1' => '25.5', 'v2' => '60.0'],
    ['device_id' => 'DEVICE001', 'v1' => '26.0', 'v2' => '61.0']
]);
```

### Statistics

```php
// Get device statistics
iot_api()->getStatistics('DEVICE001');

// Get aggregate data (V2 - using variable instead of sensor name)
iot_api()->getAggregate(
    deviceId: 'DEVICE001',
    variable: 'v1',  // V2: use v1, v2, v3, etc instead of sensor name
    startDate: '2026-02-01',
    endDate: '2026-02-25'
);
```

## 🎯 Contoh Implementasi V2

### 1. Member Area - Pilih Sensor

```php
// Controller
public function showSensorSelection()
{
    // V2: Get available variables (V1-V20)
    $variables = iot_api()->getAvailableSensors();
    
    if (!$variables['success']) {
        return back()->with('error', 'Failed to load variables');
    }
    
    return inertia('member/sensor-selection', [
        'variables' => $variables['data'],
        'availableVariables' => config('iot-api.available_variables')
    ]);
}
```

### 2. Create Device After Payment (V2)

```php
// Setelah payment approved
public function activateSubscription(Subscription $subscription)
{
    // Generate device code
    $deviceCode = 'DEV' . str_pad($subscription->id, 6, '0', STR_PAD_LEFT);
    
    // V2: Get selected sensors with custom name and unit
    $selectedSensors = $subscription->sensors->map(function($sensor) {
        return [
            'variable' => $sensor->variable_name,  // V1, V2, V3, etc
            'custom_name' => $sensor->custom_name, // Temperature, Humidity, etc
            'unit' => $sensor->unit                // °C, %, etc
        ];
    })->toArray();
    
    // Create device via IoT API V2
    $response = iot_api()->createDevice([
        'device_id' => $deviceCode,
        'device_name' => $subscription->device->name,
        'description' => $subscription->device->location,
        'sensors' => $selectedSensors
    ]);
    
    if ($response['success']) {
        // Save API Key
        $subscription->device->update([
            'device_code' => $deviceCode,
            'api_key' => $response['data']['api_key'],
            'status' => 'active',
            'activated_at' => now()
        ]);
        
        // Update subscription
        $subscription->update([
            'status' => 'active',
            'start_date' => now(),
            'end_date' => now()->addMonth()
        ]);
        
        // Send email with API Key
        Mail::to($subscription->user)->send(
            new DeviceActivated($subscription)
        );
        
        return redirect()->route('dashboard.monitoring')
            ->with('success', 'Device activated successfully!');
    }
    
    return back()->with('error', 'Failed to activate device');
}
```

### 3. Dashboard Monitoring

```php
// Controller
public function dashboard()
{
    $subscription = auth()->user()->activeSubscription;
    
    if (!$subscription) {
        return redirect()->route('member.area');
    }
    
    $deviceCode = $subscription->device->device_code;
    
    // Get latest data
    $latestData = iot_api()->getLatestData($deviceCode);
    
    // Get statistics
    $statistics = iot_api()->getStatistics($deviceCode);
    
    // Get history
    $history = iot_api()->getDataHistory($deviceCode, 100);
    
    return inertia('dashboard/monitoring', [
        'device' => $subscription->device,
        'sensors' => $subscription->sensors,
        'latestData' => $latestData['data'] ?? null,
        'statistics' => $statistics['data'] ?? null,
        'history' => $history['data'] ?? null,
    ]);
}
```

### 4. Frontend - Real-time Monitoring

```typescript
// React Component
import { useEffect, useState } from 'react';

function MonitoringDashboard({ device, sensors }) {
    const [latestData, setLatestData] = useState(null);
    
    useEffect(() => {
        // Fetch latest data every 5 seconds
        const interval = setInterval(async () => {
            const response = await fetch(
                `/api/monitoring/latest/${device.device_code}`
            );
            const data = await response.json();
            setLatestData(data);
        }, 5000);
        
        return () => clearInterval(interval);
    }, [device.device_code]);
    
    return (
        <div>
            <h2>Real-time Monitoring</h2>
            {sensors.map(sensor => (
                <div key={sensor.id}>
                    <h3>{sensor.name}</h3>
                    <p>{latestData?.[sensor.sensor_name] || '-'}</p>
                </div>
            ))}
        </div>
    );
}
```

## 🔒 Error Handling

Service sudah include error handling:

```php
$response = iot_api()->getDevices();

if (!$response['success']) {
    // Handle error
    Log::error('IoT API Error', $response);
    return back()->with('error', $response['message']);
}

// Success
$devices = $response['data'];
```

## 📊 Response Format

Semua response mengikuti format:

```json
{
    "success": true,
    "message": "Success message",
    "data": { ... }
}
```

Error response:

```json
{
    "success": false,
    "message": "Error message",
    "error": "Detailed error"
}
```

## 🚀 Testing

```php
// Test connection
$response = iot_api()->getAvailableSensors();

if ($response['success']) {
    echo "IoT API Connected!";
    echo "Available sensors: " . count($response['data']);
} else {
    echo "Connection failed: " . $response['message'];
}
```

## 📝 Notes

1. **Timeout**: Default 30 detik, bisa diubah di `.env`
2. **CORS**: Sudah dikonfigurasi untuk same server
3. **Error Logging**: Semua error otomatis log ke `storage/logs/laravel.log`
4. **Retry**: Tidak ada auto-retry, handle di aplikasi level
5. **Cache**: Tidak ada caching, implement sesuai kebutuhan

## 🔗 Related Files

- `config/iot-api.php` - Configuration
- `app/Services/IoTApiService.php` - Service class
- `app/Helpers/IoTApiHelper.php` - Helper functions
- `config/cors.php` - CORS configuration
- `Implementasi/API_IOT_DOCUMENTATION.md` - Full API docs
- `Implementasi/DEVICE_MANAGEMENT_API.md` - Device management docs
