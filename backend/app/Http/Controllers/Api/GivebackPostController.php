<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GivebackPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GivebackPostController extends Controller
{
    public function index(Request $request)
    {
        $includeArchived = $request->boolean('include_archived');

        $query = GivebackPost::query()->orderBy('created_at', 'desc');
        if (!$includeArchived) {
            $query->where('is_archived', false);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'required|string|max:500',
            'content' => 'required|string',
            'category' => 'required|string|max:100',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('giveback-posts', 'public');
            $validated['image_url'] = '/storage/' . $imagePath;
        }

        $post = GivebackPost::create($validated);

        return response()->json($post, 201);
    }

    public function update(Request $request, $id)
    {
        $post = GivebackPost::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'required|string|max:500',
            'content' => 'required|string',
            'category' => 'required|string|max:100',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($post->image_url && Storage::disk('public')->exists(str_replace('/storage/', '', $post->image_url))) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $post->image_url));
            }

            $imagePath = $request->file('image')->store('giveback-posts', 'public');
            $validated['image_url'] = '/storage/' . $imagePath;
        }

        $post->update($validated);

        return response()->json($post);
    }

    public function archive($id)
    {
        $post = GivebackPost::findOrFail($id);
        $post->update(['is_archived' => true]);

        return response()->json($post);
    }

    public function restore($id)
    {
        $post = GivebackPost::findOrFail($id);
        $post->update(['is_archived' => false]);

        return response()->json($post);
    }

    public function destroy($id)
    {
        $post = GivebackPost::findOrFail($id);

        if ($post->image_url && Storage::disk('public')->exists(str_replace('/storage/', '', $post->image_url))) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $post->image_url));
        }

        $post->delete();

        return response()->json(['message' => 'Post deleted successfully']);
    }
}
