<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CareCategory extends Model {

  use HasFactory;

  public $timestamps = true;

  protected $fillable = [
    'parent_category_id',
    'name',
    'description',
  ];
  /**
   * Subcategories that belong to this category.
   */
  public function children() {
    return $this->hasMany(CareCategory::class, 'parent_category_id');
  }

  /**
   * Problems attached to this category.
   */
  public function problems() {
    return $this->hasMany(CareProblem::class, 'category_id');
  }
}
