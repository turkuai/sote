<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Libraries\Permission;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     * 
     * Usage in routes:
     * Route::post('/users', [Controller::class, 'store'])->middleware('permission:' . Permission::CREATE);
     */
    public function handle(Request $request, Closure $next, $requiredPermission): Response
    {
        // For now we'll skip auth check - add auth logic later
        // $user = auth()->user();
        // if (!$user || !Permission::has($user->role, $requiredPermission)) {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        return $next($request);
    }
}
