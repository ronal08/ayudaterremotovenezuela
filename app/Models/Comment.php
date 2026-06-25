<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = [
        'person_id',
        'author_name',
        'author_phone',
        'content',
    ];

    public function person()
    {
        return $this->belongsTo(Person::class);
    }
}
