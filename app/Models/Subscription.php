<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $fillable = [
        'user_id',
        'device_id',
        'monitoring_package_id',
        'total_price',
        'status',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'total_price' => 'decimal:2',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    /**
     * Get the user that owns the subscription
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the device for this subscription
     */
    public function device()
    {
        return $this->belongsTo(Device::class);
    }

    /**
     * Get the monitoring package
     */
    public function package()
    {
        return $this->belongsTo(MonitoringPackage::class, 'monitoring_package_id');
    }

    /**
     * Get sensors for this subscription
     */
    public function sensors()
    {
        return $this->hasMany(SubscriptionSensor::class);
    }

    /**
     * Get orders for this subscription
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Check if subscription is active
     */
    public function isActive(): bool
    {
        return $this->status === 'active' 
            && $this->end_date 
            && $this->end_date->isFuture();
    }

    /**
     * Check if subscription is expired
     */
    public function isExpired(): bool
    {
        if ($this->status === 'expired') return true;
        return $this->end_date && $this->end_date->isPast();
    }

    /**
     * Get days remaining until expiry (0 if already expired)
     */
    public function daysRemaining(): int
    {
        if (!$this->end_date) return 0;
        if ($this->end_date->isPast()) return 0;
        return (int) now()->diffInDays($this->end_date);
    }

    /**
     * Get expiry status string for frontend
     */
    public function expiryStatus(): string
    {
        if ($this->isExpired()) return 'expired';
        $days = $this->daysRemaining();
        if ($days <= 7)  return 'critical';
        if ($days <= 30) return 'warning';
        return 'active';
    }
}
