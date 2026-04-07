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
    public function index()
    {
        $groups = Group::with('users')->get();
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
        ]);

        if ($validator->fails()) {
            return ApiResponse::validationError($validator->errors());
        }

        $group = Group::create($request->validated());
        
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
        ]);

        if ($validator->fails()) {
            return ApiResponse::validationError($validator->errors());
        }

        $group->update($request->validated());

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
}
