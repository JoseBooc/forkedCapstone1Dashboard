<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HiringRequest extends Model
{
    protected $fillable = [
        'type',
        'title',
        'company',
        'location',
        'work_type',
        'modality',
        'salary_range',
        'description',
        'application_email',
        'submitted_by_name',
        'status',
        'rejection_reason',
        'reviewed_by_name',
        'reviewed_at',
        'approved_opportunity_id',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    public function approvedOpportunity()
    {
        return $this->belongsTo(CareerOpportunity::class, 'approved_opportunity_id');
    }
}
