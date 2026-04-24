<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CareerPosting extends Model
{
    use SoftDeletes;

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
        'date_of_posting',
        'quantity',
        'salary_range_from',
        'salary_range_to',
        'salary_from',
        'salary_to',
        'description',
        'status',
        'applicants_count',
        'is_visible',
        'hidden_at',
    ];

    protected $casts = [
        'date_from' => 'date',
        'date_to' => 'date',
        'posting_date' => 'date',
        'date_of_posting' => 'date',
        'quantity' => 'integer',
        'salary_range_from' => 'decimal:2',
        'salary_range_to' => 'decimal:2',
        'salary_from' => 'decimal:2',
        'salary_to' => 'decimal:2',
        'applicants_count' => 'integer',
        'is_visible' => 'boolean',
        'hidden_at' => 'datetime',
    ];

    protected $appends = ['is_expired'];

    public function applications()
    {
        return $this->hasMany(CareerApplication::class);
    }

    public static function expireStalePosts(): void
    {
        static::query()
            ->whereDate('date_to', '<', Carbon::today())
            ->whereNull('deleted_at')
            ->update([
                'status' => 'Expired',
                'is_visible' => false,
                'hidden_at' => now(),
            ]);
    }

    public function getIsExpiredAttribute(): bool
    {
        return $this->date_to ? Carbon::parse($this->date_to)->lt(Carbon::today()) : false;
    }
}