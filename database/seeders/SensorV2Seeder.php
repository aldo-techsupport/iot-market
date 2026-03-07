<?php

namespace Database\Seeders;

use App\Models\Sensor;
use Illuminate\Database\Seeder;

class SensorV2Seeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sensors = [
            // Environmental Monitoring
            [
                'name' => 'Suhu',
                'code' => 'temperature',
                'description' => 'Sensor suhu ruangan',
                'unit' => '°C',
                'price' => 50000,
                'category' => 'environmental',
                'icon' => 'thermometer',
                'is_active' => true,
                'variable_suggestion' => 'V1',
            ],
            [
                'name' => 'Kelembaban',
                'code' => 'humidity',
                'description' => 'Sensor kelembaban udara',
                'unit' => '%',
                'price' => 50000,
                'category' => 'environmental',
                'icon' => 'droplet',
                'is_active' => true,
                'variable_suggestion' => 'V2',
            ],
            [
                'name' => 'Tekanan Udara',
                'code' => 'pressure',
                'description' => 'Sensor tekanan udara',
                'unit' => 'hPa',
                'price' => 75000,
                'category' => 'environmental',
                'icon' => 'gauge',
                'is_active' => true,
                'variable_suggestion' => 'V3',
            ],
            [
                'name' => 'Kualitas Udara (CO2)',
                'code' => 'co2',
                'description' => 'Sensor CO2',
                'unit' => 'ppm',
                'price' => 100000,
                'category' => 'environmental',
                'icon' => 'wind',
                'is_active' => true,
                'variable_suggestion' => 'V4',
            ],
            [
                'name' => 'Kebisingan',
                'code' => 'noise',
                'description' => 'Sensor tingkat kebisingan',
                'unit' => 'dB',
                'price' => 75000,
                'category' => 'environmental',
                'icon' => 'volume-2',
                'is_active' => true,
                'variable_suggestion' => 'V5',
            ],
            [
                'name' => 'Cahaya',
                'code' => 'light',
                'description' => 'Sensor intensitas cahaya',
                'unit' => 'Lux',
                'price' => 50000,
                'category' => 'environmental',
                'icon' => 'sun',
                'is_active' => true,
                'variable_suggestion' => 'V6',
            ],

            // Power Monitoring
            [
                'name' => 'Tegangan',
                'code' => 'voltage',
                'description' => 'Sensor tegangan listrik',
                'unit' => 'V',
                'price' => 75000,
                'category' => 'power',
                'icon' => 'zap',
                'is_active' => true,
                'variable_suggestion' => 'V1',
            ],
            [
                'name' => 'Arus',
                'code' => 'current',
                'description' => 'Sensor arus listrik',
                'unit' => 'A',
                'price' => 75000,
                'category' => 'power',
                'icon' => 'activity',
                'is_active' => true,
                'variable_suggestion' => 'V2',
            ],
            [
                'name' => 'Daya Aktif',
                'code' => 'power',
                'description' => 'Sensor daya aktif',
                'unit' => 'W',
                'price' => 100000,
                'category' => 'power',
                'icon' => 'zap',
                'is_active' => true,
                'variable_suggestion' => 'V3',
            ],
            [
                'name' => 'Energi',
                'code' => 'energy',
                'description' => 'Sensor konsumsi energi',
                'unit' => 'kWh',
                'price' => 100000,
                'category' => 'power',
                'icon' => 'battery',
                'is_active' => true,
                'variable_suggestion' => 'V4',
            ],

            // Machine Monitoring
            [
                'name' => 'RPM',
                'code' => 'rpm',
                'description' => 'Sensor kecepatan putaran mesin',
                'unit' => 'RPM',
                'price' => 100000,
                'category' => 'machine',
                'icon' => 'rotate-cw',
                'is_active' => true,
                'variable_suggestion' => 'V1',
            ],
            [
                'name' => 'Getaran',
                'code' => 'vibration',
                'description' => 'Sensor getaran mesin',
                'unit' => 'mm/s',
                'price' => 150000,
                'category' => 'machine',
                'icon' => 'activity',
                'is_active' => true,
                'variable_suggestion' => 'V2',
            ],
            [
                'name' => 'Suhu Motor',
                'code' => 'motor_temp',
                'description' => 'Sensor suhu motor',
                'unit' => '°C',
                'price' => 75000,
                'category' => 'machine',
                'icon' => 'thermometer',
                'is_active' => true,
                'variable_suggestion' => 'V3',
            ],
            [
                'name' => 'Beban Mesin',
                'code' => 'load',
                'description' => 'Sensor beban mesin',
                'unit' => '%',
                'price' => 100000,
                'category' => 'machine',
                'icon' => 'cpu',
                'is_active' => true,
                'variable_suggestion' => 'V4',
            ],

            // Water/Tank Monitoring
            [
                'name' => 'Level Air',
                'code' => 'water_level',
                'description' => 'Sensor level air',
                'unit' => '%',
                'price' => 75000,
                'category' => 'water',
                'icon' => 'droplet',
                'is_active' => true,
                'variable_suggestion' => 'V1',
            ],
            [
                'name' => 'Volume Air',
                'code' => 'water_volume',
                'description' => 'Sensor volume air',
                'unit' => 'L',
                'price' => 100000,
                'category' => 'water',
                'icon' => 'droplet',
                'is_active' => true,
                'variable_suggestion' => 'V2',
            ],
            [
                'name' => 'Flow Rate',
                'code' => 'flow_rate',
                'description' => 'Sensor laju aliran air',
                'unit' => 'L/min',
                'price' => 125000,
                'category' => 'water',
                'icon' => 'droplet',
                'is_active' => true,
                'variable_suggestion' => 'V3',
            ],

            // Weather
            [
                'name' => 'Kecepatan Angin',
                'code' => 'wind_speed',
                'description' => 'Sensor kecepatan angin',
                'unit' => 'm/s',
                'price' => 150000,
                'category' => 'weather',
                'icon' => 'wind',
                'is_active' => true,
                'variable_suggestion' => 'V1',
            ],
            [
                'name' => 'Arah Angin',
                'code' => 'wind_direction',
                'description' => 'Sensor arah angin',
                'unit' => '°',
                'price' => 150000,
                'category' => 'weather',
                'icon' => 'compass',
                'is_active' => true,
                'variable_suggestion' => 'V2',
            ],
            [
                'name' => 'Curah Hujan',
                'code' => 'rainfall',
                'description' => 'Sensor curah hujan',
                'unit' => 'mm',
                'price' => 125000,
                'category' => 'weather',
                'icon' => 'cloud-rain',
                'is_active' => true,
                'variable_suggestion' => 'V3',
            ],
        ];

        foreach ($sensors as $sensor) {
            Sensor::updateOrCreate(
                ['code' => $sensor['code']],
                $sensor
            );
        }

        $this->command->info('✓ Sensor V2 seeded successfully!');
    }
}
