<?php

use App\Http\Controllers\Admin\LandingPageController;
use App\Http\Controllers\Admin\MemberAreaEditorController;
use App\Http\Controllers\Admin\PricingController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\DeviceController;
use App\Http\Controllers\MemberAreaController;
use App\Models\LandingPage;
use App\Models\MemberAreaSetting;
use App\Models\PricingPackage;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::get('/', function () {
    $sections = LandingPage::where('is_active', true)->get()->keyBy('section');
    
    return inertia('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'landingData' => $sections,
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Member Area - halaman produk, subscription, dan pembelian
    Route::get('memberarea', function () {
        $packages = PricingPackage::active()->get();
        $settings = MemberAreaSetting::getSetting();
        return inertia('memberarea', [
            'user'     => auth()->user(),
            'packages' => $packages,
            'settings' => $settings,
        ]);
    })->name('member.area');
    
    // Checkout - konfirmasi pembayaran paket
    Route::get('memberarea/checkout', [MemberAreaController::class, 'checkout'])->name('member.checkout');
    Route::post('memberarea/create-order', [MemberAreaController::class, 'createOrder'])->name('member.create-order');
    
    // Device setup - hanya bisa diakses setelah order approved
    Route::get('memberarea/device-setup', [MemberAreaController::class, 'setupDevice'])->name('member.device-setup');
    Route::post('memberarea/save-device', [MemberAreaController::class, 'saveDeviceSetup'])->name('member.save-device');
    Route::get('memberarea/orders', [MemberAreaController::class, 'orders'])->name('member.orders');
    Route::get('memberarea/order/{id}', [MemberAreaController::class, 'showOrder'])->name('member.order.show');
    
    // Dashboard Monitoring - per device (oleh device ID lokal)
    Route::get('dashboard/monitoring/{id}', [MemberAreaController::class, 'monitoringDevice'])->name('dashboard.monitoring.device');
    Route::get('dashboard/monitoring/{id}/log', [MemberAreaController::class, 'monitoringLog'])->name('dashboard.monitoring.log');
    // Dashboard Monitoring - fallback ke device terbaru
    Route::get('dashboard/monitoring', [MemberAreaController::class, 'monitoring'])->name('dashboard.monitoring');
    Route::get('api/sensor-data', [MemberAreaController::class, 'getSensorData'])->name('api.sensor-data');
    Route::get('api/sensor-history', [MemberAreaController::class, 'getSensorHistory'])->name('api.sensor-history');

    // Device management (Kelola Perangkat)
    Route::put('dashboard/devices/{id}', [MemberAreaController::class, 'updateDevice'])->name('dashboard.device.update');
    Route::delete('dashboard/devices/{id}', [MemberAreaController::class, 'deleteDevice'])->name('dashboard.device.delete');
    
    // User Dashboard - show dashboard with device list
    Route::get('dashboard', [MemberAreaController::class, 'userDashboard'])->name('dashboard');
});

// Admin routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    
    // Orders Management
    Route::get('orders', [\App\Http\Controllers\Admin\OrderController::class, 'index'])->name('orders.index');
    Route::get('orders/{id}', [\App\Http\Controllers\Admin\OrderController::class, 'show'])->name('orders.show');
    Route::post('orders/{id}/approve', [\App\Http\Controllers\Admin\OrderController::class, 'approve'])->name('orders.approve');
    Route::post('orders/{id}/reject', [\App\Http\Controllers\Admin\OrderController::class, 'reject'])->name('orders.reject');
    
    // Landing Page Management
    Route::get('landing-page', [LandingPageController::class, 'index'])->name('landing-page.index');
    Route::get('landing-page/visual-editor', [MemberAreaEditorController::class, 'landingEditor'])->name('landing-page.visual-editor');
    Route::get('landing-page/{id}/edit', [LandingPageController::class, 'edit'])->name('landing-page.edit');
    Route::put('landing-page/{id}', [LandingPageController::class, 'update'])->name('landing-page.update');
    Route::post('landing-page/upload-image', [LandingPageController::class, 'uploadImage'])->name('landing-page.upload-image');

    // Member Area Editor
    Route::get('member-area/editor', [MemberAreaEditorController::class, 'editor'])->name('member-area.editor');
    Route::post('member-area/save-settings', [MemberAreaEditorController::class, 'saveSettings'])->name('member-area.save-settings');

    // Pricing Package Management
    Route::get('pricing', [PricingController::class, 'index'])->name('pricing.index');
    Route::get('pricing/create', [PricingController::class, 'create'])->name('pricing.create');
    Route::post('pricing', [PricingController::class, 'store'])->name('pricing.store');
    Route::get('pricing/{id}/edit', [PricingController::class, 'edit'])->name('pricing.edit');
    Route::put('pricing/{id}', [PricingController::class, 'update'])->name('pricing.update');
    Route::patch('pricing/{id}/toggle', [PricingController::class, 'toggleActive'])->name('pricing.toggle');
    Route::delete('pricing/{id}', [PricingController::class, 'destroy'])->name('pricing.destroy');

    // User Management
    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::get('users/{id}', [UserController::class, 'show'])->name('users.show');
    Route::put('users/{id}', [UserController::class, 'update'])->name('users.update');
    Route::delete('users/{id}', [UserController::class, 'destroy'])->name('users.destroy');

    // Device Management
    Route::get('devices', [DeviceController::class, 'index'])->name('devices.index');
    Route::get('devices/{id}', [DeviceController::class, 'show'])->name('devices.show');
    Route::put('devices/{id}', [DeviceController::class, 'update'])->name('devices.update');
    Route::put('devices/{id}/subscription', [DeviceController::class, 'updateSubscription'])->name('devices.subscription.update');
    Route::put('devices/{deviceId}/sensors/{sensorId}', [DeviceController::class, 'updateSensor'])->name('devices.sensor.update');
    Route::delete('devices/{id}', [DeviceController::class, 'destroy'])->name('devices.destroy');
});

require __DIR__.'/settings.php';
