<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GivebackProjectEvent extends Model
{
    protected $fillable = [
        'project_id',
        'title',
        'description',
        'location',
        'start_date',
        'end_date',
        'status',
        'image_url',
        'is_archived',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_archived' => 'boolean',
    ];

    public function project()
    {
        return $this->belongsTo(GivebackProject::class, 'project_id');
    }
}
