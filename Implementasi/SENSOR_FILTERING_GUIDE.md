# Sensor Filtering Guide

Panduan lengkap cara kerja sensor filtering di IoT API.

## 📋 Konsep Dasar

Sensor filtering memungkinkan Anda untuk:
1. **Memilih sensor** mana saja yang akan digunakan per device (via checkbox di web)
2. **Validasi otomatis** - hanya data sensor yang diaktifkan yang disimpan
3. **Fleksibilitas** - IoT device tetap bisa kirim semua sensor, backend yang filter

## 🔄 Alur Kerja

```
┌─────────────────────────────────────────────────────────────┐
│  1. FRONTEND WEB (Admin/User)                               │
│                                                              │
│  GET /api/devices/sensors/available                         │
│  ↓                                                           │
│  Tampilkan 53 sensor dalam checkbox (grouped by category)   │
│  ↓                                                           │
│  User pilih sensor: ☑ temperature ☑ humidity ☑ air_quality │
│  ↓                                                           │
│  POST /api/devices                                          │
│  {                                                           │
│    "device_id": "TEMP001",                                  │
│    "sensors": ["temperature", "humidity", "air_quality"]    │
│  }                                                           │
│  ↓                                                           │
│  Response: API Key = "PUuy6SxanCn6PR70i..."                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  2. DATABASE                                                 │
│                                                              │
│  Table: devices                                             │
│  ┌────┬───────────┬──────────────┬─────────────────────┐   │
│  │ id │ device_id │ device_name  │ api_key             │   │
│  ├────┼───────────┼──────────────┼─────────────────────┤   │
│  │ 1  │ TEMP001   │ Sensor Suhu  │ PUuy6SxanCn6PR70i...│   │
│  └────┴───────────┴──────────────┴─────────────────────┘   │
│                                                              │
│  Table: device_sensors                                      │
│  ┌────┬───────────┬──────────────┬────────────┐            │
│  │ id │ device_id │ sensor_name  │ is_enabled │            │
│  ├────┼───────────┼──────────────┼────────────┤            │
│  │ 1  │ 1         │ temperature  │ true       │            │
│  │ 2  │ 1         │ humidity     │ true       │            │
│  │ 3  │ 1         │ air_quality  │ true       │            │
│  └────┴───────────┴──────────────┴────────────┘            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  3. IOT DEVICE (Arduino/ESP32/Python/etc)                   │
│                                                              │
│  Device mengirim 5 sensor:                                  │
│  POST /api/iot/data                                         │
│  {                                                           │
│    "device_id": "TEMP001",                                  │
│    "temperature": 25.5,        ← DIAKTIFKAN ✅             │
│    "humidity": 60.0,           ← DIAKTIFKAN ✅             │
│    "air_quality": 45,          ← DIAKTIFKAN ✅             │
│    "noise": 55.0,              ← TIDAK DIAKTIFKAN ❌       │
│    "light_intensity": 850.0    ← TIDAK DIAKTIFKAN ❌       │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  4. BACKEND VALIDATION (Automatic)                          │
│                                                              │
│  1. Cek device_id = "TEMP001" di database                   │
│  2. Ambil enabled sensors: [temperature, humidity, air_quality]│
│  3. Filter data yang masuk:                                 │
│     ✅ temperature: 25.5  → SIMPAN                          │
│     ✅ humidity: 60.0     → SIMPAN                          │
│     ✅ air_quality: 45    → SIMPAN                          │
│     ❌ noise: 55.0        → ABAIKAN                         │
│     ❌ light_intensity    → ABAIKAN                         │
│  4. Simpan ke database (iot_data table)                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  5. RESPONSE                                                 │
│                                                              │
│  {                                                           │
│    "success": true,                                         │
│    "message": "Data berhasil disimpan",                     │
│    "data": {                                                │
│      "id": 1,                                               │
│      "device_id": "TEMP001",                                │
│      "temperature": 25.5,                                   │
│      "humidity": 60.0,                                      │
│      "air_quality": 45,                                     │
│      "created_at": "2026-02-25T10:35:00.000000Z"            │
│    }                                                         │
│  }                                                           │
│                                                              │
│  Note: noise dan light_intensity TIDAK ada di response      │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Keuntungan Sistem Ini

### 1. Fleksibilitas untuk IoT Device
- Device tidak perlu tahu sensor mana yang diaktifkan
- Kirim semua sensor yang tersedia
- Backend yang handle filtering

### 2. Kontrol dari Web Dashboard
- Admin bisa enable/disable sensor kapan saja
- Tidak perlu update firmware IoT device
- Perubahan langsung berlaku

### 3. Efisiensi Database
- Hanya data yang diperlukan yang disimpan
- Hemat storage
- Query lebih cepat

### 4. Keamanan
- Setiap device punya API Key unik
- Validasi sensor per device
- Tracking last seen

## 📱 Implementasi di Frontend

### Step 1: Load Available Sensors

```javascript
// Fetch daftar sensor yang tersedia
fetch('http://your-api.com/api/devices/sensors/available')
  .then(res => res.json())
  .then(data => {
    // data.data berisi array 53 sensor
    // Contoh:
    // [
    //   { name: "temperature", label: "Suhu (°C)", category: "Environmental" },
    //   { name: "humidity", label: "Kelembaban (%RH)", category: "Environmental" },
    //   ...
    // ]
    
    renderSensorCheckboxes(data.data);
  });
