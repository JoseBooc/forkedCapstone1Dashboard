<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventRegistration extends Model
{
    protected $fillable = [
        'event_id',
        'user_id',
        'status',
        'notes',
        'dietary_requirements',
        'special_needs',
        'number_of_guests',
        'guest_details',
        'approved_by',
        'approved_at',
        'cancelled_at',
        'cancellation_reason',
        'attended',
        'checked_in_at',
        'reminder_sent',
        'reminder_sent_at',
    ];

    protected $casts = [
        'guest_details' => 'array',
        'number_of_guests' => 'integer',
        'approved_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'checked_in_at' => 'datetime',
        'reminder_sent_at' => 'datetime',
        'attended' => 'boolean',
        'reminder_sent' => 'boolean',
    ];

    protected $appends = ['is_confirmed', 'is_cancelled'];

    /**
     * Relationships
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Computed Attributes
     */
    public function getIsConfirmedAttribute(): bool
    {
        return $this->status === 'confirmed';
    }

    public function getIsCancelledAttribute(): bool
    {
        return $this->status === 'cancelled';
    }

    /**
     * Scopes
     */
    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeAttended($query)
    {
        return $query->where('attended', true);
    }

    /**
     * Helper Methods
     */
    public function confirm(): void
    {
        $this->update(['status' => 'confirmed']);
        $this->event->incrementParticipants();
    }

    public function cancel(string $reason = null): void
    {
        $this->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $reason,
        ]);

        $this->event->decrementParticipants();
    }

    public function checkIn(): void
    {
        $this->update([
            'attended' => true,
            'checked_in_at' => now(),
        ]);
    }
}
