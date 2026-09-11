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
}
