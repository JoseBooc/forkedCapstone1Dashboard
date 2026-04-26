<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EngagementActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EngagementActivityController extends Controller
{
    public function index(Request $request)
    {
        $includeArchived = $request->boolean('include_archived');

        $query = EngagementActivity::query()->orderBy('schedule_start');
        if (!$includeArchived) {
            $query->where('is_archived', false);
        }

        return response()->json($query->get());
    }

    public function show($id)
    {
        return response()->json(EngagementActivity::findOrFail($id));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'venue' => 'required|string|max:255',
            'schedule_start' => 'required|date',
            'schedule_end' => 'required|date|after_or_equal:schedule_start',
            'registration_open' => 'required|boolean',
            'participant_limit' => 'nullable|integer|min:1',
            'fee_amount' => 'nullable|numeric|min:0',
            'status' => 'required|string|in:upcoming,ongoing,completed',
            'created_by_name' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('engagement-activities', 'public');
            $validated['image_url'] = '/storage/' . $imagePath;
        }

        $activity = EngagementActivity::create($validated);

        return response()->json($activity, 201);
    }

    public function update(Request $request, $id)
    {
        $activity = EngagementActivity::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'venue' => 'required|string|max:255',
            'schedule_start' => 'required|date',
            'schedule_end' => 'required|date|after_or_equal:schedule_start',
            'registration_open' => 'required|boolean',
            'participant_limit' => 'nullable|integer|min:1',
            'fee_amount' => 'nullable|numeric|min:0',
            'status' => 'required|string|in:upcoming,ongoing,completed',
            'created_by_name' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($activity->image_url && Storage::disk('public')->exists(str_replace('/storage/', '', $activity->image_url))) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $activity->image_url));
            }

            $imagePath = $request->file('image')->store('engagement-activities', 'public');
            $validated['image_url'] = '/storage/' . $imagePath;
        }

        $activity->update($validated);

        return response()->json($activity);
    }

    public function toggleRegistration($id)
    {
        $activity = EngagementActivity::findOrFail($id);
        $activity->registration_open = !$activity->registration_open;
        $activity->save();

        return response()->json($activity);
    }

    public function archive($id)
    {
        $activity = EngagementActivity::findOrFail($id);
        $activity->update(['is_archived' => true]);

        return response()->json($activity);
    }

    public function restore($id)
    {
        $activity = EngagementActivity::findOrFail($id);
        $activity->update(['is_archived' => false]);

        return response()->json($activity);
    }

    public function destroy($id)
    {
        $activity = EngagementActivity::findOrFail($id);

        if ($activity->image_url && Storage::disk('public')->exists(str_replace('/storage/', '', $activity->image_url))) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $activity->image_url));
        }

        $activity->delete();

        return response()->json(['message' => 'Activity deleted successfully']);
    }
}
