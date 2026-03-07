<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PricingPackage extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'price',
        'price_label',
        'color',
        'border_color',
        'button_color',
        'is_popular',
        'sort_order',
        'max_devices',
        'max_sensors',
        'features',
        'button_text',
        'is_active',
    ];

    protected $casts = [
        'price'      => 'decimal:2',
        'is_popular' => 'boolean',
        'is_active'  => 'boolean',
        'sort_order' => 'integer',
        'max_devices' => 'integer',
        'max_sensors' => 'integer',
        'features'   => 'array',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }
}
