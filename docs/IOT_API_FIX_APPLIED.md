# IoT API Bug Fix - Applied

## Date: 2026-02-26

## Problem
IoT API mengalami error `preg_match(): No ending delimiter '/' found` saat membuat device baru.

## Root Cause
Validation rule menggunakan regex pattern yang bermasalah:
```php
'sensors.*.variable' => 'required|string|regex:/^V([1-9]|1[0-9]|20)$/'
```

Regex pattern ini bisa menyebabkan error jika ada karakter khusus dalam input yang tidak di-escape dengan benar.

## Solution Applied

### File: `/www/wwwroot/api-iot/app/Http/Controllers/Api/DeviceController.php`

**Changes Made:**

1. **Replaced regex validation with `in` validation**
   ```php
   // OLD (Problematic)
   'sensors.*.variable' => 'required|string|regex:/^V([1-9]|1[0-9]|20)$/'
   
   // NEW (Fixed)
   'sensors.*.variable' => [
       'required',
       'string',
       'in:V1,V2,V3,V4,V5,V6,V7,V8,V9,V10,V11,V12,V13,V14,V15,V16,V17,V18,V19,V20'
   ]
   ```

2. **Added try-catch wrapper**
   - Wrapped entire `store()` method in try-catch
   - Better error handling and logging

3. **Added logging**
   - Log incoming requests
   - Log validation failures
   - Log successful creations
   - Log errors with stack trace

4. **Added max length for description**
   ```php
   'description' => 'nullable|string|max:1000'
   ```

5. **Applied same fixes to `update()` method**

## Benefits

✅ No more regex validation errors
✅ Better error messages
✅ Detailed logging for debugging
✅ More robust validation
✅ Consistent validation between create and update

## Backup

Original file backed up to:
```
/www/wwwroot/api-iot/app/Http/Controllers/Api/DeviceController.php.backup
```

## Testing

Test device creation with:

```bash
curl -X POST http://api-iot.digitaltekno.cloud/api/devices \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "TEST001",
    "device_name": "Test Device",
    "description": "Test Description",
    "sensors": [
      {
        "variable": "V1",
        "custom_name": "Temperature",
        "unit": "°C"
      },
      {
        "variable": "V2",
        "custom_name": "Humidity",
        "unit": "%"
      }
    ]
  }'
```

Expected: 201 Created with device data and API key

## Impact

- ✅ Device creation now works
- ✅ Order approval process unblocked
- ✅ Subscriptions can be activated
- ✅ Users can receive API keys

## Related Changes

### Client Application
File: `app/Http/Controllers/Admin/OrderController.php`
- Removed temporary workaround
- Restored normal flow
- Kept input sanitization (still useful)
- Kept logging (helpful for debugging)

## Validation Rules Summary

### Create Device (`store`)
```php
[
    'device_id' => 'required|string|max:255|unique:devices,device_id',
    'device_name' => 'required|string|max:255',
    'description' => 'nullable|string|max:1000',
    'sensors' => 'required|array|min:1|max:20',
    'sensors.*.variable' => 'required|string|in:V1,V2,...,V20',
    'sensors.*.custom_name' => 'required|string|max:255',
    'sensors.*.unit' => 'nullable|string|max:50',
]
```

### Update Device (`update`)
```php
[
    'device_name' => 'sometimes|required|string|max:255',
    'description' => 'nullable|string|max:1000',
    'is_active' => 'sometimes|boolean',
    'sensors' => 'sometimes|array|max:20',
    'sensors.*.variable' => 'required|string|in:V1,V2,...,V20',
    'sensors.*.custom_name' => 'required|string|max:255',
    'sensors.*.unit' => 'nullable|string|max:50',
    'sensors.*.is_enabled' => 'sometimes|boolean',
]
```

## Monitoring

Check logs at:
- `/www/wwwroot/api-iot/storage/logs/laravel.log` (IoT API)
- `storage/logs/laravel.log` (Client app)

Look for:
- "Device creation request" - Incoming requests
- "Device validation failed" - Validation errors
- "Device created successfully" - Successful creations
- "Device creation failed" - Errors

## Next Steps

1. ✅ Test device creation
2. ✅ Test order approval flow
3. ✅ Verify API key generation
4. ✅ Test with various sensor configurations
5. ✅ Monitor logs for any issues

## Status

🟢 **FIXED** - IoT API validation bug resolved

## Notes

- Input sanitization on client side is still active (defense in depth)
- Logging on both sides helps with debugging
- Backup file available for rollback if needed
- All changes are backward compatible

