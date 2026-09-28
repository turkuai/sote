<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sector extends Model {
  use HasFactory, SoftDeletes;

  protected $fillable = [
    'name',
  ];

  /**
   * Get all patients in this sector
   */
  public function patients() {
    return $this->belongsToMany(Patient::class, 'patient_sectors');
  }
}
