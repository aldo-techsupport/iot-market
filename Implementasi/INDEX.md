# IoT API - Documentation Index

Selamat datang di dokumentasi IoT API. Pilih dokumentasi yang Anda butuhkan:

## 📚 Dokumentasi Utama

### 1. [Quick Start Guide](QUICK_START.md)
**Mulai di sini!** Panduan cepat untuk setup dan mulai menggunakan API.
- Setup database
- Start server
- Test API pertama kali
- Contoh kode Arduino/ESP32, Python, Node.js

### 2. [API IoT Documentation](API_IOT_DOCUMENTATION.md)
Dokumentasi lengkap untuk IoT Data API.
- Endpoint untuk kirim data sensor
- Ambil data (latest, history, range)
- Statistik dan agregasi
- Daftar lengkap 53 sensor yang didukung
- Contoh penggunaan untuk berbagai jenis sensor

### 3. [Device Management API](DEVICE_MANAGEMENT_API.md)
Dokumentasi untuk Device Management & Sensor Filtering.
- Registrasi device dengan API Key
- Pilih sensor yang diaktifkan (checkbox)
- CRUD device management
- Regenerate API Key
- Frontend integration example (React/Next.js)

### 4. [Sensor Filtering Guide](SENSOR_FILTERING_GUIDE.md)
Panduan lengkap cara kerja sensor filtering.
- Konsep dan alur kerja
- Diagram flow lengkap
- Implementasi di frontend
- Implementasi di IoT device
- FAQ

## 🎨 Contoh & Template

### 5. [Example Frontend](example_frontend.html)
Halaman HTML lengkap untuk registrasi device.
- Form registrasi device
- Checkbox sensor filtering (53 sensor)
- Grouped by category
- Auto-generate API Key
- Copy to clipboard
- Example cURL

### 6. [Example API Response](example_api_response.json)
Contoh response API untuk semua endpoint.
- Get available sensors
- Create device
- Send sensor data
- Sensor filtering in action

### 7. [IoT Test Examples](iot_test_examples.json)
Contoh data sensor untuk testing.
- Temperature only
- Environmental complete
- Power meter
- Machine monitoring
- Safety system
- Agriculture sensor
- Weather station
- Dan lainnya...

### 8. [Postman Collection](IoT_API.postman_collection.json)
Collection Postman untuk testing API.
- Import ke Postman
- Test semua endpoint
- Pre-configured requests

## 🚀 Quick Links

### Untuk Developer IoT Device
1. Baca [Quick Start Guide](QUICK_START.md) - Section "Contoh dari Perangkat IoT"
2. Lihat [IoT Test Examples](iot_test_examples.json) untuk contoh data
3. Baca [API IoT Documentation](API_IOT_DOCUMENTATION.md) untuk endpoint details

### Untuk Frontend Developer
1. Buka [Example Frontend](example_frontend.html) di browser
2. Baca [Device Management API](DEVICE_MANAGEMENT_API.md)
3. Baca [Sensor Filtering Guide](SENSOR_FILTERING_GUIDE.md)

### Untuk Testing/QA
1. Import [Postman Collection](IoT_API.postman_collection.json)
2. Gunakan [IoT Test Examples](iot_test_examples.json) untuk test data
3. Lihat [Example API Response](example_api_response.json) untuk expected results

## 📊 Sensor Categories

API ini mendukung 53 sensor yang dikelompokkan dalam 8 kategori:

| Category | Jumlah Sensor | Contoh |
|----------|---------------|--------|
| Environmental | 11 | Suhu, Kelembaban, CO2, Kualitas Udara |
| Electrical | 11 | Tegangan, Arus, Daya, Energi, Power Factor |
| Flow & Pressure | 9 | Debit Air, Tekanan Pipa, Level Tangki |
| Machine Status | 7 | Status Mesin, RPM, Torsi, Beban |
| Safety | 5 | Deteksi Api, Asap, Gas Bocor |
| Agriculture & Water | 5 | Kelembaban Tanah, pH, Konduktivitas |
| Weather | 3 | Kecepatan Angin, Arah Angin, Curah Hujan |
| Vibration & Rotation | 2 | Getaran, RPM |

Lihat daftar lengkap di [API IoT Documentation](API_IOT_DOCUMENTATION.md#daftar-lengkap-field-sensor)

## 🔑 Key Features

### 1. Sensor Filtering
- Pilih sensor mana saja yang diaktifkan per device
- Validasi otomatis di backend
- IoT device tidak perlu tahu sensor mana yang enabled

### 2. Device Management
- Setiap device punya API Key unik
- CRUD device management
- Last seen tracking

### 3. Flexible Data Input
- Kirim sensor apa saja yang tersedia
- Batch insert untuk efisiensi
- Response hanya tampilkan field yang terisi

### 4. Data Analysis
- Statistik per device
- Agregasi data (avg, min, max)
- Filter by date range
- Pagination

## 🆘 Troubleshooting

### Error: Connection Refused
- Pastikan server Laravel sudah running: `php artisan serve`
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

### Sensor Data Tidak Tersimpan
- Cek apakah device sudah terdaftar
- Cek sensor yang diaktifkan di device settings
- Lihat [Sensor Filtering Guide](SENSOR_FILTERING_GUIDE.md)

## 📞 Support

Untuk pertanyaan lebih lanjut:
1. Baca dokumentasi yang relevan
2. Cek [Example API Response](example_api_response.json) untuk format yang benar
3. Test dengan [Postman Collection](IoT_API.postman_collection.json)
4. Lihat [Example Frontend](example_frontend.html) untuk implementasi lengkap

## 📝 Version History

- **v1.0** - Initial release
  - 53 sensor support
  - Device management
  - Sensor filtering
  - API Key authentication
  - Statistics & aggregation

---

**Back to:** [Main README](../README.md)
