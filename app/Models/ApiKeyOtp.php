<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApiKeyOtp extends Model
{
    protected $fillable = [
        'user_id',
        'device_id',
        'otp_code',
        'expires_at',
        'used_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used_at'    => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }

    /**
     * OTP masih valid (belum expired dan belum dipakai)
     */
    public function isValid(): bool
    {
        return $this->used_at === null
            && $this->expires_at->isFuture();
    }

    /**
     * Tandai OTP sudah dipakai
     */
    public function markUsed(): void
    {
        $this->update(['used_at' => now()]);
    }
}
