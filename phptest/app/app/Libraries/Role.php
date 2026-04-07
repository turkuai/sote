<?php

namespace App\Libraries;

/**
 * Role-Based Access Control (RBAC)
 * Defines 3 predefined roles with specific permissions
 */

class Role
{
    // Predefined Roles
    const ROLES = [
        'nurse' => 'Nurse',
        'manager' => 'Manager',
        'admin' => 'Admin',
    ];

    /**
     * Get permissions for each role
     */
    public static function getPermissions($roleType)
    {
        $rolePermissions = [
            'nurse' => [
                Permission::READ,
            ],
            'manager' => [
                Permission::READ,
                Permission::UPDATE,
                Permission::CREATE,
                Permission::APPROVE,
            ],
            'admin' => [
                Permission::CREATE,
                Permission::READ,
                Permission::UPDATE,
                Permission::DELETE,
                Permission::ADMIN,
                Permission::EXPORT,
                Permission::IMPORT,
                Permission::APPROVE,
            ],
        ];

        return $rolePermissions[$roleType] ?? [];
    }

    /**
     * Get role value (binary) from role type
     */
    public static function getRoleValue($roleType)
    {
        $permissions = self::getPermissions($roleType);
        return Permission::createRole($permissions);
    }

    /**
     * Get role name from role type
     */
    public static function getRoleName($roleType)
    {
        return self::ROLES[$roleType] ?? 'Unknown';
    }

    /**
     * Get role type from permission value
     * Returns the closest matching predefined role
     */
    public static function getRoleType($permissionValue)
    {
        foreach (array_keys(self::ROLES) as $roleType) {
            if (self::getRoleValue($roleType) === $permissionValue) {
                return $roleType;
            }
        }
        return null;
    }

    /**
     * Get all roles with their descriptions
     */
    public static function getAllRoles()
    {
        return [
            'nurse' => [
                'name' => 'Nurse',
                'description' => 'Can view data, cannot create or modify',
                'permissions' => self::getPermissions('nurse'),
                'value' => self::getRoleValue('nurse'),
            ],
            'manager' => [
                'name' => 'Manager',
                'description' => 'Can manage nurses, create groups, approve requests',
                'permissions' => self::getPermissions('manager'),
                'value' => self::getRoleValue('manager'),
            ],
            'admin' => [
                'name' => 'Admin',
                'description' => 'Full system access',
                'permissions' => self::getPermissions('admin'),
                'value' => self::getRoleValue('admin'),
            ],
        ];
    }

    /**
     * Check if user has a specific role
     */
    public static function isRole($permissionValue, $roleType)
    {
        return self::getRoleValue($roleType) === $permissionValue;
    }
}
