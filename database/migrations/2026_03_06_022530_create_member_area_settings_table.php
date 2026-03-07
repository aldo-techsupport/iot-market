<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('member_area_settings', function (Blueprint $table) {
            $table->id();
            $table->string('hero_badge_text')->nullable();
            $table->text('hero_title')->nullable();
            $table->text('hero_subtitle')->nullable();
            $table->string('hero_cta_text')->nullable();
            $table->string('features_title')->nullable();
            $table->string('features_subtitle')->nullable();
            $table->string('feature_1_title')->nullable();
            $table->text('feature_1_desc')->nullable();
            $table->string('feature_2_title')->nullable();
            $table->text('feature_2_desc')->nullable();
            $table->string('feature_3_title')->nullable();
            $table->text('feature_3_desc')->nullable();
            $table->string('pricing_title')->nullable();
            $table->text('pricing_subtitle')->nullable();
            $table->string('cta_title')->nullable();
            $table->text('cta_subtitle')->nullable();
            $table->string('cta_button_text')->nullable();
            $table->text('footer_text')->nullable();
            $table->boolean('show_features')->default(true);
            $table->boolean('show_cta')->default(true);
            $table->timestamps();
        });

        // Insert default row
        DB::table('member_area_settings')->insert([
            'hero_badge_text'   => '🚀 Mulai Monitoring IoT Anda Sekarang',
            'hero_title'        => 'Monitor Perangkat IoT Anda Secara Real-Time',
            'hero_subtitle'     => 'Platform monitoring IoT terlengkap dengan 36+ sensor, real-time data, dan dashboard interaktif. Pantau suhu, kelembaban, listrik, mesin, dan banyak lagi dari mana saja!',
            'hero_cta_text'     => 'Lihat Paket',
            'features_title'    => 'Kenapa Pilih Kami?',
            'features_subtitle' => 'Fitur lengkap untuk monitoring IoT profesional',
            'feature_1_title'   => 'Real-Time Monitoring',
            'feature_1_desc'    => 'Data sensor diupdate setiap detik. Pantau perubahan secara langsung dengan grafik interaktif.',
            'feature_2_title'   => '36+ Sensor Support',
            'feature_2_desc'    => 'Dari suhu, kelembaban, listrik, hingga deteksi api. Pilih sensor sesuai kebutuhan Anda.',
            'feature_3_title'   => 'Aman & Terpercaya',
            'feature_3_desc'    => 'Data terenkripsi, API Key unik per device, dan backup otomatis untuk keamanan maksimal.',
            'pricing_title'     => 'Paket Monitoring',
            'pricing_subtitle'  => 'Pilih paket yang sesuai dengan kebutuhan monitoring Anda',
            'cta_title'         => 'Siap Mulai Monitoring?',
            'cta_subtitle'      => 'Setup device Anda dan pilih sensor yang ingin dimonitor',
            'cta_button_text'   => 'Lihat Paket',
            'footer_text'       => '© ' . date('Y') . ' IoT Monitoring Platform. All rights reserved.',
            'show_features'     => true,
            'show_cta'          => true,
            'created_at'        => now(),
            'updated_at'        => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('member_area_settings');
    }
};
