# API IoT Documentation

API untuk menerima data dari berbagai sensor IoT. Perangkat IoT dapat mengirim data sensor apa saja yang tersedia, field yang tidak digunakan akan otomatis bernilai NULL.

## Base URL
```
http://your-domain.com/api/iot
```

## Endpoints

### 1. Kirim Data Sensor
**POST** `/api/iot/data`

Endpoint untuk mengirim data sensor dari perangkat IoT.

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Request Body:**
```json
{
  "device_id": "DEVICE001",
  "device_name": "Sensor Ruang Server",
  "temperature": 25.5,
  "humidity": 65.2,
  "air_quality": 45
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Data berhasil disimpan",
  "data": {
    "id": 1,
    "device_id": "DEVICE001",
    "device_name": "Sensor Ruang Server",
    "temperature": 25.5,
    "humidity": 65.2,
    "air_quality": 45,
    "created_at": "2026-02-25T10:30:00.000000Z",
    "updated_at": "2026-02-25T10:30:00.000000Z"
  }
}
```

---

### 2. Ambil Data Terbaru
**GET** `/api/iot/data/latest/{deviceId}`

Mengambil data sensor terbaru dari device tertentu.

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "device_id": "DEVICE001",
    "temperature": 25.5,
    "humidity": 65.2,
    "created_at": "2026-02-25T10:30:00.000000Z"
  }
}
```

---

### 3. Ambil Riwayat Data
**GET** `/api/iot/data/history/{deviceId}?per_page=50`

Mengambil riwayat data dengan pagination.

**Query Parameters:**
- `per_page` (optional): Jumlah data per halaman (default: 50)

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [...],
    "total": 100,
    "per_page": 50
  }
}
```

---

### 4. Ambil Data Berdasarkan Rentang Tanggal
**GET** `/api/iot/data/range/{deviceId}?start_date=2026-02-01&end_date=2026-02-25`

**Query Parameters:**
- `start_date` (required): Tanggal mulai (format: Y-m-d)
- `end_date` (required): Tanggal akhir (format: Y-m-d)

**Response Success (200):**
```json
{
  "success": true,
  "count": 150,
  "data": [...]
}
```

---

### 5. Daftar Semua Device
**GET** `/api/iot/devices`

Mengambil daftar semua device yang pernah mengirim data.

**Response Success (200):**
```json
{
  "success": true,
  "count": 5,
  "devices": [
    {
      "device_id": "DEVICE001",
      "device_name": "Sensor Ruang Server"
    }
  ]
}
```

---

### 6. Hapus Data Lama
**DELETE** `/api/iot/data/cleanup`

Menghapus data yang lebih lama dari jumlah hari tertentu.

**Request Body:**
```json
{
  "days": 30
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Data lebih dari 30 hari berhasil dihapus",
  "deleted_count": 1500
}
```

---

### 7. Statistik Device
**GET** `/api/iot/statistics/{deviceId}`

