<?php

use App\Services\IoTApiService;

if (!function_exists('iot_api')) {
    /**
     * Get IoT API Service instance
     */
    function iot_api(): IoTApiService
    {
        return app(IoTApiService::class);
    }
}

if (!function_exists('iot_api_url')) {
    /**
     * Get full IoT API URL
     */
    function iot_api_url(string $endpoint = ''): string
    {
        $baseUrl = config('iot-api.base_url');
        return $endpoint ? $baseUrl . $endpoint : $baseUrl;
    }
}
