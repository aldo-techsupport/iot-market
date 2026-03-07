# IoT API V2 - Contoh Implementasi

## 📋 Contoh Konfigurasi Device

### 1. Environmental Monitoring

**Use Case:** Monitoring lingkungan ruang server

```json
{
  "device_id": "ENV001",
  "device_name": "Environmental Sensor - Server Room",
  "description": "Monitoring suhu, kelembaban, dan kualitas udara ruang server",
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

**Contoh Data:**
```json
{
  "device_id": "ENV001",
  "v1": "24.5",
  "v2": "55.0",
  "v3": "1013.25",
  "v4": "450",
  "v5": "45",
  "v6": "300"
}
```

### 2. Power Meter

**Use Case:** Monitoring konsumsi listrik gedung

```json
{
  "device_id": "POWER001",
  "device_name": "Power Meter Gedung A",
  "description": "Monitoring konsumsi listrik gedung A",
  "sensors": [
    {"variable": "V1", "custom_name": "Tegangan", "unit": "V"},
    {"variable": "V2", "custom_name": "Arus", "unit": "A"},
    {"variable": "V3", "custom_name": "Daya Aktif", "unit": "W"},
    {"variable": "V4", "custom_name": "Daya Reaktif", "unit": "VAR"},
    {"variable": "V5", "custom_name": "Frekuensi", "unit": "Hz"},
    {"variable": "V6", "custom_name": "Power Factor", "unit": ""},
    {"variable": "V7", "custom_name": "Energi Total", "unit": "kWh"}
  ]
}
```

**Contoh Data:**
```json
{
  "device_id": "POWER001",
  "v1": "220.5",
  "v2": "15.2",
  "v3": "3350.6",
  "v4": "250.5",
  "v5": "50.1",
  "v6": "0.95",
  "v7": "1250.5"
}
```

### 3. Machine Monitoring

**Use Case:** Monitoring mesin produksi

```json
{
  "device_id": "MACHINE001",
  "device_name": "Mesin Produksi Line 1",
  "description": "Monitoring kondisi mesin produksi line 1",
  "sensors": [
    {"variable": "V1", "custom_name": "Status Mesin", "unit": ""},
    {"variable": "V2", "custom_name": "RPM", "unit": "RPM"},
    {"variable": "V3", "custom_name": "Getaran", "unit": "mm/s"},
    {"variable": "V4", "custom_name": "Suhu Motor", "unit": "°C"},
    {"variable": "V5", "custom_name": "Beban Mesin", "unit": "%"},
    {"variable": "V6", "custom_name": "Counter Produksi", "unit": "Unit"},
    {"variable": "V7", "custom_name": "Runtime", "unit": "Jam"}
  ]
}
```

**Contoh Data:**
```json
{
  "device_id": "MACHINE001",
  "v1": "1",
  "v2": "1450",
  "v3": "2.5",
  "v4": "65.2",
  "v5": "75.5",
  "v6": "1250",
  "v7": "8.5"
}
```

### 4. Water Tank Monitoring

**Use Case:** Monitoring tangki air

```json
{
  "device_id": "TANK001",
  "device_name": "Water Tank Monitoring",
  "description": "Monitoring level dan kualitas air tangki",
  "sensors": [
    {"variable": "V1", "custom_name": "Level", "unit": "%"},
    {"variable": "V2", "custom_name": "Tinggi Air", "unit": "cm"},
    {"variable": "V3", "custom_name": "Volume", "unit": "L"},
    {"variable": "V4", "custom_name": "Suhu Air", "unit": "°C"},
    {"variable": "V5", "custom_name": "Tekanan", "unit": "Bar"},
    {"variable": "V6", "custom_name": "Flow Rate", "unit": "L/min"},
    {"variable": "V7", "custom_name": "Status Pompa", "unit": ""}
  ]
}
```

**Contoh Data:**
```json
{
  "device_id": "TANK001",
  "v1": "75",
  "v2": "150",
  "v3": "7500",
  "v4": "28.5",
  "v5": "2.5",
  "v6": "25.5",
  "v7": "1"
}
```

### 5. Weather Station

**Use Case:** Stasiun cuaca

```json
{
  "device_id": "WEATHER001",
  "device_name": "Weather Station Atap",
  "description": "Monitoring cuaca di atap gedung",
  "sensors": [
    {"variable": "V1", "custom_name": "Suhu Udara", "unit": "°C"},
    {"variable": "V2", "custom_name": "Kelembaban", "unit": "%"},
    {"variable": "V3", "custom_name": "Tekanan Udara", "unit": "hPa"},
    {"variable": "V4", "custom_name": "Kecepatan Angin", "unit": "m/s"},
    {"variable": "V5", "custom_name": "Arah Angin", "unit": "°"},
    {"variable": "V6", "custom_name": "Curah Hujan", "unit": "mm"},
    {"variable": "V7", "custom_name": "UV Index", "unit": ""}
  ]
}
```

**Contoh Data:**
```json
{
  "device_id": "WEATHER001",
  "v1": "32.5",
  "v2": "68.5",
  "v3": "1013.25",
  "v4": "5.2",
  "v5": "180",
  "v6": "0.5",
  "v7": "8"
}
```

### 6. Smart Agriculture

**Use Case:** Monitoring pertanian pintar

```json
{
  "device_id": "FARM001",
  "device_name": "Smart Farm Sensor",
  "description": "Monitoring kondisi lahan pertanian",
  "sensors": [
    {"variable": "V1", "custom_name": "Suhu Tanah", "unit": "°C"},
    {"variable": "V2", "custom_name": "Kelembaban Tanah", "unit": "%"},
    {"variable": "V3", "custom_name": "pH Tanah", "unit": "pH"},
    {"variable": "V4", "custom_name": "Nitrogen", "unit": "mg/kg"},
    {"variable": "V5", "custom_name": "Fosfor", "unit": "mg/kg"},
    {"variable": "V6", "custom_name": "Kalium", "unit": "mg/kg"},
    {"variable": "V7", "custom_name": "Cahaya", "unit": "Lux"}
  ]
}
```

### 7. Cold Storage Monitoring

**Use Case:** Monitoring cold storage/freezer

```json
{
  "device_id": "COLD001",
  "device_name": "Cold Storage Monitor",
  "description": "Monitoring suhu dan kelembaban cold storage",
  "sensors": [
    {"variable": "V1", "custom_name": "Suhu Ruangan", "unit": "°C"},
    {"variable": "V2", "custom_name": "Kelembaban", "unit": "%"},
    {"variable": "V3", "custom_name": "Status Pintu", "unit": ""},
    {"variable": "V4", "custom_name": "Status Kompresor", "unit": ""},
    {"variable": "V5", "custom_name": "Konsumsi Daya", "unit": "W"}
  ]
}
```

### 8. Air Quality Monitoring

**Use Case:** Monitoring kualitas udara

```json
{
  "device_id": "AIR001",
  "device_name": "Air Quality Monitor",
  "description": "Monitoring kualitas udara indoor",
  "sensors": [
    {"variable": "V1", "custom_name": "PM2.5", "unit": "μg/m³"},
    {"variable": "V2", "custom_name": "PM10", "unit": "μg/m³"},
    {"variable": "V3", "custom_name": "CO2", "unit": "ppm"},
    {"variable": "V4", "custom_name": "CO", "unit": "ppm"},
    {"variable": "V5", "custom_name": "VOC", "unit": "ppb"},
    {"variable": "V6", "custom_name": "Ozon", "unit": "ppb"},
    {"variable": "V7", "custom_name": "AQI", "unit": ""}
  ]
}
```

## 🔧 Contoh Kode Implementasi

### Arduino/ESP32 - DHT22 Sensor

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

#define DHTPIN 4
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "https://api-iot.digitaltekno.cloud/api/iot/data";
const char* deviceId = "ENV001";

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void loop() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }
  
  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  
  // V2 Format: using v1, v2 instead of temperature, humidity
  String jsonData = "{";
  jsonData += "\"device_id\":\"" + String(deviceId) + "\",";
  jsonData += "\"v1\":\"" + String(temperature) + "\",";
  jsonData += "\"v2\":\"" + String(humidity) + "\"";
  jsonData += "}";
  
  int httpResponseCode = http.POST(jsonData);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("Response: " + response);
  } else {
    Serial.println("Error: " + String(httpResponseCode));
  }
  
  http.end();
  
  delay(60000); // Send data every 1 minute
}
```

