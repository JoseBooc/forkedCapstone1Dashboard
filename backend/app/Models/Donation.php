<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    protected $fillable = [
        'campaign_id',
        'first_name',
        'last_name',
        'email',
        'amount',
        'frequency',
        'designation',
        'payment_method',
        'reference_number',
        'transaction_date',
        'gcash_number',
        'account_name',
        'bank_name',
        'card_number',
        'proof_path',
        'payment_status',
        'is_hidden',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'transaction_date' => 'date',
        'is_hidden' => 'boolean',
    ];

    protected $appends = ['full_name'];

    public function campaign()
    {
        return $this->belongsTo(DonationCampaign::class, 'campaign_id');
    }

    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }
}