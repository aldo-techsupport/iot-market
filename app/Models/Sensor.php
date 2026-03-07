<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sensor extends Model
{
    protected $fillable = [
        'name',
        'code',
        'description',
        'price',
        'unit',
        'icon',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Get subscriptions that use this sensor
     */
    public function subscriptionSensors()
    {
        return $this->hasMany(SubscriptionSensor::class);
    }
}
