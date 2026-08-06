<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class AlumniEvent extends Model
{
    protected $fillable = [
        'title',
        'description',
        'category',
        'date',
        'time',
        'location',
        'max_attendees',
        'image_url',
        'event_type',
        'status',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'date' => 'date',
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'registered_count',
        'available_slots',
        'is_upcoming',
        'formatted_date',
        'time_remaining'
    ];

    public function registrations()
    {
        return $this->hasMany(EventRegistration::class, 'event_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function getRegisteredCountAttribute()
    {
        return $this->registrations()->where('status', 'confirmed')->count();
    }

    public function getAvailableSlotsAttribute()
    {
        if ($this->max_attendees === null) {
            return 'Unlimited';
        }
        
        $available = $this->max_attendees - $this->registered_count;
        return max(0, $available);
    }

    public function getIsUpcomingAttribute()
    {
        return Carbon::parse($this->date)->isFuture();
    }

    public function getFormattedDateAttribute()
    {
        return Carbon::parse($this->date)->format('F j, Y');
    }

    public function getTimeRemainingAttribute()
    {
        if (!$this->is_upcoming) {
            return 'Past Event';
        }

        $eventDate = Carbon::parse($this->date);
        $now = Carbon::now();
        $diff = $now->diff($eventDate);

        if ($diff->days > 0) {
            return $diff->days . ' day' . ($diff->days > 1 ? 's' : '') . ' away';
        } else {
            return 'This week';
        }
    }
}
