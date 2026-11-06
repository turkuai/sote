<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CareProblem extends Model {

  use HasFactory;

  public $timestamps = true;

  protected $fillable = [
    'category_id',
    'author_id',
    'patient_id',
    'description',
  ];

  public function items() {
    return $this->hasMany(CareProblemItems::class, 'problem_id');
  }

  public function category() {
    return $this->belongsTo(CareCategory::class, 'category_id');
  }

  public function author() {
    return $this->belongsTo(User::class, 'author_id');
  }
}
