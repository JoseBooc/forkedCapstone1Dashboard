<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EngagementActivity;
use App\Models\EngagementRegistration;
use Dompdf\Dompdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EngagementRegistrationController extends Controller
{
    public function index(Request $request)
    {
        $activityId = $request->query('activity_id');

        $query = EngagementRegistration::query()->with('activity')->orderBy('created_at', 'desc');
        if ($activityId) {
            $query->where('activity_id', $activityId);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'activity_id' => 'required|exists:engagement_activities,id',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'guests_count' => 'nullable|integer|min:0',
            'amount_due' => 'required|numeric|min:0',
            'payment_method' => 'required|string|in:gcash,bank_transfer,cash',
            'reference_number' => 'nullable|string|max:255|unique:engagement_registrations,reference_number',
            'proof' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp,pdf|max:4096',
        ]);

        $activity = EngagementActivity::findOrFail($validated['activity_id']);
        if (!$activity->registration_open) {
            return response()->json(['message' => 'Registration is closed for this activity.'], 422);
        }

        $requiresReference = in_array($validated['payment_method'], ['gcash', 'bank_transfer'], true);
        if ($requiresReference && empty($validated['reference_number'])) {
            return response()->json(['message' => 'Reference number is required for the selected payment method.'], 422);
        }

        if ($requiresReference && !$request->hasFile('proof')) {
            return response()->json(['message' => 'Proof of payment is required for the selected payment method.'], 422);
        }

        $paymentStatus = $validated['payment_method'] === 'cash' ? 'pending' : 'pending';
        $proofPath = null;

        if ($request->hasFile('proof')) {
            $proofPath = $request->file('proof')->store('engagement-payments', 'public');
        }

        $registration = EngagementRegistration::create([
            'activity_id' => $activity->id,
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'guests_count' => $validated['guests_count'] ?? 0,
            'amount_due' => $validated['amount_due'],
            'payment_method' => $validated['payment_method'],
            'reference_number' => $validated['reference_number'] ?? null,
            'proof_path' => $proofPath ? '/storage/' . $proofPath : null,
            'payment_status' => $paymentStatus,
            'status' => 'registered',
        ]);

        return response()->json([
            'message' => 'Registration submitted successfully.',
            'registration' => $registration,
        ], 201);
    }

    public function updatePaymentStatus(Request $request, $id)
    {
        $registration = EngagementRegistration::findOrFail($id);

        $validated = $request->validate([
            'payment_status' => 'required|string|in:pending,verified,rejected',
        ]);

        $registration->update(['payment_status' => $validated['payment_status']]);

        return response()->json($registration);
    }

    public function receipt($id)
    {
        $registration = EngagementRegistration::with('activity')->findOrFail($id);
        $activity = $registration->activity;

        $html = view('pdf.engagement-receipt', [
            'registration' => $registration,
            'activity' => $activity,
        ])->render();

        $dompdf = new Dompdf();
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        return response($dompdf->output())
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="giveback-receipt-' . $registration->id . '.pdf"');
    }

    public function updateVisibility(Request $request, $id)
    {
        $registration = EngagementRegistration::findOrFail($id);
        $registration->is_hidden = $request->input('is_hidden');
        $registration->save();

        return response()->json(['message' => 'Visibility updated successfully']);
    }
}