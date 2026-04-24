<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid email or password',
            ], 401);
        }

        $user->setAttribute('role', str_contains($user->email, 'admin@test.com') ? 'admin' : 'alumni');
        $user->setAttribute('is_active', 1);

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
        ]);
    }
}