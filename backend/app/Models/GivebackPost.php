<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GivebackPost extends Model
{
    protected $fillable = [
        'title',
        'excerpt',
        'content',
        'category',
        'image_url',
        'is_archived',
    ];

    protected $casts = [
        'is_archived' => 'boolean',
    ];
}
