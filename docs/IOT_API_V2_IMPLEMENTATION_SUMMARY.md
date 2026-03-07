# IoT API V2 - Implementation Summary

## ✅ Yang Sudah Diimplementasikan

### 1. Dokumentasi
- ✅ `docs/IOT_API_V2_MIGRATION.md` - Panduan migrasi lengkap
- ✅ `docs/IOT_API_V2_EXAMPLES.md` - Contoh implementasi berbagai use case
- ✅ `docs/IOT_API_V2_IMPLEMENTATION_SUMMARY.md` - Ringkasan implementasi (file ini)
- ✅ `docs/IOT_API_INTEGRATION.md` - Updated untuk V2

### 2. Backend Updates

#### Service Layer
- ✅ `app/Services/IoTApiService.php`
  - Updated method `getAggregate()` untuk menggunakan `variable` instead of `sensor`
  - Added backward compatibility method `getAggregateBySensor()`

#### Configuration
- ✅ `config/iot-api.php`
  - Added `version` config
  - Added `available_variables` array (V1-V20)
  - Updated comments untuk V2

#### Models
- ✅ `app/Models/SubscriptionSensor.php`
  - Added V2 fields: `variable_name`, `custom_name`, `unit`
  - Added helper methods: `isV2()`, `getDisplayNameAttribute()`, `getDisplayUnitAttribute()`
  - Added `toIoTApiFormat()` method untuk format API V2

#### Database Migrations
- ✅ `database/migrations/2026_02_26_100000_update_subscription_sensors_for_v2.php`
  - Added columns: `variable_name`, `custom_name`, `unit`
  - Made `sensor_id` nullable untuk V2 compatibility

- ✅ `database/migrations/2026_02_26_100001_add_v2_fields_to_sensors_table.php`
  - Added columns: `variable_suggestion`, `category`, `icon`

#### Seeders
- ✅ `database/seeders/SensorV2Seeder.php`
  - Seeder untuk sensor dengan format V2
  - Includes variable suggestions dan categories

## 📋 Yang Perlu Dilakukan

### Prioritas Tinggi

#### 1. Frontend - Sensor Selection UI
**File:** `resources/js/pages/member/subscribe.tsx`

Perlu update UI untuk:
- Dropdown untuk pilih variable (V1-V20)
- Input field untuk custom name
- Input field untuk unit
- Preview konfigurasi sensor

**Contoh struktur:**
```tsx
interface SensorConfig {
  variable: string;      // V1, V2, V3, etc
  custom_name: string;   // Temperature, Humidity, etc
  unit: string;          // °C, %, etc
  price: number;
}
```

#### 2. Controller - Device Activation
**File:** `app/Http/Controllers/MemberAreaController.php`

Update method untuk aktivasi device dengan format V2:

```php
public function activateDevice(Subscription $subscription)
{
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
    
    // Handle response...
}
```

#### 3. Frontend - Monitoring Dashboard
**File:** `resources/js/pages/memberarea.tsx`

Update untuk display:
- Custom sensor names
- Units
- Variable mapping

### Prioritas Sedang

#### 4. Validation
**File:** `app/Http/Requests/...`

Buat request validation untuk:
- Variable name (V1-V20)
- Custom name (required, max 255)
- Unit (optional, max 50)

#### 5. Admin Panel
**File:** `resources/js/pages/admin/orders/show.tsx`

Update untuk menampilkan:
- Variable mapping
- Custom names
- Units

#### 6. Email Templates
Update email template untuk device activation dengan info V2

### Prioritas Rendah

#### 7. Helper Functions
Tambah helper functions untuk:
- Mapping sensor lama ke variable baru
- Validasi variable name
- Format display sensor

#### 8. Testing
- Unit tests untuk model methods
- Integration tests untuk API calls
- Frontend tests untuk sensor selection

## 🔧 Contoh Implementasi Frontend

### Sensor Selection Component (V2)

```tsx
import { useState } from 'react';
import { Select, Input, Button } from '@/components/ui';

interface SensorConfig {
  variable: string;
  custom_name: string;
  unit: string;
  price: number;
}

export function SensorSelection() {
  const [sensors, setSensors] = useState<SensorConfig[]>([]);
  const availableVariables = ['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10'];
  
  const addSensor = () => {
    setSensors([...sensors, {
      variable: '',
      custom_name: '',
      unit: '',
      price: 0
    }]);
  };
  
  const updateSensor = (index: number, field: keyof SensorConfig, value: any) => {
    const updated = [...sensors];
    updated[index][field] = value;
    setSensors(updated);
  };
  
  const removeSensor = (index: number) => {
    setSensors(sensors.filter((_, i) => i !== index));
  };
  
  return (
    <div className="space-y-4">
      <h3>Konfigurasi Sensor</h3>
      
      {sensors.map((sensor, index) => (
        <div key={index} className="flex gap-4 items-end">
          <div className="flex-1">
            <label>Variable</label>
            <Select
              value={sensor.variable}
              onChange={(e) => updateSensor(index, 'variable', e.target.value)}
            >
              <option value="">Pilih Variable</option>
              {availableVariables.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </Select>
          </div>
          
          <div className="flex-1">
            <label>Nama Sensor</label>
            <Input
              value={sensor.custom_name}
              onChange={(e) => updateSensor(index, 'custom_name', e.target.value)}
              placeholder="e.g., Temperature"
            />
          </div>
          
          <div className="flex-1">
            <label>Unit</label>
            <Input
              value={sensor.unit}
              onChange={(e) => updateSensor(index, 'unit', e.target.value)}
              placeholder="e.g., °C"
            />
          </div>
          
          <Button onClick={() => removeSensor(index)} variant="destructive">
            Hapus
          </Button>
        </div>
      ))}
      
      <Button onClick={addSensor}>Tambah Sensor</Button>
      
      {/* Preview */}
      {sensors.length > 0 && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h4>Preview Konfigurasi:</h4>
          <pre>{JSON.stringify(sensors, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

### Monitoring Dashboard (V2)

```tsx
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui';

