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
        Schema::table('sensors', function (Blueprint $table) {
            // Check if columns don't exist before adding
            if (!Schema::hasColumn('sensors', 'variable_suggestion')) {
                $table->string('variable_suggestion', 10)->nullable()->after('unit')->comment('Suggested variable name (V1-V20)');
            }
            if (!Schema::hasColumn('sensors', 'category')) {
                $table->string('category', 50)->nullable()->after('variable_suggestion')->comment('Sensor category');
            }
            // icon already exists, skip it
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sensors', function (Blueprint $table) {
            if (Schema::hasColumn('sensors', 'variable_suggestion')) {
                $table->dropColumn('variable_suggestion');
            }
            if (Schema::hasColumn('sensors', 'category')) {
                $table->dropColumn('category');
            }
        });
    }
};
