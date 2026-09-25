<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model {
  use HasFactory;

  protected $fillable = [
    'name',
    'access_key',
    'owner_id',
  ];

  /**
   * Get all users in this group
   */
  public function users() {
    return $this->belongsToMany(User::class, 'user_groups');
  }

  public function patients() {
    return $this->belongsToMany(Patient::class, 'patient_groups');
  }
}