### Python - Multiple Sensors

```python
import requests
import time
import random

API_URL = "https://api-iot.digitaltekno.cloud/api/iot/data"
DEVICE_ID = "POWER001"

def read_sensors():
    """Simulate reading from power meter sensors"""
    return {
        'v1': str(round(random.uniform(215.0, 225.0), 2)),  # Voltage
        'v2': str(round(random.uniform(10.0, 20.0), 2)),    # Current
        'v3': str(round(random.uniform(3000.0, 4000.0), 2)), # Power
        'v4': str(round(random.uniform(200.0, 300.0), 2)),   # Reactive Power
        'v5': str(round(random.uniform(49.5, 50.5), 2)),     # Frequency
        'v6': str(round(random.uniform(0.90, 0.99), 2)),     # Power Factor
        'v7': str(round(random.uniform(1000.0, 2000.0), 2))  # Energy
    }

def send_sensor_data(data):
    payload = {
        "device_id": DEVICE_ID,
        **data
    }
    
    try:
        response = requests.post(API_URL, json=payload)
        if response.status_code == 201:
            print(f"✓ Data sent successfully: {response.json()}")
        else:
            print(f"✗ Error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"✗ Exception: {e}")

# Main loop
while True:
    sensor_data = read_sensors()
    send_sensor_data(sensor_data)
    time.sleep(60)  # Send every 1 minute
```

