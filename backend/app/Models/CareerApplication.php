<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CareerApplication extends Model
{
    protected $fillable = [
        'career_posting_id',
        'applicant_name',
        'applicant_email',
        'applicant_phone',
        'cover_letter',
    ];

    public function posting()
    {
        return $this->belongsTo(CareerPosting::class, 'career_posting_id');
    }
}