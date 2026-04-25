<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CareerPosting extends Model
{
    use SoftDeletes;

    protected $attributes = [
        'status' => 'pending',
    ];

    protected $fillable = [
        'company_name',
        'title',
        'type',
        'location',
        'work_type',
        'modality',
        'date_from',
        'date_to',
        'posting_date',
        'salary_range_from',
        'salary_range_to',
        'quantity',
        'description',
        'submitted_by_email',
        'status',
        'applicants_count',
        'is_visible',
        'hidden_at',
    ];

    protected $casts = [
        'date_from' => 'date',
        'date_to' => 'date',
        'posting_date' => 'date',
        'salary_range_from' => 'decimal:2',
        'salary_range_to' => 'decimal:2',
        'quantity' => 'integer',
        'applicants_count' => 'integer',
        'is_visible' => 'boolean',
        'hidden_at' => 'datetime',
    ];
}
