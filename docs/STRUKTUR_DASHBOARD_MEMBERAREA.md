# Struktur Dashboard & Member Area

## 🎯 Konsep Utama

```
┌─────────────────────────────────────────────────────────────┐
│                    LANDING PAGE (/)                          │
│                                                              │
│  User Login? → [Dashboard] [Member Area]                    │
└─────────────────────────────────────────────────────────────┘
                    ↓                    ↓
        ┌───────────────────┐   ┌──────────────────┐
        │   DASHBOARD       │   │   MEMBER AREA    │
        │   (Monitoring)    │   │   (Toko/Shop)    │
        └───────────────────┘   └──────────────────┘
```

---

## 📊 Dashboard User (Monitoring Perangkat)

**URL**: `/dashboard`  
**Fungsi**: Monitoring perangkat IoT yang sudah di-order

### Jika User Punya Perangkat Aktif:
```
┌────────────────────────────────────────────────┐
│  Dashboard Monitoring                          │
├────────────────────────────────────────────────┤
│  📱 Perangkat Aktif                            │
│  • Order: ORD-2024-001                         │
│  • Device: ESP32-Sensor-01                     │
│  • Status: ✅ Aktif                            │
│  • Sensors: 5 Sensor                           │
├────────────────────────────────────────────────┤
│  [📊 Real-Time Monitoring]  [🛒 Member Area]  │
├────────────────────────────────────────────────┤
│  Stats:                                        │
│  📡 5 Sensors  |  ✅ Online  |  ⚡ Real-time   │
└────────────────────────────────────────────────┘
```

### Jika User Belum Punya Perangkat:
```
┌────────────────────────────────────────────────┐
│  Dashboard Monitoring                          │
├────────────────────────────────────────────────┤
│           📡                                   │
│  Belum Ada Perangkat Aktif                     │
│                                                │
│  Untuk mulai monitoring, order perangkat       │
│  melalui Member Area                           │
│                                                │
│         [Buka Member Area]                     │
├────────────────────────────────────────────────┤
│  ℹ️ Dashboard Monitoring                       │
│  Halaman ini untuk monitoring perangkat        │
│  yang sudah di-order                           │
│                                                │
│  🛒 Member Area                                │
│  Untuk produk, subscription, dan pembelian     │
└────────────────────────────────────────────────┘
```

---

## 🛒 Member Area (Produk & Subscription)

**URL**: `/memberarea`  
**Fungsi**: Area pembelian, subscription, dan kelola order

```
┌────────────────────────────────────────────────┐
│  IoT Monitoring Platform                       │
├────────────────────────────────────────────────┤
│  🚀 Monitor Perangkat IoT Anda                 │
│     Secara Real-Time                           │
│                                                │
│  Platform monitoring IoT terlengkap dengan     │
│  36+ sensor, real-time data, dan dashboard     │
│  interaktif                                    │
│                                                │
│         [Mulai Berlangganan]                   │
├────────────────────────────────────────────────┤
│  Kenapa Pilih Kami?                            │
│                                                │
│  ⚡ Real-Time Monitoring                       │
│  📊 36+ Sensor Support                         │
│  🔒 Aman & Terpercaya                          │
├────────────────────────────────────────────────┤
│  Siap Mulai Monitoring?                        │
│  Setup device dan pilih sensor                 │
│                                                │
│         [Mulai Sekarang]                       │
└────────────────────────────────────────────────┘
```

### Sub-halaman Member Area:
- `/memberarea/subscribe` → Form berlangganan (pilih device & sensor)
- `/memberarea/orders` → Riwayat order
- `/memberarea/order/{id}` → Detail order

---

## 🔄 User Flow

### Flow 1: User Baru (Belum Order)
```
1. Login
   ↓
2. Dashboard Monitoring
   → Lihat: "Belum ada perangkat aktif"
   ↓
3. Klik "Buka Member Area"
   ↓
4. Member Area
   → Lihat produk & paket
   ↓
5. Klik "Mulai Berlangganan"
   ↓
6. Form Subscribe
   → Isi device name
   → Pilih sensor (dari 36+ pilihan)
   ↓
7. Submit Order
   ↓
8. Tunggu Approval Admin
```

