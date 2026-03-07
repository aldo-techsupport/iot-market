<?php

namespace Database\Seeders;

use App\Models\Sensor;
use Illuminate\Database\Seeder;

class SensorSeeder extends Seeder
{
    public function run(): void
    {
        $sensors = [
            // Environmental Sensors
            ['name' => 'Temperature', 'code' => 'TEMP', 'description' => 'Suhu (°C)', 'price' => 10000, 'unit' => '°C', 'icon' => 'thermometer'],
            ['name' => 'Humidity', 'code' => 'HUMID', 'description' => 'Kelembaban (%RH)', 'price' => 10000, 'unit' => '%RH', 'icon' => 'droplet'],
            ['name' => 'Air Pressure', 'code' => 'AIRP', 'description' => 'Tekanan Udara (hPa)', 'price' => 15000, 'unit' => 'hPa', 'icon' => 'gauge'],
            ['name' => 'Air Quality', 'code' => 'AQI', 'description' => 'Kualitas Udara (AQI)', 'price' => 15000, 'unit' => 'AQI', 'icon' => 'wind'],
            ['name' => 'CO2', 'code' => 'CO2', 'description' => 'Karbon Dioksida (ppm)', 'price' => 20000, 'unit' => 'ppm', 'icon' => 'cloud'],
            ['name' => 'CO', 'code' => 'CO', 'description' => 'Karbon Monoksida (ppm)', 'price' => 20000, 'unit' => 'ppm', 'icon' => 'alert-triangle'],
            ['name' => 'NH3', 'code' => 'NH3', 'description' => 'Amonia (ppm)', 'price' => 20000, 'unit' => 'ppm', 'icon' => 'flask'],
            ['name' => 'H2S', 'code' => 'H2S', 'description' => 'Hidrogen Sulfida (ppm)', 'price' => 20000, 'unit' => 'ppm', 'icon' => 'flask'],
            ['name' => 'VOC', 'code' => 'VOC', 'description' => 'Volatile Organic Compounds (ppm)', 'price' => 20000, 'unit' => 'ppm', 'icon' => 'flask'],
            ['name' => 'Noise', 'code' => 'NOISE', 'description' => 'Kebisingan (dB)', 'price' => 15000, 'unit' => 'dB', 'icon' => 'volume-2'],
            ['name' => 'Light Intensity', 'code' => 'LIGHT', 'description' => 'Intensitas Cahaya (Lux)', 'price' => 10000, 'unit' => 'Lux', 'icon' => 'sun'],

            // Electrical Measurements
            ['name' => 'Voltage', 'code' => 'VOLT', 'description' => 'Tegangan (Volt)', 'price' => 15000, 'unit' => 'V', 'icon' => 'zap'],
            ['name' => 'Current', 'code' => 'CURR', 'description' => 'Arus (Ampere)', 'price' => 15000, 'unit' => 'A', 'icon' => 'zap'],
            ['name' => 'Active Power', 'code' => 'POWERA', 'description' => 'Daya Aktif (Watt)', 'price' => 20000, 'unit' => 'W', 'icon' => 'activity'],
            ['name' => 'Apparent Power', 'code' => 'POWERS', 'description' => 'Daya Semu (VA)', 'price' => 20000, 'unit' => 'VA', 'icon' => 'activity'],
            ['name' => 'Reactive Power', 'code' => 'POWERR', 'description' => 'Daya Reaktif (VAR)', 'price' => 20000, 'unit' => 'VAR', 'icon' => 'activity'],
            ['name' => 'Energy', 'code' => 'ENERGY', 'description' => 'Energi (kWh)', 'price' => 25000, 'unit' => 'kWh', 'icon' => 'battery'],
            ['name' => 'Frequency', 'code' => 'FREQ', 'description' => 'Frekuensi (Hz)', 'price' => 15000, 'unit' => 'Hz', 'icon' => 'radio'],
            ['name' => 'Power Factor', 'code' => 'PF', 'description' => 'Power Factor (Cos φ)', 'price' => 20000, 'unit' => 'Cos φ', 'icon' => 'percent'],
            ['name' => 'THD', 'code' => 'THD', 'description' => 'Total Harmonic Distortion (%)', 'price' => 25000, 'unit' => '%', 'icon' => 'trending-up'],

            // Flow & Pressure
            ['name' => 'Water Flow', 'code' => 'WFLOW', 'description' => 'Debit Air (L/min)', 'price' => 20000, 'unit' => 'L/min', 'icon' => 'droplets'],
            ['name' => 'Pipe Pressure', 'code' => 'PPRES', 'description' => 'Tekanan Pipa (Bar)', 'price' => 20000, 'unit' => 'Bar', 'icon' => 'gauge'],
            ['name' => 'Tank Level', 'code' => 'TLEVEL', 'description' => 'Level Tangki (%)', 'price' => 15000, 'unit' => '%', 'icon' => 'droplet'],
            ['name' => 'Gas Pressure', 'code' => 'GPRES', 'description' => 'Tekanan Gas (Bar)', 'price' => 25000, 'unit' => 'Bar', 'icon' => 'gauge'],

            // Machine Status
            ['name' => 'RPM', 'code' => 'RPM', 'description' => 'Rotasi Per Menit', 'price' => 20000, 'unit' => 'RPM', 'icon' => 'rotate-cw'],
            ['name' => 'Vibration', 'code' => 'VIB', 'description' => 'Getaran (mm/s)', 'price' => 25000, 'unit' => 'mm/s', 'icon' => 'activity'],
            ['name' => 'Machine Status', 'code' => 'MSTAT', 'description' => 'Status Mesin (On/Off)', 'price' => 10000, 'unit' => 'bool', 'icon' => 'power'],
            ['name' => 'Production Counter', 'code' => 'PCOUNT', 'description' => 'Counter Produksi (Unit)', 'price' => 15000, 'unit' => 'Unit', 'icon' => 'hash'],

            // Safety & Detection
            ['name' => 'Fire Detection', 'code' => 'FIRE', 'description' => 'Deteksi Api', 'price' => 30000, 'unit' => 'bool', 'icon' => 'flame'],
            ['name' => 'Smoke Detection', 'code' => 'SMOKE', 'description' => 'Deteksi Asap', 'price' => 25000, 'unit' => 'bool', 'icon' => 'cloud'],
            ['name' => 'Gas Leak Detection', 'code' => 'GASLEAK', 'description' => 'Deteksi Gas Bocor', 'price' => 30000, 'unit' => 'bool', 'icon' => 'alert-triangle'],

            // Agriculture & Water Quality
            ['name' => 'Soil Moisture', 'code' => 'SMOIST', 'description' => 'Kelembaban Tanah (%)', 'price' => 15000, 'unit' => '%', 'icon' => 'droplet'],
            ['name' => 'pH Level', 'code' => 'PH', 'description' => 'pH Cairan', 'price' => 20000, 'unit' => 'pH', 'icon' => 'beaker'],
            ['name' => 'Conductivity', 'code' => 'COND', 'description' => 'Konduktivitas (µS/cm)', 'price' => 20000, 'unit' => 'µS/cm', 'icon' => 'zap'],

            // Weather
            ['name' => 'Wind Speed', 'code' => 'WSPEED', 'description' => 'Kecepatan Angin (m/s)', 'price' => 20000, 'unit' => 'm/s', 'icon' => 'wind'],
            ['name' => 'Wind Direction', 'code' => 'WDIR', 'description' => 'Arah Angin (°)', 'price' => 15000, 'unit' => '°', 'icon' => 'compass'],
            ['name' => 'Rainfall', 'code' => 'RAIN', 'description' => 'Curah Hujan (mm)', 'price' => 20000, 'unit' => 'mm', 'icon' => 'cloud-rain'],
        ];

        foreach ($sensors as $sensor) {
            Sensor::create(array_merge($sensor, ['is_active' => true]));
        }
    }
}