```

### Step 2: Render Checkboxes (Grouped by Category)

```javascript
function renderSensorCheckboxes(sensors) {
  // Group by category
  const grouped = sensors.reduce((acc, sensor) => {
    if (!acc[sensor.category]) acc[sensor.category] = [];
    acc[sensor.category].push(sensor);
    return acc;
  }, {});
  
  // Render HTML
  let html = '';
  for (const [category, categorySensors] of Object.entries(grouped)) {
    html += `<div class="category">`;
    html += `<h3>${category}</h3>`;
    
    categorySensors.forEach(sensor => {
      html += `
        <label>
          <input type="checkbox" name="sensors" value="${sensor.name}">
          ${sensor.label}
        </label>
      `;
    });
    
    html += `</div>`;
  }
  
  document.getElementById('sensors-container').innerHTML = html;
}
```

### Step 3: Submit Device Registration

```javascript
function createDevice() {
  // Get selected sensors
  const checkboxes = document.querySelectorAll('input[name="sensors"]:checked');
  const selectedSensors = Array.from(checkboxes).map(cb => cb.value);
  
  // Validate
  if (selectedSensors.length === 0) {
    alert('Pilih minimal 1 sensor!');
    return;
  }
  
  // Submit
  fetch('http://your-api.com/api/devices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      device_id: document.getElementById('device_id').value,
      device_name: document.getElementById('device_name').value,
      description: document.getElementById('description').value,
      sensors: selectedSensors
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      // IMPORTANT: API Key hanya ditampilkan sekali!
      alert('Device created! API Key: ' + data.data.api_key);
      
      // Show API Key to user
      displayApiKey(data.data.api_key);
    }
  });
}
```

## 🔧 Implementasi di IoT Device

### Arduino/ESP32 Example

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* serverUrl = "http://your-api.com/api/iot/data";

void sendData() {
  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  
  // Buat JSON dengan SEMUA sensor yang device punya
  // Backend akan otomatis filter
  StaticJsonDocument<512> doc;
  doc["device_id"] = "TEMP001";
  
  // Kirim semua sensor (tidak perlu cek mana yang enabled)
  doc["temperature"] = readTemperature();
  doc["humidity"] = readHumidity();
  doc["air_quality"] = readAirQuality();
  doc["noise"] = readNoise();
  doc["light_intensity"] = readLight();
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  int httpCode = http.POST(jsonString);
  
  if (httpCode > 0) {
    String response = http.getString();
    Serial.println(response);
    // Response hanya berisi sensor yang enabled
  }
  
  http.end();
}
```

