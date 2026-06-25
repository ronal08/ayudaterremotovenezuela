<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Person extends Model
{
    protected $table = 'people';

    protected $fillable = [
        'first_name',
        'last_name',
        'age',
        'gender',
        'last_seen_location',
        'last_seen_at',
        'distinctive_features',
        'photo_path',
        'status',
        'reporter_name',
        'reporter_phone',
        'reporter_email',
        'reporter_relationship',
        'show_reporter_info',
        'security_pin',
        'is_verified',
    ];

    protected $casts = [
        'last_seen_at' => 'datetime',
        'show_reporter_info' => 'boolean',
        'is_verified' => 'boolean',
    ];

    protected $appends = ['photo_url', 'full_name'];

    public function comments()
    {
        return $this->hasMany(Comment::class)->orderBy('created_at', 'desc');
    }

    public function getPhotoUrlAttribute()
    {
        return $this->photo_path ? asset('storage/' . $this->photo_path) : null;
    }

    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }
}
