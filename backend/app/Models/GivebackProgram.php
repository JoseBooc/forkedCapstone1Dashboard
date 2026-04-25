<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GivebackProgram extends Model
{
    protected $fillable = [
        'type',
        'title',
        'description',
        'beneficiary',
        'funding_goal',
        'amount_raised',
        'donor_count',
        'status',
        'is_archived',
    ];

    protected $casts = [
        'funding_goal' => 'decimal:2',
        'amount_raised' => 'decimal:2',
        'is_archived' => 'boolean',
    ];

    protected $appends = ['progress_percentage'];

    public function getProgressPercentageAttribute()
    {
        if ((float) $this->funding_goal === 0.0) {
            return 0;
        }

        $percentage = ($this->amount_raised / $this->funding_goal) * 100;
        return round(min(100, $percentage), 1);
    }
}
