<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Project extends Model
{
    protected $fillable = [
        'title',
        'description',
        'category',
        'budget_goal',
        'raised_amount',
        'target_date',
        'status',
        'image_url',
        'collaboration_partner',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'budget_goal' => 'decimal:2',
        'raised_amount' => 'decimal:2',
        'target_date' => 'date',
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'days_remaining',
        'progress_percentage',
        'status_badge',
        'remaining_amount',
        'donors_count'
    ];

    public function donations()
    {
        return $this->hasMany(ProjectDonation::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function getDaysRemainingAttribute()
    {
        if (!$this->target_date) {
            return 'No deadline';
        }

        $targetDate = Carbon::parse($this->target_date)->endOfDay();
        $now = Carbon::now();

        if ($now->greaterThan($targetDate)) {
            return $this->status === 'completed' ? 'Completed' : 'Overdue';
        }

        $diff = $now->diff($targetDate);
        
        if ($diff->days > 0) {
            return $diff->days . ' day' . ($diff->days > 1 ? 's' : '') . ' remaining';
        } elseif ($diff->h > 0) {
            return $diff->h . ' hour' . ($diff->h > 1 ? 's' : '') . ' remaining';
        } else {
            return 'Due soon';
        }
    }

    public function getProgressPercentageAttribute()
    {
        if ($this->budget_goal == 0) {
            return 0;
        }

        $percentage = ($this->raised_amount / $this->budget_goal) * 100;
        return round(min(100, $percentage), 1);
    }

    public function getStatusBadgeAttribute()
    {
        return match($this->status) {
            'upcoming' => 'Upcoming',
            'active' => 'Active',
            'completed' => 'Completed',
            'paused' => 'Paused',
            'cancelled' => 'Cancelled',
            default => 'Unknown'
        };
    }

    public function getRemainingAmountAttribute()
    {
        $remaining = $this->budget_goal - $this->raised_amount;
        return max(0, $remaining);
    }

    public function getDonorsCountAttribute()
    {
        return $this->donations()->distinct('email')->count('email');
    }
}
