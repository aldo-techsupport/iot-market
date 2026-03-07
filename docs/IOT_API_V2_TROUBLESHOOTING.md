# IoT API V2 - Troubleshooting

## Error: preg_match(): No ending delimiter '/' found

### Deskripsi Error
Error ini terjadi saat membuat device di IoT API V2. Error berasal dari validasi Laravel di API.

```
preg_match(): No ending delimiter '/' found
at /www/wwwroot/api-iot/vendor/laravel/framework/src/Illuminate/Validation/Concerns/ValidatesAttributes.php:2083
```

### Penyebab
Error ini terjadi karena ada validation rule `regex` di IoT API yang tidak properly formatted, atau ada data yang dikirim yang menyebabkan regex validation error. Karakter khusus dalam input (seperti backslash, pipe, dll) dapat menyebabkan regex pattern menjadi invalid.

### Solusi yang Sudah Diterapkan ✅

#### 1. Sanitasi di Backend (OrderController)

File: `app/Http/Controllers/Admin/OrderController.php`

```php
private function sanitizeString(?string $string): string
{
    if (empty($string)) {
        return '';
    }

    // Remove special characters that might cause regex issues
    // Keep: letters, numbers, spaces, and common symbols used in sensor names/units
    return preg_replace('/[^\p{L}\p{N}\s\-\_\.\,\(\)\%\°\³\²\/]/u', '', $string);
}
```

Semua field di-sanitasi sebelum dikirim ke IoT API:
- `device_name`
- `device_description`
- `custom_name` (sensor)
- `unit` (sensor)

#### 2. Sanitasi di Frontend (Subscribe Page)

File: `resources/js/pages/member/subscribe.tsx`

```typescript
const sanitizeInput = (value: string): string => {
    // Remove special characters that might cause regex issues in IoT API
    // Keep: letters, numbers, spaces, and common symbols
    return value.replace(/[^\p{L}\p{N}\s\-_.,()%°³²/]/gu, '');
};
```

Semua input field menggunakan sanitasi:
- Device name input
- Device location input
- Device description textarea
- Sensor custom name input
- Sensor unit input

#### 3. Logging untuk Debug

Ditambahkan logging di OrderController untuk tracking:

```php
Log::info('Creating device in IoT API', [
    'order_id' => $order->id,
    'device_data' => $deviceData
]);
```

### Karakter yang Diizinkan

Karakter yang aman untuk digunakan:
- ✅ Huruf (A-Z, a-z, termasuk unicode seperti é, ñ, dll)
- ✅ Angka (0-9)
- ✅ Spasi
- ✅ Tanda hubung (-)
- ✅ Underscore (_)
- ✅ Titik (.)
- ✅ Koma (,)
- ✅ Kurung ()
- ✅ Persen (%)
- ✅ Derajat (°)
- ✅ Superscript (², ³)
- ✅ Slash (/)

### Karakter yang Dihapus Otomatis

Karakter yang akan dihapus oleh sanitasi:
- ❌ Backslash (\)
- ❌ Pipe (|)
- ❌ Dollar sign ($)
- ❌ Caret (^)
- ❌ Bracket ([, ])
- ❌ Brace ({, })
- ❌ Asterisk (*)
- ❌ Plus (+)
- ❌ Question mark (?)
- ❌ Ampersand (&)
- ❌ At sign (@)
- ❌ Hash (#)
- ❌ Exclamation (!)
- ❌ Tilde (~)
- ❌ Backtick (`)
- ❌ Quote (' ")
- ❌ Semicolon (;)
- ❌ Colon (:)
- ❌ Less/Greater than (<, >)
- ❌ Equal (=)

### Testing

Untuk memverifikasi solusi bekerja:

1. Buat order dengan karakter normal:
   - Device Name: "Smart Home Sensor"
   - Custom Name: "Temperature"
   - Unit: "°C"

2. Coba dengan karakter khusus (akan di-sanitasi otomatis):
   - Input: "Sensor #1 @ Room"
   - Output: "Sensor 1  Room"

3. Coba dengan unicode:
   - Input: "Température"
   - Output: "Température" (tetap)

### Monitoring

Jika error masih terjadi, check log di:
- `storage/logs/laravel.log` (aplikasi ini)
- `/www/wwwroot/api-iot/storage/logs/laravel.log` (IoT API)

Log akan menampilkan data yang dikirim sebelum error terjadi.


