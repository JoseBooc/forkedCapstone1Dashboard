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
            'Month started living together' => ['equals', 'Living-in'],
            'Year started living together' => ['equals', 'Living-in'],
            'Do you intend to get married in the future?' => ['equals', 'Living-in'],
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
            'Month of first marriage' => ['notEquals', 'Never married'],
            'Year of first marriage' => ['notEquals', 'Never married'],
            'Month started living together' => ['notEquals', 'Never married'],
            'Year started living together' => ['notEquals', 'Never married'],
            'Do you intend to get married in the future?' => ['notEqualsStrict', 'Married'],
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
