# Sistem Member Area - IoT Monitoring Service

## 📋 Konsep Sistem

Berdasarkan API IoT yang sudah ada, sistem member area akan berfungsi sebagai:

### 1. **Member Area** (Bukan Dashboard)
- Tempat user membeli jasa monitoring online
- User memilih sensor yang ingin diaktifkan (checkbox)
- Setiap sensor punya harga berbeda
- Checkout dan payment

### 2. **Dashboard** (Setelah Berlangganan)
- Monitoring device yang sudah aktif
- Melihat data sensor real-time
- Grafik dan statistik
- Hanya muncul setelah user punya subscription aktif

## 🔄 Alur User Journey

```
┌─────────────────────────────────────────────────────────────┐
│  1. USER LOGIN                                               │
│     ↓                                                         │
│  2. MEMBER AREA (Halaman Utama)                             │
│     - Lihat paket monitoring                                 │
│     - Pilih sensor (checkbox dengan harga)                   │
│     - Lihat total harga                                      │
│     - Checkout                                               │
│     ↓                                                         │
│  3. ORDER & PAYMENT                                          │
│     - Konfirmasi order                                       │
│     - Pilih metode pembayaran                                │
│     - Upload bukti transfer                                  │
│     ↓                                                         │
│  4. ADMIN APPROVAL                                           │
│     - Admin verifikasi pembayaran                            │
│     - Aktivasi subscription                                  │
│     - Generate device & API Key                              │
│     ↓                                                         │
│  5. DASHBOARD MONITORING (Aktif)                             │
│     - User bisa akses dashboard                              │
│     - Monitoring device real-time                            │
│     - Lihat grafik dan data sensor                           │
└─────────────────────────────────────────────────────────────┘
```

## 💰 Pricing Model

### Struktur Harga
- **Base Price**: Harga dasar paket (Rp 50.000/bulan)
- **Sensor Price**: Harga per sensor yang dipilih
- **Total**: Base Price + (Jumlah Sensor × Harga Sensor)

### Contoh Sensor & Harga
```
Environmental Sensors:
- Temperature (Suhu)           : Rp 10.000/bulan
- Humidity (Kelembaban)        : Rp 10.000/bulan
- Air Quality (Kualitas Udara) : Rp 15.000/bulan
- CO2                          : Rp 20.000/bulan

Electrical Sensors:
- Voltage (Tegangan)           : Rp 15.000/bulan
- Current (Arus)               : Rp 15.000/bulan
- Power (Daya)                 : Rp 20.000/bulan
- Energy (Energi)              : Rp 25.000/bulan

... (53 sensor total)
```

## 🗄️ Database Schema (Sudah Dibuat)

### Table: sensors
```sql
- id
- name (temperature, humidity, dll)
- code (TEMP, HUMID, dll)
- description
- price (harga per bulan)
- unit (°C, %, ppm, dll)
- icon
- is_active
```

### Table: monitoring_packages
```sql
- id
- name (Basic, Pro, Enterprise)
- description
- base_price
- max_sensors (limit sensor yang bisa dipilih)
- is_active
```

### Table: devices
```sql
- id
- user_id
- name
- device_code (auto-generated)
- location
- status (active, inactive, pending)
- activated_at
```

### Table: subscriptions
```sql
- id
- user_id
- device_id
- monitoring_package_id
- total_price
- status (pending, active, expired, cancelled)
- start_date
- end_date
```

### Table: subscription_sensors
```sql
- id
- subscription_id
- sensor_id
- price (harga saat order)
```

### Table: orders
```sql
- id
- user_id
- subscription_id
- order_number (auto-generated)
- total_amount
- status (pending, paid, cancelled)
- payment_method
- paid_at
```

### Table: sensor_data (Sudah Ada di API)
```sql
- id
- device_id
- sensor_id
- value
- unit
- recorded_at
```

## 🎨 UI/UX Member Area

