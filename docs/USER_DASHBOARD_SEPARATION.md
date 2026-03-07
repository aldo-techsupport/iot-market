# Pemisahan Dashboard Admin dan User

## Konsep Utama

### Dashboard User (Monitoring)
- **Fungsi**: Khusus untuk monitoring perangkat IoT yang sudah di-order
- **Isi**: Data real-time, grafik sensor, status perangkat
- **URL**: `/dashboard`

### Member Area
- **Fungsi**: Area pembelian, subscription, dan kelola order
- **Isi**: Produk, paket langganan, riwayat pembelian, upgrade paket
- **URL**: `/memberarea`

### Dashboard Admin
- **Fungsi**: Kelola semua order, user, dan konten
- **Isi**: Statistik, approve order, manage landing page
- **URL**: `/admin/dashboard`

---

## Perubahan yang Dilakukan

### 1. Halaman Welcome (Landing Page)
- **File**: `resources/js/pages/welcome.tsx`
- **Perubahan**: Menambahkan 2 tombol untuk user yang sudah login:
  - **Dashboard**: Mengarah ke `/dashboard` (monitoring perangkat)
  - **Member Area**: Mengarah ke `/memberarea` (produk & subscription)

### 2. Dashboard User (Monitoring)
- **File**: `resources/js/pages/user/dashboard.tsx`
- **Lokasi**: Folder terpisah khusus untuk user (`user/`)
- **Fungsi**: HANYA untuk monitoring perangkat yang sudah di-order
- **Fitur**:
  - Jika ada perangkat aktif:
    - Menampilkan info device (order number, device name, status, jumlah sensor)
    - Quick access ke Real-Time Monitoring
    - Quick access ke Member Area
    - Preview stats (total sensors, device status, data update)
  - Jika belum ada perangkat:
    - Menampilkan pesan bahwa belum ada perangkat aktif
    - CTA untuk membuka Member Area
    - Penjelasan perbedaan Dashboard Monitoring vs Member Area

### 3. Member Area
- **File**: `resources/js/pages/memberarea.tsx`
- **Fungsi**: Area untuk produk, subscription, dan pembelian
- **Isi**:
  - Promosi produk IoT monitoring
  - Paket langganan
  - Form subscribe (pilih device & sensor)
  - Riwayat order
  - Upgrade paket

### 4. Routing
- **File**: `routes/web.php`
- **Struktur**:
  - `/dashboard` → Dashboard User (Monitoring perangkat)
  - `/dashboard/monitoring` → Real-time monitoring detail
  - `/memberarea` → Member Area (produk & subscription)
  - `/memberarea/subscribe` → Form berlangganan
  - `/memberarea/orders` → Riwayat order
  - `/admin/dashboard` → Dashboard Admin

### 5. Sidebar Navigation
- **File**: `resources/js/components/app-sidebar.tsx`
- **Menu Admin**:
  - Dashboard (Admin)
  - Orders
  - Landing Page
- **Menu User**:
  - Monitoring (Dashboard User)
  - Member Area

---

## Struktur Folder

```
resources/js/pages/
├── admin/
│   ├── dashboard.tsx          # Dashboard admin (kelola order, user, dll)
│   ├── landing-page/
│   └── orders/
├── user/
│   └── dashboard.tsx          # Dashboard monitoring perangkat
├── member/
│   ├── monitoring.tsx         # Real-time monitoring detail
│   ├── order.tsx              # Detail order
│   └── subscribe.tsx          # Form berlangganan
├── memberarea.tsx             # Member Area (produk & subscription)
└── ...
```

---

## Flow User

### Skenario 1: User Baru (Belum Order)
1. Login → Dashboard Monitoring → Lihat pesan "Belum ada perangkat aktif"
2. Klik "Buka Member Area" → Member Area
3. Lihat produk & paket → Klik "Mulai Berlangganan"
4. Isi form subscribe (device name, pilih sensor) → Submit order
5. Tunggu approval admin

### Skenario 2: User dengan Order Approved
1. Login → Dashboard Monitoring → Lihat info perangkat aktif
2. Klik "Real-Time Monitoring" → Lihat data sensor real-time
3. Atau klik "Member Area" → Kelola subscription, lihat riwayat order

### Skenario 3: User Ingin Upgrade/Order Lagi
1. Dari Dashboard Monitoring → Klik "Member Area"
2. Di Member Area → Lihat paket lain atau order device baru
3. Submit order baru → Tunggu approval

---

## Flow Admin

1. Login → Dashboard Admin (otomatis)
2. Lihat statistik: total users, devices, subscriptions, pending orders
3. Klik "Orders" → Approve/reject order user
4. Klik "Landing Page" → Edit konten landing page

---

## Perbedaan Jelas

| Aspek | Dashboard User (Monitoring) | Member Area |
|-------|----------------------------|-------------|
| **Fungsi** | Monitoring perangkat | Produk & pembelian |
| **Isi** | Data sensor, grafik real-time | Paket langganan, form order |
| **Kapan digunakan** | Setelah order approved | Sebelum & sesudah order |
| **Target** | User dengan perangkat aktif | Semua user (calon pembeli & existing) |
| **URL** | `/dashboard` | `/memberarea` |

---

## Testing

```bash
# Build frontend
npm run build

# Atau development mode
npm run dev
```

Test cases:
1. **User belum order**: Dashboard Monitoring menampilkan CTA ke Member Area
2. **User sudah order (approved)**: Dashboard Monitoring menampilkan info perangkat + quick access
3. **Admin login**: Langsung ke Dashboard Admin, tidak melihat menu user
4. **Landing page**: User login melihat 2 tombol (Dashboard & Member Area)

---

## Catatan Penting

- **Dashboard User = Monitoring** → Fokus pada perangkat yang sudah di-order
- **Member Area = Toko/Marketplace** → Fokus pada produk, subscription, pembelian
- Kedua halaman ini terpisah dan memiliki fungsi yang berbeda
- User bisa akses keduanya, tapi dengan tujuan yang berbeda
