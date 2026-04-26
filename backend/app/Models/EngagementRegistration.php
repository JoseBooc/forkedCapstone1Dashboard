<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EngagementRegistration extends Model
{
    protected $fillable = [
        'activity_id',
        'first_name',
        'last_name',
        'email',
        'guests_count',
        'amount_due',
        'payment_method',
        'reference_number',
        'proof_path',
        'payment_status',
        'status',
        'is_hidden',
    ];

    protected $casts = [
        'guests_count' => 'integer',
        'amount_due' => 'decimal:2',
        'is_hidden' => 'boolean',
    ];

    protected $appends = ['full_name'];

    public function activity()
    {
        return $this->belongsTo(EngagementActivity::class, 'activity_id');
    }

    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }
}