Mengambil statistik lengkap dari device tertentu.

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "device_id": "DEVICE001",
    "device_name": "Sensor Ruang Server",
    "total_records": 5000,
    "today_records": 150,
    "this_week_records": 1050,
    "this_month_records": 4500,
    "first_seen": "2026-01-01T00:00:00.000000Z",
    "last_seen": "2026-02-25T10:30:00.000000Z"
  }
}
```

---

### 8. Data Agregat (Rata-rata, Min, Max)
**GET** `/api/iot/aggregate/{deviceId}?sensor=temperature&start_date=2026-02-01&end_date=2026-02-25`

Mengambil data agregat untuk sensor tertentu.

**Query Parameters:**
- `sensor` (required): Nama sensor (contoh: temperature, humidity, voltage)
- `start_date` (optional): Tanggal mulai (format: Y-m-d)
- `end_date` (optional): Tanggal akhir (format: Y-m-d)

**Response Success (200):**
```json
{
  "success": true,
  "device_id": "DEVICE001",
  "sensor": "temperature",
  "data": {
    "average": 26.5,
    "minimum": 22.0,
    "maximum": 32.5,
    "count": 150
  }
}
```

---

### 9. Batch Insert Data
**POST** `/api/iot/data/batch`

Mengirim multiple data sensor sekaligus (maksimal 100 data per request).

**Request Body:**
```json
{
  "data": [
    {
      "device_id": "DEVICE001",
      "temperature": 25.5,
      "humidity": 60.0
    },
    {
      "device_id": "DEVICE001",
      "temperature": 25.8,
      "humidity": 61.2
    },
    {
      "device_id": "DEVICE002",
      "voltage": 220.5,
      "current": 15.2
    }
  ]
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "3 data berhasil disimpan",
  "count": 3
}
```

---

## Daftar Lengkap Field Sensor

Semua field bersifat **OPTIONAL** kecuali `device_id`. Kirim hanya sensor yang tersedia di perangkat Anda.

### Environmental Sensors
- `temperature` (decimal): Suhu (°C)
- `humidity` (decimal): Kelembaban (%RH)
- `air_pressure` (decimal): Tekanan Udara (hPa)
- `air_quality` (integer): Kualitas Udara (AQI)
- `co2` (decimal): CO2 (ppm)
- `co` (decimal): CO (ppm)
- `nh3` (decimal): NH3/Amonia (ppm)
- `h2s` (decimal): H2S (ppm)
- `voc` (decimal): VOC (ppm)
- `noise` (decimal): Kebisingan (dB)
- `light_intensity` (decimal): Intensitas Cahaya (Lux)

### Vibration & Rotation
- `vibration` (decimal): Getaran (mm/s)
- `rpm` (integer): RPM (RPM)

### Electrical Measurements
- `voltage` (decimal): Tegangan (Volt)
- `current` (decimal): Arus (Ampere)
- `active_power` (decimal): Daya Aktif (Watt)
- `apparent_power` (decimal): Daya Semu (VA)
- `apparent_power` (decimal): Daya Reaktif (VAR)
- `energy` (decimal): Energi (kWh)
- `frequency` (decimal): Frekuensi (Hz)
- `power_factor` (decimal): Power Factor (Cos φ)
- `thd` (decimal): THD (%)

### Flow & Pressure
- `water_flow` (decimal): Debit Air (L/min)
- `solar_flow` (decimal): Debit Solar (L/min)
- `pipe_pressure` (decimal): Tekanan Pipa (Bar)
- `tank_level_percent` (decimal): Level Tangki (%)
- `tank_level_cm` (decimal): Level Tangki (cm)
- `tank_volume` (decimal): Volume Tangki (Liter)
- `liquid_temperature` (decimal): Suhu Cairan (°C)
- `gas_pressure` (decimal): Tekanan Gas (Bar)
- `gas_flow` (decimal): Aliran Gas (m³/h)

### Machine Status
- `production_counter` (integer): Counter Produksi (Unit)
- `machine_runtime` (decimal): Waktu Operasi Mesin (Jam)
- `machine_status` (boolean): Status Mesin (true=On, false=Off)
- `pump_status` (boolean): Status Pompa (true=On, false=Off)
- `valve_status` (boolean): Status Valve (true=Open, false=Close)
- `torque` (decimal): Torsi (Nm)
- `machine_load` (decimal): Beban Mesin (%)

### Safety & Detection
- `fire_detected` (boolean): Deteksi Api
- `smoke_detected` (boolean): Deteksi Asap
- `gas_leak_detected` (boolean): Deteksi Gas Bocor
- `door_status` (boolean): Status Pintu (true=Open, false=Close)
- `abnormal_vibration` (boolean): Deteksi Getaran Abnormal

### Agriculture & Water Quality
- `soil_moisture` (decimal): Kelembaban Tanah (%)
- `ph_level` (decimal): pH Cairan
- `conductivity` (decimal): Konduktivitas (µS/cm)
- `salinity` (decimal): Salinitas (ppt)
- `water_level` (decimal): Ketinggian Air (cm)

### Weather
- `wind_speed` (decimal): Kecepatan Angin (m/s)
- `wind_direction` (decimal): Arah Angin (°)
- `rainfall` (decimal): Curah Hujan (mm)

### Additional
- `notes` (text): Catatan tambahan

---

## Contoh Penggunaan

### Contoh 1: Sensor Suhu Saja
```json
{
  "device_id": "TEMP001",
  "device_name": "Sensor Suhu Gudang",
  "temperature": 28.5
}
```

### Contoh 2: Sensor Listrik Lengkap
```json
{
  "device_id": "POWER001",
  "device_name": "Power Meter Gedung A",
  "voltage": 220.5,
  "current": 15.2,
  "active_power": 3350.6,
  "frequency": 50.1,
  "power_factor": 0.95,
  "energy": 125.5
}
```

### Contoh 3: Monitoring Mesin
```json
{
  "device_id": "MACHINE001",
  "device_name": "Mesin Produksi Line 1",
  "machine_status": true,
  "rpm": 1450,
  "vibration": 2.5,
  "temperature": 65.2,
  "machine_load": 75.5,
  "production_counter": 1250
}
```

### Contoh 4: Environmental Monitoring
```json
{
  "device_id": "ENV001",
  "device_name": "Sensor Lingkungan Pabrik",
  "temperature": 32.5,
  "humidity": 68.5,
  "air_quality": 85,
  "co2": 450.5,
  "noise": 65.2,
  "light_intensity": 850.5
}
```

### Contoh 5: Safety System
```json
{
  "device_id": "SAFETY001",
  "device_name": "Safety Sensor Area Produksi",
  "fire_detected": false,
  "smoke_detected": false,
  "gas_leak_detected": false,
  "door_status": true,
  "temperature": 28.5
}
```

---

## Testing dengan cURL

### Kirim Data
```bash
curl -X POST http://your-domain.com/api/iot/data \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device_id": "TEST001",
    "device_name": "Test Device",
    "temperature": 25.5,
    "humidity": 60.0
  }'
```

### Ambil Data Terbaru
```bash
curl -X GET http://your-domain.com/api/iot/data/latest/TEST001 \
  -H "Accept: application/json"
```

### Ambil Statistik Device
```bash
curl -X GET http://your-domain.com/api/iot/statistics/TEST001 \
  -H "Accept: application/json"
```

### Ambil Data Agregat
```bash
curl -X GET "http://your-domain.com/api/iot/aggregate/TEST001?sensor=temperature&start_date=2026-02-01&end_date=2026-02-25" \
  -H "Accept: application/json"
```

### Batch Insert
```bash
curl -X POST http://your-domain.com/api/iot/data/batch \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "data": [
      {
        "device_id": "TEST001",
        "temperature": 25.5,
        "humidity": 60.0
      },
      {
        "device_id": "TEST001",
        "temperature": 26.0,
        "humidity": 61.5
      }
    ]
  }'
```

---

## Error Responses

### Validation Error (422)
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "device_id": ["The device id field is required."]
  }
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Data tidak ditemukan"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Gagal menyimpan data",
  "error": "Error message here"
}
```
