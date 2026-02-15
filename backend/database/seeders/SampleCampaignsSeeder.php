<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DonationCampaign;
use Carbon\Carbon;

class SampleCampaignsSeeder extends Seeder
{
    public function run(): void
    {
        $campaigns = [
            [
                'title' => 'New Engineering Laboratory Equipment',
                'description' => 'State-of-the-art equipment for our engineering students to conduct cutting-edge research and hands-on learning.',
                'category' => 'Infrastructure',
                'image_url' => 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800',
                'goal_amount' => 5000000,
                'raised_amount' => 3850000,
                'end_date' => Carbon::now()->addDays(45),
                'is_active' => true,
            ],
            [
                'title' => 'Scholarship Fund for Underprivileged Students',
                'description' => 'Provide full scholarship opportunities for deserving students from low-income families across Mindanao.',
                'category' => 'Scholarships',
                'image_url' => 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
                'goal_amount' => 10000000,
                'raised_amount' => 7250000,
                'end_date' => Carbon::now()->addDays(30),
                'is_active' => true,
            ],
        ];

        foreach ($campaigns as $campaign) {
            DonationCampaign::create($campaign);
        }

        // Add some sample donations for each campaign
        $campaign1 = DonationCampaign::where('title', 'New Engineering Laboratory Equipment')->first();
        if ($campaign1) {
            $totalAmount = 0;
            for ($i = 1; $i <= 127; $i++) {
                $amount = rand(1000, 50000);
                $totalAmount += $amount;
                \App\Models\Donation::create([
                    'campaign_id' => $campaign1->id,
                    'first_name' => 'Donor',
                    'last_name' => $i,
                    'email' => "donor{$i}@example.com",
                    'amount' => $amount,
                    'payment_method' => 'card',
                ]);
            }
            // Update raised amount to match actual donations
            $campaign1->raised_amount = $totalAmount;
            $campaign1->save();
        }

        $campaign2 = DonationCampaign::where('title', 'Scholarship Fund for Underprivileged Students')->first();
        if ($campaign2) {
            $totalAmount = 0;
            for ($i = 1; $i <= 342; $i++) {
                $amount = rand(1000, 30000);
                $totalAmount += $amount;
                \App\Models\Donation::create([
                    'campaign_id' => $campaign2->id,
                    'first_name' => 'Supporter',
                    'last_name' => $i,
                    'email' => "supporter{$i}@example.com",
                    'amount' => $amount,
                    'payment_method' => 'card',
                ]);
            }
            // Update raised amount to match actual donations
            $campaign2->raised_amount = $totalAmount;
            $campaign2->save();
        }

        // Add some general donations (no campaign)
        for ($i = 1; $i <= 50; $i++) {
            \App\Models\Donation::create([
                'campaign_id' => null,
                'first_name' => 'General',
                'last_name' => "Donor{$i}",
                'email' => "general{$i}@example.com",
                'amount' => rand(500, 25000),
                'payment_method' => 'card',
                'created_at' => now()->subDays(rand(0, 45)),
            ]);
        }
    }
}
