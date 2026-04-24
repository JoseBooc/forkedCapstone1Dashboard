<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventRegistration extends Model
{
    protected $fillable = [
        'engagement_event_id',
        'first_name',
        'last_name',
        'email',
        'is_guest',
        'guest_count',
        'fee_amount',
        'payment_status',
    ];

    protected $casts = [
        'is_guest' => 'boolean',
        'guest_count' => 'integer',
        'fee_amount' => 'decimal:2',
    ];

    public function event()
    {
        return $this->belongsTo(EngagementEvent::class, 'engagement_event_id');
    }

    public function attendance()
    {
        return $this->hasOne(Attendance::class, 'event_registration_id');
    }

    public function payment()
    {
        return $this->hasOne(EventPayment::class, 'event_registration_id');
    }
}