# IoT API V2 Migration Guide

## 🎉 Pembaruan Sistem Variable V2

API IoT telah diupgrade dari sistem 60 sensor fixed (V1) menjadi sistem variable V1-V20 yang fleksibel (V2).

## 📊 Perbandingan V1 vs V2

| Aspek | V1 (Old) | V2 (New) |
|-------|----------|----------|
| **Jumlah Sensor** | 60 sensor fixed | 20 variable fleksibel |
| **Nama Sensor** | Fixed (temperature, humidity, dll) | Custom name per device |
| **Unit** | Fixed dalam kode | Custom unit per device |
| **Tipe Data** | Berbagai tipe (decimal, integer, boolean) | String (fleksibel) |
| **Skalabilitas** | Perlu ubah database untuk sensor baru | Tidak perlu ubah database |
| **Fleksibilitas** | Terbatas pada 60 sensor | Unlimited kombinasi |

## 🔄 Perubahan Utama

### 1. Struktur Data Sensor

**V1 (Old):**
```json
{
  "device_id": "DEVICE001",
  "temperature": 25.5,
  "humidity": 60.0,
  "voltage": 220.5
}
```

**V2 (New):**
```json
{
  "device_id": "DEVICE001",
  "v1": "25.5",
  "v2": "60.0",
  "v3": "220.5"
}
```

### 2. Konfigurasi Device

**V1 (Old):**
```json
{
  "device_id": "DEVICE001",
  "device_name": "My Device",
  "sensors": ["temperature", "humidity", "voltage"]
}
```

**V2 (New):**
```json
{
  "device_id": "DEVICE001",
  "device_name": "My Device",
  "sensors": [
    {"variable": "V1", "custom_name": "Temperature", "unit": "°C"},
    {"variable": "V2", "custom_name": "Humidity", "unit": "%"},
    {"variable": "V3", "custom_name": "Voltage", "unit": "V"}
  ]
}
```

### 3. Endpoint Aggregate

**V1 (Old):**
```
GET /api/iot/aggregate/DEVICE001?sensor=temperature
```

**V2 (New):**
```
GET /api/iot/aggregate/DEVICE001?variable=v1
```

## 🔧 Update yang Diperlukan

### 1. Service Class (IoTApiService.php)

Method `getAggregate()` perlu diupdate:

**Old:**
```php
public function getAggregate(string $deviceId, string $sensor, ...)
{
    $params = ['sensor' => $sensor];
    // ...
}
```

**New:**
```php
public function getAggregate(string $deviceId, string $variable, ...)
{
    $params = ['variable' => $variable];
    // ...
}
```

### 2. Frontend - Sensor Selection

Perlu update UI untuk input custom name dan unit:

**Old:**
```tsx
<Checkbox value="temperature">Temperature</Checkbox>
<Checkbox value="humidity">Humidity</Checkbox>
```

**New:**
```tsx
<Select value="V1">
  <option>V1</option>
  <option>V2</option>
  ...
</Select>
<Input placeholder="Custom Name" />
<Input placeholder="Unit" />
```

### 3. Database - Subscription Sensors

Tabel `subscription_sensors` perlu kolom tambahan:
- `variable_name` (V1-V20)
- `custom_name` (Temperature, Humidity, dll)
- `unit` (°C, %, dll)

### 4. Device Activation Flow

Update flow aktivasi device:

```php
// Old
$selectedSensors = $subscription->sensors->pluck('sensor_name')->toArray();

$response = iot_api()->createDevice([
    'device_id' => $deviceCode,
    'device_name' => $subscription->device->name,
    'sensors' => $selectedSensors
]);

// New
$selectedSensors = $subscription->sensors->map(function($sensor) {
    return [
        'variable' => $sensor->variable_name,
        'custom_name' => $sensor->custom_name,
        'unit' => $sensor->unit
    ];
})->toArray();

$response = iot_api()->createDevice([
    'device_id' => $deviceCode,
    'device_name' => $subscription->device->name,
    'sensors' => $selectedSensors
]);
```

## 📝 Contoh Implementasi V2

