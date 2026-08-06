<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GivebackProjectEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GivebackProjectEventController extends Controller
{
    public function index(Request $request)
    {
        $includeArchived = $request->boolean('include_archived');
        $projectId = $request->query('project_id');

        $query = GivebackProjectEvent::query()->with('project')->orderBy('start_date');

        if ($projectId) {
            $query->where('project_id', $projectId);
        }

        if (!$includeArchived) {
            $query->where('is_archived', false);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:giveback_projects,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'nullable|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|string|in:upcoming,ongoing,completed',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('giveback-project-events', 'public');
            $validated['image_url'] = '/storage/' . $imagePath;
        }

        $event = GivebackProjectEvent::create($validated);

        return response()->json($event, 201);
    }

    public function update(Request $request, $id)
    {
        $event = GivebackProjectEvent::findOrFail($id);

        $validated = $request->validate([
            'project_id' => 'required|exists:giveback_projects,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'nullable|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|string|in:upcoming,ongoing,completed',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($event->image_url && Storage::disk('public')->exists(str_replace('/storage/', '', $event->image_url))) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $event->image_url));
            }

            $imagePath = $request->file('image')->store('giveback-project-events', 'public');
            $validated['image_url'] = '/storage/' . $imagePath;
        }

        $event->update($validated);

        return response()->json($event);
    }

    public function archive($id)
    {
        $event = GivebackProjectEvent::findOrFail($id);
        $event->update(['is_archived' => true]);

        return response()->json($event);
    }

    public function restore($id)
    {
        $event = GivebackProjectEvent::findOrFail($id);
        $event->update(['is_archived' => false]);

        return response()->json($event);
    }

    public function destroy($id)
    {
        $event = GivebackProjectEvent::findOrFail($id);

        if ($event->image_url && Storage::disk('public')->exists(str_replace('/storage/', '', $event->image_url))) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $event->image_url));
        }

        $event->delete();

        return response()->json(['message' => 'Event deleted successfully']);
    }
}
