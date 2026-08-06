<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CareerOpportunity;
use Illuminate\Http\Request;

class CareerOpportunityController extends Controller
{
    public function index(Request $request)
    {
        $query = CareerOpportunity::query()->where('status', 'published');

        if ($request->filled('type')) {
            $query->where('type', $request->string('type'));
        }

        if ($request->filled('modality')) {
            $query->where('modality', $request->string('modality'));
        }

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%");
            });
        }

        $opportunities = $query->orderByDesc('is_priority')->orderByDesc('created_at')->get();

        return response()->json($opportunities);
    }

    public function show($id)
    {
        return response()->json(CareerOpportunity::findOrFail($id));
    }

    public function destroy($id)
    {
        $opportunity = CareerOpportunity::findOrFail($id);
        $opportunity->delete();

        return response()->json(['message' => 'Opportunity deleted successfully']);
    }
}
