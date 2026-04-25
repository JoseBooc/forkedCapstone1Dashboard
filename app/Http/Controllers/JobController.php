<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;

class JobController extends Controller
{
    public function index(Request $request)
    {
        $role = strtolower((string) ($request->query('role') ?? optional($request->user())->role ?? optional(auth()->user())->role ?? 'alumni'));
        $currentUserEmail = optional(auth()->user())->email
            ?? optional($request->user())->email
            ?? $request->query('user_email');

        $query = Job::query()->orderByDesc('posting_date')->orderByDesc('created_at');

        if ($role === 'admin') {
            $query->where('status', 'pending');
        } else {
            if (!$currentUserEmail) {
                return response()->json([]);
            }

            $query->where('submitted_by_email', $currentUserEmail);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $role = strtolower((string) (optional(auth()->user())->role ?? optional($request->user())->role ?? $request->input('user_role') ?? 'alumni'));
        $submittedByEmail = optional(auth()->user())->email
            ?? optional($request->user())->email
            ?? $request->input('user_email');
        $isAdmin = $role === 'admin';

        $validated = $request->validate([
            'job_title' => 'nullable|string|max:255|required_without:title',
            'title' => 'nullable|string|max:255|required_without:job_title',
            'company_name' => 'required|string|max:255',
            'type' => 'required|string|in:Job,Internship',
            'location' => 'required|string|max:255',
            'work_type' => 'required|string|max:255',
            'modality' => 'required|string|in:Remote,Hybrid,On-site',
            'date_from' => 'required|date',
            'date_to' => 'required|date|after_or_equal:date_from',
            'posting_date' => 'required|date',
            'quantity' => 'required|integer|min:1',
            'salary_range_from' => 'required|numeric|min:0',
            'salary_range_to' => 'required|numeric|min:0|gte:salary_range_from',
            'description' => 'required|string',
        ]);

        $job = Job::create([
            'title' => $validated['title'] ?? $validated['job_title'],
            'company_name' => $validated['company_name'],
            'type' => $validated['type'],
            'location' => $validated['location'],
            'work_type' => $validated['work_type'],
            'modality' => $validated['modality'],
            'date_from' => $validated['date_from'],
            'date_to' => $validated['date_to'],
            'posting_date' => $validated['posting_date'],
            'quantity' => $validated['quantity'],
            'salary_range_from' => $validated['salary_range_from'],
            'salary_range_to' => $validated['salary_range_to'],
            'description' => $validated['description'],
            'submitted_by_email' => $submittedByEmail,
            'status' => $isAdmin ? 'approved' : 'pending',
            'applicants_count' => 0,
            'is_visible' => $isAdmin,
            'hidden_at' => $isAdmin ? null : now(),
        ]);

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Job posted successfully.',
                'job' => $job,
            ], 201);
        }

        return redirect()->back()->with('success', 'Job posted successfully.');
    }

    public function approve(Job $job, Request $request)
    {
        $role = strtolower((string) (optional(auth()->user())->role ?? optional($request->user())->role ?? $request->input('user_role') ?? 'alumni'));
        abort_unless($role === 'admin', 403, 'Only admins can approve job postings.');

        if ($job->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending job postings can be approved.',
                'job' => $job,
            ], 422);
        }

        $job->update([
            'status' => 'approved',
            'is_visible' => true,
            'hidden_at' => null,
        ]);

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Job approved successfully.',
                'job' => $job->fresh(),
            ]);
        }

        return redirect()->back()->with('success', 'Job approved successfully.');
    }
}
