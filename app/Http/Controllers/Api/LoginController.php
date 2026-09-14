<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller {
  public function login(Request $request) {
    $credentials = $request->validate([
      'email' => 'required|email',
      'password' => 'required',
    ]);

    if (Auth::guard('web')->attempt($credentials, $request->boolean('remember'))) {
      $request->session()->regenerate();
      return response()->json([
        'message' => 'Login successful',
        'user' => Auth::user(),
      ]);
    }

    return response()->json([
      'message' => 'Invalid email or password',
    ], 401);
  }

  public function logout(Request $request) {
    Auth::guard('web')->logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return response()->json([
      'message' => 'Logout successful',
    ]);
  }
}
