<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Volunteer extends Model
{
    protected $table = 'volunteers';

    protected $fillable = [
        'name',
        'phone',
        'vehicle_type',
        'vehicle_model',
        'state',
        'municipality',
        'notes',
        'status',
        'is_verified',
        'security_pin',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
    ];
}
