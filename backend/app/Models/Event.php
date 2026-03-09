<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Event extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'image_url',
        'category_id',
        'location_type',
        'location_address',
        'location_city',
        'location_venue',
        'virtual_meeting_url',
        'location_notes',
        'start_date',
        'end_date',
        'registration_deadline',
        'max_participants',
        'current_participants',
        'requires_approval',
        'allow_waitlist',
        'status',
        'is_featured',
        'is_public',
        'send_reminders',
        'reminder_days_before',
        'created_by',
        'updated_by',
        'published_at',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'registration_deadline' => 'datetime',
        'published_at' => 'datetime',
        'requires_approval' => 'boolean',
        'allow_waitlist' => 'boolean',
        'is_featured' => 'boolean',
        'is_public' => 'boolean',
        'send_reminders' => 'boolean',
        'max_participants' => 'integer',
        'current_participants' => 'integer',
        'reminder_days_before' => 'integer',
    ];

    protected $appends = [
        'is_registration_open',
        'is_full',
        'available_spots',
        'days_until_event',
        'is_upcoming',
        'is_ongoing',
        'is_past',
    ];

    /**
     * Relationships
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(EventCategory::class, 'category_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(EventRegistration::class);
    }

    public function confirmedRegistrations(): HasMany
    {
        return $this->registrations()->where('status', 'confirmed');
    }

    public function attendanceRecords(): HasMany
    {
        return $this->hasMany(EventAttendance::class);
    }

    /**
     * Computed Attributes
     */
    public function getIsRegistrationOpenAttribute(): bool
    {
        if ($this->status !== 'published') {
            return false;
        }

        if ($this->registration_deadline && Carbon::now()->isAfter($this->registration_deadline)) {
            return false;
        }

        if ($this->max_participants && $this->current_participants >= $this->max_participants && !$this->allow_waitlist) {
            return false;
        }

        return Carbon::now()->isBefore($this->start_date);
    }

    public function getIsFullAttribute(): bool
    {
        if (!$this->max_participants) {
            return false;
        }

        return $this->current_participants >= $this->max_participants;
    }

    public function getAvailableSpotsAttribute(): ?int
    {
        if (!$this->max_participants) {
            return null; // Unlimited
        }

        return max(0, $this->max_participants - $this->current_participants);
    }

    public function getDaysUntilEventAttribute(): int
    {
        return Carbon::now()->diffInDays($this->start_date, false);
    }

    public function getIsUpcomingAttribute(): bool
    {
        return Carbon::now()->isBefore($this->start_date);
    }

    public function getIsOngoingAttribute(): bool
    {
        return Carbon::now()->between($this->start_date, $this->end_date);
    }

    public function getIsPastAttribute(): bool
    {
        return Carbon::now()->isAfter($this->end_date);
    }

    /**
     * Scopes
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('start_date', '>', Carbon::now());
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    /**
     * Helper Methods
     */
    public function incrementParticipants(): void
    {
        $this->increment('current_participants');
    }

    public function decrementParticipants(): void
    {
        $this->decrement('current_participants');
    }

    public function canUserRegister(User $user): bool
    {
        // Check if already registered
        if ($this->registrations()->where('user_id', $user->id)->exists()) {
            return false;
        }

        return $this->is_registration_open;
    }
}
