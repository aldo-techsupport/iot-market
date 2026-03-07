# Quick Start Guide - IoT API

Panduan cepat untuk mulai menggunakan IoT API.

## 1. Setup Database

Edit file `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=iot_database
DB_USERNAME=root
DB_PASSWORD=your_password
```

Jalankan migration:

```bash
php artisan migrate
```

## 2. Start Server

```bash
php artisan serve
```

Server akan berjalan di `http://localhost:8000`

## 3. Test API

### Test 1: Kirim Data Sensor Suhu

```bash
curl -X POST http://localhost:8000/api/iot/data \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device_id": "TEMP001",
    "device_name": "Sensor Suhu Ruangan",
    "temperature": 25.5,
    "humidity": 65.2
  }'
```

Response:
```json
{
  "success": true,
  "message": "Data berhasil disimpan",
  "data": {
    "id": 1,
    "device_id": "TEMP001",
    "device_name": "Sensor Suhu Ruangan",
    "temperature": 25.5,
    "humidity": 65.2,
    "created_at": "2026-02-25T10:30:00.000000Z",
    "updated_at": "2026-02-25T10:30:00.000000Z"
  }
}
```

### Test 2: Ambil Data Terbaru

```bash
curl -X GET http://localhost:8000/api/iot/data/latest/TEMP001 \
  -H "Accept: application/json"
```

### Test 3: Lihat Semua Device

```bash
curl -X GET http://localhost:8000/api/iot/devices \
  -H "Accept: application/json"
```

### Test 4: Ambil Statistik Device

```bash
curl -X GET http://localhost:8000/api/iot/statistics/TEMP001 \
  -H "Accept: application/json"
```

## 4. Contoh dari Perangkat IoT

### Arduino/ESP32 Example (HTTP POST)

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "http://your-domain.com/api/iot/data";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void sendSensorData(float temperature, float humidity) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    // Create JSON payload
    StaticJsonDocument<200> doc;
    doc["device_id"] = "ESP32_001";
    doc["device_name"] = "ESP32 Sensor";
    doc["temperature"] = temperature;
    doc["humidity"] = humidity;
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    // Send POST request
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Response: " + response);
    } else {
      Serial.println("Error: " + String(httpResponseCode));
    }
    
    http.end();
  }
}

void loop() {
  // Read sensor values
  float temperature = 25.5; // Replace with actual sensor reading
  float humidity = 65.2;    // Replace with actual sensor reading
  
  // Send data to API
  sendSensorData(temperature, humidity);
  
  // Wait 5 minutes before next reading
  delay(300000);
}
```

### Python Example

```python
import requests
import time

API_URL = "http://your-domain.com/api/iot/data"

def send_sensor_data(device_id, temperature, humidity):
    payload = {
        "device_id": device_id,
        "device_name": "Python Sensor",
        "temperature": temperature,
        "humidity": humidity
    }
    
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    
    try:
        response = requests.post(API_URL, json=payload, headers=headers)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

# Main loop
while True:
    # Read sensor values (replace with actual sensor reading)
    temperature = 25.5
    humidity = 65.2
    
    # Send to API
    send_sensor_data("PYTHON_001", temperature, humidity)
    
    # Wait 5 minutes
    time.sleep(300)
```

### Node.js Example

```javascript
const axios = require('axios');

const API_URL = 'http://your-domain.com/api/iot/data';

async function sendSensorData(deviceId, temperature, humidity) {
  try {
    const response = await axios.post(API_URL, {
      device_id: deviceId,
      device_name: 'Node.js Sensor',
      temperature: temperature,
      humidity: humidity
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('Status:', response.status);
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Main loop
setInterval(() => {
  // Read sensor values (replace with actual sensor reading)
  const temperature = 25.5;
  const humidity = 65.2;
  
  // Send to API
  sendSensorData('NODEJS_001', temperature, humidity);
}, 300000); // Every 5 minutes
```

## 5. Batch Insert (Untuk Efisiensi)

Jika perangkat IoT menyimpan data offline dan ingin mengirim sekaligus:

```bash
curl -X POST http://localhost:8000/api/iot/data/batch \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "data": [
      {
        "device_id": "TEMP001",
        "temperature": 25.5,
        "humidity": 60.0
      },
      {
        "device_id": "TEMP001",
        "temperature": 26.0,
        "humidity": 61.5
      },
      {
        "device_id": "TEMP001",
        "temperature": 26.5,
        "humidity": 62.0
      }
    ]
  }'
```

## 6. Monitoring & Maintenance

### Cleanup Data Lama

Hapus data lebih dari 30 hari:

```bash
curl -X DELETE http://localhost:8000/api/iot/data/cleanup \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"days": 30}'
```

### Cek Statistik

```bash
curl -X GET http://localhost:8000/api/iot/statistics/TEMP001 \
  -H "Accept: application/json"
```

### Agregasi Data

Ambil rata-rata, min, max suhu dalam rentang waktu:

```bash
curl -X GET "http://localhost:8000/api/iot/aggregate/TEMP001?sensor=temperature&start_date=2026-02-01&end_date=2026-02-25" \
  -H "Accept: application/json"
```

## 7. Tips & Best Practices

1. **Gunakan Batch Insert** untuk mengirim multiple data sekaligus (lebih efisien)
2. **Kirim hanya sensor yang tersedia** - tidak perlu mengirim semua field
3. **Gunakan device_id yang unik** untuk setiap perangkat
4. **Set interval pengiriman** yang wajar (misal: 5 menit, 10 menit)
5. **Handle error** dengan retry mechanism di perangkat IoT
6. **Cleanup data lama** secara berkala untuk menghemat storage

## 8. Troubleshooting

### Error: Connection Refused
- Pastikan server Laravel sudah running (`php artisan serve`)
- Cek firewall settings

### Error: 404 Not Found
- Pastikan endpoint URL benar
- Cek `php artisan route:list` untuk melihat available routes

### Error: 422 Validation Error
- Cek format JSON
- Pastikan `device_id` ada (required field)
- Cek nilai sensor sesuai range yang valid

### Error: 500 Internal Server Error
- Cek Laravel logs di `storage/logs/laravel.log`
- Pastikan database connection benar

## Support

Untuk dokumentasi lengkap, lihat `API_IOT_DOCUMENTATION.md`
