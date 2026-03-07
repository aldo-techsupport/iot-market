<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'subscription_id',
        'monitoring_package_id',
        'device_id',
        'order_number',
        'device_name',
        'device_location',
        'device_description',
        'total_amount',
        'status',
        'payment_method',
        'paid_at',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    /**
     * Get the user that owns the order
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the subscription
     */
    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }

    /**
     * Get the monitoring package
     */
    public function package()
    {
        return $this->belongsTo(MonitoringPackage::class, 'monitoring_package_id');
    }

    /**
     * Get the device for this order
     */
    public function device()
    {
        return $this->belongsTo(Device::class);
    }

    /**
     * Get the sensors for this order
     */
    public function sensors()
    {
        return $this->belongsToMany(Sensor::class, 'order_sensors')
            ->withPivot(['variable_name', 'custom_name', 'unit', 'price'])
            ->withTimestamps();
    }

    /**
     * Generate order number
     */
    public static function generateOrderNumber(): string
    {
        return 'ORD-' . date('Ymd') . '-' . str_pad(self::whereDate('created_at', today())->count() + 1, 4, '0', STR_PAD_LEFT);
    }
}
