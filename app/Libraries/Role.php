<?php

namespace App\Libraries;

class Role {
    // Role definitions
    const ROLE_NURSE = 'nurse';
    const ROLE_MANAGER = 'manager';
    const ROLE_ADMIN = 'admin';

    // Role permissions (binary values)
    const NURSE_PERMISSIONS = 2;      // Can read, limited write
    const MANAGER_PERMISSIONS = 135;  // Can read, write, manage users
    const ADMIN_PERMISSIONS = 255;    // Full access

    /**
     * Get all available roles
     *
     * @return array
     */
    public static function all() {
        return [
            [
                'type' => self::ROLE_NURSE,
                'name' => 'Nurse',
                'permissions' => self::NURSE_PERMISSIONS,
                'description' => 'Can view and create basic records',
            ],
            [
                'type' => self::ROLE_MANAGER,
                'name' => 'Manager',
                'permissions' => self::MANAGER_PERMISSIONS,
                'description' => 'Can manage nurses and create groups',
            ],
            [
                'type' => self::ROLE_ADMIN,
                'name' => 'Administrator',
                'permissions' => self::ADMIN_PERMISSIONS,
                'description' => 'Full system access',
            ],
        ];
    }

    /**
     * Get permission value for a role type
     *
     * @param string $roleType
     * @return int|null
     */
    public static function getPermissions($roleType) {
        return match ($roleType) {
            self::ROLE_NURSE => self::NURSE_PERMISSIONS,
            self::ROLE_MANAGER => self::MANAGER_PERMISSIONS,
            self::ROLE_ADMIN => self::ADMIN_PERMISSIONS,
            default => null,
        };
    }

    /**
     * Get role name from type
     *
     * @param string $roleType
     * @return string|null
     */
    public static function getName($roleType) {
        return match ($roleType) {
            self::ROLE_NURSE => 'Nurse',
            self::ROLE_MANAGER => 'Manager',
            self::ROLE_ADMIN => 'Administrator',
            default => null,
        };
    }

    /**
     * Check if a role type is valid
     *
     * @param string $roleType
     * @return bool
     */
    public static function isValid($roleType) {
        return in_array($roleType, [
            self::ROLE_NURSE,
            self::ROLE_MANAGER,
            self::ROLE_ADMIN,
        ]);
    }
}
