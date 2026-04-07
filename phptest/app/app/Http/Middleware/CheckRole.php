<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Libraries\Role;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles  The roles allowed to access this route
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Get the authenticated user
        $user = $request->user();

        // If no user, deny access
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated',
            ], 401);
        }

        // Check if user has one of the required roles
        $hasRole = false;
        foreach ($roles as $role) {
            if ($user->role_type === $role) {
                $hasRole = true;
                break;
            }
        }

        // If user doesn't have required role, deny access
        if (!$hasRole) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized - Insufficient permissions. Required roles: ' . implode(', ', $roles),
            ], 403);
        }

        return $next($request);
    }
}