### Python Example

```python
import requests

def send_sensor_data():
    url = "http://your-api.com/api/iot/data"
    
    # Kirim semua sensor yang tersedia
    # Backend akan filter otomatis
    data = {
        "device_id": "TEMP001",
        "temperature": read_temperature(),
        "humidity": read_humidity(),
        "air_quality": read_air_quality(),
        "noise": read_noise(),
        "light_intensity": read_light()
    }
    
    response = requests.post(url, json=data)
    print(response.json())
    # Response hanya berisi sensor yang enabled
```

## 🔄 Update Sensor Configuration

Jika ingin mengubah sensor yang diaktifkan:

```bash
# Update device untuk enable/disable sensor
curl -X PUT http://your-api.com/api/devices/1 \
  -H "Content-Type: application/json" \
  -d '{
    "sensors": [
      "temperature",
      "humidity",
      "air_pressure",
      "co2"
    ]
  }'
```

Setelah update:
- Sensor baru langsung aktif
- IoT device tidak perlu diubah
- Kirim data seperti biasa

## ❓ FAQ

### Q: Apakah IoT device harus tahu sensor mana yang enabled?
**A:** TIDAK. Device kirim semua sensor yang tersedia, backend yang filter.

### Q: Bagaimana jika device kirim sensor yang tidak enabled?
**A:** Data sensor tersebut diabaikan, tidak disimpan ke database.

### Q: Apakah bisa update sensor tanpa restart device?
**A:** YA. Update dari web dashboard, langsung berlaku tanpa restart device.

### Q: Bagaimana jika device belum terdaftar?
**A:** Data tetap disimpan (semua sensor), tapi tidak ada filtering.

### Q: Apakah API Key wajib?
**A:** Tidak wajib, tapi sangat direkomendasikan untuk keamanan.

### Q: Berapa banyak sensor yang bisa dipilih?
**A:** Minimal 1, maksimal 53 (semua sensor yang tersedia).

### Q: Apakah bisa pilih sensor berbeda per device?
**A:** YA. Setiap device bisa punya konfigurasi sensor yang berbeda.

## 📊 Monitoring

### Cek Sensor yang Enabled

```bash
# Get device detail
curl -X GET http://your-api.com/api/devices/1

# Response:
# {
#   "success": true,
#   "data": {
#     "device_id": "TEMP001",
#     "sensors": [
#       { "sensor_name": "temperature", "is_enabled": true },
#       { "sensor_name": "humidity", "is_enabled": true },
#       { "sensor_name": "air_quality", "is_enabled": true }
#     ]
#   }
# }
```

### Cek Last Seen

```bash
# Get all devices
curl -X GET http://your-api.com/api/devices

# Response:
# {
#   "data": [
#     {
#       "device_id": "TEMP001",
#       "last_seen": "5 minutes ago",
#       "enabled_sensors_count": 3
#     }
#   ]
# }
```

## 🎨 UI/UX Recommendations

1. **Group by Category** - Tampilkan sensor per kategori untuk kemudahan
2. **Select All Button** - Tambahkan tombol "Select All" per kategori
3. **Search/Filter** - Tambahkan search box untuk cari sensor
4. **Visual Indicator** - Tampilkan jumlah sensor yang dipilih
5. **API Key Display** - Tampilkan API Key dengan warning "Save this!"
6. **Copy Button** - Tambahkan tombol copy untuk API Key
7. **Example cURL** - Generate contoh cURL setelah device dibuat

Lihat `example_frontend.html` untuk implementasi lengkap!

## 📚 Related Documentation

- `DEVICE_MANAGEMENT_API.md` - API documentation lengkap
- `example_frontend.html` - Working example dengan UI
- `example_api_response.json` - Contoh response API
