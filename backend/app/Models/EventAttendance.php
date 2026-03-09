<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventAttendance extends Model
{
    protected $table = 'event_attendance';

    protected $fillable = [
        'event_id',
        'registration_id',
        'user_id',
        'checked_in_at',
        'checked_out_at',
        'checked_in_by',
        'attendance_type',
        'rating',
        'feedback',
        'feedback_submitted_at',
        'ip_address',
        'device_info',
        'duration_minutes',
    ];

    protected $casts = [
        'checked_in_at' => 'datetime',
        'checked_out_at' => 'datetime',
        'feedback_submitted_at' => 'datetime',
        'rating' => 'integer',
        'duration_minutes' => 'integer',
    ];

    /**
     * Relationships
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function registration(): BelongsTo
    {
        return $this->belongsTo(EventRegistration::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function checkedInBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'checked_in_by');
    }

    /**
     * Scopes
     */
    public function scopeInPerson($query)
    {
        return $query->where('attendance_type', 'in-person');
    }

    public function scopeVirtual($query)
    {
        return $query->where('attendance_type', 'virtual');
    }

    public function scopeWithFeedback($query)
    {
        return $query->whereNotNull('feedback');
    }

    /**
     * Helper Methods
     */
    public function calculateDuration(): void
    {
        if ($this->checked_in_at && $this->checked_out_at) {
            $this->duration_minutes = $this->checked_in_at->diffInMinutes($this->checked_out_at);
            $this->save();
        }
    }

    public function submitFeedback(int $rating, string $feedback = null): void
    {
        $this->update([
            'rating' => $rating,
            'feedback' => $feedback,
            'feedback_submitted_at' => now(),
        ]);
    }
}
