<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CareProblemItems extends Model {

  use HasFactory;

  public $timestamps = true;

  protected $fillable = [
    'problem_id',
    'description',
    'author_id',
    'type',
  ];

  /**
   * The care problem this item belongs to.
   */
  public function problem() {
    return $this->belongsTo(CareProblem::class, 'problem_id');
  }
}
