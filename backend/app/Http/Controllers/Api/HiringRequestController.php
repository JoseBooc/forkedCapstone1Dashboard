<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CareerOpportunity;
use App\Models\HiringRequest;
use Illuminate\Http\Request;

class HiringRequestController extends Controller
{
    public function index(Request $request)
    {
        $query = HiringRequest::query()->orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|in:Job,Internship',
            'title' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'work_type' => 'required|string|max:100',
            'modality' => 'required|string|in:Remote,Hybrid,On-site',
            'salary_range' => 'nullable|string|max:100',
            'description' => 'required|string',
            'application_email' => 'required|email',
            'submitted_by_name' => 'nullable|string|max:255',
        ]);

        $hiringRequest = HiringRequest::create($validated + ['status' => 'pending']);

        return response()->json($hiringRequest, 201);
    }

    public function approve(Request $request, $id)
    {
        $hiringRequest = HiringRequest::findOrFail($id);

        if ($hiringRequest->status !== 'pending') {
            return response()->json(['message' => 'Only pending requests can be approved'], 422);
        }

        $validated = $request->validate([
            'reviewed_by_name' => 'nullable|string|max:255',
        ]);

        $opportunity = CareerOpportunity::create([
            'type' => $hiringRequest->type,
            'title' => $hiringRequest->title,
            'company' => $hiringRequest->company,
            'location' => $hiringRequest->location,
            'work_type' => $hiringRequest->work_type,
            'modality' => $hiringRequest->modality,
            'salary_range' => $hiringRequest->salary_range,
            'description' => $hiringRequest->description,
            'application_email' => $hiringRequest->application_email,
            'status' => 'published',
            'posted_by_name' => $hiringRequest->submitted_by_name,
        ]);

        $hiringRequest->update([
            'status' => 'approved',
            'reviewed_by_name' => $validated['reviewed_by_name'] ?? null,
            'reviewed_at' => now(),
            'approved_opportunity_id' => $opportunity->id,
        ]);

        return response()->json($hiringRequest->fresh('approvedOpportunity'));
    }

    public function reject(Request $request, $id)
    {
        $hiringRequest = HiringRequest::findOrFail($id);

        if ($hiringRequest->status !== 'pending') {
            return response()->json(['message' => 'Only pending requests can be rejected'], 422);
        }

        $validated = $request->validate([
            'rejection_reason' => 'nullable|string',
            'reviewed_by_name' => 'nullable|string|max:255',
        ]);

        $hiringRequest->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'] ?? null,
            'reviewed_by_name' => $validated['reviewed_by_name'] ?? null,
            'reviewed_at' => now(),
        ]);

        return response()->json($hiringRequest);
    }
}
