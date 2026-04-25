<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Response extends Model
{
    use HasUuids;

    protected $fillable = ['respondent_email', 'submitted_at'];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    public function responseAnswers(): HasMany
    {
        return $this->hasMany(ResponseAnswer::class);
    }
}
