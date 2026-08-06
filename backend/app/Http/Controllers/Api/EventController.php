<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AlumniEvent;
use App\Models\EventRegistration;
use Illuminate\Http\Request;
use Carbon\Carbon;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = AlumniEvent::query();

        // Filter by event type
        if ($request->has('type')) {
            $query->where('event_type', $request->type);
        }

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Show upcoming events
        if ($request->has('upcoming') && $request->boolean('upcoming')) {
            $query->where('date', '>=', Carbon::now()->toDateString());
        }

        // Show past events
        if ($request->has('past') && $request->boolean('past')) {
            $query->where('date', '<', Carbon::now()->toDateString());
        }

        // Non-admins see only active events
        if (!auth()->check() || auth()->user()->role !== 'admin') {
            $query->where('is_active', true);
        }

        return response()->json($query->orderBy('date', 'desc')->get());
    }

    public function show($id)
    {
        $event = AlumniEvent::with(['registrations', 'creator'])->findOrFail($id);
        return response()->json($event);
    }

    public function store(Request $request)
    {
        // Admin only
        if (!auth()->check() || auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string|max:100',
            'date' => 'required|date',
            'time' => 'required|string|max:100',
            'location' => 'required|string|max:255',
            'max_attendees' => 'nullable|integer|min:1',
            'event_type' => 'required|in:social,professional,training,fundraiser,networking',
            'image_url' => 'nullable|string|url',
            'status' => 'required|in:upcoming,ongoing,completed,cancelled',
        ]);

        $event = AlumniEvent::create([
            ...$validated,
            'is_active' => true,
            'created_by' => auth()->id(),
        ]);

        return response()->json([
            'message' => 'Event created successfully',
            'event' => $event,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        // Admin only
        if (!auth()->check() || auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $event = AlumniEvent::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'category' => 'sometimes|required|string|max:100',
            'date' => 'sometimes|required|date',
            'time' => 'sometimes|required|string|max:100',
            'location' => 'sometimes|required|string|max:255',
            'max_attendees' => 'nullable|integer|min:1',
            'event_type' => 'sometimes|required|in:social,professional,training,fundraiser,networking',
            'image_url' => 'nullable|string|url',
            'status' => 'sometimes|required|in:upcoming,ongoing,completed,cancelled',
        ]);

        $event->update($validated);

        return response()->json([
            'message' => 'Event updated successfully',
            'event' => $event,
        ]);
    }

    public function destroy($id)
    {
        // Admin only
        if (!auth()->check() || auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $event = AlumniEvent::findOrFail($id);
        $event->delete();

        return response()->json(['message' => 'Event deleted successfully']);
    }

    public function toggleActive($id)
    {
        // Admin only
        if (!auth()->check() || auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $event = AlumniEvent::findOrFail($id);
        $event->update(['is_active' => !$event->is_active]);

        return response()->json([
            'message' => $event->is_active ? 'Event activated' : 'Event deactivated',
            'event' => $event,
        ]);
    }

    public function register(Request $request, $id)
    {
        $event = AlumniEvent::findOrFail($id);

        // Check if event is full
        if ($event->max_attendees !== null && $event->registered_count >= $event->max_attendees) {
            return response()->json(['message' => 'Event is fully booked'], 409);
        }

        $validated = $request->validate([
            'user_id' => 'nullable|integer',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        // Check if already registered
        $existing = EventRegistration::where('event_id', $event->id)
            ->where('email', $validated['email'])
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Already registered for this event'], 409);
        }

        $registration = EventRegistration::create([
            'event_id' => $event->id,
            'user_id' => $validated['user_id'] ?? null,
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'status' => 'confirmed',
            'registered_at' => now(),
        ]);

        return response()->json([
            'message' => 'Registration successful',
            'registration' => $registration,
        ], 201);
    }

    public function unregister($eventId, $registrationId)
    {
        $registration = EventRegistration::findOrFail($registrationId);

        if ($registration->event_id != $eventId) {
            return response()->json(['message' => 'Invalid registration'], 422);
        }

        $registration->delete();

        return response()->json(['message' => 'Unregistered successfully']);
    }

    public function getRegistrations($eventId)
    {
        // Admin only
        if (!auth()->check() || auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $event = AlumniEvent::findOrFail($eventId);
        $registrations = $event->registrations()->get();

        return response()->json($registrations);
    }

    public function markAttendance(Request $request, $eventId, $registrationId)
    {
        // Admin only
        if (!auth()->check() || auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $registration = EventRegistration::findOrFail($registrationId);

        if ($registration->event_id != $eventId) {
            return response()->json(['message' => 'Invalid registration'], 422);
        }

        $registration->update(['attended' => true]);

        return response()->json([
            'message' => 'Attendance marked',
            'registration' => $registration,
        ]);
    }

    public function getAnalytics($eventId)
    {
        // Admin only
        if (!auth()->check() || auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $event = AlumniEvent::findOrFail($eventId);
        $totalRegistrations = $event->registrations()->count();
        $attendedCount = $event->registrations()->where('attended', true)->count();
        $noShowCount = $totalRegistrations - $attendedCount;

        return response()->json([
            'event' => $event,
            'total_registrations' => $totalRegistrations,
            'attended' => $attendedCount,
            'no_show' => $noShowCount,
            'attendance_rate' => $totalRegistrations > 0 ? ($attendedCount / $totalRegistrations) * 100 : 0,
        ]);
    }
}
