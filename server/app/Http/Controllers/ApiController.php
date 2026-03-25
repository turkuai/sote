<?php

namespace App\Http\Controllers;

class ApiController extends Controller
{
    public function getUser()
    {
        return response()->json([
            'id' => 1,
            'name' => 'User Example',
            'email' => 'example@test.com',
            'phone' => '+1 555 123 456'
        ], 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type');
    }
}
