<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EventCategory extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'color',
        'icon',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get events in this category
     */
    public function events(): HasMany
    {
        return $this->hasMany(Event::class, 'category_id');
    }

    /**
     * Get active events in this category
     */
    public function activeEvents(): HasMany
    {
        return $this->events()->where('status', 'published');
    }

    /**
     * Scope for active categories
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
