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
        'event_type',
        'category',
        'registration_start_at',
        'registration_end_at',
        'approval_status',
        'rejection_reason',
        'submitted_by_email',
        'posted_at',
    ];

    protected $casts = [
        'schedule_start' => 'datetime',
        'schedule_end' => 'datetime',
        'registration_open' => 'boolean',
        'participant_limit' => 'integer',
        'fee_amount' => 'decimal:2',
        'is_archived' => 'boolean',
        'registration_start_at' => 'datetime',
        'registration_end_at' => 'datetime',
        'posted_at' => 'datetime',
    ];

    public function registrations()
    {
        return $this->hasMany(EngagementRegistration::class, 'activity_id');
    }
}
