<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('order_sensors', function (Blueprint $table) {
            $table->string('variable_name')->after('sensor_id')->nullable();
            $table->string('custom_name')->after('variable_name')->nullable();
            $table->string('unit')->after('custom_name')->nullable();
            $table->decimal('price', 10, 2)->after('unit')->default(0);
        });
    }

    public function down(): void
    {
        Schema::table('order_sensors', function (Blueprint $table) {
            $table->dropColumn(['variable_name', 'custom_name', 'unit', 'price']);
        });
    }
};
