<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DonationCampaign;
use App\Models\Donation;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DonationCampaignController extends Controller
{
    public function index(Request $request)
    {
        $role = $request->query('role');
        
        // Auto-deactivate expired campaigns
        DonationCampaign::where('is_active', true)
            ->where('end_date', '<', Carbon::now()->startOfDay())
            ->update(['is_active' => false]);
        
        if ($role === 'admin') {
            // Admin sees all campaigns
            $campaigns = DonationCampaign::orderBy('created_at', 'desc')->get();
        } else {
            // Regular users only see active campaigns
            $campaigns = DonationCampaign::where('is_active', true)
                ->orderBy('created_at', 'desc')
                ->get();
        }
        
        return response()->json($campaigns);
    }

    public function show($id)
    {
        $campaign = DonationCampaign::findOrFail($id);
        return response()->json($campaign);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'nullable|string|max:255',
            'image_url' => 'nullable|string|max:1000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'goal_amount' => 'required|numeric|min:1',
            'end_date' => 'required|date',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $imagePath = $image->storeAs('campaign-images', $imageName, 'public');
            $validated['image_url'] = '/storage/' . $imagePath;
        }

        $campaign = DonationCampaign::create($validated);
        
        return response()->json($campaign, 201);
    }

    public function update(Request $request, $id)
    {
        $campaign = DonationCampaign::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'nullable|string|max:255',
            'image_url' => 'nullable|string|max:1000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'goal_amount' => 'required|numeric|min:1',
            'end_date' => 'required|date',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($campaign->image_url && \Storage::disk('public')->exists(str_replace('/storage/', '', $campaign->image_url))) {
                \Storage::disk('public')->delete(str_replace('/storage/', '', $campaign->image_url));
            }
            
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $imagePath = $image->storeAs('campaign-images', $imageName, 'public');
            $validated['image_url'] = '/storage/' . $imagePath;
        }

        $campaign->update($validated);
        
        return response()->json($campaign);
    }

    public function destroy($id)
    {
        $campaign = DonationCampaign::findOrFail($id);
        $campaign->delete();
        
        return response()->json(['message' => 'Campaign deleted successfully']);
    }

    public function toggleActive($id)
    {
        $campaign = DonationCampaign::findOrFail($id);
        $campaign->is_active = !$campaign->is_active;
        $campaign->save();
        
        return response()->json($campaign);
    }

    public function addDonation(Request $request, $id)
    {
        $campaign = DonationCampaign::findOrFail($id);
        
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'payment_method' => 'required|string|in:Credit Card,GCash,Bank Transfer',
            'reference_number' => 'nullable|string|max:255',
            'transaction_date' => 'nullable|date',
            'gcash_number' => 'nullable|string|max:255',
            'account_name' => 'nullable|string|max:255',
            'bank_name' => 'nullable|string|max:255',
            'card_number' => 'nullable|string|max:255',
            'proof' => 'required|image|max:5120',
        ]);

        if ($validated['payment_method'] === 'GCash') {
            if (empty($validated['gcash_number']) || empty($validated['reference_number']) || empty($validated['transaction_date'])) {
                return response()->json(['message' => 'Please fill in all GCash payment fields.'], 422);
            }
        }

        if ($validated['payment_method'] === 'Bank Transfer') {
            if (empty($validated['account_name']) || empty($validated['bank_name']) || empty($validated['reference_number']) || empty($validated['transaction_date'])) {
                return response()->json(['message' => 'Please fill in all Bank Transfer fields.'], 422);
            }
        }

        if ($validated['payment_method'] === 'Credit Card') {
            if (empty($validated['card_number'])) {
                return response()->json(['message' => 'Please provide your card number.'], 422);
            }
        }

        $proofPath = null;
        if ($request->hasFile('proof')) {
            $storedPath = $request->file('proof')->store('donation-proofs', 'public');
            $proofPath = '/storage/' . $storedPath;
        }

        $donation = new Donation([
            'campaign_id' => $campaign->id,
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'amount' => $validated['amount'],
            'frequency' => 'One-Time',
            'designation' => 'Campaign: ' . $campaign->title,
            'payment_method' => $validated['payment_method'],
            'reference_number' => $validated['reference_number'] ?? null,
            'transaction_date' => $validated['transaction_date'] ?? null,
            'gcash_number' => $validated['gcash_number'] ?? null,
            'account_name' => $validated['account_name'] ?? null,
            'bank_name' => $validated['bank_name'] ?? null,
            'card_number' => $validated['card_number'] ?? null,
            'proof_path' => $proofPath,
            'payment_status' => 'pending',
        ]);
        
        $donation->save();

        return response()->json([
            'message' => 'Donation submitted successfully and is pending verification.',
            'donation' => $donation,
            'campaign' => $campaign,
        ], 201);
    }

    public function getDonors($id)
    {
        $campaign = DonationCampaign::findOrFail($id);
        $donors = $campaign->donations()
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($donors);
    }
}