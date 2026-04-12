<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $category = DB::table('categories')->where('order', 3)->first();
        if (!$category) {
            return;
        }

        $siblingsCountQuestion = DB::table('questions')
            ->where('category_id', $category->id)
            ->where('ref', 'A13')
            ->first();

        if (!$siblingsCountQuestion) {
            return;
        }

        DB::table('questions')
            ->where('category_id', $category->id)
            ->where('type', 'repeating_text')
            ->where('repeating_ref', 'A13')
            ->update([
                'condition_question_id' => $siblingsCountQuestion->id,
                'condition_operator' => 'greaterThan',
                'condition_value' => '0',
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        $category = DB::table('categories')->where('order', 3)->first();
        if (!$category) {
            return;
        }

        DB::table('questions')
            ->where('category_id', $category->id)
            ->where('type', 'repeating_text')
            ->where('repeating_ref', 'A13')
            ->update([
                'condition_question_id' => null,
                'condition_operator' => null,
                'condition_value' => null,
                'updated_at' => now(),
            ]);
    }
};
