<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $category = DB::table('categories')->where('order', 2)->first();
        if (!$category) {
            return;
        }

        $this->combinePair(
            $category->id,
            'Month of first marriage',
            'Year of first marriage',
            'Date of first marriage'
        );

        $this->combinePair(
            $category->id,
            'Month started living together',
            'Year started living together',
            'Date started living together'
        );

        // Normalize order for section 2 after removals.
        $questions = DB::table('questions')
            ->where('category_id', $category->id)
            ->orderBy('order')
            ->get();

        foreach ($questions as $index => $question) {
            DB::table('questions')
                ->where('id', $question->id)
                ->update([
                    'order' => $index + 1,
                    'updated_at' => now(),
                ]);
        }
    }

    public function down(): void
    {
        // Intentionally left minimal because restoring deleted year questions
        // cannot be done safely without reconstructing prior answers.
    }

    private function combinePair(string $categoryId, string $monthText, string $yearText, string $newText): void
    {
        $monthQuestion = DB::table('questions')
            ->where('category_id', $categoryId)
            ->where('text', $monthText)
            ->first();

        if (!$monthQuestion) {
            return;
        }

        DB::table('questions')
            ->where('id', $monthQuestion->id)
            ->update([
                'text' => $newText,
                'type' => 'date',
                'placeholder' => '',
                'updated_at' => now(),
            ]);

        DB::table('answers')->where('question_id', $monthQuestion->id)->delete();

        $yearQuestion = DB::table('questions')
            ->where('category_id', $categoryId)
            ->where('text', $yearText)
            ->first();

        if ($yearQuestion) {
            DB::table('questions')->where('id', $yearQuestion->id)->delete();
        }
    }
};
