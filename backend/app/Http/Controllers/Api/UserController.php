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

        // Check if account is pending approval
        if ($user->approval_status === 'pending') {
            return response()->json([
                'message' => 'Your account is currently pending verification. An administrator will verify your account within 24 to 48 hours.'
            ], 403);
        }

        // Check if account was disapproved
        if ($user->approval_status === 'disapproved') {
            return response()->json([
                'message' => 'Your account registration has been disapproved. Please contact the administrator for more information.'
            ], 403);
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
            'phone_number' => 'nullable|string',
            'current_address' => 'nullable|string',
            'country' => 'nullable|string',
            'geocode' => 'nullable|string',
            'sex' => 'nullable|string',
            'religion' => 'nullable|string',
            'marital_status' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'region' => 'nullable|string',
            'province' => 'nullable|string',
            'city' => 'nullable|string',
            'course' => 'nullable|string',
            'batch_year' => 'nullable|string',
            'has_diploma' => 'nullable|string|in:yes,no',
            'diploma_file' => 'nullable|file|mimes:png,jpg,jpeg,pdf|max:10240',
            'id_type' => 'nullable|string',
            'valid_id_file' => 'nullable|file|mimes:png,jpg,jpeg,pdf|max:10240',
        ]);

        // Handle middle name - set to null if empty
        $middleName = $request->middle_name;
        if (empty($middleName) || trim($middleName) === '') {
            $middleName = null;
        }

        // Construct full name properly
        $fullName = trim($request->first_name . ($middleName ? ' ' . $middleName : '') . ' ' . $request->last_name);

        // Handle diploma file upload
        $diplomaFilePath = null;
        if ($request->hasFile('diploma_file')) {
            $diplomaFile = $request->file('diploma_file');
            $diplomaFileName = time() . '_diploma_' . $diplomaFile->getClientOriginalName();
            $diplomaFilePath = $diplomaFile->storeAs('uploads/diplomas', $diplomaFileName, 'public');
        }

        // Handle valid ID file upload
        $validIdFilePath = null;
        if ($request->hasFile('valid_id_file')) {
            $validIdFile = $request->file('valid_id_file');
            $validIdFileName = time() . '_id_' . $validIdFile->getClientOriginalName();
            $validIdFilePath = $validIdFile->storeAs('uploads/ids', $validIdFileName, 'public');
        }

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
            'country' => $request->country,
            'geocode' => $request->geocode,
            'sex' => $request->sex,
            'religion' => $request->religion,
            'religion_other' => $request->religion_other,
            'marital_status' => $request->marital_status,
            'marriage_date' => $request->marriage_date,
            'intend_to_marry' => $request->intend_to_marry,
            'intended_marriage_age' => $request->intended_marriage_age,
            'no_marriage_reason' => $request->no_marriage_reason,
            'birth_date' => $request->birth_date,
            'region' => $request->region,
            'province' => $request->province,
            'city' => $request->city,
            'course' => $request->course,
            'batch_year' => $request->batch_year,
            'has_diploma' => $request->has_diploma ?? 'no',
            'diploma_file_path' => $diplomaFilePath,
            'id_type' => $request->id_type,
            'valid_id_file_path' => $validIdFilePath,
            'is_active' => $request->approval_status === 'approved' ? 1 : 0,
            'approval_status' => $request->approval_status ?? 'pending',
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
        
        // Handle middle name - set to null if empty
        $updateData = $request->all();
        if (isset($updateData['middle_name'])) {
            $middleName = $updateData['middle_name'];
            if (empty($middleName) || trim($middleName) === '') {
                $updateData['middle_name'] = null;
            }
        }
        
        // Reconstruct full name if first_name or last_name is being updated
        if (isset($updateData['first_name']) || isset($updateData['last_name']) || isset($updateData['middle_name'])) {
            $firstName = $updateData['first_name'] ?? $user->first_name;
            $middleName = isset($updateData['middle_name']) ? $updateData['middle_name'] : $user->middle_name;
            $lastName = $updateData['last_name'] ?? $user->last_name;
            
            // Clean middle name again for name construction
            if (empty($middleName) || trim($middleName) === '') {
                $middleName = null;
            }
            
            $updateData['name'] = trim($firstName . ($middleName ? ' ' . $middleName : '') . ' ' . $lastName);
        }
        
        $user->update($updateData);
        
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
        
        // Handle middle name - set to null if empty
        $updateData = $request->all();
        if (isset($updateData['middle_name'])) {
            $middleName = $updateData['middle_name'];
            if (empty($middleName) || trim($middleName) === '') {
                $updateData['middle_name'] = null;
            }
        }
        
        // Reconstruct full name if first_name or last_name is being updated
        if (isset($updateData['first_name']) || isset($updateData['last_name']) || isset($updateData['middle_name'])) {
            $firstName = $updateData['first_name'] ?? $user->first_name;
            $middleName = isset($updateData['middle_name']) ? $updateData['middle_name'] : $user->middle_name;
            $lastName = $updateData['last_name'] ?? $user->last_name;
            
            // Clean middle name again for name construction
            if (empty($middleName) || trim($middleName) === '') {
                $middleName = null;
            }
            
            $updateData['name'] = trim($firstName . ($middleName ? ' ' . $middleName : '') . ' ' . $lastName);
        }
        
        $user->update($updateData);
        
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

    // Get all pending approval users
    public function getPendingUsers()
    {
        $users = User::where('approval_status', 'pending')->get();
        return response()->json($users);
    }

    // Approve a user
    public function approveUser($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $user->approval_status = 'approved';
        $user->is_active = 1;
        $user->save();

        return response()->json([
            'message' => 'User approved successfully',
            'user' => $user
        ]);
    }

    // Disapprove a user
    public function disapproveUser($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $user->approval_status = 'disapproved';
        $user->is_active = 0;
        $user->save();

        return response()->json([
            'message' => 'User disapproved successfully',
            'user' => $user
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
