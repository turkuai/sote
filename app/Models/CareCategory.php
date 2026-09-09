<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CareCategory extends Model
{

    use HasFactory;

    public $timestamps = true;

    protected $fillable = [
        'parent_category_id',
        'name',
        'description',
    ];
}
