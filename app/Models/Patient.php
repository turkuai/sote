<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Group;

class Patient extends Model {
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
  public function sectors() {
    return $this->belongsToMany(Sector::class, 'patient_sectors');
  }

  public function userGroups() {
    return $this->belongsToMany(Group::class, 'patient_groups');
  }

  public function patient_groups() {
    return $this->belongsToMany(Group::class, 'patient_groups', 'patient_id', 'group_id');
  }

  /**
   * Care problems recorded for this patient
   */
  public function careProblems() {
    return $this->hasMany(CareProblem::class, 'patient_id');
  }

  public function care_problem() {
    return $this->hasMany(CareProblem::class, 'patient_id');
  }

  public function scopeForUser($query, $userId) {
    return $query->whereIn('id', function ($subQuery) use ($userId) {
      $subQuery->select('patient_id')
        ->from('patient_groups')
        ->whereIn('group_id', function ($innerQuery) use ($userId) {
          $innerQuery->select('group_id')
            ->from('user_groups')
            ->where('user_id', $userId);
        });
    });
  }
}
