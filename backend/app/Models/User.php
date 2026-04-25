<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
        'first_name',
        'middle_name',
        'last_name',
        'current_address',
        'country',
        'phone_number',
        'telephone_number',
        'zipcode',
        'sex',
        'religion',
        'religion_other',
        'marital_status',
        'marriage_date',
        'intend_to_marry',
        'intended_marriage_age',
        'no_marriage_reason',
        'birth_date',
        'region',
        'province',
        'city',
        'course',
        'batch_year',
        'has_diploma',
        'diploma_file_path',
        'id_type',
        'valid_id_file_path',
        'profile_image_path',
        'approval_status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'deleted_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
