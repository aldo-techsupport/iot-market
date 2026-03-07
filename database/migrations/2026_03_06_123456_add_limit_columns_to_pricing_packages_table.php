<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pricing_packages', function (Blueprint $table) {
            $table->integer('max_devices')->default(1)->after('price_label');
            $table->integer('max_sensors')->default(5)->after('max_devices');
        });
    }

    public function down(): void
    {
        Schema::table('pricing_packages', function (Blueprint $table) {
            $table->dropColumn(['max_devices', 'max_sensors']);
        });
    }
};
