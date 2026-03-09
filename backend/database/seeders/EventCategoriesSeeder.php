<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EventCategory;

class EventCategoriesSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Networking',
                'slug' => 'networking',
                'description' => 'Professional networking events and meetups',
                'color' => '#3B82F6',
                'icon' => '👥',
                'is_active' => true,
            ],
            [
                'name' => 'Homecoming',
                'slug' => 'homecoming',
                'description' => 'Annual homecoming celebrations and reunions',
                'color' => '#EF4444',
                'icon' => '🏠',
                'is_active' => true,
            ],
            [
                'name' => 'Workshop',
                'slug' => 'workshop',
                'description' => 'Educational workshops and training sessions',
                'color' => '#10B981',
                'icon' => '🎓',
                'is_active' => true,
            ],
            [
                'name' => 'Seminar',
                'slug' => 'seminar',
                'description' => 'Professional seminars and talks',
                'color' => '#8B5CF6',
                'icon' => '📚',
                'is_active' => true,
            ],
            [
                'name' => 'Sports',
                'slug' => 'sports',
                'description' => 'Sports events and athletic activities',
                'color' => '#F59E0B',
                'icon' => '⚽',
                'is_active' => true,
            ],
            [
                'name' => 'Social',
                'slug' => 'social',
                'description' => 'Social gatherings and casual meetups',
                'color' => '#EC4899',
                'icon' => '🎉',
                'is_active' => true,
            ],
            [
                'name' => 'Webinar',
                'slug' => 'webinar',
                'description' => 'Online webinars and virtual events',
                'color' => '#06B6D4',
                'icon' => '💻',
                'is_active' => true,
            ],
            [
                'name' => 'Volunteer',
                'slug' => 'volunteer',
                'description' => 'Community service and volunteer activities',
                'color' => '#84CC16',
                'icon' => '🤝',
                'is_active' => true,
            ],
            [
                'name' => 'Career Fair',
                'slug' => 'career-fair',
                'description' => 'Job fairs and career development events',
                'color' => '#6366F1',
                'icon' => '💼',
                'is_active' => true,
            ],
            [
                'name' => 'Cultural',
                'slug' => 'cultural',
                'description' => 'Cultural celebrations and heritage events',
                'color' => '#F43F5E',
                'icon' => '🎭',
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            EventCategory::create($category);
        }

        echo "\n✓ " . count($categories) . " event categories created\n";
    }
}
