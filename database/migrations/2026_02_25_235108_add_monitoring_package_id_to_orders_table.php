<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('monitoring_package_id')->nullable()->after('subscription_id')->constrained()->onDelete('cascade');
            $table->foreignId('subscription_id')->nullable()->change();
            $table->enum('status', ['pending', 'approved', 'rejected', 'paid', 'cancelled'])->default('pending')->change();
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['monitoring_package_id']);
            $table->dropColumn('monitoring_package_id');
        });
    }
};