interface SensorData {
  variable: string;
  custom_name: string;
  unit: string;
  value: string;
}

export function MonitoringDashboard({ deviceCode, sensors }) {
  const [latestData, setLatestData] = useState<any>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/monitoring/latest/${deviceCode}`);
      const data = await response.json();
      setLatestData(data);
    };
    
    fetchData();
    const interval = setInterval(fetchData, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, [deviceCode]);
  
  const getSensorValue = (variable: string) => {
    return latestData?.[variable.toLowerCase()] || '-';
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sensors.map((sensor: SensorData) => (
        <Card key={sensor.variable}>
          <div className="p-4">
            <h3 className="text-sm text-gray-500">{sensor.custom_name}</h3>
            <div className="text-3xl font-bold mt-2">
              {getSensorValue(sensor.variable)}
              {sensor.unit && <span className="text-lg ml-2">{sensor.unit}</span>}
            </div>
            <div className="text-xs text-gray-400 mt-1">{sensor.variable}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}
```

## 🗄️ Database Schema Changes

### subscription_sensors Table

```sql
ALTER TABLE subscription_sensors
ADD COLUMN variable_name VARCHAR(10) NULL COMMENT 'V1-V20 variable name' AFTER sensor_id,
ADD COLUMN custom_name VARCHAR(255) NULL COMMENT 'Custom sensor name' AFTER variable_name,
ADD COLUMN unit VARCHAR(50) NULL COMMENT 'Measurement unit' AFTER custom_name,
MODIFY COLUMN sensor_id BIGINT UNSIGNED NULL;
```

### sensors Table

```sql
ALTER TABLE sensors
ADD COLUMN variable_suggestion VARCHAR(10) NULL COMMENT 'Suggested variable name (V1-V20)' AFTER unit,
ADD COLUMN category VARCHAR(50) NULL COMMENT 'Sensor category' AFTER variable_suggestion,
ADD COLUMN icon VARCHAR(50) NULL COMMENT 'Icon name for UI' AFTER category;
```

## 🚀 Migration Steps

### 1. Backup Database
```bash
php artisan db:backup
# or
mysqldump -u username -p database_name > backup_before_v2.sql
```

### 2. Run Migrations
```bash
php artisan migrate
```

### 3. Run Seeders
```bash
php artisan db:seed --class=SensorV2Seeder
```

### 4. Update Environment
```env
IOT_API_VERSION=v2
```

### 5. Clear Cache
```bash
php artisan config:clear
php artisan cache:clear
php artisan view:clear
```

### 6. Test Integration
```bash
# Test API connection
php artisan tinker
>>> iot_api()->getAvailableSensors()
```

## 📊 Testing Checklist

### Backend
- [ ] Test IoTApiService methods dengan V2 format
- [ ] Test SubscriptionSensor model methods
- [ ] Test device creation dengan V2 format
- [ ] Test data retrieval dengan variable names

### Frontend
- [ ] Test sensor selection UI
- [ ] Test form validation
- [ ] Test data submission
- [ ] Test monitoring dashboard display

### Integration
- [ ] Test end-to-end flow: select sensors → create order → activate device
- [ ] Test data display dengan custom names dan units
- [ ] Test aggregate queries dengan variables

## 🔗 Referensi

### Dokumentasi Internal
- [Migration Guide](IOT_API_V2_MIGRATION.md)
- [Examples](IOT_API_V2_EXAMPLES.md)
- [Integration Guide](IOT_API_INTEGRATION.md)

### Dokumentasi API (External)
- `/www/wwwroot/api-iot/docs/README.md`
- `/www/wwwroot/api-iot/docs/API_IOT_DOCUMENTATION.md`
- `/www/wwwroot/api-iot/docs/DEVICE_MANAGEMENT_API.md`
- `/www/wwwroot/api-iot/docs/QUICK_START.md`

## 💡 Tips

1. **Backward Compatibility**: Sistem masih support V1 format untuk data lama
2. **Gradual Migration**: Bisa migrasi bertahap, tidak perlu sekaligus
3. **Testing**: Test di development environment dulu sebelum production
4. **Documentation**: Update dokumentasi user setelah implementasi selesai
5. **Training**: Berikan training ke user tentang sistem variable baru

## 🆘 Troubleshooting

### Issue: Variable tidak muncul di dropdown
**Solution:** Pastikan config `iot-api.available_variables` sudah di-load

### Issue: Data tidak tersimpan dengan format V2
**Solution:** Cek migration sudah dijalankan dan kolom V2 sudah ada

### Issue: API error saat create device
**Solution:** Cek format request sesuai dengan dokumentasi V2

### Issue: Display sensor masih pakai nama lama
**Solution:** Pastikan menggunakan `getDisplayNameAttribute()` di model

---

**Last Updated:** 2026-02-26  
**Status:** 🚧 In Progress  
**Next Steps:** Implement frontend sensor selection UI
