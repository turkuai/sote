<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CareProblemItems extends Model
{

    use HasFactory;

    public $timestamps = true;

    protected $fillable = [
        'problem_id',
        'description',
        'author_id',
        'type',
    ];
}
