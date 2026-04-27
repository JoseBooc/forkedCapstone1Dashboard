<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\EngagementEvent;
use App\Models\EventPayment;
use App\Models\EventRegistration;
use Illuminate\Http\Request;

class EngagementController extends Controller
{
    public function index(Request $request)
    {
        $role = $request->query('role');

        $query = EngagementEvent::query()->orderByDesc('event_date')->orderByDesc('created_at');

        if ($role !== 'admin') {
            $query->where('status', 'Approved');
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'event_group' => 'nullable|string|max:255',
            'event_date' => 'required|date',
            'start_time' => 'nullable',
            'end_time' => 'nullable',
            'location' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'nullable|string|max:1000',
            'capacity' => 'nullable|integer|min:0',
            'registration_fee' => 'nullable|numeric|min:0',
            'status' => 'nullable|string|in:Pending,Approved,Rejected,Draft',
            'posted_by' => 'nullable|string|max:255',
        ]);

        $event = EngagementEvent::create([
            ...$validated,
            'status' => $validated['status'] ?? 'Approved',
            'capacity' => $validated['capacity'] ?? 0,
            'registration_fee' => $validated['registration_fee'] ?? 0,
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
            'category' => 'required|string|max:255',
            'event_group' => 'nullable|string|max:255',
            'event_date' => 'required|date',
            'start_time' => 'nullable',
            'end_time' => 'nullable',
            'location' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'nullable|string|max:1000',
            'capacity' => 'nullable|integer|min:0',
            'registration_fee' => 'nullable|numeric|min:0',
            'status' => 'nullable|string|in:Pending,Approved,Rejected,Draft',
            'posted_by' => 'nullable|string|max:255',
        ]);

        $engagementEvent->update([
            ...$validated,
            'status' => $validated['status'] ?? $engagementEvent->status,
            'capacity' => $validated['capacity'] ?? $engagementEvent->capacity,
            'registration_fee' => $validated['registration_fee'] ?? $engagementEvent->registration_fee,
        ]);

        return response()->json([
            'message' => 'Engagement event updated successfully',
            'event' => $engagementEvent->fresh(),
        ]);
    }

    public function approve(EngagementEvent $engagementEvent)
    {
        $engagementEvent->update(['status' => 'Approved']);

        return response()->json([
            'message' => 'Event approved successfully',
            'event' => $engagementEvent->fresh(),
        ]);
    }

    public function decline(EngagementEvent $engagementEvent)
    {
        $engagementEvent->update(['status' => 'Rejected']);

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
            'guest_count' => 'nullable|integer|min:0',
            'fee_amount' => 'nullable|numeric|min:0',
            'payment_status' => 'nullable|string|max:255',
        ]);

        $registration = EventRegistration::create([
            'engagement_event_id' => $engagementEvent->id,
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'is_guest' => $validated['is_guest'] ?? false,
            'guest_count' => $validated['guest_count'] ?? 0,
            'fee_amount' => $validated['fee_amount'] ?? $engagementEvent->registration_fee,
            'payment_status' => $validated['payment_status'] ?? (($validated['fee_amount'] ?? $engagementEvent->registration_fee) > 0 ? 'Paid' : 'Unpaid'),
        ]);

        $guestCount = (int) ($registration->guest_count ?? 0);
        $engagementEvent->increment('participants_count', 1 + $guestCount);
        if ($guestCount > 0) {
            $engagementEvent->increment('guest_count', $guestCount);
        }

        if (($registration->fee_amount ?? 0) > 0) {
            EventPayment::create([
                'engagement_event_id' => $engagementEvent->id,
                'event_registration_id' => $registration->id,
                'payer_name' => trim($registration->first_name . ' ' . $registration->last_name),
                'payer_email' => $registration->email,
                'amount' => $registration->fee_amount,
                'payment_method' => $request->input('payment_method', 'Cash'),
                'status' => $registration->payment_status,
                'paid_at' => now(),
            ]);
        }

        return response()->json([
            'message' => 'Registration saved successfully',
            'registration' => $registration,
            'event' => $engagementEvent->fresh(),
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