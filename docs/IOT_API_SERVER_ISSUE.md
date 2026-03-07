# IoT API Server Issue - "Tidak Ada Akses Web"

## Masalah

Ketika mencoba membuat device atau mengirim data ke IoT API di `https://api-iot.digitaltekno.cloud`, server mengembalikan halaman HTML dengan pesan:

```
🚫 Tidak Ada Akses Web
Ini adalah API Service. Tidak ada layanan web di sini.
```

## Penyebab

Server IoT API (`api-iot.digitaltekno.cloud`) belum dikonfigurasi dengan benar atau belum di-deploy. Server menolak semua request API dan hanya menampilkan halaman HTML statis.

## Endpoint yang Seharusnya Tersedia

Berdasarkan dokumentasi, endpoint berikut seharusnya berfungsi:

### Device Management
- `POST https://api-iot.digitaltekno.cloud/api/devices` - Create device
- `GET https://api-iot.digitaltekno.cloud/api/devices` - List devices
- `GET https://api-iot.digitaltekno.cloud/api/devices/{id}` - Get device detail
- `PUT https://api-iot.digitaltekno.cloud/api/devices/{id}` - Update device
- `DELETE https://api-iot.digitaltekno.cloud/api/devices/{id}` - Delete device

### IoT Data
- `POST https://api-iot.digitaltekno.cloud/api/iot/data` - Send sensor data
- `GET https://api-iot.digitaltekno.cloud/api/iot/data/latest/{deviceId}` - Get latest data
- `GET https://api-iot.digitaltekno.cloud/api/iot/data/history/{deviceId}` - Get history

## Solusi

### Opsi 1: Deploy IoT API ke Server (Recommended)

Server IoT API perlu di-deploy dengan benar. Pastikan:

1. **Laravel application sudah di-deploy** di `api-iot.digitaltekno.cloud`
2. **Web server (Nginx/Apache) dikonfigurasi dengan benar** untuk menerima API requests
3. **Routes API sudah terdaftar** di `routes/api.php`
4. **Database sudah di-migrate** dan seeded

#### Contoh Nginx Configuration

```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name api-iot.digitaltekno.cloud;
    
    root /var/www/iot-api/public;
    index index.php;

    # SSL Configuration
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    # API Routes
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # PHP-FPM
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
}
```

#### Contoh Apache Configuration (.htaccess)

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

### Opsi 2: Gunakan Local Development Server (Temporary)

Untuk testing, gunakan local server:

1. Update `.env`:
```env
IOT_API_URL=http://localhost:8001
```

2. Jalankan IoT API server di port berbeda:
```bash
cd /path/to/iot-api
php artisan serve --port=8001
```

### Opsi 3: Gunakan API yang Sama (Single Application)

Jika tidak ingin deploy server terpisah, integrasikan IoT API ke aplikasi utama:

1. Update `.env`:
```env
IOT_API_URL=http://localhost:8000
# atau
IOT_API_URL=https://your-main-domain.com
```

2. Copy routes dari IoT API ke aplikasi utama:
```bash
# Copy routes/api.php dari IoT API project
# Merge dengan routes/api.php di aplikasi utama
```

3. Copy controllers dan models yang diperlukan

## Testing Koneksi

### Test dengan cURL

```bash
# Test create device
curl -X POST https://api-iot.digitaltekno.cloud/api/devices \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "TEST001",
    "device_name": "Test Device",
    "sensors": [
      {
        "variable": "V1",
        "custom_name": "Temperature",
        "unit": "°C"
      }
    ]
  }'
```

### Expected Response (Success)

```json
{
  "success": true,
  "message": "Device berhasil dibuat",
  "data": {
    "device": {
      "id": 1,
      "device_id": "TEST001",
      "device_name": "Test Device",
      ...
    },
    "api_key": "...",
    "sensors": [...]
  }
}
```

### Current Response (Error)

```html
<!DOCTYPE html>
<html>
  <body>
    <h1>🚫 Tidak Ada Akses Web</h1>
    ...
  </body>
</html>
```

## Checklist untuk Admin

- [ ] Deploy IoT API Laravel application ke server
- [ ] Konfigurasi web server (Nginx/Apache)
- [ ] Setup SSL certificate
- [ ] Migrate database
- [ ] Seed database dengan sensor data
- [ ] Test API endpoints dengan Postman/cURL
- [ ] Update DNS jika diperlukan
- [ ] Verify CORS settings jika diperlukan

## Kontak

Jika masalah berlanjut, hubungi administrator sistem untuk:
1. Verifikasi deployment status
2. Check web server logs
3. Verify Laravel application status
4. Check database connection

## Referensi

- [API IoT Documentation](./API_IOT_DOCUMENTATION.md)
- [Device Management API](./DEVICE_MANAGEMENT_API.md)
- [Quick Start Guide](./QUICK_START.md)
