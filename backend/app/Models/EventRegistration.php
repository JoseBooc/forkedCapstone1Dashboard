<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventRegistration extends Model
{
    protected $fillable = [
        'event_id',
        'user_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'status',
        'registered_at',
        'attended',
    ];

    protected $casts = [
        'registered_at' => 'datetime',
        'attended' => 'boolean',
    ];

    protected $appends = ['full_name'];

    public function event()
    {
        return $this->belongsTo(AlumniEvent::class, 'event_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }
}
