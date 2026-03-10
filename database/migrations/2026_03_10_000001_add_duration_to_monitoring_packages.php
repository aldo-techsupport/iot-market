<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('monitoring_packages', function (Blueprint $table) {
            $table->integer('duration_months')->default(1)->after('max_sensors');
        });

        // Set default duration for existing packages
        DB::table('monitoring_packages')->update(['duration_months' => 1]);
    }

    public function down(): void
    {
        Schema::table('monitoring_packages', function (Blueprint $table) {
            $table->dropColumn('duration_months');
        });
    }
};
