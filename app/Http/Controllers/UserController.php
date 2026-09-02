<?php

namespace App\Http\Controllers;

use App\Libraries\ApiResponse;
use App\Libraries\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends Controller
{
  /**
   * Get all users with their groups
   */
  public function index(Request $request)
  {
    try {
      $query = User::with('groups');

      // Filter by role_type if provided
      if ($request->has('role_type') && $request->input('role_type') !== '') {
        $roleType = $request->input('role_type');
        if ($roleType === 'null') {
          $query->whereNull('role_type');
        } else {
          $query->where('role_type', $roleType);
        }
      }

      // Search by name, email, or first_name
      if ($request->has('search') && $request->search) {
        $search = strtolower($request->search);
        $query->where(function ($q) use ($search) {
          $q->whereRaw('LOWER(name) LIKE ?', ["%{$search}%"])
            ->orWhereRaw('LOWER(first_name) LIKE ?', ["%{$search}%"])
            ->orWhereRaw('LOWER(last_name) LIKE ?', ["%{$search}%"])
            ->orWhereRaw('LOWER(email) LIKE ?', ["%{$search}%"]);
        });
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
      $usersPaginator = $query->paginate($pageSize);
      return ApiResponse::paginated($usersPaginator, "Users retrieved successfully");
    } catch (\Exception $e) {
      \Log::error('UserController@index error: ' . $e->getMessage(), ['exception' => $e]);
      return ApiResponse::error('Failed to retrieve users: ' . $e->getMessage(), 500);
    }
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
      'password' => 'sometimes|string|min:6',
      'role_type' => 'required|in:nurse,manager,admin',
    ]);

    if ($validator->fails()) {
      return ApiResponse::validationError($validator->errors());
    }

    $data = $validator->validated();

    // Generate password if not provided
    if (!isset($data['password']) || empty(trim($data['password']))) {
      $data['password'] = Str::random(12);
    }

    // Hash password using Hash facade
    $data['password'] = Hash::make($data['password']);

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

    $data = $validator->validated();

    // Hash password if provided
    if (isset($data['password']) && !empty(trim($data['password']))) {
      $data['password'] = Hash::make($data['password']);
    } else {
      // Remove password from update if not provided
      unset($data['password']);
    }

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

    // Refresh the user instance to get updated values
    $user->refresh();

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

    if (auth()->id() == $id) {
      return ApiResponse::error('Self-deletion is not allowed.', 422);
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
