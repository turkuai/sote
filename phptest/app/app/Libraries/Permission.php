<?php

namespace App\Libraries;

/**
 * Binary Permissions Handler
 * Bitwise permissions system for user/role management
 */

class Permission
{
    // Permission constants (powers of 2)
    const CREATE = 1;      // 2^0 = 1
    const READ = 2;        // 2^1 = 2
    const UPDATE = 4;      // 2^2 = 4
    const DELETE = 8;      // 2^3 = 8
    const ADMIN = 16;      // 2^4 = 16
    const EXPORT = 32;     // 2^5 = 32
    const IMPORT = 64;     // 2^6 = 64
    const APPROVE = 128;   // 2^7 = 128

    // Permission names for display
    public static function getPermissionNames()
    {
        return [
            self::CREATE => 'Create',
            self::READ => 'Read',
            self::UPDATE => 'Update',
            self::DELETE => 'Delete',
            self::ADMIN => 'Admin',
            self::EXPORT => 'Export',
            self::IMPORT => 'Import',
            self::APPROVE => 'Approve',
        ];
    }

    /**
     * Check if a user has a permission
     * Uses bitwise AND operation
     */
    public static function has($userRole, $permission)
    {
        return ($userRole & $permission) == $permission;
    }

    /**
     * Grant a permission
     * Uses bitwise OR operation
     */
    public static function grant($userRole, $permission)
    {
        return $userRole | $permission;
    }

    /**
     * Revoke a permission
     * Uses bitwise AND NOT operation
     */
    public static function revoke($userRole, $permission)
    {
        return $userRole & ~$permission;
    }

    /**
     * Grant multiple permissions
     */
    public static function grantMultiple($userRole, $permissions = [])
    {
        foreach ($permissions as $permission) {
            $userRole = self::grant($userRole, $permission);
        }
        return $userRole;
    }

    /**
     * Get all permissions for a user role (as array of permission values)
     */
    public static function getPermissions($userRole)
    {
        $permissions = [];
        $names = self::getPermissionNames();

        foreach ($names as $value => $name) {
            if (self::has($userRole, $value)) {
                $permissions[] = $value;
            }
        }

        return $permissions;
    }

    /**
     * Get all permission names for a user role
     */
    public static function getPermissionLabels($userRole)
    {
        $labels = [];
        $names = self::getPermissionNames();

        foreach ($names as $value => $name) {
            if (self::has($userRole, $value)) {
                $labels[] = $name;
            }
        }

        return $labels;
    }

    /**
     * Create a role with specific permissions
     */
    public static function createRole($permissions = [])
    {
        $role = 0;
        foreach ($permissions as $permission) {
            $role = self::grant($role, $permission);
        }
        return $role;
    }
}
