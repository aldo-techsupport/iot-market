<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class IoTApiService
{
    protected string $baseUrl;
    protected int $timeout;

    public function __construct()
    {
        $this->baseUrl = config('iot-api.base_url');
        $this->timeout = config('iot-api.timeout');
    }

    /**
     * Get available sensors
     */
    public function getAvailableSensors()
    {
        return $this->get('/api/devices/sensors/available');
    }

    /**
     * Create device with selected sensors
     */
    public function createDevice(array $data)
    {
        return $this->post('/api/devices', $data);
    }

    /**
     * Get all devices
     */
    public function getDevices()
    {
        return $this->get('/api/devices');
    }

    /**
     * Get device detail
     */
    public function getDevice(int $id)
    {
        return $this->get("/api/devices/{$id}");
    }

    /**
     * Update device
     */
    public function updateDevice(int $id, array $data)
    {
        return $this->put("/api/devices/{$id}", $data);
    }

    /**
     * Delete device
     */
    public function deleteDevice(int $id)
    {
        return $this->delete("/api/devices/{$id}");
    }

    /**
     * Regenerate API Key
     */
    public function regenerateApiKey(int $id)
    {
        return $this->post("/api/devices/{$id}/regenerate-key");
    }

    /**
     * Get latest sensor data
     */
    public function getLatestData(string $deviceId)
    {
        return $this->get("/api/iot/data/latest/{$deviceId}");
    }

    /**
     * Get sensor data history
     */
    public function getDataHistory(string $deviceId, int $perPage = 50)
    {
        return $this->get("/api/iot/data/history/{$deviceId}", [
            'per_page' => $perPage,
        ]);
    }

    /**
     * Get sensor data by date range
     */
    public function getDataRange(string $deviceId, string $startDate, string $endDate)
    {
        return $this->get("/api/iot/data/range/{$deviceId}", [
            'start_date' => $startDate,
            'end_date' => $endDate,
        ]);
    }

    /**
     * Get device statistics
     */
    public function getStatistics(string $deviceId)
    {
        return $this->get("/api/iot/statistics/{$deviceId}");
    }

    /**
     * Get aggregate data (V2 - using variable instead of sensor)
     */
    public function getAggregate(string $deviceId, string $variable, ?string $startDate = null, ?string $endDate = null)
    {
        $params = ['variable' => $variable];
        
        if ($startDate) {
            $params['start_date'] = $startDate;
        }
        
        if ($endDate) {
            $params['end_date'] = $endDate;
        }

        return $this->get("/api/iot/aggregate/{$deviceId}", $params);
    }

    /**
     * Get aggregate data (V1 - backward compatibility)
     * @deprecated Use getAggregate() with variable parameter instead
     */
    public function getAggregateBySensor(string $deviceId, string $sensor, ?string $startDate = null, ?string $endDate = null)
    {
        // Map sensor name to variable if needed
        // This is for backward compatibility only
        return $this->getAggregate($deviceId, $sensor, $startDate, $endDate);
    }

    /**
     * Send sensor data
     */
    public function sendData(array $data)
    {
        return $this->post('/api/iot/data', $data);
    }

    /**
     * Send batch sensor data
     */
    public function sendBatchData(array $data)
    {
        return $this->post('/api/iot/data/batch', ['data' => $data]);
    }

    /**
     * GET request
     */
    protected function get(string $endpoint, array $params = [])
    {
        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders([
                    'Accept' => 'application/json',
                ])
                ->get($this->baseUrl . $endpoint, $params);

            return $this->handleResponse($response);
        } catch (\Exception $e) {
            Log::error('IoT API GET Error: ' . $e->getMessage(), [
                'endpoint' => $endpoint,
                'params' => $params,
            ]);

            return [
                'success' => false,
                'message' => 'Failed to connect to IoT API',
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * POST request
     */
    protected function post(string $endpoint, array $data = [])
    {
        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders([
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ])
                ->post($this->baseUrl . $endpoint, $data);

            return $this->handleResponse($response);
        } catch (\Exception $e) {
            Log::error('IoT API POST Error: ' . $e->getMessage(), [
                'endpoint' => $endpoint,
                'data' => $data,
            ]);

            return [
                'success' => false,
                'message' => 'Failed to connect to IoT API',
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * PUT request
     */
    protected function put(string $endpoint, array $data = [])
    {
        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders([
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ])
                ->put($this->baseUrl . $endpoint, $data);

            return $this->handleResponse($response);
        } catch (\Exception $e) {
            Log::error('IoT API PUT Error: ' . $e->getMessage(), [
                'endpoint' => $endpoint,
                'data' => $data,
            ]);

            return [
                'success' => false,
                'message' => 'Failed to connect to IoT API',
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * DELETE request
     */
    protected function delete(string $endpoint)
    {
        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders([
                    'Accept' => 'application/json',
                ])
                ->delete($this->baseUrl . $endpoint);

            return $this->handleResponse($response);
        } catch (\Exception $e) {
            Log::error('IoT API DELETE Error: ' . $e->getMessage(), [
                'endpoint' => $endpoint,
            ]);

            return [
                'success' => false,
                'message' => 'Failed to connect to IoT API',
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Handle API response
     */
    protected function handleResponse($response)
    {
        if ($response->successful()) {
            // Check if response is JSON
            $contentType = $response->header('Content-Type');
            if (strpos($contentType, 'application/json') === false) {
                Log::error('IoT API returned non-JSON response', [
                    'status' => $response->status(),
                    'content_type' => $contentType,
                    'body_preview' => substr($response->body(), 0, 200),
                ]);

                return [
                    'success' => false,
                    'message' => 'IoT API server tidak dikonfigurasi dengan benar. Server mengembalikan HTML alih-alih JSON. Silakan hubungi administrator untuk deploy IoT API server.',
                    'error' => 'Server returned HTML instead of JSON',
                ];
            }

            return $response->json();
        }

        // Check if error response is HTML
        $contentType = $response->header('Content-Type');
        if (strpos($contentType, 'text/html') !== false) {
            Log::error('IoT API returned HTML error page', [
                'status' => $response->status(),
                'content_type' => $contentType,
                'body_preview' => substr($response->body(), 0, 200),
            ]);

            return [
                'success' => false,
                'message' => 'IoT API server tidak tersedia atau belum dikonfigurasi. Silakan hubungi administrator.',
                'error' => 'Server returned HTML error page',
                'status' => $response->status(),
            ];
        }

        Log::error('IoT API Error Response', [
            'status' => $response->status(),
            'body' => $response->body(),
        ]);

        return [
            'success' => false,
            'message' => 'API request failed',
            'status' => $response->status(),
            'error' => $response->body(),
        ];
    }
}