### 1. Environmental Monitoring
```json
{
  "device_id": "ENV001",
  "device_name": "Environmental Sensor",
  "sensors": [
    {"variable": "V1", "custom_name": "Suhu", "unit": "°C"},
    {"variable": "V2", "custom_name": "Kelembaban", "unit": "%"},
    {"variable": "V3", "custom_name": "Tekanan Udara", "unit": "hPa"},
    {"variable": "V4", "custom_name": "CO2", "unit": "ppm"},
    {"variable": "V5", "custom_name": "Kebisingan", "unit": "dB"},
    {"variable": "V6", "custom_name": "Cahaya", "unit": "Lux"}
  ]
}
```

### 2. Power Meter
```json
{
  "device_id": "POWER001",
  "device_name": "Power Meter Gedung A",
  "sensors": [
    {"variable": "V1", "custom_name": "Tegangan", "unit": "V"},
    {"variable": "V2", "custom_name": "Arus", "unit": "A"},
    {"variable": "V3", "custom_name": "Daya Aktif", "unit": "W"},
    {"variable": "V4", "custom_name": "Daya Reaktif", "unit": "VAR"},
    {"variable": "V5", "custom_name": "Frekuensi", "unit": "Hz"},
    {"variable": "V6", "custom_name": "Power Factor", "unit": ""},
    {"variable": "V7", "custom_name": "Energi", "unit": "kWh"}
  ]
}
```

### 3. Machine Monitoring
```json
{
  "device_id": "MACHINE001",
  "device_name": "Mesin Produksi Line 1",
  "sensors": [
    {"variable": "V1", "custom_name": "Status", "unit": ""},
    {"variable": "V2", "custom_name": "RPM", "unit": "RPM"},
    {"variable": "V3", "custom_name": "Getaran", "unit": "mm/s"},
    {"variable": "V4", "custom_name": "Suhu", "unit": "°C"},
    {"variable": "V5", "custom_name": "Beban", "unit": "%"},
    {"variable": "V6", "custom_name": "Counter", "unit": "Unit"},
    {"variable": "V7", "custom_name": "Runtime", "unit": "Jam"}
  ]
}
```

## ✅ Keuntungan V2

1. **Fleksibilitas Maksimal**
   - Tidak terbatas pada 60 sensor yang sudah ditentukan
   - Bisa menambah sensor baru tanpa ubah database

2. **Custom Naming**
   - Setiap device bisa punya nama sensor sendiri
   - Mudah dipahami oleh user

3. **Custom Unit**
   - Unit pengukuran bisa disesuaikan
   - Mendukung berbagai standar (SI, Imperial, dll)

4. **Skalabilitas**
   - Struktur database lebih sederhana
   - Performa query lebih baik

5. **Multi-Purpose**
   - Satu sistem bisa untuk berbagai jenis sensor
   - Cocok untuk berbagai industri

## 🚀 Action Items

### Prioritas Tinggi
- [ ] Update `IoTApiService.php` - method `getAggregate()`
- [ ] Update database migration untuk `subscription_sensors`
- [ ] Update seeder untuk sensor dengan format V2
- [ ] Update UI sensor selection di member area

### Prioritas Sedang
- [ ] Update dokumentasi internal
- [ ] Update contoh kode di dokumentasi
- [ ] Test integrasi dengan API V2
- [ ] Update email template dengan info variable

### Prioritas Rendah
- [ ] Update dashboard monitoring untuk display custom name & unit
- [ ] Tambah validasi untuk variable V1-V20
- [ ] Tambah helper untuk mapping variable

## 📚 Referensi Dokumentasi V2

Dokumentasi lengkap tersedia di `/www/wwwroot/api-iot/docs/`:

- `README.md` - Overview V2
- `MIGRATION_V2_SUMMARY.md` - Panduan migrasi lengkap
- `V2_CHANGES.md` - Daftar perubahan
- `API_IOT_DOCUMENTATION.md` - Dokumentasi API V2
- `DEVICE_MANAGEMENT_API.md` - Device management V2
- `QUICK_START.md` - Quick start guide V2
- `INDEX.md` - Index dokumentasi

## 🆘 Support

Jika ada pertanyaan tentang migrasi V2:
1. Baca dokumentasi lengkap di folder docs
2. Cek contoh konfigurasi di dokumentasi
3. Test dengan Postman collection (perlu update ke V2)

---

**Migration Date:** 2026-02-26  
**Version:** V1 → V2  
**Status:** 📋 Planning Phase
