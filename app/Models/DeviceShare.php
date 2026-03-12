<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeviceShare extends Model
{
    protected $fillable = [
        'device_id',
        'inviter_id',
        'user_id',
        'token',
        'status',
    ];

    public function device()
    {
        return $this->belongsTo(Device::class);
    }

    public function inviter()
    {
        return $this->belongsTo(User::class, 'inviter_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
