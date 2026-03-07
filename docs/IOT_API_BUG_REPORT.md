# IoT API Bug Report - Regex Validation Error

## Bug Description

**Error**: `preg_match(): No ending delimiter '/' found`

**Location**: `/www/wwwroot/api-iot/app/Http/Controllers/Api/DeviceController.php` line 73

**Severity**: Critical - Prevents device creation

## Error Details

```
ErrorException: preg_match(): No ending delimiter '/' found
at /www/wwwroot/api-iot/vendor/laravel/framework/src/Illuminate/Validation/Concerns/ValidatesAttributes.php:2083
```

## Reproduction Steps

1. Send POST request to `/api/devices` with V2 format:

```json
{
  "device_id": "DEV000003",
  "device_name": "smart",
  "description": "23",
  "sensors": [
    {
      "variable": "V1",
      "custom_name": "Air Pressure",
      "unit": "hPa"
    },
    {
      "variable": "V2",
      "custom_name": "Gas Leak Detection",
      "unit": "bool"
    }
  ]
}
```

2. API returns 500 error with preg_match error

## Root Cause Analysis

The error occurs in Laravel's `ValidatesAttributes.php` at line 2083, which is the `validateRegex` method. This suggests that:

1. There's a validation rule using `regex:` in the DeviceController
2. The regex pattern itself is malformed (missing delimiters)
3. OR a field value is being used as a regex pattern without proper escaping

## Likely Causes

### 1. Malformed Regex in Validation Rules

```php
// WRONG - Missing delimiters
'unit' => 'regex:^[a-zA-Z0-9]+$'

// CORRECT - With delimiters
'unit' => 'regex:/^[a-zA-Z0-9]+$/'
```

### 2. Dynamic Regex Pattern

```php
// WRONG - Using user input as regex pattern
'unit' => 'regex:' . $request->input('some_field')

// CORRECT - Fixed regex pattern
'unit' => 'regex:/^[a-zA-Z0-9\s\-\_\.\,\(\)\%\°\³\²\/]+$/u'
```

### 3. Validation Rule Typo

```php
// Check for typos in validation rules
$request->validate([
    'device_id' => 'required|string|max:255',
    'device_name' => 'required|string|max:255',
    'description' => 'nullable|string',
    'sensors' => 'required|array',
    'sensors.*.variable' => 'required|string|in:V1,V2,...,V20',
    'sensors.*.custom_name' => 'required|string|max:255',
    'sensors.*.unit' => 'nullable|string|max:50', // Check this line
]);
```

## Recommended Fix

### Option 1: Fix Validation Rules (Recommended)

File: `/www/wwwroot/api-iot/app/Http/Controllers/Api/DeviceController.php`

```php
public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'device_id' => 'required|string|max:255|unique:devices,device_id',
        'device_name' => 'required|string|max:255',
        'description' => 'nullable|string|max:1000',
        'sensors' => 'required|array|min:1|max:20',
        'sensors.*.variable' => 'required|string|in:V1,V2,V3,V4,V5,V6,V7,V8,V9,V10,V11,V12,V13,V14,V15,V16,V17,V18,V19,V20',
        'sensors.*.custom_name' => 'required|string|max:255',
        'sensors.*.unit' => 'nullable|string|max:50',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'Validation error',
            'errors' => $validator->errors()
        ], 422);
    }

    // Rest of the code...
}
```

### Option 2: Add Try-Catch

```php
try {
    $validator = Validator::make($request->all(), $rules);
    
    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'Validation error',
            'errors' => $validator->errors()
        ], 422);
    }
} catch (\Exception $e) {
    \Log::error('Validation error: ' . $e->getMessage(), [
        'request_data' => $request->all()
    ]);
    
    return response()->json([
        'success' => false,
        'message' => 'Validation configuration error: ' . $e->getMessage()
    ], 500);
}
```

## Testing

After fix, test with:

```bash
curl -X POST http://api-iot.digitaltekno.cloud/api/devices \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "TEST001",
    "device_name": "Test Device",
    "description": "Test",
    "sensors": [
      {
        "variable": "V1",
        "custom_name": "Temperature",
        "unit": "°C"
      }
    ]
  }'
```

Expected response: 201 Created with device data

## Workaround (Client Side)

Until the API is fixed, the client application has implemented:

1. Input sanitization to remove special characters
2. Better error handling with specific message for regex errors
3. Logging for debugging

However, this is NOT a permanent solution. The API validation must be fixed.

## Impact

- **Users**: Cannot create new devices
- **Business**: Order approval process blocked
- **System**: All device registrations fail

## Priority

🔴 **CRITICAL** - Blocks core functionality

## Contact

For questions about this bug report, contact the development team.

## Related Files

- `app/Http/Controllers/Admin/OrderController.php` (client-side workaround)
- `docs/IOT_API_ERROR_FIX.md` (client-side fix documentation)
- `docs/IOT_API_V2_TROUBLESHOOTING.md` (troubleshooting guide)

## Update Log

- **2026-02-26**: Bug discovered and reported
- **2026-02-26**: Client-side workaround implemented
- **Pending**: API team to fix validation rules

