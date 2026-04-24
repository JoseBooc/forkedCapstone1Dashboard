<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventPayment extends Model
{
    protected $fillable = [
        'engagement_event_id',
        'event_registration_id',
        'payer_name',
        'payer_email',
        'amount',
        'payment_method',
        'status',
        'paid_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'paid_at' => 'datetime',
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