<?php

namespace Database\Seeders;

use App\Models\PricingPackage;
use Illuminate\Database\Seeder;

class PricingPackageSeeder extends Seeder
{
    public function run(): void
    {
        $packages = [
            [
                'name'         => 'Free',
                'slug'         => 'free',
                'price'        => 0,
                'price_label'  => 'Gratis',
                'color'        => 'green',
                'border_color' => 'border-green-500',
                'button_color' => 'outline',
                'is_popular'   => false,
                'sort_order'   => 1,
                'button_text'  => 'Mulai Gratis',
                'is_active'    => true,
                'features'     => [
                    ['label' => '1 Device',              'included' => true],
                    ['label' => '5 Sensor/device',       'included' => true],
                    ['label' => '1 Grafik/device',       'included' => true],
                    ['label' => 'Notifikasi WA/Telegram','included' => false],
                ],
            ],
            [
                'name'         => 'Starter',
                'slug'         => 'starter',
                'price'        => 70000,
                'price_label'  => 'Rp70K',
                'color'        => 'blue',
                'border_color' => 'border-blue-500',
                'button_color' => 'blue',
                'is_popular'   => false,
                'sort_order'   => 2,
                'button_text'  => 'Checkout',
                'is_active'    => true,
                'features'     => [
                    ['label' => '5 Device',              'included' => true],
                    ['label' => '15 Sensor/device',      'included' => true],
                    ['label' => '15 Grafik/device',      'included' => true],
                    ['label' => 'Notifikasi WA/Telegram','included' => true],
                ],
            ],
            [
                'name'         => 'Pro',
                'slug'         => 'pro',
                'price'        => 150000,
                'price_label'  => 'Rp150K',
                'color'        => 'purple',
                'border_color' => 'border-purple-500',
                'button_color' => 'purple',
                'is_popular'   => true,
                'sort_order'   => 3,
                'button_text'  => 'Checkout',
                'is_active'    => true,
                'features'     => [
                    ['label' => '10 Device',             'included' => true],
                    ['label' => '20 Sensor/device',      'included' => true],
                    ['label' => '20 Grafik/device',      'included' => true],
                    ['label' => 'Notifikasi WA/Telegram','included' => true],
                ],
            ],
            [
                'name'         => 'Business',
                'slug'         => 'business',
                'price'        => 250000,
                'price_label'  => 'Rp250K',
                'color'        => 'orange',
                'border_color' => 'border-orange-500',
                'button_color' => 'orange',
                'is_popular'   => false,
                'sort_order'   => 4,
                'button_text'  => 'Checkout',
                'is_active'    => true,
                'features'     => [
                    ['label' => '20 Device',             'included' => true],
                    ['label' => '25 Sensor/device',      'included' => true],
                    ['label' => '25 Grafik/device',      'included' => true],
                    ['label' => 'Notifikasi WA/Telegram','included' => true],
                ],
            ],
        ];

        foreach ($packages as $package) {
            PricingPackage::create($package);
        }
    }
}
