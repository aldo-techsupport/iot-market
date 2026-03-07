<?php

namespace Database\Seeders;

use App\Models\LandingPage;
use Illuminate\Database\Seeder;

class LandingPageSeeder extends Seeder
{
    public function run(): void
    {
        $sections = [
            [
                'section' => 'hero',
                'content' => [
                    'title' => 'Smart Home & IoT Solutions',
                    'subtitle' => 'Transform your home into an intelligent living space with our cutting-edge IoT technology. Control, monitor, and automate your home devices from anywhere.',
                    'primary_button_text' => 'Get Started',
                    'primary_button_url' => '/register',
                    'secondary_button_text' => 'Learn More',
                    'secondary_button_url' => '/about',
                ],
                'is_active' => true,
            ],
            [
                'section' => 'features',
                'content' => [
                    'title' => 'Why Choose Our IoT Platform',
                    'subtitle' => 'Powerful features for modern smart homes',
                    'items' => [
                        [
                            'title' => 'Real-time Monitoring',
                            'description' => 'Monitor all your smart devices in real-time from a single dashboard',
                            'icon' => 'monitor',
                        ],
                        [
                            'title' => 'Automation',
                            'description' => 'Create custom automation rules to make your home truly smart',
                            'icon' => 'automation',
                        ],
                        [
                            'title' => 'Energy Efficiency',
                            'description' => 'Track and optimize your energy consumption to save costs',
                            'icon' => 'energy',
                        ],
                        [
                            'title' => 'Security',
                            'description' => 'Enterprise-grade security to protect your home and data',
                            'icon' => 'security',
                        ],
                        [
                            'title' => 'Voice Control',
                            'description' => 'Control your devices with voice commands via Alexa or Google',
                            'icon' => 'voice',
                        ],
                        [
                            'title' => '24/7 Support',
                            'description' => 'Our team is always ready to help you with any issues',
                            'icon' => 'support',
                        ],
                    ],
                ],
                'is_active' => true,
            ],
            [
                'section' => 'about',
                'content' => [
                    'title' => 'About Our Platform',
                    'description' => 'We are dedicated to making smart home technology accessible to everyone. Our IoT platform connects all your devices seamlessly, providing you with complete control and peace of mind.',
                    'image' => '/images/about.jpg',
                    'stats' => [
                        ['label' => 'Active Users', 'value' => '10,000+'],
                        ['label' => 'Connected Devices', 'value' => '50,000+'],
                        ['label' => 'Countries', 'value' => '25+'],
                    ],
                ],
                'is_active' => true,
            ],
        ];

        foreach ($sections as $section) {
            LandingPage::create($section);
        }
    }
}
