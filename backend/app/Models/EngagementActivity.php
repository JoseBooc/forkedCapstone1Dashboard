<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EngagementActivity extends Model
{
    protected $fillable = [
        'title',
        'description',
        'venue',
        'schedule_start',
        'schedule_end',
        'registration_open',
        'participant_limit',
        'fee_amount',
        'status',
        'image_url',
        'created_by_name',
        'is_archived',
    ];

    protected $casts = [
        'schedule_start' => 'datetime',
        'schedule_end' => 'datetime',
        'registration_open' => 'boolean',
        'participant_limit' => 'integer',
        'fee_amount' => 'decimal:2',
        'is_archived' => 'boolean',
    ];

    public function registrations()
    {
        return $this->hasMany(EngagementRegistration::class, 'activity_id');
    }
}
