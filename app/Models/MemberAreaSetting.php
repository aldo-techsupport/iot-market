<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MemberAreaSetting extends Model
{
    protected $table = 'member_area_settings';

    protected $fillable = [
        'hero_badge_text',
        'hero_title',
        'hero_subtitle',
        'hero_cta_text',
        'features_title',
        'features_subtitle',
        'feature_1_title',
        'feature_1_desc',
        'feature_2_title',
        'feature_2_desc',
        'feature_3_title',
        'feature_3_desc',
        'pricing_title',
        'pricing_subtitle',
        'cta_title',
        'cta_subtitle',
        'cta_button_text',
        'footer_text',
        'show_features',
        'show_cta',
    ];

    protected $casts = [
        'show_features' => 'boolean',
        'show_cta'      => 'boolean',
    ];

    /**
     * Get the single settings row (singleton pattern).
     */
    public static function getSetting(): self
    {
        return static::firstOrCreate([], [
            'hero_badge_text'   => '🚀 Mulai Monitoring IoT Anda Sekarang',
            'hero_title'        => 'Monitor Perangkat IoT Anda Secara Real-Time',
            'hero_subtitle'     => 'Platform monitoring IoT terlengkap dengan 36+ sensor, real-time data, dan dashboard interaktif.',
            'hero_cta_text'     => 'Lihat Paket',
            'features_title'    => 'Kenapa Pilih Kami?',
            'features_subtitle' => 'Fitur lengkap untuk monitoring IoT profesional',
            'feature_1_title'   => 'Real-Time Monitoring',
            'feature_1_desc'    => 'Data sensor diupdate setiap detik.',
            'feature_2_title'   => '36+ Sensor Support',
            'feature_2_desc'    => 'Dari suhu, kelembaban, listrik, hingga deteksi api.',
            'feature_3_title'   => 'Aman & Terpercaya',
            'feature_3_desc'    => 'Data terenkripsi dan backup otomatis.',
            'pricing_title'     => 'Paket Monitoring',
            'pricing_subtitle'  => 'Pilih paket yang sesuai dengan kebutuhan monitoring Anda',
            'cta_title'         => 'Siap Mulai Monitoring?',
            'cta_subtitle'      => 'Setup device Anda dan pilih sensor yang ingin dimonitor',
            'cta_button_text'   => 'Lihat Paket',
            'footer_text'       => '© ' . date('Y') . ' IoT Monitoring Platform. All rights reserved.',
            'show_features'     => true,
            'show_cta'          => true,
        ]);
    }
}
