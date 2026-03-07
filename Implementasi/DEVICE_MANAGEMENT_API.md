# Device Management API Documentation

API untuk mengelola device IoT dan sensor filtering. Setiap device memiliki API Key unik dan dapat memilih sensor mana saja yang diaktifkan.

## Base URL
```
http://your-domain.com/api
```

## Fitur Utama

- ✅ Registrasi device dengan API Key unik
- ✅ Sensor filtering per device (checkbox selection)
- ✅ Validasi otomatis - hanya sensor yang diaktifkan yang disimpan
- ✅ API Key regeneration
- ✅ Device management (CRUD)
- ✅ Tracking last seen device

---

## Endpoints

### 1. Get Available Sensors
**GET** `/api/devices/sensors/available`

Mendapatkan daftar semua sensor yang tersedia untuk dipilih.

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "name": "temperature",
      "label": "Suhu (°C)",
      "category": "Environmental"
    },
    {
      "name": "humidity",
      "label": "Kelembaban (%RH)",
      "category": "Environmental"
    },
    ...
  ]
}
```

---

### 2. Create Device
**POST** `/api/devices`

Membuat device baru dengan sensor yang dipilih. API Key akan di-generate otomatis.

**Request Body:**
```json
{
  "device_id": "TEMP001",
  "device_name": "Sensor Suhu Ruangan",
  "description": "Sensor untuk monitoring suhu ruang server",
  "sensors": [
    "temperature",
    "humidity",
    "air_quality"
  ]
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Device berhasil dibuat",
  "data": {
    "device": {
      "id": 1,
      "device_id": "TEMP001",
      "device_name": "Sensor Suhu Ruangan",
      "description": "Sensor untuk monitoring suhu ruang server",
      "is_active": true,
      "created_at": "2026-02-25T10:30:00.000000Z"
    },
    "api_key": "PUuy6SxanCn6PR70iK8dEde8rBlbI1ZsHgJI25mRRhbHaywAt7F0gLnUjjf9efOG",
    "sensors": [
      {
        "id": 1,
        "device_id": 1,
        "sensor_name": "temperature",
        "is_enabled": true
      },
      {
        "id": 2,
        "device_id": 1,
        "sensor_name": "humidity",
        "is_enabled": true
      },
      {
        "id": 3,
        "device_id": 1,
        "sensor_name": "air_quality",
        "is_enabled": true
      }
    ]
  }
}
```

⚠️ **PENTING**: API Key hanya ditampilkan sekali saat device dibuat. Simpan dengan aman!

---

### 3. Get All Devices
**GET** `/api/devices`

Mendapatkan daftar semua device yang terdaftar.

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "device_id": "TEMP001",
      "device_name": "Sensor Suhu Ruangan",
      "description": "Sensor untuk monitoring suhu ruang server",
      "is_active": true,
      "last_seen": "5 minutes ago",
      "enabled_sensors_count": 3,
      "created_at": "2026-02-25T10:30:00.000000Z"
    }
  ]
}
```

---

### 4. Get Device Detail
**GET** `/api/devices/{id}`

