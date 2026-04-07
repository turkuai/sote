<?php

namespace App\Http\Controllers;

use App\Libraries\ApiResponse;
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
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role_type' => 'required|in:nurse,manager,admin',
        ]);

        if ($validator->fails()) {
            return ApiResponse::validationError($validator->errors());
        }

        $data = $request->validated();
        
        // Set the binary role value based on role_type
        $data['name'] = $data['first_name'] . ' ' . $data['last_name'];
        $data['role'] = Role::getPermissions($data['role_type']);

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
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'sometimes|string|min:6',
            'role_type' => 'sometimes|in:nurse,manager,admin',
        ]);

        if ($validator->fails()) {
            return ApiResponse::validationError($validator->errors());
        }

        $data = $request->validated();
        
        // If role_type is being updated, also update the binary role value
        if (isset($data['role_type'])) {
            $data['role'] = Role::getPermissions($data['role_type']);
        }

        // Update name if first_name or last_name changed
        if (isset($data['first_name']) || isset($data['last_name'])) {
            $firstName = $data['first_name'] ?? $user->first_name;
            $lastName = $data['last_name'] ?? $user->last_name;
            $data['name'] = $firstName . ' ' . $lastName;
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
        $roles = Role::all();
        return ApiResponse::success($roles, 'Available roles retrieved successfully');
    }
}
