<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class DonationCampaign extends Model
{
    protected $fillable = [
        'title',
        'description',
        'category',
        'image_url',
        'goal_amount',
        'raised_amount',
        'end_date',
        'is_active',
    ];

    protected $casts = [
        'goal_amount' => 'decimal:2',
        'raised_amount' => 'decimal:2',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];

    protected $appends = ['days_left', 'progress_percentage', 'time_remaining', 'donors_count', 'remaining_amount'];

    public function donations()
    {
        return $this->hasMany(Donation::class, 'campaign_id');
    }

    public function getDaysLeftAttribute()
    {
        if (!$this->end_date) {
            return 'Ended';
        }

        $endDate = Carbon::parse($this->end_date)->endOfDay();
        $now = Carbon::now();

        if ($now->greaterThan($endDate)) {
            return 'Ended';
        }

        $diff = $now->diff($endDate);
        
        if ($diff->days > 0) {
            return $diff->days . ' day' . ($diff->days > 1 ? 's' : '') . ' left';
        } elseif ($diff->h > 0) {
            return $diff->h . ' hour' . ($diff->h > 1 ? 's' : '') . ' left';
        } elseif ($diff->i > 0) {
            return $diff->i . ' minute' . ($diff->i > 1 ? 's' : '') . ' left';
        } else {
            return 'Ending soon';
        }
    }

    public function getTimeRemainingAttribute()
    {
        if (!$this->end_date) {
            return ['ended' => true, 'days' => 0, 'hours' => 0, 'minutes' => 0];
        }

        $endDate = Carbon::parse($this->end_date)->endOfDay();
        $now = Carbon::now();

        if ($now->greaterThan($endDate)) {
            return ['ended' => true, 'days' => 0, 'hours' => 0, 'minutes' => 0];
        }

        $diff = $now->diff($endDate);
        
        return [
            'ended' => false,
            'days' => $diff->days,
            'hours' => $diff->h,
            'minutes' => $diff->i,
        ];
    }

    public function getProgressPercentageAttribute()
    {
        if ($this->goal_amount == 0) {
            return 0;
        }

        $percentage = ($this->raised_amount / $this->goal_amount) * 100;
        return round(min(100, $percentage), 1);
    }

    public function getDonorsCountAttribute()
    {
        return $this->donations()->distinct('email')->count('email');
    }

    public function getRemainingAmountAttribute()
    {
        $remaining = $this->goal_amount - $this->raised_amount;
        return max(0, $remaining);
    }
}
