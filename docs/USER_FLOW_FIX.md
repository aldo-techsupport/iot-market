# User Flow Fix - Member Area vs Dashboard

## ✅ Yang Sudah Diperbaiki

### Masalah
User baru yang register/login langsung masuk ke dashboard, padahal seharusnya masuk ke **Member Area** karena belum punya subscription.

### Solusi
Sistem sekarang membedakan redirect berdasarkan status subscription:

## 🔄 Alur Login Baru

```
User Login
    ↓
Cek Role
    ├─ Admin? → /admin/dashboard
    └─ User? 
        ↓
        Cek Subscription
        ├─ Punya subscription aktif? → /dashboard/monitoring
        └─ Belum punya subscription? → /member/area
```

## 📍 Routes

### Member Area
```
URL: /member/area
Untuk: User yang belum punya subscription
Isi: Pilih paket monitoring, lihat harga, cara berlangganan
```

### Dashboard Monitoring
```
URL: /dashboard/monitoring
Untuk: User yang sudah punya subscription aktif
Isi: Real-time monitoring, grafik sensor, data history
```

### Legacy Dashboard
```
URL: /dashboard
Redirect otomatis:
- Punya subscription → /dashboard/monitoring
- Belum punya → /member/area
```

## 🎯 User Journey

### User Baru (Belum Subscribe)
1. Register/Login
2. Redirect ke `/member/area`
3. Lihat paket monitoring
4. Pilih paket & sensor
5. Checkout & payment
6. Tunggu approval admin
7. Setelah approved → bisa akses `/dashboard/monitoring`

### User dengan Subscription Aktif
1. Login
2. Redirect langsung ke `/dashboard/monitoring`
3. Monitoring device real-time
4. Lihat data sensor, grafik, statistik

### Admin
1. Login
2. Redirect ke `/admin/dashboard`
3. Manage landing page, sensors, packages, orders

## 🔧 File yang Diubah

### 1. LoginResponse.php
```php
// Cek subscription sebelum redirect
if ($user->hasActiveSubscription()) {
    return redirect()->route('dashboard.monitoring');
}
return redirect()->route('member.area');
```

### 2. User.php (Model)
```php
// Relationship & helper methods
public function subscriptions()
public function activeSubscription()
public function hasActiveSubscription(): bool
```

### 3. routes/web.php
```php
// Member Area route
Route::get('member/area', ...)->name('member.area');

// Dashboard Monitoring route
Route::get('dashboard/monitoring', ...)->name('dashboard.monitoring');

// Legacy dashboard redirect
Route::get('dashboard', ...)->name('dashboard');
```

### 4. resources/js/pages/member/area.tsx
```tsx
// Halaman member area dengan 3 paket:
- Basic (Rp 50K/bulan, max 5 sensor)
- Pro (Rp 100K/bulan, max 15 sensor)
- Enterprise (Rp 200K/bulan, unlimited sensor)
```

## 🧪 Testing

### Test User Baru
```bash
1. Register user baru
2. Setelah register, akan redirect ke /member/area
3. Lihat halaman member area dengan 3 paket
```

### Test User dengan Subscription
```bash
1. Login dengan user yang punya subscription aktif
2. Akan redirect ke /dashboard/monitoring
3. Jika belum ada subscription, redirect ke /member/area
```

### Test Admin
```bash
1. Login dengan admin@example.com
2. Akan redirect ke /admin/dashboard
3. Sidebar menampilkan menu admin
```

## 📊 Status Subscription

### Active
- `status = 'active'`
- `end_date > now()`
- User bisa akses dashboard monitoring

### Pending
- `status = 'pending'`
- Menunggu payment approval
- User tetap di member area

### Expired
- `status = 'expired'`
- `end_date < now()`
- User redirect ke member area untuk perpanjang

### Cancelled
- `status = 'cancelled'`
- User redirect ke member area

## 🎨 Member Area Features

### Paket Monitoring
- **Basic**: Rp 50K/bulan, max 5 sensor
- **Pro**: Rp 100K/bulan, max 15 sensor (Popular)
- **Enterprise**: Rp 200K/bulan, unlimited sensor

### Cara Berlangganan
1. Pilih paket
2. Pilih sensor (checkbox dengan harga)
3. Checkout
4. Payment
5. Tunggu approval (1x24 jam)
6. Akses dashboard monitoring

## 🔒 Middleware Protection

### Member Area
```php
Route::middleware(['auth', 'verified'])
```
- Harus login
- Email harus verified

### Dashboard Monitoring
```php
Route::middleware(['auth', 'verified'])
// + cek hasActiveSubscription()
```
- Harus login
- Email verified
- Punya subscription aktif

### Admin Dashboard
```php
Route::middleware(['auth', 'verified', 'admin'])
```
- Harus login
- Email verified
- Role = admin

## 💡 Tips

1. **User baru** selalu masuk ke member area
2. **User lama** dengan subscription aktif langsung ke dashboard monitoring
3. **Admin** selalu ke admin dashboard
4. **Subscription expired** redirect ke member area untuk perpanjang

## 🚀 Next Steps

1. ✅ Member area page (DONE)
2. ⏳ Sensor selection page (checkbox + harga)
3. ⏳ Checkout page
4. ⏳ Payment & order management
5. ⏳ Dashboard monitoring (real-time)
6. ⏳ Admin approval system

---

**Status**: User flow sudah diperbaiki! User baru sekarang masuk ke Member Area, bukan langsung ke dashboard.
