# Landing Page Update

## Perubahan yang Dilakukan

Landing page telah diganti dengan desain baru yang diadaptasi dari template startup-nextjs yang ada di folder `/www/wwwroot/iot-dev/template`.

### File yang Diubah

1. **resources/js/pages/welcome.tsx** (Baru)
   - Landing page baru dengan desain modern dan profesional
   - Menggunakan komponen dari template startup-nextjs
   - Fitur:
     - Header dengan sticky navigation
     - Hero section dengan background SVG decorations
     - Features section dengan grid layout
     - About/Stats section (opsional)
     - Footer dengan links

2. **routes/web.php**
   - Mengubah route '/' dari `welcome-iot` menjadi `welcome`

3. **resources/js/pages/welcome-iot.tsx.backup**
   - File lama di-backup untuk referensi

### Fitur Landing Page Baru

#### Header
- Sticky navigation yang muncul saat scroll
- Mobile responsive dengan hamburger menu
- Link ke Sign In dan Sign Up
- Dark mode support

#### Hero Section
- Judul dan subtitle yang dapat dikustomisasi dari admin
- 2 CTA buttons (primary dan secondary)
- Background decorations dengan SVG gradients
- Responsive design

#### Features Section
- Grid layout 3 kolom (responsive)
- Icon untuk setiap feature
- Dapat dikustomisasi dari admin panel
- Default features jika belum ada data

#### Footer
- Company info
- Quick links
- Support links
- Copyright notice

### Cara Menggunakan

Landing page akan otomatis mengambil data dari database `landing_pages` table. Admin dapat mengedit konten melalui:

1. Login sebagai admin
2. Buka menu "Landing Page"
3. Edit section yang diinginkan (Hero, Features, About)

### Data Structure

#### Hero Section
```json
{
  "title": "Smart IoT Monitoring Platform",
  "subtitle": "Monitor and control your IoT devices...",
  "primary_button_text": "🚀 Get Started",
  "primary_button_url": "/register",
  "secondary_button_text": "Learn More",
  "secondary_button_url": "#features"
}
```

#### Features Section
```json
{
  "title": "Main Features",
  "subtitle": "Powerful features to help you...",
  "items": [
    {
      "icon": "monitor",
      "title": "Real-time Monitoring",
      "description": "Monitor your IoT devices..."
    }
  ]
}
```

#### About Section
```json
{
  "title": "About Us",
  "description": "We provide the best IoT solutions...",
  "stats": [
    {
      "value": "10K+",
      "label": "Active Users"
    }
  ]
}
```

### Template Source

Template diadaptasi dari:
- **Nama**: Startup - Free Next.js Template
- **Lokasi**: `/www/wwwroot/iot-dev/template/startup-nextjs-main`
- **Framework**: Next.js 16 + Tailwind CSS
- **License**: Free and Open-Source

### Build & Deploy

Untuk apply perubahan:

```bash
npm run build
```

Atau untuk development:

```bash
npm run dev
```

### Catatan

- Design menggunakan Tailwind CSS classes yang sudah ada
- Fully responsive untuk mobile, tablet, dan desktop
- Dark mode support (mengikuti system preference)
- SEO friendly dengan proper heading structure
- Accessibility compliant dengan semantic HTML

### Backup

File lama disimpan di:
- `resources/js/pages/welcome-iot.tsx.backup`

Jika ingin kembali ke design lama:
1. Hapus file `resources/js/pages/welcome.tsx`
2. Rename `welcome-iot.tsx.backup` menjadi `welcome-iot.tsx`
3. Update route di `routes/web.php` kembali ke `welcome-iot`
4. Run `npm run build`
