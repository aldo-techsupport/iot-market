# ✅ SOLUSI: IoT API Server Issue

## Status Saat Ini

✅ **IoT API Server sudah berfungsi!**
- Server ada di `/www/wwwroot/api-iot`
- Laravel application sudah di-deploy
- Routes API sudah dikonfigurasi dengan benar
- Endpoint `/api/devices` **BERFUNGSI** (HTTP 200)

❌ **Masalah yang Ditemukan:**
- Endpoint `/api/iot/data` mengalami **HTTP 302 redirect** ke root `/`
- Setelah redirect, method POST berubah jadi GET, menyebabkan error "Method Not Allowed"

## Root Cause

Web server (Apache) melakukan redirect dari `/api/iot/data` ke `/` (root), kemungkinan karena:
1. Virtual host configuration yang salah
2. .htaccess rules yang conflict
3. Trailing slash redirect issue

## Test Results

### ✅ Working Endpoints:

```bash
# GET /api/devices - WORKS!
curl https://api-iot.digitaltekno.cloud/api/devices
# Response: {"success":true,"data":[...]}

# POST /api/devices - WORKS!
curl -X POST https://api-iot.digitaltekno.cloud/api/devices \
  -H "Content-Type: application/json" \
  -d '{"device_id":"TEST","device_name":"Test","sensors":[...]}'
# Response: {"success":true,"message":"Device berhasil dibuat",...}
```

### ❌ Broken Endpoint:

```bash
# POST /api/iot/data - REDIRECT!
curl -v -X POST https://api-iot.digitaltekno.cloud/api/iot/data \
  -H "Content-Type: application/json" \
  -d '{"device_id":"TEST","v1":25.5}'
# Response: HTTP/2 302 (redirect to /)
# Then: MethodNotAllowedHttpException - POST not supported for route /
```

## Solusi

### Opsi 1: Fix Apache/Nginx Configuration (RECOMMENDED)

Cek dan perbaiki virtual host configuration:

#### Untuk Apache:

```bash
# Cek virtual host config
cat /etc/apache2/sites-available/api-iot.digitaltekno.cloud.conf
# atau
cat /www/server/panel/vhost/apache/api-iot.digitaltekno.cloud.conf
```

Pastikan DocumentRoot mengarah ke `/www/wwwroot/api-iot/public`:

```apache
<VirtualHost *:80>
    ServerName api-iot.digitaltekno.cloud
    DocumentRoot /www/wwwroot/api-iot/public
    
    <Directory /www/wwwroot/api-iot/public>
        AllowOverride All
        Require all granted
    </Directory>
    
    # Jangan ada redirect rules yang aneh
    # RewriteRule yang salah bisa menyebabkan masalah ini
</VirtualHost>
```

#### Untuk Nginx:

```bash
# Cek nginx config
cat /etc/nginx/sites-available/api-iot.digitaltekno.cloud
# atau
cat /www/server/panel/vhost/nginx/api-iot.digitaltekno.cloud.conf
```

Pastikan configuration benar:

```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name api-iot.digitaltekno.cloud;
    
    root /www/wwwroot/api-iot/public;
    index index.php index.html;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

### Opsi 2: Cek .htaccess di Root Directory

Kadang ada .htaccess di `/www/wwwroot/api-iot/.htaccess` yang conflict:

```bash
# Cek apakah ada .htaccess di root
cat /www/wwwroot/api-iot/.htaccess

# Jika ada dan berisi redirect rules, hapus atau rename
mv /www/wwwroot/api-iot/.htaccess /www/wwwroot/api-iot/.htaccess.backup
```

### Opsi 3: Cek Laravel Routes

Pastikan tidak ada middleware yang menyebabkan redirect:

```bash
# Test routes
cd /www/wwwroot/api-iot
php artisan route:list | grep "iot/data"
```

Expected output:
```
POST      api/iot/data ................ IotDataController@store
```

### Opsi 4: Temporary Workaround - Update Base URL

Jika masalah sulit diperbaiki, gunakan endpoint yang working:

Update di aplikasi utama `.env`:
```env
# Gunakan endpoint alternatif atau port berbeda
IOT_API_URL=http://localhost:8001
```

Atau jalankan IoT API di port berbeda:
```bash
cd /www/wwwroot/api-iot
php artisan serve --host=0.0.0.0 --port=8001
```

## Langkah Troubleshooting

### 1. Cek Apache/Nginx Error Logs

```bash
# Apache
tail -f /var/log/apache2/error.log
tail -f /www/wwwroot/api-iot/storage/logs/laravel.log

# Nginx
tail -f /var/log/nginx/error.log
```

### 2. Cek Rewrite Rules

```bash
# Test dengan curl verbose
curl -v -X POST https://api-iot.digitaltekno.cloud/api/iot/data \
  -H "Content-Type: application/json" \
  -d '{"device_id":"TEST","v1":25.5}' 2>&1 | grep -i "location:"
```

### 3. Test Langsung ke PHP

```bash
# Bypass web server, test langsung
cd /www/wwwroot/api-iot
php artisan serve --port=8888

# Test dari terminal lain
curl -X POST http://localhost:8888/api/iot/data \
  -H "Content-Type: application/json" \
  -d '{"device_id":"TEST","v1":25.5}'
```

### 4. Cek Panel Configuration (jika pakai panel seperti BT/aaPanel)

Jika menggunakan control panel:
1. Login ke panel (BT/aaPanel/cPanel)
2. Buka Website Settings untuk `api-iot.digitaltekno.cloud`
3. Cek "Rewrite Rules" atau "URL Rewrite"
4. Pastikan tidak ada rules yang redirect `/api/*` ke tempat lain

## Quick Fix Commands

```bash
# 1. Restart web server
sudo systemctl restart apache2
# atau
sudo systemctl restart nginx

# 2. Clear Laravel cache
cd /www/wwwroot/api-iot
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# 3. Fix permissions
sudo chown -R www-data:www-data /www/wwwroot/api-iot
sudo chmod -R 755 /www/wwwroot/api-iot
sudo chmod -R 775 /www/wwwroot/api-iot/storage
sudo chmod -R 775 /www/wwwroot/api-iot/bootstrap/cache
```

## Verification

Setelah fix, test dengan:

```bash
# Test create device (should work)
curl -X POST https://api-iot.digitaltekno.cloud/api/devices \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "VERIFY001",
    "device_name": "Verification Test",
    "sensors": [{"variable":"V1","custom_name":"Test","unit":"°C"}]
  }'

# Test send data (should work after fix)
curl -X POST https://api-iot.digitaltekno.cloud/api/iot/data \
  -H "Content-Type: application/json" \
  -d '{"device_id":"VERIFY001","v1":25.5}'
```

Expected response untuk send data:
```json
{
  "success": true,
  "message": "Data berhasil disimpan",
  "data": {...}
}
```

## Summary

- ✅ Server sudah ada dan berfungsi
- ✅ `/api/devices` endpoint working
- ❌ `/api/iot/data` mengalami redirect issue
- 🔧 **Action Required**: Fix web server configuration untuk menghilangkan redirect

## Next Steps

1. Cek dan fix Apache/Nginx virtual host configuration
2. Hapus .htaccess yang conflict (jika ada)
3. Restart web server
4. Test endpoint `/api/iot/data`
5. Jika masih error, gunakan workaround (local server atau port berbeda)

---

**Update:** Masalah bukan di aplikasi Laravel, tapi di web server configuration yang menyebabkan redirect.
