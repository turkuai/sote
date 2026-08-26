<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Patient extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'first_name',
        'last_name',
        'social_id',
        'arrival_date',
        'remarks',
    ];

    protected $dates = [
        'arrival_date',
        'deleted_at',
    ];

    /**
     * Get all sectors for this patient
     */
    public function sectors()
    {
        return $this->belongsToMany(Sector::class, 'patient_sectors');
    }
}
