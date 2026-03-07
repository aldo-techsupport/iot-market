<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('subscription_sensors', function (Blueprint $table) {
            // Add V2 columns
            $table->string('variable_name', 10)->nullable()->after('sensor_id')->comment('V1-V20 variable name');
            $table->string('custom_name')->nullable()->after('variable_name')->comment('Custom sensor name');
            $table->string('unit', 50)->nullable()->after('custom_name')->comment('Measurement unit');
            
            // Make sensor_id nullable for V2 compatibility
            $table->unsignedBigInteger('sensor_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscription_sensors', function (Blueprint $table) {
            $table->dropColumn(['variable_name', 'custom_name', 'unit']);
            
            // Restore sensor_id as required
            $table->unsignedBigInteger('sensor_id')->nullable(false)->change();
        });
    }
};
