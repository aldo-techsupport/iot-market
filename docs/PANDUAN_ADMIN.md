# Panduan Admin - Landing Page IoT & Smart Home

## ✅ Yang Sudah Selesai

1. **Landing Page IoT & Smart Home** - Halaman depan dengan tema IoT dan smart home
2. **Sistem Admin** - Dashboard khusus untuk admin
3. **CMS Landing Page** - Edit semua konten (teks, gambar) dari dashboard
4. **Auto Redirect** - Admin otomatis ke `/admin/dashboard` setelah login

## 🔑 Login Credentials

### Admin
```
Email: admin@example.com
Password: password
```
Setelah login → otomatis ke `/admin/dashboard`

### User Biasa
```
Email: test@example.com
Password: password
```
Setelah login → ke `/dashboard`

## 📝 Cara Menggunakan

### 1. Login sebagai Admin
1. Buka: `http://your-domain.com/login`
2. Masukkan email & password admin
3. Otomatis redirect ke admin dashboard

### 2. Edit Landing Page
1. Di admin dashboard, klik **"Edit Landing Page"**
2. Pilih section yang mau diedit:
   - **Hero** - Bagian header utama
   - **Features** - Fitur-fitur produk (6 items)
   - **About** - Tentang platform & statistik
3. Edit konten sesuai kebutuhan
4. Klik **"Save Changes"**
5. Klik **"Preview Landing Page"** untuk lihat hasil

### 3. Isi Konten Landing Page

#### Section Hero
- **Title**: Judul besar di atas
- **Subtitle**: Deskripsi di bawah judul
- **Primary Button**: Tombol utama (teks + URL)
- **Secondary Button**: Tombol kedua (teks + URL)

#### Section Features
- **Title & Subtitle**: Judul section
- **6 Feature Items**, masing-masing punya:
  - Title
  - Description
  - Icon (pilih: monitor, automation, energy, security, voice, support)

#### Section About
- **Title**: Judul section
- **Description**: Deskripsi panjang
- **3 Statistics**: Label + Value (contoh: "10,000+ Active Users")

## 🎨 Konten Default (Tema IoT)

Landing page sudah diisi dengan konten tentang:
- Smart Home Solutions
- IoT Platform
- Real-time Monitoring
- Home Automation
- Energy Efficiency
- Security Features
- Voice Control
- 24/7 Support

Semua bisa diubah sesuai kebutuhan Anda!

## 🚀 Akses Cepat

- **Landing Page**: `http://your-domain.com/`
- **Login**: `http://your-domain.com/login`
- **Admin Dashboard**: `http://your-domain.com/admin/dashboard`
- **Edit Landing Page**: `http://your-domain.com/admin/landing-page`

## 💡 Tips

1. **Preview dulu** sebelum publish - gunakan tombol "Preview Landing Page"
2. **Backup konten** - copy paste konten penting sebelum edit besar
3. **Konsisten** - gunakan tone dan style yang sama di semua section
4. **Mobile friendly** - landing page sudah responsive, tapi cek di mobile juga

## 🔧 Menambah Admin Baru

Jalankan di terminal:
```bash
php artisan tinker
```

Lalu ketik:
```php
App\Models\User::create([
    'name' => 'Nama Admin',
    'email' => 'email@domain.com',
    'password' => bcrypt('password123'),
    'role' => 'admin',
]);
```

## ❓ Troubleshooting

### Admin tidak bisa akses halaman admin
- Pastikan user punya `role = 'admin'` di database
- Cek di tabel `users`, kolom `role`

### Landing page kosong
- Jalankan: `php artisan db:seed --class=LandingPageSeeder`

### Perubahan tidak tersimpan
- Cek permission folder `storage/`
- Jalankan: `chmod -R 775 storage`

## 📞 Support

Jika ada masalah, cek file `storage/logs/laravel.log` untuk error details.
