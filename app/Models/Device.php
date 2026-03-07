<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'device_code',
        'api_key',
        'location',
        'description',
        'status',
        'activated_at',
    ];

    protected $casts = [
        'activated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the device
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get subscriptions for this device
     */
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Get active subscription
     */
    public function activeSubscription()
    {
        return $this->hasOne(Subscription::class)
            ->where('status', 'active')
            ->where('end_date', '>', now())
            ->latest();
    }
}
