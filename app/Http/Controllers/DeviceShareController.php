<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Models\DeviceShare;
use App\Models\User;
use App\Notifications\DeviceInviteNotification;
use Illuminate\Http\Request;

class DeviceShareController extends Controller
{
    /**
     * Invite a user to a device by their unique ID
     */
    public function inviteUser(Request $request, $deviceId)
    {
        $request->validate([
            'unique_id' => 'required|string|size:9',
        ]);

        $device = Device::where('id', $deviceId)->where('user_id', auth()->id())->firstOrFail();

        $invitedUser = User::where('unique_id', $request->unique_id)->first();

        if (!$invitedUser) {
            return response()->json(['success' => false, 'message' => 'User dengan ID tersebut tidak ditemukan.']);
        }

        if ($invitedUser->id === auth()->id()) {
            return response()->json(['success' => false, 'message' => 'Anda tidak bisa menambahkan diri Anda sendiri.']);
        }

        // Check if already shared/pending
        $existingShare = DeviceShare::where('device_id', $device->id)
            ->where('user_id', $invitedUser->id)
            ->first();

        if ($existingShare) {
            if ($existingShare->status === 'accepted') {
                return response()->json(['success' => false, 'message' => 'User ini sudah memiliki akses ke perangkat.']);
            }
            if ($existingShare->status === 'pending') {
                // Regenerate token and send notification again
                $token = str_pad(mt_rand(0, 999999), 6, '0', STR_PAD_LEFT);
                $existingShare->update(['token' => $token]);
                $invitedUser->notify(new DeviceInviteNotification($existingShare));
                
                return response()->json([
                    'success' => true, 
                    'share_id' => $existingShare->id,
                    'message' => "Undangan dikirim ulang. Silakan minta kode OTP dari user tersebut dan masukkan di bawah ini."
                ]);
            }
            
            // if rejected, we can resend by deleting it
            $existingShare->delete();
        }

        // Generate 6 digit pin
        $token = str_pad(mt_rand(0, 999999), 6, '0', STR_PAD_LEFT);

        $share = DeviceShare::create([
            'device_id' => $device->id,
            'inviter_id' => auth()->id(),
            'user_id' => $invitedUser->id,
            'token' => $token,
            'status' => 'pending',
        ]);

        // Notify invited user
        $invitedUser->notify(new DeviceInviteNotification($share));

        return response()->json([
            'success' => true, 
            'share_id' => $share->id,
            'message' => "Undangan berhasil dikirim. Silakan minta kode (OTP) dari Notifikasi user tersebut dan masukkan di bawah ini."
        ]);
    }

    /**
     * Accept a device invitation (Verified by Owner)
     */
    public function acceptInvite(Request $request)
    {
        $request->validate([
            'share_id' => 'required|exists:device_shares,id',
            'token' => 'required|string|size:6',
        ]);

        // Owner is the one verifying the OTP!
        $share = DeviceShare::where('id', $request->share_id)
            ->where('inviter_id', auth()->id())
            ->where('status', 'pending')
            ->first();

        if (!$share) {
            return response()->json(['success' => false, 'message' => 'Undangan tidak valid atau sudah kedaluwarsa.']);
        }

        if ($share->token !== $request->token) {
            return response()->json(['success' => false, 'message' => 'Kode verifikasi (OTP) tidak valid.']);
        }

        $share->update([
            'status' => 'accepted',
            'token' => null, // clear token after use
        ]);

        // Mark related notification as read for the INVITED user
        $share->user->notifications()
            ->where('data->share_id', $share->id)
            ->get()
            ->markAsRead();

        return response()->json(['success' => true, 'message' => 'Berhasil memberikan akses perangkat ke user!']);
    }

    /**
     * Mark a generic notification as read
     */
    public function markNotificationRead($id)
    {
        $notification = auth()->user()->notifications()->find($id);
        if ($notification) {
            $notification->markAsRead();
        }
        return response()->json(['success' => true]);
    }

    /**
     * Clear all notifications
     */
    public function clearAllNotifications()
    {
        auth()->user()->notifications()->delete();
        return response()->json(['success' => true, 'message' => 'Semua notifikasi berhasil dihapus.']);
    }

    public function managePage($id)
    {
        $device = Device::with(['shares.user' => function($q) {
            $q->select('id', 'name', 'email');
        }])->findOrFail($id);

        if ($device->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        return inertia('user/manage-share', [
            'device' => $device
        ]);
    }

    /**
     * Hapus akses device (dari sisi owner atau user yang dishare)
     */
    public function removeShare($id)
    {
        // $id is the share_id in this context if called by owner, 
        // OR it's a device_id if called from the "Hapus Sharing" button on dashboard for a shared device.
        $userId = auth()->id();
        
        // Cek dulu apakah $id adalah ID dari DeviceShare
        $share = DeviceShare::find($id);

        if ($share) {
            // Ini dipanggil oleh owner dari modal "Kelola Sharing"
            $device = Device::findOrFail($share->device_id);
            if ($device->user_id !== $userId) {
                abort(403, 'Unauthorized action.');
            }
            $share->delete();
            return redirect()->back()->with('success', 'Akses pengguna ke perangkat berhasil dihapus.');
        } else {
            // Berarti $id adalah Device ID, dipanggil dari "Hapus Sharing" di card device
            $device = Device::findOrFail($id);
            if ($device->user_id === $userId) {
                // Owner membatalkan semua share ke device ini - (opsional, jika dipanggil dari luar modal)
                $device->shares()->delete();
                return redirect()->back()->with('success', 'Semua akses perangkat berhasil dihapus.');
            } else {
                // User membatalkan akses dirinya sendiri
                $device->shares()->where('user_id', $userId)->delete();
                return redirect()->route('dashboard')->with('success', 'Perangkat berhasil dihapus dari daftar Anda.');
            }
        }
    }
}
