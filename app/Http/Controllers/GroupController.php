<?php

namespace App\Http\Controllers;

use App\Libraries\ApiResponse;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GroupController extends Controller
{
    /**
     * Get all groups with their users
     */
    public function index(Request $request)
    {
        $query = Group::withCount('users');
        
        // Search by name
        if ($request->has('search') && $request->search) {
            $search = strtolower($request->search);
            $query->whereRaw('LOWER(name) LIKE ?', ["%{$search}%"]);
        }
        
        $groups = $query->get();
        
        // Map users_count to user_count for frontend compatibility
        $groups = $groups->map(function ($group) {
            return [
                'id' => $group->id,
                'name' => $group->name,
                'access_key' => $group->access_key,
                'user_count' => $group->users_count,
                'created_at' => $group->created_at,
                'updated_at' => $group->updated_at,
            ];
        });
        
        return ApiResponse::success($groups, 'Groups retrieved successfully');
    }

    /**
     * Get a specific group with its users
     */
    public function show($id)
    {
        $group = Group::with('users')->find($id);
        
        if (!$group) {
            return ApiResponse::notFound('Group not found');
        }

        return ApiResponse::success($group, 'Group retrieved successfully');
    }

    /**
     * Create a new group
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:groups,name',
            'access_key' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return ApiResponse::validationError($validator->errors());
        }

        $group = Group::create($validator->validated());
        
        return ApiResponse::success($group, 'Group created successfully', 201);
    }

    /**
     * Update a group
     */
    public function update(Request $request, $id)
    {
        $group = Group::find($id);
        
        if (!$group) {
            return ApiResponse::notFound('Group not found');
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255|unique:groups,name,' . $id,
            'access_key' => 'sometimes|required|string|max:255',
        ]);

        if ($validator->fails()) {
            return ApiResponse::validationError($validator->errors());
        }

        $group->update($validator->validated());
        $group->refresh(); // Reload from database to get updated data

        return ApiResponse::success($group, 'Group updated successfully');
    }

    /**
     * Delete a group
     */
    public function destroy($id)
    {
        $group = Group::find($id);
        
        if (!$group) {
            return ApiResponse::notFound('Group not found');
        }

        $group->delete();

        return ApiResponse::success(null, 'Group deleted successfully');
    }

    /**
     * Add a user to a group
     */
    public function addUserToGroup($groupId, $userId)
    {
        // Check if group exists
        $group = Group::find($groupId);
        if (!$group) {
            return ApiResponse::notFound('Group not found');
        }

        // Check if user exists
        $user = \App\Models\User::find($userId);
        if (!$user) {
            return ApiResponse::notFound('User not found');
        }

        // Check if user is already in group
        if ($group->users()->where('user_id', $userId)->exists()) {
            return ApiResponse::error('User is already in this group', 400);
        }

        // Add user to group
        $group->users()->attach($userId);

        return ApiResponse::success(['message' => 'User added to group successfully'], 'User added to group', 201);
    }

    /**
     * Remove a user from a group
     */
    public function removeUserFromGroup($groupId, $userId)
    {
        // Check if group exists
        $group = Group::find($groupId);
        if (!$group) {
            return ApiResponse::notFound('Group not found');
        }

        // Check if user exists
        $user = \App\Models\User::find($userId);
        if (!$user) {
            return ApiResponse::notFound('User not found');
        }

        // Remove user from group
        $group->users()->detach($userId);

        return ApiResponse::success(null, 'User removed from group successfully');
    }
}
