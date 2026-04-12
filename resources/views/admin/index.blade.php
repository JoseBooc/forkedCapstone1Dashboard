@extends('layouts.app')

@section('title', 'Admin - Tracer Study')

@section('content')
<div x-data="adminApp()" x-cloak>
    {{-- Admin Header --}}
    <div class="bg-white border-b border-border sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-6 py-4">
            <div class="flex items-center justify-between gap-4">
                <div class="flex-1">
                    <h1 class="text-2xl font-bold text-[#003087]">ADDU Tracer Study Admin</h1>
                    <p class="text-sm text-muted-foreground mt-1">Manage your survey</p>
                </div>
                <a href="/" class="flex items-center gap-2 px-4 py-2 bg-[#003087] text-white rounded-lg hover:bg-[#002366] transition-colors whitespace-nowrap">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    Back to Form
                </a>
            </div>
        </div>

        {{-- Navigation Tabs --}}
        <div class="max-w-7xl mx-auto px-6">
            <nav class="flex gap-1 -mb-px overflow-x-auto">
                <a href="/admin"
                   class="px-4 py-2.5 text-sm font-medium border-b-2 transition-colors border-[#003087] text-[#003087] whitespace-nowrap">
                    Dashboard
                </a>
                <a href="/admin/responses"
                   class="px-4 py-2.5 text-sm font-medium border-b-2 transition-colors border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap">
                    Responses
                </a>
            </nav>
        </div>
    </div>

    {{-- Main Content --}}
    <div class="max-w-7xl mx-auto px-6 py-8">
        <div class="bg-white rounded-lg shadow-sm p-8">
            {{-- Tracer Study Management Header --}}
            <div class="bg-gradient-to-br from-[#003087] to-[#0052CC] text-white p-6 rounded-lg shadow-lg mb-6">
                <h1 class="text-3xl mb-2">Tracer Study Management</h1>
                <p class="text-white/90">Create and manage survey categories, questions, and answer options</p>
                <div class="mt-3 flex gap-4 text-sm text-white/80">
                    <span>📋 <span x-text="categories.length"></span> Categories</span>
                    <span>•</span>
                    <span>❓ <span x-text="totalQuestions"></span> Questions</span>
                </div>
            </div>

            {{-- Tabs --}}
            <div class="border-b border-gray-200 mb-6">
                <div class="flex gap-6">
                    <button
                        @click="activeTab = 'categories'"
                        :class="activeTab === 'categories' ? 'border-[#003087] text-[#003087]' : 'border-transparent text-gray-600 hover:text-gray-900'"
                        class="px-4 py-4 font-medium border-b-2 transition-colors"
                    >
                        Manage Categories & Questions
                    </button>
                    <button
                        @click="activeTab = 'preview'"
                        :class="activeTab === 'preview' ? 'border-[#003087] text-[#003087]' : 'border-transparent text-gray-600 hover:text-gray-900'"
                        class="px-4 py-4 font-medium border-b-2 transition-colors flex items-center gap-2"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        Preview Survey
                    </button>
                </div>
            </div>

            {{-- Categories Tab --}}
            <template x-if="activeTab === 'categories'">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {{-- Left Column - Categories --}}
                    <div class="lg:col-span-1">
                        <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
                            <div class="p-4 border-b border-gray-200">
                                <div class="flex items-center justify-between mb-4">
                                    <h2 class="font-semibold">Categories</h2>
                                    <button
                                        @click="isEditingCategory = true; selectedCategory = null; categoryForm = { title: '', description: '' }"
                                        class="flex items-center gap-2 px-3 py-2 bg-[#003087] text-white rounded-lg text-sm hover:bg-[#002366] transition-colors"
                                    >
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                                        Add Category
                                    </button>
                                </div>

                                {{-- Category Form --}}
                                <template x-if="isEditingCategory">
                                    <div class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                                        <div>
                                            <label class="block text-xs font-medium mb-1">Category Title</label>
                                            <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded text-sm" placeholder="e.g., Basic Information" x-model="categoryForm.title">
                                        </div>
                                        <div>
                                            <label class="block text-xs font-medium mb-1">Description</label>
                                            <textarea class="w-full px-3 py-2 border border-gray-300 rounded text-sm" placeholder="Brief description" rows="2" x-model="categoryForm.description"></textarea>
                                        </div>
                                        <div class="flex gap-2">
                                            <button @click="saveCategory()" class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#003087] text-white rounded text-sm hover:bg-[#002366] transition-colors">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
                                                <span x-text="editingCategoryId ? 'Update' : 'Save'"></span>
                                            </button>
                                            <button @click="isEditingCategory = false; editingCategoryId = null; categoryForm = { title: '', description: '' }" class="px-3 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                            </button>
                                        </div>
                                    </div>
                                </template>
                            </div>

                            {{-- Category List --}}
                            <div class="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                                <template x-if="categories.length === 0">
                                    <div class="p-8 text-center text-gray-500">
                                        <svg class="w-12 h-12 mx-auto mb-3 opacity-30 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                        <p class="text-sm">No categories yet</p>
                                        <p class="text-xs">Click "Add Category" to get started</p>
                                    </div>
                                </template>
                                <template x-for="category in categories" :key="category.id">
                                    <div
                                        :class="selectedCategory?.id === category.id ? 'bg-blue-50 border-l-4 border-l-[#003087]' : 'hover:bg-gray-50'"
                                        class="p-4 cursor-pointer transition-colors"
                                        @click="selectedCategory = category"
                                    >
                                        <div class="flex items-start justify-between gap-2">
                                            <div class="flex items-start gap-3 flex-1">
                                                <svg class="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                                                <div class="flex-1 min-w-0">
                                                    <h3 class="font-medium text-sm mb-1" x-text="category.title"></h3>
                                                    <p class="text-xs text-gray-600 line-clamp-2" x-text="category.description"></p>
                                                    <p class="text-xs text-gray-500 mt-2" x-text="category.questions.length + ' question' + (category.questions.length !== 1 ? 's' : '')"></p>
                                                </div>
                                            </div>
                                            <div class="flex gap-1 flex-shrink-0">
                                                <button @click.stop="editCategory(category)" class="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                                </button>
                                                <button @click.stop="deleteCategory(category.id)" class="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>

                    {{-- Right Column - Questions --}}
                    <div class="lg:col-span-2">
                        <template x-if="selectedCategory">
                            <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
                                <div class="p-4 border-b border-gray-200">
                                    <div class="flex items-center justify-between mb-4">
                                        <div>
                                            <h2 class="font-semibold mb-1" x-text="selectedCategory.title"></h2>
                                            <p class="text-sm text-gray-600" x-text="selectedCategory.description"></p>
                                        </div>
                                        <button
                                            @click="isEditingQuestion = true; editingQuestionId = null; questionForm = { text: '', type: 'text', required: false, answers: [], placeholder: 'Region XI', help_text: '' }"
                                            class="flex items-center gap-2 px-4 py-2 bg-[#003087] text-white rounded-lg text-sm hover:bg-[#002366] transition-colors"
                                        >
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                                            Add Question
                                        </button>
                                    </div>

                                    {{-- Question Form --}}
                                    <template x-if="isEditingQuestion">
                                        <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
                                            <div>
                                                <label class="block text-sm font-medium mb-2">Question Text</label>
                                                <textarea class="w-full px-3 py-2 border border-gray-300 rounded text-sm" placeholder="Enter your question here..." rows="2" x-model="questionForm.text"></textarea>
                                            </div>
                                            <div class="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label class="block text-sm font-medium mb-2">Question Type</label>
                                                    <select class="w-full px-3 py-2 border border-gray-300 rounded text-sm" x-model="questionForm.type">
                                                        <option value="text">Short Text</option>
                                                        <option value="textarea">Long Text</option>
                                                        <option value="display">Display Text (No Input)</option>
                                                        <option value="radio">Single Choice (Radio)</option>
                                                        <option value="checkbox">Multiple Choice (Checkbox)</option>
                                                        <option value="select">Dropdown (Select)</option>
                                                        <option value="number">Number</option>
                                                        <option value="date">Date</option>
                                                        <option value="month">Month/Year</option>
                                                    </select>
                                                </div>
                                                <div class="flex items-end">
                                                    <label class="flex items-center gap-2 cursor-pointer">
                                                        <input type="checkbox" class="w-4 h-4 text-[#003087] rounded" x-model="questionForm.required">
                                                        <span class="text-sm font-medium">Required Question</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium mb-2" x-text="questionForm.type === 'display' ? 'Display Text' : 'Placeholder Text (optional)'"></label>
                                                <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded text-sm" :placeholder="questionForm.type === 'display' ? 'e.g. Region XI' : 'e.g. Enter your answer here...'" x-model="questionForm.placeholder">
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium mb-2">Help Text (optional)</label>
                                                <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded text-sm" placeholder="Additional guidance for respondents..." x-model="questionForm.help_text">
                                            </div>

                                            {{-- Answer Options --}}
                                            <template x-if="['radio', 'checkbox', 'select'].includes(questionForm.type)">
                                                <div>
                                                    <div class="flex items-center justify-between mb-2">
                                                        <label class="block text-sm font-medium">Answer Options</label>
                                                        <button @click="addAnswerOption()" class="flex items-center gap-1 px-2 py-1 bg-[#003087] text-white rounded text-xs hover:bg-[#002366] transition-colors">
                                                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                                                            Add Option
                                                        </button>
                                                    </div>
                                                    <div class="space-y-2">
                                                        <template x-for="(answer, idx) in questionForm.answers" :key="idx">
                                                            <div class="flex items-center gap-2">
                                                                <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                                                                <input type="text" class="flex-1 px-3 py-2 border border-gray-300 rounded text-sm" placeholder="Answer option text" x-model="answer.text">
                                                                <button @click="questionForm.answers.splice(idx, 1)" class="p-2 text-red-600 hover:bg-red-100 rounded transition-colors">
                                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                                                </button>
                                                            </div>
                                                        </template>
                                                        <template x-if="questionForm.answers.length === 0">
                                                            <p class="text-xs text-gray-500 text-center py-3">No answer options yet. Click "Add Option" to create choices.</p>
                                                        </template>
                                                    </div>
                                                </div>
                                            </template>

                                            <div class="flex gap-2">
                                                <button @click="saveQuestion()" class="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#003087] text-white rounded text-sm hover:bg-[#002366] transition-colors">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
                                                    <span x-text="editingQuestionId ? 'Update Question' : 'Save Question'"></span>
                                                </button>
                                                <button @click="isEditingQuestion = false; editingQuestionId = null" class="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors">Cancel</button>
                                            </div>
                                        </div>
                                    </template>
                                </div>

                                {{-- Questions List --}}
                                <div class="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                                    <template x-if="selectedCategory.questions.length === 0">
                                        <div class="p-8 text-center text-gray-500">
                                            <svg class="w-12 h-12 mx-auto mb-3 opacity-30 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                            <p class="text-sm">No questions in this category yet</p>
                                            <p class="text-xs">Click "Add Question" to get started</p>
                                        </div>
                                    </template>
                                    <template x-for="(question, index) in selectedCategory.questions.slice().sort((a, b) => a.order - b.order)" :key="question.id">
                                        <div
                                            class="p-4 hover:bg-gray-50 transition-colors cursor-move"
                                            :class="draggedQuestionId === question.id ? 'opacity-50 bg-blue-50' : ''"
                                            draggable="true"
                                            @dragstart="onQuestionDragStart(question.id)"
                                            @dragover.prevent
                                            @drop="onQuestionDrop(question.id)"
                                            @dragend="draggedQuestionId = null"
                                            title="Drag to reorder"
                                        >
                                            <div class="flex items-start gap-3">
                                                <svg class="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                                                <div class="flex-1 min-w-0">
                                                    <div class="flex items-start gap-2 mb-2">
                                                        <span class="text-xs font-medium text-gray-500 mt-1" x-text="'Q' + (index + 1)"></span>
                                                        <div class="flex-1">
                                                            <div class="flex items-start gap-2 mb-1">
                                                                <p class="text-sm flex-1" x-text="question.text"></p>
                                                                <template x-if="question.required">
                                                                    <span class="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Required</span>
                                                                </template>
                                                            </div>
                                                            <template x-if="question.help_text">
                                                                <p class="text-xs text-gray-600 mb-2" x-text="question.help_text"></p>
                                                            </template>
                                                            <div class="flex items-center gap-2 text-xs text-gray-500">
                                                                <span class="capitalize" x-text="question.type"></span>
                                                                <template x-if="question.answers && question.answers.length > 0">
                                                                    <span>
                                                                        <span>•</span>
                                                                        <span x-text="question.answers.length + ' options'"></span>
                                                                    </span>
                                                                </template>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="flex gap-1 flex-shrink-0">
                                                    <button @click="editQuestion(question)" class="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors">
                                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                                    </button>
                                                    <button @click="deleteQuestion(question.id)" class="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors">
                                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </template>

                        <template x-if="!selectedCategory">
                            <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
                                <svg class="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                <h3 class="text-lg font-medium mb-2">No Category Selected</h3>
                                <p class="text-sm text-gray-600">Select a category from the left to manage its questions</p>
                            </div>
                        </template>
                    </div>
                </div>
            </template>

            {{-- Preview Tab --}}
            <template x-if="activeTab === 'preview'">
                <div>
                    <div class="mb-6">
                        <h2 class="text-xl font-semibold mb-2">Survey Preview</h2>
                        <p class="text-sm text-gray-600">This is how the survey will appear to respondents</p>
                    </div>

                    <template x-if="categories.length === 0">
                        <div class="text-center py-12">
                            <svg class="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                            <p class="text-gray-600">No categories or questions to preview</p>
                        </div>
                    </template>

                    <div class="space-y-8">
                        <template x-for="(category, catIndex) in categories" :key="category.id">
                            <div class="border border-gray-300 rounded-lg p-6">
                                <div class="mb-6">
                                    <h3 class="text-lg font-semibold mb-1" x-text="'Section ' + (catIndex + 1) + ': ' + category.title"></h3>
                                    <p class="text-sm text-gray-600" x-text="category.description"></p>
                                </div>
                                <div class="space-y-6">
                                    <template x-for="question in category.questions" :key="question.id">
                                        <div>
                                            <label class="block text-sm font-medium mb-2">
                                                <span x-text="question.text"></span>
                                                <template x-if="question.required && question.type !== 'display'"><span class="text-red-600 ml-1">*</span></template>
                                            </label>
                                            <template x-if="question.help_text">
                                                <p class="text-xs text-gray-600 mb-2" x-text="question.help_text"></p>
                                            </template>

                                            <template x-if="question.type === 'display'">
                                                <div class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700" x-text="question.placeholder || 'Region XI'"></div>
                                            </template>

                                            <template x-if="question.type === 'text'">
                                                <input type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg" :placeholder="question.placeholder || 'Your answer'" disabled>
                                            </template>
                                            <template x-if="question.type === 'textarea'">
                                                <textarea class="w-full px-4 py-2 border border-gray-300 rounded-lg" :placeholder="question.placeholder || 'Your answer'" rows="3" disabled></textarea>
                                            </template>
                                            <template x-if="question.type === 'number'">
                                                <input type="number" class="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg" :placeholder="question.placeholder" disabled>
                                            </template>
                                            <template x-if="question.type === 'date'">
                                                <input type="date" class="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg" disabled>
                                            </template>
                                            <template x-if="question.type === 'month'">
                                                <input type="month" class="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg" disabled>
                                            </template>
                                            <template x-if="question.type === 'radio'">
                                                <div class="space-y-2">
                                                    <template x-for="answer in question.answers" :key="answer.id">
                                                        <label class="flex items-center gap-2 cursor-pointer">
                                                            <input type="radio" :name="'preview-' + question.id" class="w-4 h-4" disabled>
                                                            <span class="text-sm" x-text="answer.text"></span>
                                                        </label>
                                                    </template>
                                                </div>
                                            </template>
                                            <template x-if="question.type === 'checkbox'">
                                                <div class="space-y-2">
                                                    <template x-for="answer in question.answers" :key="answer.id">
                                                        <label class="flex items-center gap-2 cursor-pointer">
                                                            <input type="checkbox" class="w-4 h-4 rounded" disabled>
                                                            <span class="text-sm" x-text="answer.text"></span>
                                                        </label>
                                                    </template>
                                                </div>
                                            </template>
                                            <template x-if="question.type === 'select'">
                                                <select class="w-full px-4 py-2 border border-gray-300 rounded-lg" disabled>
                                                    <option>Select an option...</option>
                                                    <template x-for="answer in question.answers" :key="answer.id">
                                                        <option x-text="answer.text"></option>
                                                    </template>
                                                </select>
                                            </template>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </template>
        </div>
    </div>
