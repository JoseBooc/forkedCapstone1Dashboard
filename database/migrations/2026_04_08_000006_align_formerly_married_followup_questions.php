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

        $sharedStatuses = '["Married","Annulled","Separated","Divorced","Widowed"]';

        DB::table('questions')
            ->where('category_id', $category->id)
            ->whereIn('text', ['Date of first marriage', 'Date started living together'])
            ->update([
                'condition_question_id' => $statusQuestion->id,
                'condition_operator' => 'in',
                'condition_value' => $sharedStatuses,
                'updated_at' => now(),
            ]);
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

        DB::table('questions')
            ->where('category_id', $category->id)
            ->where('text', 'Date of first marriage')
            ->update([
                'condition_question_id' => $statusQuestion->id,
                'condition_operator' => 'in',
                'condition_value' => '["Married","Annulled","Separated","Divorced","Widowed"]',
                'updated_at' => now(),
            ]);

        DB::table('questions')
            ->where('category_id', $category->id)
            ->where('text', 'Date started living together')
            ->update([
                'condition_question_id' => $statusQuestion->id,
                'condition_operator' => 'equals',
                'condition_value' => 'Married',
                'updated_at' => now(),
            ]);
    }
};
