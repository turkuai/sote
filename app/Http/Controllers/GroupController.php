<?php

namespace App\Http\Controllers;

use App\Libraries\ApiResponse;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class GroupController extends Controller {
  /**
   * Get all groups with their users
   */
  public function index(Request $request) {
    $query = Group::withCount('users');

    // Search by name
    if ($request->has('search') && $request->search) {
      $search = strtolower($request->search);
      $query->whereRaw('LOWER(name) LIKE ?', ["%{$search}%"]);
    }

    /*
          * Match the number of items displayed per page in ServerGrid.
          * This value must stay synchronized with ServerGrid's pageSize. Otherwise,
          * the frontend pagination may not match the number of records returned by the backend.
          * In the future, we should consider passing pageSize from the frontend as a query
          * parameter. This would require modifying the tai-grid package directly.
          * ServerGrid already sends the current page as "?page=...", which Laravel's
          * paginate() automatically recognizes and uses to retrieve the correct page.
        */
    $pageSize = 10;
    $groupsPaginator = $query->paginate($pageSize);
    $currentUserId = Auth::id();

    // Map users_count to user_count for frontend compatibility
    $groups = $groupsPaginator->getCollection()->map(function ($group) use ($currentUserId) {
      return [
        'id' => $group->id,
        'name' => $group->name,
        'access_key' => $group->access_key,
        'user_count' => $group->users_count,
        'is_owner' => $group->owner_id === $currentUserId,
        'is_member' => $group->users()->where('user_id', $currentUserId)->exists(),
        'created_at' => $group->created_at,
        'updated_at' => $group->updated_at,
      ];
    });

    $groupsPaginator->setCollection($groups);

    return ApiResponse::paginated($groupsPaginator, 'Groups retrieved successfully');
  }

  /**
   * Get a specific group with its users
   */
  public function show($id) {
    $group = Group::with('users')->find($id);

    if (!$group) {
      return ApiResponse::notFound('Group not found');
    }

    return ApiResponse::success($group, 'Group retrieved successfully');
  }

  /**
   * Create a new group
   */
  public function store(Request $request) {
    $validator = Validator::make($request->all(), [
      'name' => 'required|string|max:255|unique:groups,name',
      'access_key' => 'required|string|max:255',
    ]);

    if ($validator->fails()) {
      return ApiResponse::validationError($validator->errors());
    }

    $user = Auth::user();
    $group = Group::create(array_merge($validator->validated(), ['owner_id' => $user->id]));

    // Add creator as a member of the group
    $group->users()->attach($user->id);

    return ApiResponse::success($group, 'Group created successfully', 201);
  }

  /**
   * Update a group
   */
  public function update(Request $request, $id) {
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
  public function destroy($id) {
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
  public function addUserToGroup($groupId, $userId) {
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
   * Remove groups from patients 
   */
  public function removeGroupsFromPatients(Request $request) {
    $validated = $request->validate([
      'patient_id' => 'required|array',
      'group_id' => 'required|array',
    ]);

    $patient = \App\Models\Patient::find($validated['patient_id']);
    if (!$patient) {
      return ApiResponse::notFound('Patient not found');
    }

    $patient->groups()->detach($validated['group_id']);

    return ApiResponse::success(null, 'Group removed from patient successfully');
  }

  /**
   * Remove a user from a group
   */
  public function removeUserFromGroup($groupId, $userId) {
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

  /**
   * Get groups the authenticated user belongs to
   */
  public function myGroups(Request $request) {
    $user = $request->user();
    $groups = $user->groups()->get()->map(function ($group) {
      return [
        'id' => $group->id,
        'name' => $group->name,
        'created_at' => $group->created_at,
        'updated_at' => $group->updated_at,
      ];
    });

    return ApiResponse::success($groups, 'Groups retrieved successfully');
  }

  /**
   * Allow an authenticated user to self-register into a group using the access key
   */
  public function join(Request $request) {
    $validated = $request->validate([
      'group_name' => 'required|string',
      'access_key' => 'required|string',
    ]);

    $group = Group::where('name', $validated['group_name'])
      ->whereRaw('BINARY access_key = ?', [$validated['access_key']])
      ->first();

    if (!$group) {
      return ApiResponse::error('Invalid group name or access key', 404);
    }

    $user = $request->user();

    if ($group->users()->where('user_id', $user->id)->exists()) {
      return ApiResponse::error('You are already in this group', 400);
    }

    $group->users()->attach($user->id);

    return ApiResponse::success(null, 'Successfully joined the group');
  }
}
