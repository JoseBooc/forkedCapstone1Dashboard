<?php

namespace App\Models;

class Job extends CareerPosting
{
    protected $table = 'career_postings';

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
}
