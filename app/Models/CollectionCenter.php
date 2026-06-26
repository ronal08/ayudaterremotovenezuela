<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CollectionCenter extends Model
{
    protected $table = 'collection_centers';

    protected $fillable = [
        'name',
        'address',
        'state',
        'municipality',
        'contact_name',
        'contact_phone',
        'location_url',
        'photo_path',
        'needs',
        'status',
        'is_verified',
        'security_pin',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
    ];

    protected $appends = ['photo_url'];

    public function getPhotoUrlAttribute()
    {
        return $this->photo_path ? asset('storage/' . $this->photo_path) : null;
    }
}