Mendapatkan detail device termasuk sensor yang diaktifkan.

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "device_id": "TEMP001",
    "device_name": "Sensor Suhu Ruangan",
    "description": "Sensor untuk monitoring suhu ruang server",
    "is_active": true,
    "last_seen": "2026-02-25T10:35:00.000000Z",
    "sensors": [
      {
        "id": 1,
        "sensor_name": "temperature",
        "is_enabled": true
      },
      {
        "id": 2,
        "sensor_name": "humidity",
        "is_enabled": true
      }
    ],
    "created_at": "2026-02-25T10:30:00.000000Z",
    "updated_at": "2026-02-25T10:30:00.000000Z"
  }
}
```

---

### 5. Update Device
**PUT** `/api/devices/{id}`

Update informasi device dan/atau sensor yang diaktifkan.

**Request Body:**
```json
{
  "device_name": "Sensor Suhu Ruangan - Updated",
  "description": "Updated description",
  "is_active": true,
  "sensors": [
    "temperature",
    "humidity",
    "air_pressure",
    "co2"
  ]
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Device berhasil diupdate",
  "data": {
    "id": 1,
    "device_id": "TEMP001",
    "device_name": "Sensor Suhu Ruangan - Updated",
    ...
  }
}
```

---

### 6. Delete Device
**DELETE** `/api/devices/{id}`

Menghapus device dan semua sensor yang terkait.

**Response Success (200):**
```json
{
  "success": true,
  "message": "Device berhasil dihapus"
}
```

---

### 7. Regenerate API Key
**POST** `/api/devices/{id}/regenerate-key`

Generate API Key baru untuk device (API Key lama akan tidak valid).

**Response Success (200):**
```json
{
  "success": true,
  "message": "API Key berhasil di-regenerate",
  "data": {
    "api_key": "NEW_API_KEY_HERE_64_CHARACTERS_LONG"
  }
}
```

---

## Sensor Filtering - How It Works

### 1. Registrasi Device dengan Sensor Pilihan

Frontend menampilkan checkbox untuk semua sensor yang tersedia:

```javascript
// Get available sensors
fetch('http://your-domain.com/api/devices/sensors/available')
  .then(res => res.json())
  .then(data => {
    // Display checkboxes grouped by category
    data.data.forEach(sensor => {
      // Create checkbox for each sensor
      console.log(sensor.name, sensor.label, sensor.category);
    });
  });
```

### 2. Create Device dengan Sensor Terpilih

```javascript
// User selects sensors via checkboxes
const selectedSensors = ['temperature', 'humidity', 'air_quality'];

// Create device
fetch('http://your-domain.com/api/devices', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    device_id: 'TEMP001',
    device_name: 'Sensor Suhu Ruangan',
    description: 'Monitoring ruang server',
    sensors: selectedSensors
  })
})
.then(res => res.json())
.then(data => {
  // Save API Key - only shown once!
  const apiKey = data.data.api_key;
  console.log('API Key:', apiKey);
  
  // Show to user to copy
  alert('Save this API Key: ' + apiKey);
});
```

### 3. Kirim Data dari IoT Device

Device hanya perlu kirim data seperti biasa. Backend akan otomatis filter sensor yang tidak diaktifkan:

```bash
# Device mengirim 5 sensor
curl -X POST http://your-domain.com/api/iot/data \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "TEMP001",
    "temperature": 25.5,
    "humidity": 60.0,
    "air_quality": 45,
    "noise": 55.0,
    "light_intensity": 850.0
  }'
```

**Hasil**: Hanya `temperature`, `humidity`, dan `air_quality` yang disimpan (sesuai sensor yang diaktifkan). `noise` dan `light_intensity` diabaikan.

### 4. Response Jika Sensor Tidak Diizinkan

Jika device mengirim data tapi tidak ada sensor yang diizinkan:

```json
{
  "success": false,
  "message": "Tidak ada sensor yang diizinkan untuk device ini",
  "enabled_sensors": ["temperature", "humidity", "air_quality"]
}
```

---

## Frontend Integration Example

### React/Next.js Example

```jsx
import { useState, useEffect } from 'react';

