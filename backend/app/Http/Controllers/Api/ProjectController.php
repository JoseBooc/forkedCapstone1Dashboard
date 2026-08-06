<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectDonation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::query();

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by category if provided
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Filter by active status
        if ($request->has('active')) {
            $query->where('is_active', $request->boolean('active'));
        }

        // Show only active projects for non-admins
        if (!auth()->check() || auth()->user()->role !== 'admin') {
            $query->where('is_active', true);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function show($id)
    {
        $project = Project::with(['donations', 'creator'])->findOrFail($id);
        return response()->json($project);
    }

    public function store(Request $request)
    {
        // Admin only
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string|max:100',
            'budget_goal' => 'required|numeric|min:1',
            'target_date' => 'required|date|after:today',
            'collaboration_partner' => 'nullable|string|max:255',
            'image_url' => 'nullable|string|url',
            'status' => 'required|in:upcoming,active,completed,paused,cancelled',
        ]);

        $project = Project::create([
            ...$validated,
            'raised_amount' => 0,
            'is_active' => true,
            'created_by' => auth()->id(),
        ]);

        return response()->json([
            'message' => 'Project created successfully',
            'project' => $project,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        // Admin only
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $project = Project::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'category' => 'sometimes|required|string|max:100',
            'budget_goal' => 'sometimes|required|numeric|min:1',
            'target_date' => 'sometimes|required|date',
            'collaboration_partner' => 'nullable|string|max:255',
            'image_url' => 'nullable|string|url',
            'status' => 'sometimes|required|in:upcoming,active,completed,paused,cancelled',
        ]);

        $project->update($validated);

        return response()->json([
            'message' => 'Project updated successfully',
            'project' => $project,
        ]);
    }

    public function destroy($id)
    {
        // Admin only
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $project = Project::findOrFail($id);
        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }

    public function toggleActive($id)
    {
        // Admin only
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $project = Project::findOrFail($id);
        $project->update(['is_active' => !$project->is_active]);

        return response()->json([
            'message' => $project->is_active ? 'Project activated' : 'Project deactivated',
            'project' => $project,
        ]);
    }

    public function addDonation(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'payment_method' => 'nullable|string|max:255',
            'is_recurring' => 'nullable|boolean',
            'frequency' => 'nullable|in:monthly,quarterly,annual',
        ]);

        $donation = ProjectDonation::create([
            'project_id' => $project->id,
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'amount' => $validated['amount'],
            'payment_method' => $validated['payment_method'] ?? 'Credit Card',
            'is_recurring' => $validated['is_recurring'] ?? false,
            'frequency' => $validated['frequency'] ?? null,
        ]);

        // Update project raised amount
        $project->update([
            'raised_amount' => $project->raised_amount + $validated['amount']
        ]);

        return response()->json([
            'message' => 'Donation recorded successfully',
            'donation' => $donation,
            'project' => $project,
        ], 201);
    }

    public function getDonors($id)
    {
        // Admin only
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $project = Project::findOrFail($id);
        $donors = $project->donations()
            ->distinct('email')
            ->select('email', 'first_name', 'last_name')
            ->selectRaw('SUM(amount) as total_donated')
            ->selectRaw('COUNT(*) as donation_count')
            ->groupBy('email', 'first_name', 'last_name')
            ->orderByDesc('total_donated')
            ->get();

        return response()->json($donors);
    }

    public function getAnalytics()
    {
        // Admin only
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $allProjects = Project::with('donations')->get();
        $totalRaised = Project::sum('raised_amount');
        $activeProjects = Project::where('is_active', true)->where('status', 'active')->count();
        $completedProjects = Project::where('status', 'completed')->count();
        $totalDonors = ProjectDonation::distinct('email')->count('email');

        return response()->json([
            'total_raised' => $totalRaised,
            'active_projects' => $activeProjects,
            'completed_projects' => $completedProjects,
            'total_donors' => $totalDonors,
            'projects' => $allProjects,
        ]);
    }
}
