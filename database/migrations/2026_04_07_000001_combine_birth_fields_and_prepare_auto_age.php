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

        $monthQuestion = DB::table('questions')
            ->where('category_id', $category->id)
            ->where('text', 'Month of birth')
            ->first();

        $yearQuestion = DB::table('questions')
            ->where('category_id', $category->id)
            ->where('text', 'Year of birth')
            ->first();

        $ageQuestion = DB::table('questions')
            ->where('category_id', $category->id)
            ->where('text', 'Age on last birthday')
            ->first();

        if ($monthQuestion) {
            DB::table('questions')
                ->where('id', $monthQuestion->id)
                ->update([
                    'text' => 'Birthday',
                    'type' => 'date',
                    'placeholder' => '',
                    'condition_question_id' => null,
                    'condition_operator' => null,
                    'condition_value' => null,
                    'updated_at' => now(),
                ]);

            DB::table('answers')->where('question_id', $monthQuestion->id)->delete();
        }

        if ($yearQuestion) {
            DB::table('questions')->where('id', $yearQuestion->id)->delete();

            DB::table('questions')
                ->where('category_id', $category->id)
                ->where('order', '>', $yearQuestion->order)
                ->decrement('order');
        }

        if ($monthQuestion) {
            DB::table('questions')
                ->where('id', $monthQuestion->id)
                ->update(['order' => 1, 'updated_at' => now()]);
        }

        if ($ageQuestion) {
            DB::table('questions')
                ->where('id', $ageQuestion->id)
                ->update([
                    'order' => 2,
                    'type' => 'number',
                    'placeholder' => 'Auto-calculated from birthday',
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

        $birthdayQuestion = DB::table('questions')
            ->where('category_id', $category->id)
            ->where('text', 'Birthday')
            ->first();

        if (!$birthdayQuestion) {
            return;
        }

        $existingYear = DB::table('questions')
            ->where('category_id', $category->id)
            ->where('text', 'Year of birth')
            ->first();

        if (!$existingYear) {
            DB::table('questions')
                ->where('category_id', $category->id)
                ->where('order', '>=', 2)
                ->increment('order');

            DB::table('questions')->insert([
                'id' => (string) Illuminate\Support\Str::uuid(),
                'category_id' => $category->id,
                'text' => 'Year of birth',
                'type' => 'number',
                'required' => false,
                'placeholder' => 'e.g. 1995',
                'help_text' => '',
                'order' => 2,
                'condition_question_id' => null,
                'condition_operator' => null,
                'condition_value' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        DB::table('questions')
            ->where('id', $birthdayQuestion->id)
            ->update([
                'text' => 'Month of birth',
                'type' => 'select',
                'placeholder' => '',
                'updated_at' => now(),
            ]);
    }
};
