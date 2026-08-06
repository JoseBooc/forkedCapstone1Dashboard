<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GivebackProject extends Model
{
    protected $fillable = [
        'title',
        'description',
        'collaboration',
        'target_amount',
        'start_date',
        'end_date',
        'status',
        'image_url',
        'is_archived',
    ];

    protected $casts = [
        'target_amount' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'is_archived' => 'boolean',
    ];

    public function events()
    {
        return $this->hasMany(GivebackProjectEvent::class, 'project_id');
    }
}