</div>

<script>
function adminApp() {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

    return {
        categories: @json($categories),
        selectedCategory: null,
        activeTab: 'categories',
        isEditingCategory: false,
        editingCategoryId: null,
        categoryForm: { title: '', description: '' },
        isEditingQuestion: false,
        editingQuestionId: null,
        questionForm: { text: '', type: 'text', required: false, answers: [], placeholder: 'Region XI', help_text: '' },
            draggedQuestionId: null,

        get totalQuestions() {
            return this.categories.reduce((t, c) => t + c.questions.length, 0);
        },

        editCategory(category) {
            this.editingCategoryId = category.id;
            this.categoryForm = { title: category.title, description: category.description };
            this.isEditingCategory = true;
        },

        async saveCategory() {
            if (!this.categoryForm.title.trim()) { alert('Please enter a category title'); return; }

            if (this.editingCategoryId) {
                const res = await fetch('/admin/api/categories/' + this.editingCategoryId, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
                    body: JSON.stringify(this.categoryForm),
                });
                if (res.ok) {
                    const cat = this.categories.find(c => c.id === this.editingCategoryId);
                    if (cat) { cat.title = this.categoryForm.title; cat.description = this.categoryForm.description; }
                    if (this.selectedCategory?.id === this.editingCategoryId) {
                        this.selectedCategory.title = this.categoryForm.title;
                        this.selectedCategory.description = this.categoryForm.description;
                    }
                }
            } else {
                const res = await fetch('/admin/api/categories', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
                    body: JSON.stringify(this.categoryForm),
                });
                if (res.ok) {
                    const newCat = await res.json();
                    this.categories.push(newCat);
                }
            }

            this.isEditingCategory = false;
            this.editingCategoryId = null;
            this.categoryForm = { title: '', description: '' };
        },

        async deleteCategory(id) {
            if (!confirm('Are you sure you want to delete this category? All questions will be removed.')) return;

            const res = await fetch('/admin/api/categories/' + id, {
                method: 'DELETE',
                headers: { 'X-CSRF-TOKEN': csrfToken },
            });

            if (res.ok) {
                this.categories = this.categories.filter(c => c.id !== id);
                if (this.selectedCategory?.id === id) this.selectedCategory = null;
            }
        },

        addAnswerOption() {
            this.questionForm.answers.push({ text: '', order: this.questionForm.answers.length + 1 });
        },

        editQuestion(question) {
            this.editingQuestionId = question.id;
            this.questionForm = {
                text: question.text,
                type: question.type,
                required: question.required,
                answers: (question.answers || []).map(a => ({ ...a })),
                placeholder: question.placeholder || 'Region XI',
                help_text: question.help_text || '',
            };
            this.isEditingQuestion = true;
        },

        async saveQuestion() {
            if (!this.questionForm.text.trim()) { alert('Please enter question text'); return; }
            if (!this.selectedCategory) return;

            const existingQuestion = this.editingQuestionId
                ? this.selectedCategory.questions.find(q => q.id === this.editingQuestionId)
                : null;

            const payload = {
                category_id: this.selectedCategory.id,
                text: this.questionForm.text,
                type: this.questionForm.type,
                required: this.questionForm.required,
                placeholder: this.questionForm.placeholder,
                help_text: this.questionForm.help_text,
                order: existingQuestion?.order ?? this.selectedCategory.questions.length + 1,
                answers: this.questionForm.answers.map((a, i) => ({ text: a.text, order: i + 1 })),
            };

            if (this.editingQuestionId) {
                const res = await fetch('/admin/api/questions/' + this.editingQuestionId, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
                    body: JSON.stringify(payload),
                });
                if (res.ok) {
                    const updated = await res.json();
                    const idx = this.selectedCategory.questions.findIndex(q => q.id === this.editingQuestionId);
                    if (idx !== -1) this.selectedCategory.questions[idx] = updated;
                    // Also update in categories array
                    const cat = this.categories.find(c => c.id === this.selectedCategory.id);
                    if (cat) {
                        const qi = cat.questions.findIndex(q => q.id === this.editingQuestionId);
                        if (qi !== -1) cat.questions[qi] = updated;
                    }
                }
            } else {
                const res = await fetch('/admin/api/questions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
                    body: JSON.stringify(payload),
                });
                if (res.ok) {
                    const newQ = await res.json();
                    this.selectedCategory.questions.push(newQ);
                    const cat = this.categories.find(c => c.id === this.selectedCategory.id);
                    if (cat && !cat.questions.find(q => q.id === newQ.id)) cat.questions.push(newQ);
                }
            }

            this.isEditingQuestion = false;
            this.editingQuestionId = null;
            this.questionForm = { text: '', type: 'text', required: false, answers: [], placeholder: 'Region XI', help_text: '' };
        },

        async deleteQuestion(id) {
            if (!confirm('Are you sure you want to delete this question?')) return;

            const res = await fetch('/admin/api/questions/' + id, {
                method: 'DELETE',
                headers: { 'X-CSRF-TOKEN': csrfToken },
            });

            if (res.ok) {
                this.selectedCategory.questions = this.selectedCategory.questions.filter(q => q.id !== id);
                const cat = this.categories.find(c => c.id === this.selectedCategory.id);
                if (cat) cat.questions = cat.questions.filter(q => q.id !== id);
            }
        },

        onQuestionDragStart(questionId) {
            this.draggedQuestionId = questionId;
        },

        async onQuestionDrop(targetQuestionId) {
            if (!this.selectedCategory || !this.draggedQuestionId || this.draggedQuestionId === targetQuestionId) {
                this.draggedQuestionId = null;
                return;
            }

            const sortedQuestions = this.selectedCategory.questions
                .slice()
                .sort((a, b) => a.order - b.order);

            const fromIndex = sortedQuestions.findIndex(q => q.id === this.draggedQuestionId);
            const toIndex = sortedQuestions.findIndex(q => q.id === targetQuestionId);

            if (fromIndex === -1 || toIndex === -1) {
                this.draggedQuestionId = null;
                return;
            }

            const [moved] = sortedQuestions.splice(fromIndex, 1);
            sortedQuestions.splice(toIndex, 0, moved);

            const normalized = sortedQuestions.map((q, idx) => ({ ...q, order: idx + 1 }));
            await this.persistQuestionOrder(normalized);
            this.draggedQuestionId = null;
        },

        async persistQuestionOrder(orderedQuestions) {
            const res = await fetch('/admin/api/questions/reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
                body: JSON.stringify({
                    category_id: this.selectedCategory.id,
                    question_orders: orderedQuestions.map(q => ({ id: q.id, order: q.order })),
                }),
            });

            if (res.ok) {
                const updatedQuestions = await res.json();
                this.selectedCategory.questions = updatedQuestions;
                const cat = this.categories.find(c => c.id === this.selectedCategory.id);
                if (cat) cat.questions = updatedQuestions;
            } else {
                alert('Unable to reorder questions. Please try again.');
            }
        },

    };
}
</script>

<style>
[x-cloak] { display: none !important; }
</style>
@endsection
