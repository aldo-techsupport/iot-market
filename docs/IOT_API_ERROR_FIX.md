# Fix: IoT API preg_match Error

## Problem
Saat admin approve order, terjadi error dari IoT API:
```
preg_match(): No ending delimiter '/' found
```

Error ini terjadi karena karakter khusus dalam input user (device name, sensor custom name, unit, dll) menyebabkan regex validation di IoT API menjadi invalid.

## Root Cause
IoT API memiliki validation rule yang menggunakan regex, dan karakter khusus seperti `\`, `|`, `$`, `^`, dll dapat menyebabkan regex pattern menjadi malformed.

## Solution Implemented

### 1. Backend Sanitization
**File**: `app/Http/Controllers/Admin/OrderController.php`

Ditambahkan method `sanitizeString()` yang menghapus karakter khusus sebelum data dikirim ke IoT API:

```php
private function sanitizeString(?string $string): string
{
    if (empty($string)) {
        return '';
    }

    // Remove special characters that might cause regex issues
    return preg_replace('/[^\p{L}\p{N}\s\-\_\.\,\(\)\%\°\³\²\/]/u', '', $string);
}
```

Semua field di-sanitasi di method `approve()`:
- `device_name`
- `device_description`
- `custom_name` (untuk setiap sensor)
- `unit` (untuk setiap sensor)

### 2. Frontend Sanitization
**File**: `resources/js/pages/member/subscribe.tsx`

Ditambahkan function `sanitizeInput()` yang mencegah user memasukkan karakter bermasalah:

```typescript
const sanitizeInput = (value: string): string => {
    return value.replace(/[^\p{L}\p{N}\s\-_.,()%°³²/]/gu, '');
};
```

Semua input field menggunakan sanitasi real-time:
- Device name
- Device location
- Device description
- Sensor custom name
- Sensor unit

### 3. Logging
Ditambahkan logging untuk debugging:

```php
Log::info('Creating device in IoT API', [
    'order_id' => $order->id,
    'device_data' => $deviceData
]);
```

## Allowed Characters

### Safe Characters ✅
- Letters (A-Z, a-z, unicode)
- Numbers (0-9)
- Space
- Hyphen (-)
- Underscore (_)
- Period (.)
- Comma (,)
- Parentheses ()
- Percent (%)
- Degree (°)
- Superscript (², ³)
- Slash (/)

### Removed Characters ❌
- Backslash (\)
- Pipe (|)
- Dollar ($)
- Caret (^)
- Brackets ([], {})
- Asterisk (*)
- Plus (+)
- Question (?)
- Ampersand (&)
- At (@)
- Hash (#)
- Exclamation (!)
- Quotes (' ")
- Semicolon (;)
- Colon (:)
- Less/Greater (<, >)
- Equal (=)

## Testing

### Before Fix
Input: `Sensor #1 @ Room | Test`
Result: ❌ Error preg_match

### After Fix
Input: `Sensor #1 @ Room | Test`
Sanitized: `Sensor 1  Room  Test`
Result: ✅ Success

## Files Modified

1. `app/Http/Controllers/Admin/OrderController.php`
   - Added `sanitizeString()` method
   - Added `Log` facade import
   - Updated `approve()` to sanitize all fields
   - Added logging

2. `resources/js/pages/member/subscribe.tsx`
   - Added `sanitizeInput()` function
   - Updated all input onChange handlers

3. `docs/IOT_API_V2_TROUBLESHOOTING.md`
   - Created comprehensive troubleshooting guide

4. `docs/IOT_API_ERROR_FIX.md`
   - This document

## Impact

### User Experience
- Users can still input most characters
- Special characters are automatically removed
- No error messages shown to user
- Seamless experience

### Data Integrity
- Data is cleaned before storage
- Consistent format in database
- No breaking characters in IoT API

### Reliability
- Prevents IoT API errors
- Order approval process works smoothly
- Device creation succeeds

## Future Improvements

1. Add visual feedback when characters are removed
2. Show tooltip with allowed characters
3. Add backend validation rules to match frontend
4. Contact IoT API team to fix regex validation bug

## Related Documents

- [Order Approval Flow Fix](ORDER_APPROVAL_FLOW_FIX.md)
- [IoT API V2 Troubleshooting](IOT_API_V2_TROUBLESHOOTING.md)
- [IoT API V2 Implementation](IOT_V2_IMPLEMENTATION_COMPLETE.md)
