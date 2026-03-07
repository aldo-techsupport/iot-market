# IoT API V2 - Quick Reference

## 🎯 Apa itu V2?

IoT API V2 adalah upgrade dari sistem 60 sensor fixed menjadi sistem **20 variable (V1-V20) yang fleksibel** dengan custom name dan unit untuk setiap variable.

## 📚 Dokumentasi

### Mulai dari Sini
1. **[IOT_API_V2_MIGRATION.md](IOT_API_V2_MIGRATION.md)** - Panduan migrasi dari V1 ke V2
2. **[IOT_API_V2_IMPLEMENTATION_SUMMARY.md](IOT_API_V2_IMPLEMENTATION_SUMMARY.md)** - Status implementasi dan checklist
3. **[IOT_API_V2_EXAMPLES.md](IOT_API_V2_EXAMPLES.md)** - Contoh konfigurasi berbagai use case

### Dokumentasi Lainnya
- **[IOT_API_INTEGRATION.md](IOT_API_INTEGRATION.md)** - Panduan integrasi (updated untuk V2)

### Dokumentasi API External
Dokumentasi lengkap API tersedia di `/www/wwwroot/api-iot/docs/`:
- `README.md` - Overview
- `API_IOT_DOCUMENTATION.md` - API endpoints
- `DEVICE_MANAGEMENT_API.md` - Device management
- `QUICK_START.md` - Quick start guide
- `MIGRATION_V2_SUMMARY.md` - Migration summary

## 🔄 Perubahan Utama

### Format Data

**V1 (Old):**
```json
{
  "device_id": "DEVICE001",
  "temperature": 25.5,
  "humidity": 60.0
}
```

**V2 (New):**
```json
{
  "device_id": "DEVICE001",
  "v1": "25.5",
  "v2": "60.0"
}
```

### Konfigurasi Device

**V1 (Old):**
```json
{
  "sensors": ["temperature", "humidity"]
}
```

**V2 (New):**
```json
{
  "sensors": [
    {"variable": "V1", "custom_name": "Temperature", "unit": "°C"},
    {"variable": "V2", "custom_name": "Humidity", "unit": "%"}
  ]
}
```

## ✅ Status Implementasi

### Selesai
- ✅ Dokumentasi lengkap
- ✅ Service layer update
- ✅ Model update
- ✅ Database migrations
- ✅ Seeders

### Dalam Progress
- 🚧 Frontend sensor selection UI
- 🚧 Device activation flow
- 🚧 Monitoring dashboard update

### Belum Dimulai
- ⏳ Admin panel update
- ⏳ Email templates
- ⏳ Testing

## 🚀 Quick Start

### 1. Run Migrations
```bash
php artisan migrate
```

### 2. Run Seeders
```bash
php artisan db:seed --class=SensorV2Seeder
```

### 3. Update .env
```env
IOT_API_VERSION=v2
```

### 4. Test Connection
```bash
php artisan tinker
>>> iot_api()->getAvailableSensors()
```

## 💡 Contoh Penggunaan

### Create Device (V2)
```php
$response = iot_api()->createDevice([
    'device_id' => 'DEVICE001',
    'device_name' => 'My Device',
    'sensors' => [
        ['variable' => 'V1', 'custom_name' => 'Suhu', 'unit' => '°C'],
        ['variable' => 'V2', 'custom_name' => 'Kelembaban', 'unit' => '%']
    ]
]);
```

### Get Aggregate (V2)
```php
$aggregate = iot_api()->getAggregate(
    deviceId: 'DEVICE001',
    variable: 'v1',  // V2: use v1, v2, etc
    startDate: '2026-02-01',
    endDate: '2026-02-26'
);
```

## 📋 Use Cases

### Environmental Monitoring
- V1 = Suhu (°C)
- V2 = Kelembaban (%)
- V3 = Tekanan Udara (hPa)
- V4 = CO2 (ppm)

### Power Meter
- V1 = Tegangan (V)
- V2 = Arus (A)
- V3 = Daya (W)
- V4 = Energi (kWh)

### Machine Monitoring
- V1 = Status (On/Off)
- V2 = RPM (RPM)
- V3 = Getaran (mm/s)
- V4 = Suhu (°C)

**Lihat contoh lengkap:** [IOT_API_V2_EXAMPLES.md](IOT_API_V2_EXAMPLES.md)

## 🔧 Files Updated

### Backend
- `app/Services/IoTApiService.php`
- `app/Models/SubscriptionSensor.php`
- `config/iot-api.php`
- `database/migrations/2026_02_26_100000_update_subscription_sensors_for_v2.php`
- `database/migrations/2026_02_26_100001_add_v2_fields_to_sensors_table.php`
- `database/seeders/SensorV2Seeder.php`

### Documentation
- `docs/IOT_API_V2_MIGRATION.md`
- `docs/IOT_API_V2_EXAMPLES.md`
- `docs/IOT_API_V2_IMPLEMENTATION_SUMMARY.md`
- `docs/IOT_API_INTEGRATION.md` (updated)
- `docs/IOT_V2_README.md` (this file)

## 🆘 Need Help?

1. Baca dokumentasi di folder `docs/`
2. Cek contoh implementasi di `IOT_API_V2_EXAMPLES.md`
3. Lihat status implementasi di `IOT_API_V2_IMPLEMENTATION_SUMMARY.md`
4. Baca dokumentasi API external di `/www/wwwroot/api-iot/docs/`

## 🔗 Links

- [Main Documentation](IOT_API_INTEGRATION.md)
- [Migration Guide](IOT_API_V2_MIGRATION.md)
- [Examples](IOT_API_V2_EXAMPLES.md)
- [Implementation Status](IOT_API_V2_IMPLEMENTATION_SUMMARY.md)

---

**Version:** V2.0  
**Last Updated:** 2026-02-26  
**Status:** 🚧 In Progress
