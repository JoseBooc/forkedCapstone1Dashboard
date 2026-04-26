<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\EngagementEvent;
use App\Models\EventPayment;
use App\Models\EventRegistration;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class EngagementController extends Controller
{
    public function index(Request $request)
    {
        $query = EngagementEvent::query()->orderByDesc('start_date')->orderByDesc('created_at');

        // Filter by active status unless admin
        $role = $request->query('role');
        if ($role !== 'admin') {
            $query->where('is_active', true);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string',  // Category name from frontend
            'category_id' => 'nullable|integer',  // Category ID if provided
            'description' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'event_date' => 'required|date',
            'start_time' => 'nullable|string',  // From frontend time picker
            'end_time' => 'nullable|string',  // From frontend time picker
            'start_date' => 'nullable|date',  // Direct start_date if provided
            'end_date' => 'nullable|date',  // Direct end_date if provided
            'capacity' => 'nullable|integer|min:0',
            'max_participants' => 'nullable|integer|min:0',
            'status' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'image_url' => 'nullable|string',
            'posted_by' => 'nullable|string',
        ]);

        // Transform frontend data to database format
        $startDate = $validated['start_date'] ?? Carbon::parse($validated['event_date'] ?? now());
        $endDate = $validated['end_date'] ?? Carbon::parse($validated['event_date'] ?? now());
        
        $categoryId = $validated['category_id'] ?? null;

        if ($categoryId === null && Schema::hasTable('event_categories')) {
            $categoryLabel = trim((string) ($validated['category'] ?? ''));

            if ($categoryLabel !== '') {
                $categories = DB::table('event_categories');

                if (Schema::hasColumn('event_categories', 'name')) {
                    $categoryId = $categories->where('name', $categoryLabel)->value('id');
                } elseif (Schema::hasColumn('event_categories', 'title')) {
                    $categoryId = $categories->where('title', $categoryLabel)->value('id');
                }
            }

            if ($categoryId === null) {
                $categoryId = DB::table('event_categories')->orderBy('id')->value('id');
            }

            if ($categoryId === null) {
                $now = now();
                $categoryId = DB::table('event_categories')->insertGetId([
                    'name' => $categoryLabel !== '' ? $categoryLabel : 'General',
                    'description' => null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }

        if ($categoryId === null) {
            return response()->json([
                'message' => 'No event category is configured yet. Please add an event category first.',
            ], 422);
        }

        $event = EngagementEvent::create([
            'category_id' => $categoryId,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'location' => $validated['location'] ?? null,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'max_participants' => $validated['capacity'] ?? $validated['max_participants'] ?? 0,
            'is_active' => $validated['status'] === 'Approved' ? true : false,  // Convert status to is_active
        ]);

        return response()->json([
            'message' => 'Engagement event created successfully',
            'event' => $event,
        ], 201);
    }

    public function update(Request $request, EngagementEvent $engagementEvent)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string',
            'category_id' => 'nullable|integer',
            'description' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'event_date' => 'nullable|date',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'start_time' => 'nullable|string',
            'end_time' => 'nullable|string',
            'capacity' => 'nullable|integer|min:0',
            'max_participants' => 'nullable|integer|min:0',
            'status' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $updateData = [
            'title' => $validated['title'],
            'description' => $validated['description'] ?? $engagementEvent->description,
            'location' => $validated['location'] ?? $engagementEvent->location,
        ];

        // Handle dates
        if ($validated['start_date'] ?? null) {
            $updateData['start_date'] = $validated['start_date'];
        } elseif ($validated['event_date'] ?? null) {
            $updateData['start_date'] = Carbon::parse($validated['event_date']);
        }

        if ($validated['end_date'] ?? null) {
            $updateData['end_date'] = $validated['end_date'];
        }

        // Handle capacity/max_participants
        if ($validated['capacity'] !== null) {
            $updateData['max_participants'] = $validated['capacity'];
        } elseif ($validated['max_participants'] !== null) {
            $updateData['max_participants'] = $validated['max_participants'];
        }

        // Handle status/is_active
        if ($validated['status'] !== null) {
            $updateData['is_active'] = $validated['status'] === 'Approved' ? true : false;
        } elseif ($validated['is_active'] !== null) {
            $updateData['is_active'] = $validated['is_active'];
        }

        // Handle category_id
        if ($validated['category_id'] !== null) {
            $updateData['category_id'] = $validated['category_id'];
        }

        $engagementEvent->update($updateData);

        return response()->json([
            'message' => 'Engagement event updated successfully',
            'event' => $engagementEvent->fresh(),
        ]);
    }

    public function approve(EngagementEvent $engagementEvent)
    {
        $engagementEvent->update(['is_active' => true]);

        return response()->json([
            'message' => 'Event approved successfully',
            'event' => $engagementEvent->fresh(),
        ]);
    }

    public function decline(EngagementEvent $engagementEvent)
    {
        $engagementEvent->update(['is_active' => false]);

        return response()->json([
            'message' => 'Event declined successfully',
            'event' => $engagementEvent->fresh(),
        ]);
    }

    public function destroy(EngagementEvent $engagementEvent)
    {
        $engagementEvent->delete();

        return response()->json([
            'message' => 'Event deleted successfully',
        ]);
    }

    public function register(Request $request, EngagementEvent $engagementEvent)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'is_guest' => 'nullable|boolean',
        ]);

        $registration = EventRegistration::create([
            'engagement_event_id' => $engagementEvent->id,
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'is_guest' => $validated['is_guest'] ?? false,
        ]);

        return response()->json([
            'message' => 'Registration saved successfully',
            'registration' => $registration,
        ], 201);
    }

    public function attend(Request $request, EngagementEvent $engagementEvent)
    {
        $validated = $request->validate([
            'event_registration_id' => 'nullable|exists:event_registrations,id',
            'attendee_name' => 'required|string|max:255',
            'attendee_email' => 'nullable|email|max:255',
            'attended' => 'nullable|boolean',
        ]);

        $attendance = Attendance::create([
            'engagement_event_id' => $engagementEvent->id,
            'event_registration_id' => $validated['event_registration_id'] ?? null,
            'attendee_name' => $validated['attendee_name'],
            'attendee_email' => $validated['attendee_email'] ?? null,
            'attended' => $validated['attended'] ?? true,
            'attended_at' => now(),
        ]);

        return response()->json([
            'message' => 'Attendance recorded successfully',
            'attendance' => $attendance,
        ], 201);
    }
}