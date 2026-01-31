<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // Login/Authenticate user
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid email or password'
            ], 401);
        }

        // Check if user account is blocked
        if ($user->is_active === 0) {
            return response()->json([
                'message' => 'Your account has been blocked. Please contact the administrator.'
            ], 403);
        }

        return response()->json([
            'message' => 'Login successful',
            'user' => $user
        ], 200);
    }

    // Get all users
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    // Create new user
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'phone_number' => 'required|string',
            'current_address' => 'required|string',
            'civil_status' => 'required|string',
            'birth_date' => 'required|date',
            'region' => 'required|string',
            'province' => 'required|string',
            'city' => 'required|string',
            'course' => 'required|string',
            'batch_year' => 'required|string',
        ]);

        // Handle middle name - set to null if empty
        $middleName = $request->middle_name;
        if (empty($middleName) || trim($middleName) === '') {
            $middleName = null;
        }

        // Construct full name properly
        $fullName = trim($request->first_name . ($middleName ? ' ' . $middleName : '') . ' ' . $request->last_name);

        $user = User::create([
            'name' => $fullName,
            'first_name' => $request->first_name,
            'middle_name' => $middleName,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role ?? 'alumni',
            'phone_number' => $request->phone_number,
            'telephone_number' => $request->telephone_number,
            'current_address' => $request->current_address,
            'civil_status' => $request->civil_status,
            'birth_date' => $request->birth_date,
            'region' => $request->region,
            'province' => $request->province,
            'city' => $request->city,
            'course' => $request->course,
            'batch_year' => $request->batch_year,
            'is_active' => 1,
            'email_verified_at' => now(),
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user
        ], 201);
    }

    // Get user by email
    public function show($email)
    {
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
        
        return response()->json($user);
    }
    
    // Update user by email
    public function update(Request $request, $email)
    {
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
        
        $user->update($request->all());
        
        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    // Update user by ID
    public function updateById(Request $request, $id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
        
        $user->update($request->all());
        
        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

    // Delete user by ID
    public function destroy($id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
        
        $user->delete();
        
        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }

    // Toggle user active status (block/unblock)
    public function toggleActive(Request $request, $id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
        
        $request->validate([
            'is_active' => 'required|integer|in:0,1',
        ]);
        
        $user->is_active = $request->is_active;
        $user->save();
        
        return response()->json([
            'message' => 'User status updated successfully',
            'user' => $user
        ]);
    }
}
