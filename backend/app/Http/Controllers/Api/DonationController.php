<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use Illuminate\Http\Request;

class DonationController extends Controller
{
    public function index()
    {
        $donations = Donation::with('campaign')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($donations);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'frequency' => 'nullable|string|max:255',
            'designation' => 'nullable|string|max:255',
            'payment_method' => 'nullable|string|max:255',
            'reference_number' => 'nullable|string|max:255',
            'transaction_date' => 'nullable|date',
            'gcash_number' => 'nullable|string|max:255',
            'account_name' => 'nullable|string|max:255',
            'bank_name' => 'nullable|string|max:255',
            'card_number' => 'nullable|string|max:255',
            'proof' => 'nullable|image|max:5120',
        ]);

        $proofPath = null;
        if ($request->hasFile('proof')) {
            $storedPath = $request->file('proof')->store('donation-proofs', 'public');
            $proofPath = '/storage/' . $storedPath;
        }

        $donation = Donation::create([
            'campaign_id' => null,
            'first_name' => $validated['first_name'] ?? 'Anonymous',
            'last_name' => $validated['last_name'] ?? 'Donor',
            'email' => $validated['email'] ?? 'anonymous@local.test',
            'amount' => $validated['amount'],
            'frequency' => $validated['frequency'] ?? 'One-Time',
            'designation' => $validated['designation'] ?? null,
            'payment_method' => $validated['payment_method'] ?? 'Credit Card',
            'reference_number' => $validated['reference_number'] ?? null,
            'transaction_date' => $validated['transaction_date'] ?? null,
            'gcash_number' => $validated['gcash_number'] ?? null,
            'account_name' => $validated['account_name'] ?? null,
            'bank_name' => $validated['bank_name'] ?? null,
            'card_number' => $validated['card_number'] ?? null,
            'proof_path' => $proofPath,
            'payment_status' => 'pending',
        ]);
        
        return response()->json([
            'message' => 'Donation recorded successfully',
            'id' => $donation->id,
            'donation' => $donation,
        ], 201);
    }

    public function updatePaymentStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'payment_status' => 'required|in:pending,verified,rejected',
        ]);

        $donation = Donation::findOrFail($id);
        $previousStatus = $donation->payment_status;
        $donation->payment_status = $validated['payment_status'];
        $donation->save();

        if ($donation->campaign) {
            if ($previousStatus !== 'verified' && $donation->payment_status === 'verified') {
                $donation->campaign->raised_amount = (float) $donation->campaign->raised_amount + (float) $donation->amount;
                $donation->campaign->save();
            }

            if ($previousStatus === 'verified' && $donation->payment_status !== 'verified') {
                $donation->campaign->raised_amount = max(
                    0,
                    (float) $donation->campaign->raised_amount - (float) $donation->amount
                );
                $donation->campaign->save();
            }
        }

        return response()->json([
            'message' => 'Donation payment status updated successfully',
            'donation' => $donation,
        ]);
    }

    public function getByEmail($email)
    {
        $donations = Donation::where('email', $email)
            ->with('campaign')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($donations);
    }

    public function getStatistics()
    {
        $currentYear = date('Y');
        
        $totalRaisedThisYear = Donation::whereYear('created_at', $currentYear)->sum('amount');
        
        $activeDonors = Donation::whereYear('created_at', $currentYear)
            ->distinct('email')
            ->count('email');
        
        $scholarshipsAwarded = 1200;
        
        return response()->json([
            'total_raised_this_year' => $totalRaisedThisYear,
            'active_donors' => $activeDonors,
            'scholarships_awarded' => $scholarshipsAwarded,
        ]);
    }

    public function getAnalytics()
    {
        $allDonations = Donation::with('campaign')
            ->orderBy('created_at', 'desc')
            ->get();

        $generalDonations = Donation::whereNull('campaign_id')
            ->orderBy('created_at', 'desc')
            ->get();
        
        $generalTotal = $generalDonations->sum('amount');

        $campaignDonations = Donation::whereNotNull('campaign_id')
            ->with('campaign')
            ->get()
            ->groupBy('campaign_id')
            ->map(function ($donations) {
                return [
                    'campaign' => $donations->first()->campaign,
                    'total' => $donations->sum('amount'),
                    'count' => $donations->count(),
                    'donations' => $donations,
                ];
            })
            ->values();

        return response()->json([
            'all_donations' => $allDonations,
            'general_donations' => [
                'donations' => $generalDonations,
                'total' => $generalTotal,
                'count' => $generalDonations->count(),
            ],
            'campaign_donations' => $campaignDonations,
            'overall_total' => $allDonations->sum('amount'),
            'overall_count' => $allDonations->count(),
        ]);
    }

    public function updateVisibility(Request $request, $id)
    {
        $donation = Donation::findOrFail($id);
        $donation->is_hidden = $request->input('is_hidden');
        $donation->save();

        return response()->json(['message' => 'Visibility updated successfully']);
    }
}