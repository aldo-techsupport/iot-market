<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabel untuk sensor yang tersedia
        Schema::create('sensors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2); // Harga per bulan
            $table->string('unit')->nullable(); // Unit pengukuran (°C, %, ppm, dll)
            $table->string('icon')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Tabel untuk paket monitoring
        Schema::create('monitoring_packages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('base_price', 10, 2);
            $table->integer('max_sensors')->default(10);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Tabel untuk device/alat monitoring user
        Schema::create('devices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('device_code')->unique();
            $table->string('location')->nullable();
            $table->enum('status', ['active', 'inactive', 'pending'])->default('pending');
            $table->timestamp('activated_at')->nullable();
            $table->timestamps();
        });

        // Tabel untuk subscription user
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('device_id')->constrained()->onDelete('cascade');
            $table->foreignId('monitoring_package_id')->constrained()->onDelete('cascade');
            $table->decimal('total_price', 10, 2);
            $table->enum('status', ['pending', 'active', 'expired', 'cancelled'])->default('pending');
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->timestamps();
        });

        // Tabel untuk sensor yang dipilih dalam subscription
        Schema::create('subscription_sensors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscription_id')->constrained()->onDelete('cascade');
            $table->foreignId('sensor_id')->constrained()->onDelete('cascade');
            $table->decimal('price', 10, 2); // Harga saat order
            $table->timestamps();
        });

        // Tabel untuk data sensor (monitoring data)
        Schema::create('sensor_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained()->onDelete('cascade');
            $table->foreignId('sensor_id')->constrained()->onDelete('cascade');
            $table->decimal('value', 10, 2);
            $table->string('unit')->nullable();
            $table->timestamp('recorded_at');
            $table->timestamps();
            
            $table->index(['device_id', 'sensor_id', 'recorded_at']);
        });

        // Tabel untuk orders
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('subscription_id')->constrained()->onDelete('cascade');
            $table->string('order_number')->unique();
            $table->decimal('total_amount', 10, 2);
            $table->enum('status', ['pending', 'paid', 'cancelled'])->default('pending');
            $table->enum('payment_method', ['bank_transfer', 'credit_card', 'ewallet'])->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
        Schema::dropIfExists('sensor_data');
        Schema::dropIfExists('subscription_sensors');
        Schema::dropIfExists('subscriptions');
        Schema::dropIfExists('devices');
        Schema::dropIfExists('monitoring_packages');
        Schema::dropIfExists('sensors');
    }
};
