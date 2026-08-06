<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GivebackProgram;
use Illuminate\Http\Request;

class GivebackProgramController extends Controller
{
    public function index(Request $request)
    {
        $includeArchived = $request->boolean('include_archived');

        $query = GivebackProgram::query()->orderBy('created_at', 'desc');
        if (!$includeArchived) {
            $query->where('is_archived', false);
        }

        return response()->json($query->get());
    }

    public function show($id)
    {
        return response()->json(GivebackProgram::findOrFail($id));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|in:scholarship,donation,community_support',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'beneficiary' => 'required|string|max:255',
            'funding_goal' => 'required|numeric|min:1',
            'amount_raised' => 'nullable|numeric|min:0',
            'donor_count' => 'nullable|integer|min:0',
            'status' => 'required|string|in:upcoming,ongoing,completed',
        ]);

        $program = GivebackProgram::create($validated);

        return response()->json($program, 201);
    }

    public function update(Request $request, $id)
    {
        $program = GivebackProgram::findOrFail($id);

        $validated = $request->validate([
            'type' => 'required|string|in:scholarship,donation,community_support',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'beneficiary' => 'required|string|max:255',
            'funding_goal' => 'required|numeric|min:1',
            'amount_raised' => 'required|numeric|min:0',
            'donor_count' => 'required|integer|min:0',
            'status' => 'required|string|in:upcoming,ongoing,completed',
        ]);

        $program->update($validated);

        return response()->json($program);
    }

    public function archive($id)
    {
        $program = GivebackProgram::findOrFail($id);
        $program->update(['is_archived' => true]);

        return response()->json($program);
    }

    public function restore($id)
    {
        $program = GivebackProgram::findOrFail($id);
        $program->update(['is_archived' => false]);

        return response()->json($program);
    }

    public function destroy($id)
    {
        $program = GivebackProgram::findOrFail($id);
        $program->delete();

        return response()->json(['message' => 'Program deleted successfully']);
    }
}
