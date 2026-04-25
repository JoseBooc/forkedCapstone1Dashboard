<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EngagementEvent extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'category',
        'event_group',
        'event_date',
        'start_time',
        'end_time',
        'location',
        'description',
        'image_url',
        'capacity',
        'participants_count',
        'guest_count',
        'registration_fee',
        'status',
        'posted_by',
    ];

    protected $casts = [
        'event_date' => 'date',
        'capacity' => 'integer',
        'participants_count' => 'integer',
        'guest_count' => 'integer',
        'registration_fee' => 'decimal:2',
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