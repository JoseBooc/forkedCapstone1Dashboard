<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Question;
use App\Models\Answer;
use App\Models\Response;
use App\Models\ResponseAnswer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function index()
    {
        $categories = Category::with('questions.answers')->orderBy('order')->get();
        return view('admin.index', compact('categories'));
    }

    public function responses()
    {
        $responses = Response::orderBy('submitted_at', 'desc')->get();
        $categories = Category::with('questions')->orderBy('order')->get();

        // Build question lookup
        $questionLookup = [];
        foreach ($categories as $cat) {
            foreach ($cat->questions as $q) {
                $questionLookup[$q->id] = [
                    'text' => $q->text,
                    'category_title' => $cat->title,
                    'category_order' => $cat->order,
                    'question_order' => $q->order,
                ];
            }
        }

        return view('admin.responses', compact('responses', 'questionLookup'));
    }

    public function responseDetails(string $responseId)
    {
        $answers = ResponseAnswer::where('response_id', $responseId)->get();
        $categories = Category::with('questions')->orderBy('order')->get();

        $questionLookup = [];
        foreach ($categories as $cat) {
            foreach ($cat->questions as $q) {
                $questionLookup[$q->id] = [
                    'text' => $q->text,
                    'category_title' => $cat->title,
                    'category_order' => $cat->order,
                    'question_order' => $q->order,
                ];
            }
        }

        $enriched = $answers->map(function ($ra) use ($questionLookup) {
            $q = $questionLookup[$ra->question_id] ?? null;
            return [
                'id' => $ra->id,
                'question_id' => $ra->question_id,
                'value' => $ra->value,
                'values' => $ra->values,
                'question_text' => $q ? $q['text'] : $ra->question_id,
                'category_title' => $q ? $q['category_title'] : 'Unknown',
                'category_order' => $q ? $q['category_order'] : 999,
                'question_order' => $q ? $q['question_order'] : 999,
            ];
        })->sortBy(['category_order', 'question_order'])->values();

        return response()->json($enriched);
    }

    public function exportCsv()
    {
        $responses = Response::orderBy('submitted_at', 'desc')->get();
        $allAnswers = ResponseAnswer::all();
        $categories = Category::with('questions')->orderBy('order')->get();

        $questionLookup = [];
        $qIds = [];
        foreach ($categories as $cat) {
            foreach ($cat->questions()->orderBy('order')->get() as $q) {
                $questionLookup[$q->id] = $q->text;
                $qIds[] = $q->id;
            }
        }

        // Group answers by response
        $byResponse = [];
        foreach ($allAnswers as $ra) {
            if (!isset($byResponse[$ra->response_id])) {
                $byResponse[$ra->response_id] = [];
            }
            $byResponse[$ra->response_id][$ra->question_id] =
                ($ra->values && count($ra->values) > 0) ? implode('; ', $ra->values) : ($ra->value ?? '');
        }

        $headers = array_merge(['Response ID', 'Submitted At'], array_map(fn($id) => $questionLookup[$id] ?? $id, $qIds));

        $callback = function () use ($responses, $qIds, $byResponse, $headers) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $headers);

            foreach ($responses as $r) {
                $ans = $byResponse[$r->id] ?? [];
                $row = [
                    $r->id,
                    $r->submitted_at?->format('M d, Y g:i A'),
                ];
                foreach ($qIds as $qId) {
                    $row[] = $ans[$qId] ?? '';
                }
                fputcsv($file, $row);
            }

            fclose($file);
        };

        $filename = 'tracer-study-responses-' . now()->format('Y-m-d') . '.csv';

        return response()->stream($callback, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    // Category CRUD
    public function storeCategory(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
        ]);

        $order = Category::count() + 1;

        $category = Category::create([
            'title' => $request->title,
            'description' => $request->description ?? '',
            'order' => $order,
        ]);

        return response()->json($category->load('questions.answers'));
    }

    public function updateCategory(Request $request, string $id)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
        ]);

        $category = Category::findOrFail($id);
        $category->update([
            'title' => $request->title,
            'description' => $request->description ?? '',
        ]);

        return response()->json($category);
    }

    public function deleteCategory(string $id)
    {
        Category::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // Question CRUD
    public function storeQuestion(Request $request)
    {
        $request->validate([
            'category_id' => 'required|uuid|exists:categories,id',
            'text' => 'required|string',
            'type' => 'required|string',
        ]);

        $question = Question::create([
            'category_id' => $request->category_id,
            'text' => $request->text,
            'type' => $request->type,
            'required' => $request->boolean('required'),
            'placeholder' => $request->placeholder ?? '',
            'help_text' => $request->help_text ?? '',
            'order' => $request->order ?? 0,
            'condition_question_id' => $request->condition_question_id,
            'condition_operator' => $request->condition_operator,
            'condition_value' => $request->condition_value,
        ]);

        // Save answers
        if ($request->has('answers')) {
            foreach ($request->answers as $a) {
                Answer::create([
                    'question_id' => $question->id,
                    'text' => $a['text'],
                    'order' => $a['order'] ?? 0,
                ]);
            }
        }

        return response()->json($question->load('answers'));
    }

    public function updateQuestion(Request $request, string $id)
    {
        $request->validate([
            'text' => 'required|string',
            'type' => 'required|string',
        ]);

        $question = Question::findOrFail($id);
        $question->update([
            'text' => $request->text,
            'type' => $request->type,
            'required' => $request->boolean('required'),
            'placeholder' => $request->placeholder ?? '',
            'help_text' => $request->help_text ?? '',
            'order' => $request->order ?? $question->order,
            'condition_question_id' => $request->condition_question_id,
            'condition_operator' => $request->condition_operator,
            'condition_value' => $request->condition_value,
        ]);

        // Sync answers
        if ($request->has('answers')) {
            $question->answers()->delete();
            foreach ($request->answers as $a) {
                Answer::create([
                    'question_id' => $question->id,
                    'text' => $a['text'],
                    'order' => $a['order'] ?? 0,
                ]);
            }
        }

        return response()->json($question->load('answers'));
    }

    public function deleteQuestion(string $id)
    {
        Question::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    public function reorderQuestions(Request $request)
    {
        $request->validate([
            'category_id' => 'required|uuid|exists:categories,id',
            'question_orders' => 'required|array|min:1',
            'question_orders.*.id' => 'required|uuid|exists:questions,id',
            'question_orders.*.order' => 'required|integer|min:1',
        ]);

        $categoryId = $request->category_id;
        $questionOrders = collect($request->question_orders);
        $questionIds = $questionOrders->pluck('id')->all();

        $matchedCount = Question::where('category_id', $categoryId)
            ->whereIn('id', $questionIds)
            ->count();

        if ($matchedCount !== count($questionIds)) {
            return response()->json(['message' => 'One or more questions do not belong to this category.'], 422);
        }

        DB::transaction(function () use ($questionOrders, $categoryId) {
            foreach ($questionOrders as $item) {
                Question::where('id', $item['id'])
                    ->where('category_id', $categoryId)
                    ->update(['order' => $item['order']]);
            }
        });

        $questions = Question::with('answers')
            ->where('category_id', $categoryId)
            ->orderBy('order')
            ->get();

        return response()->json($questions);
    }

    // API: get all categories with questions for the admin JS
    public function categoriesJson()
    {
        $categories = Category::with('questions.answers')->orderBy('order')->get();
        return response()->json($categories);
    }
}
