<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $category = DB::table('categories')->where('order', 2)->first();

        if (!$category) {
            return;
        }

        $genderQuestion = DB::table('questions')
            ->where('category_id', $category->id)
            ->where('text', 'Gender')
            ->first();

        if (!$genderQuestion) {
            return;
        }

        $this->replaceAnswers($genderQuestion->id, [
            'Male',
            'Female',
            'Transgender',
            'Non-Binary',
            'Self-describe',
            'Prefer not to say',
        ]);
    }

    public function down(): void
    {
        $category = DB::table('categories')->where('order', 2)->first();

        if (!$category) {
            return;
        }

        $genderQuestion = DB::table('questions')
            ->where('category_id', $category->id)
            ->where('text', 'Gender')
            ->first();

        if (!$genderQuestion) {
            return;
        }

        $this->replaceAnswers($genderQuestion->id, [
            'Male',
            'Female',
            'Transgender',
            'Non-Binary',
            'Self-describe',
        ]);
    }

    private function replaceAnswers(string $questionId, array $answerTexts): void
    {
        DB::table('answers')->where('question_id', $questionId)->delete();

        $rows = [];
        $now = now();

        foreach ($answerTexts as $index => $text) {
            $rows[] = [
                'id' => (string) Str::uuid(),
                'question_id' => $questionId,
                'text' => $text,
                'order' => $index + 1,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('answers')->insert($rows);
    }
};
