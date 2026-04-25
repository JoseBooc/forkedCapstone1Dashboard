<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Draft extends Model
{
    use HasUuids;

    protected $fillable = ['resume_code', 'form_data', 'current_section'];

    protected $casts = [
        'form_data' => 'array',
    ];
}
