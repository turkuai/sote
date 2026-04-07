<?php

namespace App\Http\Controllers;

use App\Libraries\ApiResponse;
use App\Libraries\ValidationRules;
use App\Libraries\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Get all users with their groups
     */
    public function index()
    {
        $users = User::with('groups')->get();
        return ApiResponse::success($users, 'Users retrieved successfully');
    }

    /**
     * Get a specific user with their groups
     */
    public function show($id)
    {
        $user = User::with('groups')->find($id);
        
        if (!$user) {
            return ApiResponse::notFound('User not found');
        }

        return ApiResponse::success($user, 'User retrieved successfully');
    }

    /**
     * Create a new user
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => [ValidationRules::required(), ValidationRules::uniqueEmail('users')],
            'role_type' => 'required|in:nurse,manager,admin',
        ]);

        if ($validator->fails()) {
            return ApiResponse::validationError($validator->errors());
        }

        $data = $request->validated();
        
        // Set the binary role value based on role_type
        $data['role'] = Role::getRoleValue($data['role_type']);

        $user = User::create($data);
        
        return ApiResponse::success($user, 'User created successfully', 201);
    }

    /**
     * Update a user
     */
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return ApiResponse::notFound('User not found');
        }

        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => ValidationRules::uniqueEmail('users', 'email', $id),
            'role_type' => 'sometimes|in:nurse,manager,admin',
        ]);

        if ($validator->fails()) {
            return ApiResponse::validationError($validator->errors());
        }

        $data = $request->validated();
        
        // If role_type is being updated, also update the binary role value
        if (isset($data['role_type'])) {
            $data['role'] = Role::getRoleValue($data['role_type']);
        }

        $user->update($data);

        return ApiResponse::success($user, 'User updated successfully');
    }

    /**
     * Delete a user
     */
    public function destroy($id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return ApiResponse::notFound('User not found');
        }

        $user->delete();

        return ApiResponse::success(null, 'User deleted successfully');
    }

    /**
     * Get all available roles
     */
    public function getRoles()
    {
        $roles = Role::getAllRoles();
        return ApiResponse::success($roles, 'Available roles retrieved successfully');
    }
}
