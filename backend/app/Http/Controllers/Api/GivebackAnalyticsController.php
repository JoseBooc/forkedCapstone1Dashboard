<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EngagementActivity;
use App\Models\EngagementRegistration;
use App\Models\GivebackProgram;
use App\Models\GivebackProject;
use Illuminate\Support\Facades\DB;

class GivebackAnalyticsController extends Controller
{
    public function overview()
    {
        $totalRegistrants = EngagementRegistration::count();
        $paidUsers = EngagementRegistration::where('payment_status', 'verified')->count();
        $pendingPayments = EngagementRegistration::where('payment_status', 'pending')->count();
        $totalFunds = EngagementRegistration::where('payment_status', 'verified')->sum('amount_due');

        $activeProjects = GivebackProject::where('status', 'ongoing')->where('is_archived', false)->count();
        $activePrograms = GivebackProgram::where('status', 'ongoing')->where('is_archived', false)->count();

        $monthlyRegistrations = EngagementRegistration::select(
                DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
                DB::raw('COUNT(*) as registrations'),
                DB::raw('SUM(CASE WHEN payment_status = "verified" THEN amount_due ELSE 0 END) as verified_total')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json([
            'total_registrants' => $totalRegistrants,
            'paid_users' => $paidUsers,
            'pending_payments' => $pendingPayments,
            'total_funds_raised' => $totalFunds,
            'active_projects' => $activeProjects,
            'active_programs' => $activePrograms,
            'monthly_reports' => $monthlyRegistrations,
        ]);
    }

    public function project($id)
    {
        $project = GivebackProject::with('events')->findOrFail($id);
        $events = $project->events;

        return response()->json([
            'project' => $project,
            'total_events' => $events->count(),
            'upcoming_events' => $events->where('status', 'upcoming')->count(),
            'ongoing_events' => $events->where('status', 'ongoing')->count(),
            'completed_events' => $events->where('status', 'completed')->count(),
        ]);
    }

    public function activity($id)
    {
        $activity = EngagementActivity::findOrFail($id);
        $registrations = EngagementRegistration::where('activity_id', $id);

        $totalRegistrants = $registrations->count();
        $paidUsers = $registrations->where('payment_status', 'verified')->count();
        $pendingPayments = $registrations->where('payment_status', 'pending')->count();
        $totalFunds = $registrations->where('payment_status', 'verified')->sum('amount_due');

        return response()->json([
            'activity' => $activity,
            'total_registrants' => $totalRegistrants,
            'paid_users' => $paidUsers,
            'pending_payments' => $pendingPayments,
            'total_funds_raised' => $totalFunds,
        ]);
    }
}
