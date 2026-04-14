<?php

namespace App\Http\Controllers;

use App\Libraries\ApiResponse;
use App\Libraries\Permission;
use App\Models\User;

class PermissionExampleController extends Controller
{
    /**
     * Get all available permissions
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPermissions()
    {
        return ApiResponse::success(
            Permission::all(),
            'Available permissions retrieved successfully'
        );
    }

    /**
     * Get permissions for a specific user
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserPermissions($id)
    {
        $user = User::find($id);

        if (!$user) {
            return ApiResponse::notFound('User not found');
        }

        $permissions = Permission::getPermissions($user->role);

        return ApiResponse::success([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'role' => $user->role,
                'role_type' => $user->role_type,
            ],
            'permissions' => $permissions,
        ], 'User permissions retrieved successfully');
    }
}
