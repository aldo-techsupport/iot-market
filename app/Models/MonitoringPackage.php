<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MonitoringPackage extends Model
{
    protected $fillable = [
        'name',
        'description',
        'base_price',
        'max_sensors',
        'duration_months',
        'is_active',
    ];

    protected $casts = [
        'base_price'       => 'decimal:2',
        'max_sensors'      => 'integer',
        'duration_months'  => 'integer',
        'is_active'        => 'boolean',
    ];

    /**
     * Get subscriptions for this package
     */
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }
}
