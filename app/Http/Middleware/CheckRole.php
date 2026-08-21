<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Libraries\Role;
use App\Libraries\ApiResponse;

class CheckRole {
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  ...$roles
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$roles) {
        if (!auth()->check()) {
            return ApiResponse::error('Unauthenticated', 401);
        }

        $user = auth()->user();

        // Get the required permission level from role names
        // If multiple roles are specified (e.g., manager,admin), we need the MINIMUM to check against
        // because if you have admin (255) you also have manager (135) permissions
        $requiredPermission = PHP_INT_MAX;
        foreach ($roles as $roleName) {
            $rolePermission = Role::getPermissions($roleName);
            $requiredPermission = min($requiredPermission, $rolePermission);
        }

        // Reset to 0 if no roles were specified
        if ($requiredPermission === PHP_INT_MAX) {
            $requiredPermission = 0;
        }

        // Check if user has sufficient permission (binary check with role hierarchy)
        if ($user->role < $requiredPermission) {
            return ApiResponse::error('Forbidden: Insufficient permissions', 403);
        }

        return $next($request);
    }
}
