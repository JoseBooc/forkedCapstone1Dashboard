<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectDonation extends Model
{
    protected $fillable = [
        'project_id',
        'first_name',
        'last_name',
        'email',
        'amount',
        'payment_method',
        'is_recurring',
        'frequency',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'is_recurring' => 'boolean',
    ];

    protected $appends = ['full_name', 'formatted_amount'];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    public function getFormattedAmountAttribute()
    {
        return '₱' . number_format($this->amount, 2);
    }
}
