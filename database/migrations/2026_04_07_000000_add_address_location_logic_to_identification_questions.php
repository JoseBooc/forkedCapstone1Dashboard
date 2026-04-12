<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $category = DB::table('categories')->where('order', 1)->first();

        if (!$category) {
            return;
        }

        $locationQuestion = DB::table('questions')
            ->where('category_id', $category->id)
            ->where('text', 'Is your current address in the Philippines or abroad?')
            ->first();

        if (!$locationQuestion) {
            DB::table('questions')
                ->where('category_id', $category->id)
                ->where('order', '>=', 6)
                ->increment('order', 2);

            $locationQuestionId = (string) Str::uuid();
            $now = now();

            DB::table('questions')->insert([
                'id' => $locationQuestionId,
                'category_id' => $category->id,
                'text' => 'Is your current address in the Philippines or abroad?',
                'type' => 'radio',
                'required' => false,
                'placeholder' => '',
                'help_text' => '',
                'order' => 6,
                'condition_question_id' => null,
                'condition_operator' => null,
                'condition_value' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            DB::table('answers')->insert([
                [
                    'id' => (string) Str::uuid(),
                    'question_id' => $locationQuestionId,
                    'text' => 'Philippines',
                    'order' => 1,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'id' => (string) Str::uuid(),
                    'question_id' => $locationQuestionId,
                    'text' => 'Abroad',
                    'order' => 2,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
            ]);

            DB::table('questions')->insert([
                'id' => (string) Str::uuid(),
                'category_id' => $category->id,
                'text' => 'Which country are you currently in?',
                'type' => 'text',
                'required' => false,
                'placeholder' => 'Country',
                'help_text' => '',
                'order' => 7,
                'condition_question_id' => $locationQuestionId,
                'condition_operator' => 'equals',
                'condition_value' => 'Abroad',
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            $locationQuestion = (object) ['id' => $locationQuestionId];
        }

        $localFieldLabels = [
            'Urban/Rural',
            'Address',
            'Barangay',
            'Municipality',
            'Province',
            'Region',
            'Zip Code',
            'Geocode',
        ];

        DB::table('questions')
            ->where('category_id', $category->id)
            ->whereIn('text', $localFieldLabels)
            ->update([
                'condition_question_id' => $locationQuestion->id,
                'condition_operator' => 'equals',
                'condition_value' => 'Philippines',
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        $category = DB::table('categories')->where('order', 1)->first();

        if (!$category) {
            return;
        }

        $locationQuestion = DB::table('questions')
            ->where('category_id', $category->id)
            ->where('text', 'Is your current address in the Philippines or abroad?')
            ->first();

        if (!$locationQuestion) {
            return;
        }

        DB::table('questions')
            ->where('category_id', $category->id)
            ->whereIn('text', [
                'Urban/Rural',
                'Address',
                'Barangay',
                'Municipality',
                'Province',
                'Region',
                'Zip Code',
                'Geocode',
            ])
            ->update([
                'condition_question_id' => null,
                'condition_operator' => null,
                'condition_value' => null,
                'updated_at' => now(),
            ]);

        DB::table('questions')
            ->where('category_id', $category->id)
            ->where('text', 'Which country are you currently in?')
            ->delete();

        DB::table('questions')
            ->where('id', $locationQuestion->id)
            ->delete();

        DB::table('questions')
            ->where('category_id', $category->id)
            ->where('order', '>=', 8)
            ->decrement('order', 2);
    }
};
