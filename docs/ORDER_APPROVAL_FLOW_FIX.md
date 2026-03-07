# Order Approval Flow - Device Info Fix

## Problem
Admin harus mengisi ulang informasi device (nama, lokasi, deskripsi) saat approve order, padahal customer sudah mengisi informasi tersebut saat checkout.

## Solution
Menyimpan informasi device langsung di tabel `orders` saat checkout, sehingga admin hanya perlu klik tombol approve tanpa mengisi form lagi.

## Changes Made

### 1. Database Migration
**File**: `database/migrations/2026_02_26_110000_add_device_info_to_orders_table.php`
- Menambahkan kolom `device_name`, `device_location`, `device_description` ke tabel `orders`

**File**: `database/migrations/2026_02_26_120000_add_v2_fields_to_order_sensors_table.php`
- Menambahkan kolom V2 ke pivot table `order_sensors`:
  - `variable_name` (V1-V20)
  - `custom_name` (nama custom dari user)
  - `unit` (satuan sensor)
  - `price` (harga per sensor)

### 2. Backend Updates

#### Order Model (`app/Models/Order.php`)
- Menambahkan `device_name`, `device_location`, `device_description` ke `$fillable`
- Menambahkan `withPivot(['variable_name', 'custom_name', 'unit', 'price'])` pada relasi `sensors()`

#### MemberAreaController (`app/Http/Controllers/MemberAreaController.php`)
- Method `checkout()` sudah menyimpan device info ke order
- Menyimpan V2 sensor configuration ke pivot table `order_sensors`

#### OrderController (`app/Http/Controllers/Admin/OrderController.php`)
- Method `approve()` menggunakan device info dari order (bukan dari form input)
- Membuat device di IoT API V2 dengan data dari order
- Menyimpan V2 sensor configuration ke subscription

### 3. Frontend Updates

#### Admin Order Detail Page (`resources/js/pages/admin/orders/show.tsx`)
**Removed**:
- Form input untuk device name, location, description saat approve
- State `showApproveForm`

**Added**:
- Card "Device Information" yang menampilkan device info dari order
- Sensor list dengan V2 format (variable, custom name, unit)
- Simple approve button (tanpa form)

**Updated**:
- Interface `Order` dengan field device info dan pivot data
- Sensor display dengan V2 configuration details

## Flow Sekarang

### Customer Flow:
1. Customer pilih sensors di halaman subscribe
2. Customer isi device info (name, location, description) di checkout
3. Order dibuat dengan status `pending`

### Admin Flow:
1. Admin lihat order detail
2. Admin review:
   - Customer info
   - Device info (sudah diisi customer)
   - Sensor configuration (V2 format)
3. Admin klik "Approve Order" (tanpa form)
4. System:
   - Buat device di IoT API V2
   - Buat device di database lokal
   - Buat subscription dengan V2 sensor config
   - Update order status ke `approved`

## Benefits
✅ Admin tidak perlu input ulang device info
✅ Mengurangi kemungkinan error/typo
✅ Proses approval lebih cepat
✅ Data konsisten antara order dan device
✅ Support penuh IoT API V2 format

## Testing Checklist
- [ ] Customer bisa checkout dengan device info
- [ ] Order tersimpan dengan device info yang benar
- [ ] Admin bisa lihat device info di order detail
- [ ] Admin bisa approve dengan 1 klik
- [ ] Device terbuat di IoT API V2 dengan config yang benar
- [ ] Subscription terbuat dengan V2 sensor config
- [ ] Order status berubah ke approved
