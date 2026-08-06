<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GivebackProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GivebackProjectController extends Controller
{
    public function index(Request $request)
    {
        $includeArchived = $request->boolean('include_archived');

        $query = GivebackProject::query()->orderBy('created_at', 'desc');
        if (!$includeArchived) {
            $query->where('is_archived', false);
        }

        return response()->json($query->get());
    }

    public function show($id)
    {
        return response()->json(GivebackProject::with('events')->findOrFail($id));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'collaboration' => 'nullable|string|max:255',
            'target_amount' => 'required|numeric|min:1',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|string|in:upcoming,ongoing,completed',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('giveback-projects', 'public');
            $validated['image_url'] = '/storage/' . $imagePath;
        }

        $project = GivebackProject::create($validated);

        return response()->json($project, 201);
    }

    public function update(Request $request, $id)
    {
        $project = GivebackProject::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'collaboration' => 'nullable|string|max:255',
            'target_amount' => 'required|numeric|min:1',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|string|in:upcoming,ongoing,completed',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($project->image_url && Storage::disk('public')->exists(str_replace('/storage/', '', $project->image_url))) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $project->image_url));
            }

            $imagePath = $request->file('image')->store('giveback-projects', 'public');
            $validated['image_url'] = '/storage/' . $imagePath;
        }

        $project->update($validated);

        return response()->json($project);
    }

    public function archive($id)
    {
        $project = GivebackProject::findOrFail($id);
        $project->update(['is_archived' => true]);

        return response()->json($project);
    }

    public function restore($id)
    {
        $project = GivebackProject::findOrFail($id);
        $project->update(['is_archived' => false]);

        return response()->json($project);
    }

    public function destroy($id)
    {
        $project = GivebackProject::findOrFail($id);

        if ($project->image_url && Storage::disk('public')->exists(str_replace('/storage/', '', $project->image_url))) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $project->image_url));
        }

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }
}