### Flow 2: User dengan Order Approved
```
1. Login
   ↓
2. Dashboard Monitoring
   → Lihat info perangkat aktif
   ↓
3a. Klik "Real-Time Monitoring"
    → Lihat data sensor real-time
    → Grafik, chart, data terbaru
    
3b. Klik "Member Area"
    → Kelola subscription
    → Lihat riwayat order
    → Order device tambahan
```

### Flow 3: User Ingin Upgrade/Order Lagi
```
1. Dashboard Monitoring
   ↓
2. Klik "Member Area"
   ↓
3. Member Area
   → Lihat paket lain
   → Order device baru
   ↓
4. Submit Order Baru
   ↓
5. Tunggu Approval
```

---

## 🎨 Sidebar Navigation

### User Biasa:
```
┌─────────────────┐
│  IoT Platform   │
├─────────────────┤
│ 📊 Monitoring   │  ← Dashboard User
│ 🛒 Member Area  │  ← Produk & Subscription
├─────────────────┤
│ ⚙️ Settings     │
│ 👤 Profile      │
└─────────────────┘
```

### Admin:
```
┌─────────────────┐
│  IoT Platform   │
├─────────────────┤
│ 📊 Dashboard    │  ← Dashboard Admin
│ 📋 Orders       │  ← Kelola Order
│ 🎨 Landing Page │  ← Edit Landing
├─────────────────┤
│ ⚙️ Settings     │
│ 👤 Profile      │
└─────────────────┘
```

---

## 📍 URL Structure

```
User Routes:
├── /dashboard                    → Dashboard Monitoring (user)
├── /dashboard/monitoring         → Real-time monitoring detail
├── /memberarea                   → Member Area (produk & subscription)
├── /memberarea/subscribe         → Form berlangganan
├── /memberarea/orders            → Riwayat order
└── /memberarea/order/{id}        → Detail order

Admin Routes:
├── /admin/dashboard              → Dashboard Admin
├── /admin/orders                 → Kelola semua order
├── /admin/orders/{id}            → Detail order
└── /admin/landing-page           → Edit landing page

Auth Routes:
├── /login                        → Login
├── /register                     → Register
└── /                             → Landing page
```

---

## 🎯 Perbedaan Jelas

| Aspek | Dashboard (Monitoring) | Member Area |
|-------|------------------------|-------------|
| **Icon** | 📊 | 🛒 |
| **Fungsi** | Monitoring perangkat | Produk & pembelian |
| **Target** | User dengan perangkat | Semua user |
| **Isi** | Data sensor, grafik | Paket, form order |
| **Kapan** | Setelah order approved | Sebelum & sesudah order |
| **URL** | `/dashboard` | `/memberarea` |
| **Sidebar** | "Monitoring" | "Member Area" |

---

## ✅ Checklist Testing

- [ ] User login → Lihat 2 tombol di landing page (Dashboard & Member Area)
- [ ] User belum order → Dashboard menampilkan CTA ke Member Area
- [ ] User sudah order → Dashboard menampilkan info perangkat
- [ ] Klik "Real-Time Monitoring" → Buka halaman monitoring detail
- [ ] Klik "Member Area" → Buka halaman produk & subscription
- [ ] Sidebar user → Hanya ada "Monitoring" dan "Member Area"
- [ ] Admin login → Langsung ke Dashboard Admin
- [ ] Sidebar admin → Hanya ada menu admin (Dashboard, Orders, Landing Page)

---

## 📝 Catatan Penting

1. **Dashboard User = Monitoring** → Fokus pada perangkat yang sudah di-order
2. **Member Area = Toko** → Fokus pada produk, subscription, pembelian
3. Kedua halaman terpisah dengan fungsi berbeda
4. User bisa akses keduanya, tapi dengan tujuan berbeda
5. Admin tidak melihat menu user, dan sebaliknya
