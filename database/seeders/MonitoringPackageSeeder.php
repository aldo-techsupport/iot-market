<?php

namespace Database\Seeders;

use App\Models\MonitoringPackage;
use Illuminate\Database\Seeder;

class MonitoringPackageSeeder extends Seeder
{
    public function run(): void
    {
        $packages = [
            [
                'name' => 'Free',
                'description' => 'Coba gratis selamanya. Cocok untuk pemula yang ingin mencoba sistem monitoring IoT.',
                'base_price' => 0,
                'max_sensors' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Starter',
                'description' => 'Paket dasar untuk monitoring sederhana. Cocok untuk kebutuhan monitoring skala kecil.',
                'base_price' => 70000,
                'max_sensors' => 15,
                'is_active' => true,
            ],
            [
                'name' => 'Pro',
                'description' => 'Paket profesional dengan lebih banyak sensor. Cocok untuk monitoring skala menengah dengan kebutuhan data yang lebih kompleks.',
                'base_price' => 150000,
                'max_sensors' => 20,
                'is_active' => true,
            ],
            [
                'name' => 'Business',
                'description' => 'Paket lengkap untuk bisnis. Banyak sensor dan fitur premium untuk monitoring skala besar.',
                'base_price' => 250000,
                'max_sensors' => 25,
                'is_active' => true,
            ],
        ];

        foreach ($packages as $package) {
            MonitoringPackage::create($package);
        }
    }
}
