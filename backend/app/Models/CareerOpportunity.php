<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CareerOpportunity extends Model
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
        'is_priority',
        'status',
        'posted_by_name',
    ];

    protected $casts = [
        'is_priority' => 'boolean',
    ];

    public function hiringRequest()
    {
        return $this->hasOne(HiringRequest::class, 'approved_opportunity_id');
    }
}
