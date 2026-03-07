<?php

return [

    /*
    |--------------------------------------------------------------------------
    | IoT API Base URL
    |--------------------------------------------------------------------------
    |
    | Base URL untuk IoT API yang terpisah dari aplikasi utama.
    | API ini digunakan untuk menerima dan mengelola data sensor IoT.
    |
    | V2 Update: API sekarang menggunakan sistem variable V1-V20 yang fleksibel
    | dengan custom name dan unit untuk setiap variable.
    |
    */

    'base_url' => env('IOT_API_URL', 'https://api-iot.digitaltekno.cloud'),

    /*
    |--------------------------------------------------------------------------
    | API Version
    |--------------------------------------------------------------------------
    |
    | Version API yang digunakan. V2 menggunakan sistem variable (V1-V20).
    |
    */

    'version' => env('IOT_API_VERSION', 'v2'),

    /*
    |--------------------------------------------------------------------------
    | API Timeout
    |--------------------------------------------------------------------------
    |
    | Timeout dalam detik untuk request ke IoT API.
    |
    */

    'timeout' => env('IOT_API_TIMEOUT', 30),

    /*
    |--------------------------------------------------------------------------
    | Available Variables (V2)
    |--------------------------------------------------------------------------
    |
    | Daftar variable yang tersedia di sistem V2 (V1-V20).
    | Setiap variable dapat dikustomisasi dengan custom name dan unit.
    |
    */

    'available_variables' => [
        'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10',
        'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17', 'V18', 'V19', 'V20'
    ],

    /*
    |--------------------------------------------------------------------------
    | API Endpoints
    |--------------------------------------------------------------------------
    |
    | Daftar endpoint yang tersedia di IoT API V2.
    |
    */

    'endpoints' => [
        // Device Management
        'devices' => [
            'list' => '/api/devices',
            'create' => '/api/devices',
            'detail' => '/api/devices/{id}',
            'update' => '/api/devices/{id}',
            'delete' => '/api/devices/{id}',
            'regenerate_key' => '/api/devices/{id}/regenerate-key',
            'available_sensors' => '/api/devices/sensors/available',
        ],

        // IoT Data
        'data' => [
            'send' => '/api/iot/data',
            'batch' => '/api/iot/data/batch',
            'latest' => '/api/iot/data/latest/{deviceId}',
            'history' => '/api/iot/data/history/{deviceId}',
            'range' => '/api/iot/data/range/{deviceId}',
            'cleanup' => '/api/iot/data/cleanup',
        ],

        // Statistics
        'statistics' => [
            'device' => '/api/iot/statistics/{deviceId}',
            'aggregate' => '/api/iot/aggregate/{deviceId}',
        ],

        // Device List
        'device_list' => '/api/iot/devices',
    ],

];