### Node.js - Batch Insert

```javascript
const axios = require('axios');

const API_URL = 'https://api-iot.digitaltekno.cloud/api/iot/data/batch';
const DEVICE_ID = 'MACHINE001';

// Simulate reading multiple data points
function generateBatchData(count) {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      device_id: DEVICE_ID,
      v1: '1', // Status: On
      v2: String(Math.floor(Math.random() * 100 + 1400)), // RPM
      v3: String((Math.random() * 2 + 1).toFixed(2)), // Vibration
      v4: String((Math.random() * 10 + 60).toFixed(2)), // Temperature
      v5: String((Math.random() * 20 + 70).toFixed(2)), // Load
      v6: String(Math.floor(Math.random() * 100 + 1200)), // Counter
      v7: String((Math.random() * 2 + 8).toFixed(2)) // Runtime
    });
  }
  return data;
}

async function sendBatchData() {
  try {
    const batchData = generateBatchData(10); // Generate 10 data points
    
    const response = await axios.post(API_URL, {
      data: batchData
    });
    
    console.log('✓ Batch data sent:', response.data);
  } catch (error) {
    console.error('✗ Error:', error.message);
  }
}

// Send batch data every 5 minutes
setInterval(sendBatchData, 300000);
```

## 📊 Contoh Response API

### Create Device Response

```json
{
  "success": true,
  "message": "Device berhasil dibuat",
  "data": {
    "device": {
      "id": 1,
      "device_id": "ENV001",
      "device_name": "Environmental Sensor - Server Room",
      "description": "Monitoring suhu, kelembaban, dan kualitas udara",
      "is_active": true,
      "created_at": "2026-02-26T10:00:00.000000Z"
    },
    "api_key": "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567890abcdef12",
    "sensors": [
      {
        "id": 1,
        "device_id": 1,
        "variable_name": "V1",
        "custom_name": "Suhu",
        "unit": "°C",
        "is_enabled": true
      },
      {
        "id": 2,
        "device_id": 1,
        "variable_name": "V2",
        "custom_name": "Kelembaban",
        "unit": "%",
        "is_enabled": true
      }
    ]
  }
}
```

### Latest Data Response

```json
{
  "success": true,
  "data": {
    "id": 1234,
    "device_id": "ENV001",
    "device_name": "Environmental Sensor - Server Room",
    "v1": "24.5",
    "v2": "55.0",
    "v3": "1013.25",
    "v4": "450",
    "v5": "45",
    "v6": "300",
    "created_at": "2026-02-26T10:30:00.000000Z"
  }
}
```

### Statistics Response

```json
{
  "success": true,
  "data": {
    "device_id": "ENV001",
    "device_name": "Environmental Sensor - Server Room",
    "total_records": 5000,
    "today_records": 150,
    "this_week_records": 1050,
    "this_month_records": 4500,
    "first_seen": "2026-01-01T00:00:00.000000Z",
    "last_seen": "2026-02-26T10:30:00.000000Z"
  }
}
```

### Aggregate Response

```json
{
  "success": true,
  "device_id": "ENV001",
  "variable": "V1",
  "custom_name": "Suhu",
  "unit": "°C",
  "data": {
    "average": 24.5,
    "minimum": 22.0,
    "maximum": 28.5,
    "count": 150
  }
}
```

## 💡 Tips & Best Practices

1. **Konsistensi Variable**: Jangan ubah mapping variable setelah device aktif
2. **Validasi Data**: Validasi data sensor sebelum dikirim
3. **Error Handling**: Implementasi retry mechanism untuk koneksi gagal
4. **Interval Pengiriman**: Sesuaikan dengan kebutuhan (1-5 menit untuk monitoring real-time)
5. **Batch Insert**: Gunakan batch insert untuk efisiensi jika ada banyak data
6. **Custom Name**: Gunakan nama yang deskriptif dan mudah dipahami
7. **Unit**: Selalu sertakan unit untuk memudahkan interpretasi data
8. **Monitoring**: Monitor statistik device secara berkala

## 🔗 Referensi

- [API Documentation](API_IOT_DOCUMENTATION.md)
- [Device Management API](DEVICE_MANAGEMENT_API.md)
- [Quick Start Guide](QUICK_START.md)
- [Migration Guide](IOT_API_V2_MIGRATION.md)