function DeviceRegistration() {
  const [sensors, setSensors] = useState([]);
  const [selectedSensors, setSelectedSensors] = useState([]);
  const [deviceInfo, setDeviceInfo] = useState({
    device_id: '',
    device_name: '',
    description: ''
  });
  const [apiKey, setApiKey] = useState('');

  // Load available sensors
  useEffect(() => {
    fetch('http://your-domain.com/api/devices/sensors/available')
      .then(res => res.json())
      .then(data => setSensors(data.data));
  }, []);

  // Group sensors by category
  const groupedSensors = sensors.reduce((acc, sensor) => {
    if (!acc[sensor.category]) acc[sensor.category] = [];
    acc[sensor.category].push(sensor);
    return acc;
  }, {});

  // Handle checkbox change
  const handleSensorToggle = (sensorName) => {
    setSelectedSensors(prev => 
      prev.includes(sensorName)
        ? prev.filter(s => s !== sensorName)
        : [...prev, sensorName]
    );
  };

  // Submit device registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch('http://your-domain.com/api/devices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...deviceInfo,
        sensors: selectedSensors
      })
    });

    const data = await response.json();
    
    if (data.success) {
      setApiKey(data.data.api_key);
      alert('Device created! Save your API Key!');
    }
  };

  return (
    <div>
      <h2>Register New Device</h2>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Device ID"
          value={deviceInfo.device_id}
          onChange={(e) => setDeviceInfo({...deviceInfo, device_id: e.target.value})}
          required
        />
        
        <input
          type="text"
          placeholder="Device Name"
          value={deviceInfo.device_name}
          onChange={(e) => setDeviceInfo({...deviceInfo, device_name: e.target.value})}
          required
        />
        
        <textarea
          placeholder="Description"
          value={deviceInfo.description}
          onChange={(e) => setDeviceInfo({...deviceInfo, description: e.target.value})}
        />

        <h3>Select Sensors</h3>
        {Object.entries(groupedSensors).map(([category, categorySensors]) => (
          <div key={category}>
            <h4>{category}</h4>
            {categorySensors.map(sensor => (
              <label key={sensor.name}>
                <input
                  type="checkbox"
                  checked={selectedSensors.includes(sensor.name)}
                  onChange={() => handleSensorToggle(sensor.name)}
                />
                {sensor.label}
              </label>
            ))}
          </div>
        ))}

        <button type="submit">Create Device</button>
      </form>

      {apiKey && (
        <div className="api-key-display">
          <h3>⚠️ Save this API Key! It won't be shown again.</h3>
          <code>{apiKey}</code>
          <button onClick={() => navigator.clipboard.writeText(apiKey)}>
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## Testing dengan cURL

### 1. Get Available Sensors
```bash
curl -X GET http://localhost:8000/api/devices/sensors/available \
  -H "Accept: application/json"
```

### 2. Create Device
```bash
curl -X POST http://localhost:8000/api/devices \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device_id": "TEMP001",
    "device_name": "Sensor Suhu Ruangan",
    "description": "Monitoring ruang server",
    "sensors": ["temperature", "humidity", "air_quality"]
  }'
```

### 3. Get All Devices
```bash
curl -X GET http://localhost:8000/api/devices \
  -H "Accept: application/json"
```

### 4. Update Device Sensors
```bash
curl -X PUT http://localhost:8000/api/devices/1 \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "sensors": ["temperature", "humidity", "air_pressure", "co2"]
  }'
```

### 5. Test Sensor Filtering
```bash
# Device mengirim 5 sensor, tapi hanya 3 yang diaktifkan
curl -X POST http://localhost:8000/api/iot/data \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "TEMP001",
    "temperature": 25.5,
    "humidity": 60.0,
    "air_quality": 45,
    "noise": 55.0,
    "light_intensity": 850.0
  }'

# Response: Hanya temperature, humidity, air_quality yang disimpan
```

---

## Error Responses

### Device Not Found (404)
```json
{
  "success": false,
  "message": "Device tidak ditemukan"
}
```

### Validation Error (422)
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "device_id": ["The device id has already been taken."],
    "sensors": ["The sensors field is required."]
  }
}
```

### Sensor Not Allowed (403)
```json
{
  "success": false,
  "message": "Tidak ada sensor yang diizinkan untuk device ini",
  "enabled_sensors": ["temperature", "humidity"]
}
```

---

## Database Schema

### Table: devices
- `id` - Primary key
- `device_id` - Unique device identifier
- `device_name` - Device name
- `api_key` - Unique API key (64 characters)
- `description` - Optional description
- `is_active` - Active status
- `last_seen` - Last data received timestamp
- `created_at`, `updated_at`

### Table: device_sensors
- `id` - Primary key
- `device_id` - Foreign key to devices
- `sensor_name` - Sensor name (e.g., 'temperature')
- `is_enabled` - Enabled status
- `created_at`, `updated_at`

---

## Best Practices

1. **Simpan API Key dengan Aman** - API Key hanya ditampilkan sekali saat device dibuat
2. **Update Sensor Sesuai Kebutuhan** - Gunakan endpoint update untuk mengubah sensor yang diaktifkan
3. **Monitor Last Seen** - Cek kapan terakhir device mengirim data
4. **Regenerate API Key** - Jika API Key bocor, segera regenerate
5. **Validasi di Frontend** - Minimal 1 sensor harus dipilih saat create device

---

## Support

Untuk dokumentasi IoT data API, lihat `API_IOT_DOCUMENTATION.md`
