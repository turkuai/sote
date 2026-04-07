<?php

namespace App\Http\Controllers;

use App\Libraries\Permission;
use Illuminate\Http\Request;

/**
 * Permission Examples Controller
 * Shows how to use binary permissions
 */
class PermissionExampleController extends Controller
{
    /**
     * Get all permission definitions
     */
    public function getPermissions()
    {
        return response()->json([
            'permissions' => Permission::getPermissionNames(),
            'description' => 'Binary permission system - each permission is a power of 2'
        ]);
    }

    /**
     * Get user permissions
     */
    public function getUserPermissions($userId)
    {
        // In real app, fetch from DB
        // $user = User::find($userId);
        // $role = $user->role;

        $exampleRole = 15; // Example: CREATE(1) + READ(2) + UPDATE(4) + DELETE(8) = 15

        return response()->json([
            'role_value' => $exampleRole,
            'permissions' => Permission::getPermissionLabels($exampleRole),
            'has_create' => Permission::has($exampleRole, Permission::CREATE),
            'has_read' => Permission::has($exampleRole, Permission::READ),
            'has_update' => Permission::has($exampleRole, Permission::UPDATE),
            'has_delete' => Permission::has($exampleRole, Permission::DELETE),
            'has_admin' => Permission::has($exampleRole, Permission::ADMIN),
        ]);
    }

    /**
     * Example: Check if user can create
     */
    public function canCreate($userId)
    {
        // $user = User::find($userId);
        // if (!Permission::has($user->role, Permission::CREATE)) {
        //     return response()->json(['message' => 'No permission to create'], 403);
        // }

        return response()->json(['can_create' => true]);
    }

    /**
     * Example: Grant permission
     */
    public function grantPermission($userId, $permissionName)
    {
        // $user = User::find($userId);
        // $permission = Permission::$$permissionName;
        // $user->role = Permission::grant($user->role, $permission);
        // $user->save();

        return response()->json(['message' => 'Permission granted']);
    }

    /**
     * Example: Revoke permission
     */
    public function revokePermission($userId, $permissionName)
    {
        // $user = User::find($userId);
        // $permission = Permission::$$permissionName;
        // $user->role = Permission::revoke($user->role, $permission);
        // $user->save();

        return response()->json(['message' => 'Permission revoked']);
    }
}
