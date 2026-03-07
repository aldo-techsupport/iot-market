<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pricing_packages', function (Blueprint $table) {
            $table->id();
            $table->string('name');              // Nama paket: Free, Starter, Pro, Business
            $table->string('slug')->unique();    // free, starter, pro, business
            $table->decimal('price', 10, 2)->default(0); // Harga (0 = gratis)
            $table->string('price_label')->nullable();   // Label harga: "Gratis", "Rp70K", dll
            $table->string('color')->default('green');   // Tema warna: green, blue, purple, orange
            $table->string('border_color')->nullable();  // CSS border color class
            $table->string('button_color')->nullable();  // CSS button color class
            $table->boolean('is_popular')->default(false); // Badge "Popular"
            $table->integer('sort_order')->default(0);   // Urutan tampil
            $table->json('features');            // Array fitur: [{label, included}]
            $table->string('button_text')->default('Checkout'); // Teks tombol
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pricing_packages');
    }
};
