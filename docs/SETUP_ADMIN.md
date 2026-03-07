# Setup Admin & Landing Page CMS

## Fitur yang Sudah Diimplementasi

1. ✅ Landing page IoT & Smart Home dengan konten dinamis
2. ✅ Role-based authentication (Admin & User)
3. ✅ Admin dashboard untuk manage landing page
4. ✅ CMS untuk edit semua konten landing page (teks, gambar, dll)
5. ✅ Redirect otomatis ke `/admin/dashboard` untuk admin setelah login

## Kredensial Login

### Admin User
- Email: `admin@example.com`
- Password: `password`
- Redirect: `/admin/dashboard`

### Regular User
- Email: `test@example.com`
- Password: `password`
- Redirect: `/dashboard`

## Cara Menggunakan

### 1. Login sebagai Admin
1. Buka `http://your-domain.com/login`
2. Login dengan kredensial admin di atas
3. Anda akan otomatis diarahkan ke `/admin/dashboard`

### 2. Edit Landing Page
1. Dari admin dashboard, klik "Edit Landing Page"
2. Pilih section yang ingin diedit (Hero, Features, About)
3. Edit konten sesuai kebutuhan
4. Klik "Save Changes"
5. Preview perubahan dengan klik "Preview Landing Page"

### 3. Struktur Landing Page

#### Hero Section
- Title: Judul utama
- Subtitle: Deskripsi singkat
- Primary Button: Teks & URL tombol utama
- Secondary Button: Teks & URL tombol sekunder

#### Features Section
- Title & Subtitle
- 6 Feature Items dengan:
  - Title
  - Description
  - Icon (monitor, automation, energy, security, voice, support)

#### About Section
- Title & Description
- 3 Statistics dengan label dan value

## Database Tables

### landing_pages
- `id`: Primary key
- `section`: Nama section (hero, features, about)
- `content`: JSON content
- `is_active`: Status aktif/nonaktif
- `created_at`, `updated_at`

### users (updated)
- Ditambahkan kolom `role` (admin/user)

## File-file Penting

### Backend
- `app/Models/LandingPage.php` - Model landing page
- `app/Http/Controllers/Admin/LandingPageController.php` - Controller admin
- `app/Http/Middleware/IsAdmin.php` - Middleware admin
- `routes/web.php` - Routes
- `database/seeders/LandingPageSeeder.php` - Seeder data awal

### Frontend
- `resources/js/pages/welcome-iot.tsx` - Landing page publik
- `resources/js/pages/admin/dashboard.tsx` - Admin dashboard
- `resources/js/pages/admin/landing-page/index.tsx` - List sections
- `resources/js/pages/admin/landing-page/edit.tsx` - Edit section

## Menambah User Admin Baru

```php
use App\Models\User;

User::create([
    'name' => 'Admin Name',
    'email' => 'admin@domain.com',
    'password' => bcrypt('password'),
    'role' => 'admin',
]);
```

## Upload Gambar (Coming Soon)

Fitur upload gambar sudah disiapkan di controller, tinggal implementasi UI:
- Endpoint: `POST /admin/landing-page/upload-image`
- Storage: `storage/app/public/landing-pages/`

## Customisasi

### Menambah Section Baru
1. Tambah data di `LandingPageSeeder.php`
2. Update `welcome-iot.tsx` untuk render section baru
3. Update `edit.tsx` untuk form edit section baru

### Mengubah Tema/Style
Edit file `resources/js/pages/welcome-iot.tsx` untuk mengubah warna, layout, dll.

## Troubleshooting

### Admin tidak bisa akses /admin/*
Pastikan user memiliki `role = 'admin'` di database

### Landing page tidak muncul
Jalankan seeder: `php artisan db:seed --class=LandingPageSeeder`

### Perubahan tidak tersimpan
Cek permission folder `storage/` dan `public/storage/`
