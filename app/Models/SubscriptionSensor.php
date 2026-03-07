<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubscriptionSensor extends Model
{
    protected $fillable = [
        'subscription_id',
        'sensor_id',
        'variable_name',  // V2: V1-V20
        'custom_name',    // V2: Custom sensor name
        'unit',           // V2: Measurement unit
        'price',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    /**
     * Get the subscription
     */
    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }

    /**
     * Get the sensor (V1 - backward compatibility)
     */
    public function sensor()
    {
        return $this->belongsTo(Sensor::class);
    }

    /**
     * Check if this is V2 format (using variable_name)
     */
    public function isV2(): bool
    {
        return !empty($this->variable_name);
    }

    /**
     * Get display name (V2 custom_name or V1 sensor name)
     */
    public function getDisplayNameAttribute(): string
    {
        if ($this->isV2()) {
            return $this->custom_name ?? $this->variable_name;
        }
        
        return $this->sensor?->name ?? 'Unknown Sensor';
    }

    /**
     * Get display unit (V2 unit or V1 sensor unit)
     */
    public function getDisplayUnitAttribute(): ?string
    {
        if ($this->isV2()) {
            return $this->unit;
        }
        
        return $this->sensor?->unit ?? null;
    }

    /**
     * Format for IoT API V2
     */
    public function toIoTApiFormat(): array
    {
        if ($this->isV2()) {
            return [
                'variable' => $this->variable_name,
                'custom_name' => $this->custom_name,
                'unit' => $this->unit,
            ];
        }
        
        // V1 backward compatibility - map to V2 format
        // This should be handled during migration
        return [
            'variable' => 'V1', // Default, should be properly mapped
            'custom_name' => $this->sensor?->name ?? 'Sensor',
            'unit' => $this->sensor?->unit ?? '',
        ];
    }
}
