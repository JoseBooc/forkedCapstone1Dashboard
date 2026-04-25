<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CareerApplication;
use App\Models\CareerPosting;
use Illuminate\Http\Request;

class CareerPostingController extends Controller
{
    public function index(Request $request)
    {
        CareerPosting::expireStalePosts();

        $role = $request->query('role');

        $query = CareerPosting::query()
            ->withCount('applications')
            ->orderByDesc('posting_date')
            ->orderByDesc('date_of_posting')
            ->orderByDesc('created_at');

        if ($role !== 'admin') {
            $query->where('status', 'Approved')
                ->where('is_visible', true)
                ->whereDate('date_to', '>=', now()->toDateString());
        }

        return response()->json($query->get());
    }

    public function show(Request $request, CareerPosting $careerPosting)
    {
        CareerPosting::expireStalePosts();

        if ($request->query('role') !== 'admin') {
            abort_if(!$careerPosting->is_visible || $careerPosting->status !== 'Approved' || $careerPosting->is_expired, 404);
        }

        return response()->json($careerPosting->loadCount('applications'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'job_title' => 'nullable|string|max:255|required_without:title',
            'company_name' => 'required|string|max:255',
            'title' => 'nullable|string|max:255|required_without:job_title',
            'type' => 'required|string|in:Job,Internship',
            'location' => 'required|string|max:255',
            'work_type' => 'required|string|max:255',
            'modality' => 'required|string|max:255',
            'date_from' => 'required|date',
            'date_to' => 'required|date|after_or_equal:date_from',
            'posting_date' => 'nullable|date|required_without:date_of_posting',
            'date_of_posting' => 'nullable|date|required_without:posting_date',
            'quantity' => 'required|integer|min:1',
            'salary_range_from' => 'nullable|numeric|min:0',
            'salary_range_to' => 'nullable|numeric|min:0|gte:salary_range_from',
            'salary_from' => 'nullable|numeric|min:0',
            'salary_to' => 'nullable|numeric|min:0|gte:salary_from',
            'description' => 'required|string',
            'status' => 'nullable|string|in:Pending,Approved,Declined,Expired',
        ]);

        $title = $validated['title'] ?? $validated['job_title'];
        $postingDate = $validated['posting_date'] ?? $validated['date_of_posting'];
        $salaryRangeFrom = $validated['salary_range_from'] ?? $validated['salary_from'] ?? null;
        $salaryRangeTo = $validated['salary_range_to'] ?? $validated['salary_to'] ?? null;

        $posting = CareerPosting::create([
            'company_name' => $validated['company_name'],
            'title' => $title,
            'type' => $validated['type'],
            'location' => $validated['location'],
            'work_type' => $validated['work_type'],
            'modality' => $validated['modality'],
            'date_from' => $validated['date_from'],
            'date_to' => $validated['date_to'],
            'posting_date' => $postingDate,
            'date_of_posting' => $postingDate,
            'quantity' => $validated['quantity'],
            'salary_range_from' => $salaryRangeFrom,
            'salary_range_to' => $salaryRangeTo,
            'salary_from' => $salaryRangeFrom,
            'salary_to' => $salaryRangeTo,
            'description' => $validated['description'],
            'status' => $validated['status'] ?? 'Pending',
            'applicants_count' => 0,
            'is_visible' => ($validated['status'] ?? 'Pending') === 'Approved',
            'hidden_at' => null,
        ]);

        if (!$request->expectsJson()) {
            return redirect()->back()->with('success', 'Career posting created successfully');
        }

        return response()->json([
            'message' => 'Career posting created successfully',
            'posting' => $posting,
        ], 201);
    }

    public function approve(CareerPosting $careerPosting)
    {
        $careerPosting->update([
            'status' => 'Approved',
            'is_visible' => true,
            'hidden_at' => null,
        ]);

        return response()->json([
            'message' => 'Career posting approved successfully',
            'posting' => $careerPosting->fresh(),
        ]);
    }

    public function decline(CareerPosting $careerPosting)
    {
        $careerPosting->update([
            'status' => 'Declined',
            'is_visible' => false,
            'hidden_at' => now(),
        ]);

        return response()->json([
            'message' => 'Career posting declined successfully',
            'posting' => $careerPosting->fresh(),
        ]);
    }

    public function toggleVisibility(CareerPosting $careerPosting)
    {
        $careerPosting->update([
            'is_visible' => !$careerPosting->is_visible,
            'hidden_at' => $careerPosting->is_visible ? now() : null,
        ]);

        return response()->json([
            'message' => 'Career posting visibility updated successfully',
            'posting' => $careerPosting->fresh(),
        ]);
    }

    public function destroy(CareerPosting $careerPosting)
    {
        $careerPosting->delete();

        return response()->json(['message' => 'Career posting deleted successfully']);
    }

    public function addApplication(Request $request, CareerPosting $careerPosting)
    {
        $validated = $request->validate([
            'applicant_name' => 'required|string|max:255',
            'applicant_email' => 'required|email|max:255',
            'applicant_phone' => 'nullable|string|max:50',
            'cover_letter' => 'nullable|string',
        ]);

        $application = CareerApplication::create([
            'career_posting_id' => $careerPosting->id,
            ...$validated,
        ]);

        $careerPosting->increment('applicants_count');

        return response()->json([
            'message' => 'Application submitted successfully',
            'application' => $application,
            'posting' => $careerPosting->fresh(),
        ], 201);
    }
}