### Halaman 1: Pilih Paket
```
┌─────────────────────────────────────────────────────────┐
│  Pilih Paket Monitoring                                 │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  BASIC   │  │   PRO    │  │ ENTERPRISE│             │
│  │          │  │          │  │           │             │
│  │ Rp 50K   │  │ Rp 100K  │  │ Rp 200K   │             │
│  │ /bulan   │  │ /bulan   │  │ /bulan    │             │
│  │          │  │          │  │           │             │
│  │ Max 5    │  │ Max 15   │  │ Max 53    │             │
│  │ Sensor   │  │ Sensor   │  │ Sensor    │             │
│  │          │  │          │  │           │             │
│  │ [Pilih]  │  │ [Pilih]  │  │ [Pilih]   │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
```

### Halaman 2: Pilih Sensor (Checkbox)
```
┌─────────────────────────────────────────────────────────┐
│  Pilih Sensor yang Ingin Diaktifkan                     │
│  Paket: BASIC (Max 5 Sensor)                            │
│                                                          │
│  Environmental Sensors                                   │
│  ☑ Temperature (Suhu)           Rp 10.000/bulan        │
│  ☑ Humidity (Kelembaban)        Rp 10.000/bulan        │
│  ☐ Air Quality                  Rp 15.000/bulan        │
│  ☐ CO2                          Rp 20.000/bulan        │
│                                                          │
│  Electrical Sensors                                      │
│  ☑ Voltage (Tegangan)           Rp 15.000/bulan        │
│  ☐ Current (Arus)               Rp 15.000/bulan        │
│  ☐ Power (Daya)                 Rp 20.000/bulan        │
│                                                          │
│  ... (53 sensor total)                                   │
│                                                          │
│  ┌─────────────────────────────────────────────┐       │
│  │ Sensor Dipilih: 3/5                         │       │
│  │ Base Price:     Rp  50.000                  │       │
│  │ Sensor Price:   Rp  35.000 (3 sensor)       │       │
│  │ ─────────────────────────────────────────   │       │
│  │ TOTAL:          Rp  85.000/bulan            │       │
│  └─────────────────────────────────────────────┘       │
│                                                          │
│  [Kembali]  [Lanjut ke Checkout]                       │
└─────────────────────────────────────────────────────────┘
```

### Halaman 3: Checkout
```
┌─────────────────────────────────────────────────────────┐
│  Checkout                                                │
│                                                          │
│  Informasi Device                                        │
│  Device Name: [Sensor Ruang Server          ]           │
│  Location:    [Ruang Server Lt. 2           ]           │
│                                                          │
│  Ringkasan Order                                         │
│  Paket: BASIC                                            │
│  Sensor:                                                 │
│  - Temperature (Suhu)        Rp 10.000                  │
│  - Humidity (Kelembaban)     Rp 10.000                  │
│  - Voltage (Tegangan)        Rp 15.000                  │
│                                                          │
│  Subtotal:                   Rp 85.000/bulan            │
│  Durasi: 1 bulan                                         │
│  ─────────────────────────────────────────────          │
│  TOTAL:                      Rp 85.000                  │
│                                                          │
│  Metode Pembayaran                                       │
│  ○ Transfer Bank                                         │
│  ○ Credit Card                                           │
│  ○ E-Wallet                                              │
│                                                          │
│  [Kembali]  [Bayar Sekarang]                           │
└─────────────────────────────────────────────────────────┘
```

### Halaman 4: Menunggu Verifikasi
```
┌─────────────────────────────────────────────────────────┐
│  Order #ORD-2026-001                                     │
│  Status: Menunggu Pembayaran                             │
│                                                          │
│  Transfer ke:                                            │
│  Bank BCA                                                │
│  No. Rek: 1234567890                                     │
│  A/N: PT IoT Monitoring                                  │
│  Jumlah: Rp 85.000                                       │
│                                                          │
│  Upload Bukti Transfer:                                  │
│  [Choose File] [Upload]                                  │
│                                                          │
│  Setelah upload, admin akan verifikasi dalam 1x24 jam   │
└─────────────────────────────────────────────────────────┘
```

## 🔧 Integrasi dengan API yang Sudah Ada

### 1. Setelah Payment Approved
```php
// Admin approve payment
// 1. Update order status = 'paid'
// 2. Update subscription status = 'active'
// 3. Create device via API
$response = Http::post('http://your-api.com/api/devices', [
    'device_id' => $deviceCode, // Auto-generated
    'device_name' => $deviceName,
    'description' => $location,
    'sensors' => $selectedSensors // Array sensor yang dipilih user
]);

// 4. Save API Key ke device table
$device->api_key = $response['data']['api_key'];
$device->status = 'active';
$device->activated_at = now();
$device->save();

// 5. Send email ke user dengan API Key
```

