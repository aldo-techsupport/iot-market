# User Flow - Login & Redirect

## 🔄 Alur Login Berdasarkan Role & Status

### 1. Admin Login
```
Login → Admin Dashboard (/admin/dashboard)
```
- Langsung ke admin dashboard
- Tidak perlu cek subscription

### 2. User dengan Subscription Aktif
```
Login → Dashboard Monitoring (/dashboard)
```
- User yang sudah punya subscription aktif
- Bisa monitoring device real-time

### 3. User Baru / Belum Subscribe
```
Login → Member Area (/member/area)
Register → Member Area (/member/area)
```
- User baru yang baru register
- User lama yang subscription expired
- Harus pilih paket & subscribe dulu

## 📋 Logic di LoginResponse

```php
// 1. Cek role
if ($user->isAdmin()) {
    return redirect()->route('admin.dashboard');
}

// 2. Cek subscription
if ($user->hasActiveSubscription()) {
    return redirect()->route('dashboard');
}

// 3. Default ke member area
return redirect()->route('member.area');
```

## 🛡️ Protected Routes

### Dashboard Route
```php
Route::get('dashboard', function () {
    // Auto redirect jika belum subscribe
    if (!auth()->user()->hasActiveSubscription()) {
        return redirect()->route('member.area');
    }
    
    return inertia('dashboard');
})->name('dashboard');
```

### Member Area Route
```php
Route::get('member/area', function () {
    return inertia('member/area', [
        'hasActiveSubscription' => auth()->user()->hasActiveSubscription(),
    ]);
})->name('member.area');
```

## 🎯 User Journey

### Scenario 1: User Baru
```
1. Register → Member Area
2. Pilih Paket → Pilih Sensor → Checkout
3. Payment → Menunggu Approval Admin
4. Admin Approve → Device Activated
5. Login → Dashboard Monitoring ✅
```

### Scenario 2: User dengan Subscription Aktif
```
1. Login → Dashboard Monitoring ✅
2. Monitoring real-time
3. Lihat history & statistik
```

### Scenario 3: Subscription Expired
```
1. Login → Member Area (auto redirect)
2. Perpanjang subscription
3. Payment → Approval
4. Login → Dashboard Monitoring ✅
```

## 🔑 Helper Methods di User Model

```php
// Check if user has active subscription
$user->hasActiveSubscription(); // true/false

// Get active subscription
$user->activeSubscription; // Subscription model or null

// Get all subscriptions
$user->subscriptions; // Collection
```

## 📱 UI Indicators

### Member Area
- ✅ Badge hijau: "Anda sudah memiliki subscription aktif"
- 💡 Badge biru: "Anda belum memiliki subscription"
- Link ke dashboard jika sudah subscribe

### Dashboard
- Auto redirect ke member area jika belum subscribe
- Tampilkan device info & monitoring

## 🧪 Testing

### Test User Baru
```bash
# Register user baru
# Login
# Expected: Redirect ke /member/area
```

### Test User dengan Subscription
```bash
# Login dengan user yang punya subscription aktif
# Expected: Redirect ke /dashboard
```

### Test Admin
```bash
# Login dengan admin@example.com
# Expected: Redirect ke /admin/dashboard
```

## 🔧 Troubleshooting

### User masuk ke dashboard padahal belum subscribe
- Cek: `$user->hasActiveSubscription()` return true/false
- Cek: Table `subscriptions` ada data dengan status 'active'
- Cek: `end_date` masih > now()

### User tidak bisa akses dashboard
- Cek: Subscription status = 'active'
- Cek: end_date belum expired
- Cek: Route protection sudah benar

## 📝 Notes

1. **Member Area** = Tempat beli jasa monitoring (bukan dashboard)
2. **Dashboard** = Monitoring device (hanya untuk yang sudah subscribe)
3. **Auto Redirect** = User otomatis diarahkan sesuai status subscription
4. **Protection** = Dashboard protected, auto redirect jika belum subscribe
