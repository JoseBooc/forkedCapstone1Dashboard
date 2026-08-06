<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\SupabaseService;

class SupabaseSeedController extends Controller
{
    public function seed()
    {
        $supabase = new SupabaseService();

        // Example data to insert
        $data = [
            ['id' => 1],
            ['id' => 2],
            ['id' => 3],
        ];

        $results = [];
        foreach ($data as $row) {
            $results[] = $supabase->insert('test_users', $row);
        }

        return response()->json([
            'message' => 'Seed completed',
            'results' => $results
        ]);
    }
}