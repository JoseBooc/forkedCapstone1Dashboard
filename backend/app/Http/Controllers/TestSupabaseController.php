<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\SupabaseService;

class TestSupabaseController extends Controller
{
    protected SupabaseService $supabase;

    public function __construct(SupabaseService $supabase)
    {
        $this->supabase = $supabase;
    }

    public function getData()
    {
        // Replace 'your_table_name' with the actual table in Supabase
        $data = $this->supabase->get('your_table_name');

        return response()->json($data);
    }

    public function insertData()
    {
        $data = [
            'name' => 'Test Name',
            'email' => 'test@example.com'
        ];

        $result = $this->supabase->insert('your_table_name', $data);

        return response()->json($result);
    }
}
