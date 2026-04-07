<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'role',
        'role_type',
    ];

    /**
     * Get all groups this user belongs to
     */
    public function groups()
    {
        return $this->belongsToMany(Group::class, 'user_groups');
    }

    /**
     * Get the formatted role name
     */
    public function getRoleNameAttribute()
    {
        return ucfirst($this->role_type ?? 'nurse');
    }

    /**
     * Check if user has a specific role
     */
    public function isRole($roleType)
    {
        return $this->role_type === $roleType;
    }
}
