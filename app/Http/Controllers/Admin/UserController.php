<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Device;
use App\Models\Order;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $users = User::where('role', 'user')
            ->when($search, fn($q) => $q->where(fn($q2) =>
                $q2->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
            ))
            ->withCount(['devices', 'orders'])
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return inertia('admin/users/index', [
            'users'  => $users,
            'search' => $search,
        ]);
    }

    public function show($id)
    {
        $user = User::withCount(['devices', 'orders'])->findOrFail($id);

        $devices = Device::where('user_id', $id)
            ->with(['subscriptions' => fn($q) => $q->latest()])
            ->latest()
            ->get()
            ->map(function ($device) {
                $sub = $device->subscriptions->first();
                return [
                    'id'           => $device->id,
                    'name'         => $device->name,
                    'device_code'  => $device->device_code,
                    'location'     => $device->location,
                    'status'       => $device->status,
                    'activated_at' => $device->activated_at?->toDateString(),
                    'subscription' => $sub ? [
                        'id'             => $sub->id,
                        'status'         => $sub->status,
                        'start_date'     => $sub->start_date?->toDateString(),
                        'end_date'       => $sub->end_date?->toDateString(),
                        'days_remaining' => $sub->daysRemaining(),
                        'expiry_status'  => $sub->expiryStatus(),
                        'is_expired'     => $sub->isExpired(),
                    ] : null,
                ];
            });

        $orders = Order::where('user_id', $id)
            ->with(['sensors'])
            ->latest()
            ->take(10)
            ->get();

        return inertia('admin/users/show', [
            'user'    => $user,
            'devices' => $devices,
            'orders'  => $orders,
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:8',
        ]);

        $updateData = [
            'name'  => $validated['name'],
            'email' => $validated['email'],
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        return back()->with('success', 'Data user berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->role === 'admin') {
            return back()->with('error', 'Tidak dapat menghapus akun admin!');
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User berhasil dihapus!');
    }
}
