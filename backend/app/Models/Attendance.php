<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'engagement_event_id',
        'event_registration_id',
        'attendee_name',
        'attendee_email',
        'attended',
        'attended_at',
    ];

    protected $casts = [
        'attended' => 'boolean',
        'attended_at' => 'datetime',
    ];

    public function event()
    {
        return $this->belongsTo(EngagementEvent::class, 'engagement_event_id');
    }

    public function registration()
    {
        return $this->belongsTo(EventRegistration::class, 'event_registration_id');
    }
}