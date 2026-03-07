<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\Device;
use App\Models\Subscription;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_users' => User::where('role', 'user')->count(),
            'total_devices' => Device::count(),
            'active_subscriptions' => Subscription::where('status', 'active')->count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'total_revenue' => Subscription::where('status', 'active')->sum('total_price'),
        ];

        $recentOrders = Order::with(['user', 'sensors'])
            ->latest()
            ->take(5)
            ->get();

        $recentUsers = User::where('role', 'user')
            ->latest()
            ->take(5)
            ->get();

        return inertia('admin/dashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'recentUsers' => $recentUsers,
        ]);
    }
}
