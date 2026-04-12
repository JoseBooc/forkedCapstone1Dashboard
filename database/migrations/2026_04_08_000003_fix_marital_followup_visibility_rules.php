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

        $statusQuestion = DB::table('questions')
            ->where('category_id', $category->id)
            ->where('text', 'Current marital status')
            ->first();

        if (!$statusQuestion) {
            return;
        }

        $updates = [
            'Month of first marriage' => ['equals', 'Married'],
            'Year of first marriage' => ['equals', 'Married'],
            'Month started living together' => ['equals', 'Married'],
            'Year started living together' => ['equals', 'Married'],
            'Do you intend to get married in the future?' => ['in', '["Never married","Living-in"]'],
        ];

        foreach ($updates as $text => [$operator, $value]) {
            DB::table('questions')
                ->where('category_id', $category->id)
                ->where('text', $text)
                ->update([
                    'condition_question_id' => $statusQuestion->id,
                    'condition_operator' => $operator,
                    'condition_value' => $value,
                    'updated_at' => now(),
                ]);
        }
    }

    public function down(): void
    {
        $category = DB::table('categories')->where('order', 2)->first();
        if (!$category) {
            return;
        }

        $statusQuestion = DB::table('questions')
            ->where('category_id', $category->id)
            ->where('text', 'Current marital status')
            ->first();

        if (!$statusQuestion) {
            return;
        }

        $revert = [
            'Month of first marriage' => ['equals', 'Married'],
            'Year of first marriage' => ['equals', 'Married'],
            'Month started living together' => ['equals', 'Living-in'],
            'Year started living together' => ['equals', 'Living-in'],
            'Do you intend to get married in the future?' => ['equals', 'Living-in'],
        ];

        foreach ($revert as $text => [$operator, $value]) {
            DB::table('questions')
                ->where('category_id', $category->id)
                ->where('text', $text)
                ->update([
                    'condition_question_id' => $statusQuestion->id,
                    'condition_operator' => $operator,
                    'condition_value' => $value,
                    'updated_at' => now(),
                ]);
        }
    }
};