### 2. User Akses Dashboard
```php
// Cek apakah user punya subscription aktif
$activeSubscription = Subscription::where('user_id', auth()->id())
    ->where('status', 'active')
    ->where('end_date', '>', now())
    ->first();

if (!$activeSubscription) {
    // Redirect ke member area
    return redirect()->route('member.area');
}

// User punya subscription aktif
// Tampilkan dashboard monitoring
return view('dashboard.monitoring', [
    'device' => $activeSubscription->device,
    'sensors' => $activeSubscription->sensors,
]);
```

### 3. Dashboard Monitoring (Menggunakan API)
```javascript
// Get latest sensor data
fetch(`http://your-api.com/api/iot/data/latest/${deviceId}`)
  .then(res => res.json())
  .then(data => {
    // Display sensor data
    updateTemperature(data.data.temperature);
    updateHumidity(data.data.humidity);
    updateVoltage(data.data.voltage);
  });

// Get sensor history
fetch(`http://your-api.com/api/iot/data/history/${deviceId}?per_page=50`)
  .then(res => res.json())
  .then(data => {
    // Display chart
    renderChart(data.data.data);
  });

// Get statistics
fetch(`http://your-api.com/api/statistics/${deviceId}`)
  .then(res => res.json())
  .then(data => {
    // Display stats
    displayStats(data.data);
  });
```

## 📱 Fitur Member Area

### User Features
1. ✅ Lihat paket monitoring
2. ✅ Pilih sensor (checkbox dengan harga)
3. ✅ Kalkulasi harga otomatis
4. ✅ Checkout & payment
5. ✅ Upload bukti transfer
6. ✅ Tracking order status
7. ✅ Akses dashboard setelah aktif
8. ✅ Perpanjang subscription
9. ✅ Upgrade/downgrade paket
10. ✅ Lihat riwayat order

### Admin Features
1. ✅ Manage paket monitoring
2. ✅ Manage sensor & harga
3. ✅ Verifikasi pembayaran
4. ✅ Aktivasi subscription
5. ✅ Generate device & API Key
6. ✅ Monitor semua device
7. ✅ Lihat revenue & statistik
8. ✅ Manage user subscription

## 🚀 Next Steps

1. **Buat Models** untuk semua table
2. **Buat Seeder** untuk sensors & packages
3. **Buat Controllers**:
   - MemberAreaController (user)
   - SubscriptionController (user)
   - OrderController (user)
   - Admin/SensorController (admin)
   - Admin/PackageController (admin)
   - Admin/OrderController (admin)
4. **Buat Views** (React/Inertia):
   - Member area pages
   - Checkout flow
   - Dashboard monitoring
   - Admin management
5. **Integrasi dengan API IoT** yang sudah ada

## 📊 Monitoring Dashboard Features

### Real-time Monitoring
- Live sensor data (auto-refresh setiap 5 detik)
- Grafik real-time
- Alert jika nilai sensor abnormal
- Status device (online/offline)

### Historical Data
- Grafik per sensor (hari, minggu, bulan)
- Export data ke CSV/Excel
- Filter by date range
- Statistik (avg, min, max)

### Device Management
- Lihat device info
- Lihat sensor yang aktif
- Download API Key
- Regenerate API Key
- Deactivate device

## 💡 Tips Implementasi

1. **Gunakan API yang Sudah Ada** - Jangan buat ulang, integrasikan saja
2. **Sensor Filtering** - Sudah ada di API, tinggal pakai
3. **Device Management** - API sudah support, tinggal wrapper
4. **Real-time Data** - Gunakan polling atau WebSocket
5. **Payment Gateway** - Integrasikan Midtrans/Xendit untuk auto-verify

## 🔗 Related Files

- `Implementasi/API_IOT_DOCUMENTATION.md` - API IoT lengkap
- `Implementasi/DEVICE_MANAGEMENT_API.md` - Device & sensor filtering
- `Implementasi/SENSOR_FILTERING_GUIDE.md` - Cara kerja filtering
- `database/migrations/2026_02_25_230236_create_monitoring_system_tables.php` - Database schema
