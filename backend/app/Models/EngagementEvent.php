<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EngagementEvent extends Model
{
    protected $table = 'events';

    protected $fillable = [
        'category_id',
        'title',
        'description',
        'location',
        'start_date',
        'end_date',
        'max_participants',
        'is_active',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'max_participants' => 'integer',
        'is_active' => 'boolean',
    ];

    public function registrations()
    {
        return $this->hasMany(EventRegistration::class, 'engagement_event_id');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'engagement_event_id');
    }

    public function payments()
    {
        return $this->hasMany(EventPayment::class, 'engagement_event_id');
    }
}