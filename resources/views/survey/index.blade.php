@extends('layouts.app')

@section('title', 'ADDU Alumni Tracer Study')

@section('content')
<div x-data="surveyApp()" x-cloak>
    {{-- ── Survey Form ── --}}
    <div class="min-h-screen bg-gray-50 pb-24">
            {{-- Header --}}
            <div class="bg-white border-b border-border sticky top-0 z-40">
                <div class="max-w-4xl mx-auto px-6 py-4">
                    <div class="flex items-center justify-between gap-4">
                        <div class="flex-1">
                            <h1 class="text-2xl font-bold text-[#003087]">ADDU Alumni Tracer Study</h1>
                            <p class="text-sm text-muted-foreground mt-1">
                                <span x-text="'Section ' + currentSection + ' of ' + totalSections"></span>
                            </p>
                        </div>
                        <div class="w-full max-w-xs">
                            <div class="survey-progress-shell">
                                <div
                                    class="survey-progress-fill"
                                    :style="{ width: (currentSection / totalSections * 100) + '%' }"
                                ></div>
                            </div>
                            <div class="mt-1 text-right text-[11px] font-semibold text-[#003087]/80" x-text="Math.round((currentSection / totalSections) * 100) + '%' "></div>
                        </div>
                        <template x-if="!isEditMode">
                            <button
                                @click="showResumeDialog = true"
                                class="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/></svg>
                                Resume
                            </button>
                        </template>
                        <a href="/admin" class="flex items-center gap-2 px-4 py-2 bg-[#003087] text-white rounded-lg hover:bg-blue-900 transition-colors whitespace-nowrap">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>
                            Admin
                        </a>
                    </div>
                </div>
            </div>

            {{-- Resume Dialog --}}
            <template x-if="showResumeDialog">
                <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-gray-900">Resume Survey</h3>
                            <button @click="showResumeDialog = false; resumeError = ''" class="p-1 hover:bg-gray-100 rounded">
                                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                        <p class="text-sm text-gray-600 mb-4">Enter your 6-character resume code to continue where you left off.</p>
                        <input
                            type="text"
                            maxlength="6"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-[0.3em] font-mono uppercase"
                            placeholder="ABC123"
                            x-model="resumeInput"
                            @keydown.enter="resumeSurvey()"
                        >
                        <template x-if="resumeError">
                            <p class="text-sm text-red-600 mt-2" x-text="resumeError"></p>
                        </template>
                        <button
                            @click="resumeSurvey()"
                            class="w-full mt-4 px-6 py-3 bg-[#003087] text-white rounded-lg font-medium hover:bg-[#002366] transition-colors"
                        >
                            Load My Progress
                        </button>
                    </div>
                </div>
            </template>

            {{-- Saved Banner --}}
            <template x-if="showSavedBanner && resumeCode">
                <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
                        <p class="text-lg font-semibold text-gray-900 mb-1">Progress Saved!</p>
                        <p class="text-sm text-gray-600 mb-4">Your resume code:</p>
                        <div class="flex items-center justify-center gap-2 mb-2">
                            <span class="text-3xl font-mono font-bold tracking-[0.3em] text-[#003087]" x-text="resumeCode"></span>
                            <button @click="copyCode()" class="p-1.5 hover:bg-gray-100 rounded" title="Copy code">
                                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                            </button>
                        </div>
                        <p class="text-xs text-gray-500 mb-2">Save this code to resume your progress anytime.</p>
                        <p class="text-xs text-red-500 font-medium mb-6">⚠ You have 10 days to complete the survey. After that, your saved progress will be deleted and you will need to start over.</p>
                        <button @click="showSavedBanner = false" class="w-full px-6 py-3 bg-[#003087] text-white rounded-lg font-medium hover:bg-[#002366] transition-colors">
                            Got it
                        </button>
                    </div>
                </div>
            </template>

            {{-- Main Content --}}
            <div class="max-w-4xl mx-auto px-6 py-8">
                <div class="bg-white rounded-lg shadow-sm p-8">
                    <template x-if="currentCategory">
                        <div class="space-y-8">
                            {{-- Edit mode banner --}}
                            <template x-if="isEditMode && currentSection === 1">
                                <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p class="text-sm text-blue-800">
                                        <strong>Editing mode:</strong> You have already submitted this survey. You can review and update your answers below.
                                    </p>
                                </div>
                            </template>

                            {{-- Section Header --}}
                            <div>
                                <h2 class="mb-2" x-text="'SECTION ' + currentSection + ': ' + currentCategory.title.toUpperCase()"></h2>
                                <p class="text-muted-foreground" x-text="currentCategory.description"></p>
                            </div>

                            {{-- Questions --}}
                            <template x-if="visibleQuestions.length === 0">
                                <div class="text-center py-8">
                                    <svg class="w-12 h-12 mx-auto mb-3 text-gray-400 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                    <p class="text-sm text-muted-foreground">No questions in this section yet.</p>
                                </div>
                            </template>

                            <div class="space-y-6">
                                <template x-for="question in visibleQuestions" :key="question.id">
                                    <div class="space-y-2">
                                        <label class="block text-sm font-medium">
                                            <span x-text="question.text"></span>
                                            <template x-if="question.required && question.type !== 'display'">
                                                <span class="text-red-600 ml-1">*</span>
                                            </template>
                                        </label>
                                        <template x-if="question.help_text">
                                            <p class="text-xs text-muted-foreground" x-text="question.help_text"></p>
                                        </template>

                                        {{-- Display-only text --}}
                                        <template x-if="question.type === 'display'">
                                            <div class="w-full px-4 py-3 border border-border rounded-lg bg-gray-50 text-gray-800" x-text="question.placeholder || 'Region XI'"></div>
                                        </template>

                                        {{-- Text input --}}
                                        <template x-if="question.type === 'text'">
                                            <input
                                                type="text"
                                                class="w-full px-4 py-3 border border-border rounded-lg"
                                                :placeholder="question.placeholder || 'Your answer'"
                                                :value="formData[question.id] || ''"
                                                @input="formData[question.id] = $event.target.value"
                                            >
                                        </template>

                                        {{-- Textarea --}}
                                        <template x-if="question.type === 'textarea'">
                                            <textarea
                                                class="w-full px-4 py-3 border border-border rounded-lg min-h-[120px]"
                                                :placeholder="question.placeholder || 'Your answer'"
                                                :value="formData[question.id] || ''"
                                                @input="formData[question.id] = $event.target.value"
                                            ></textarea>
                                        </template>

                                        {{-- Number --}}
                                        <template x-if="question.type === 'number'">
                                            <input
                                                type="number"
                                                class="w-full md:w-1/3 px-4 py-3 border border-border rounded-lg"
                                                :placeholder="question.placeholder || '0'"
                                                :value="formData[question.id] || ''"
                                                :readonly="isAutoCalculatedAgeQuestion(question)"
                                                :class="isAutoCalculatedAgeQuestion(question) ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''"
                                                @input="formData[question.id] = $event.target.value"
                                            >
                                        </template>

                                        {{-- Date --}}
                                        <template x-if="question.type === 'date'">
                                            <input
                                                type="date"
                                                class="w-full md:w-1/2 px-4 py-3 border border-border rounded-lg"
                                                :value="formData[question.id] || ''"
                                                @input="onDateChange(question, $event.target.value)"
                                                @change="onDateChange(question, $event.target.value)"
                                            >
                                        </template>

                                        {{-- Month --}}
                                        <template x-if="question.type === 'month'">
                                            <input
                                                type="month"
                                                class="w-full md:w-1/2 px-4 py-3 border border-border rounded-lg"
                                                :value="formData[question.id] || ''"
                                                @input="formData[question.id] = $event.target.value"
                                            >
                                        </template>

                                        {{-- Radio --}}
                                        <template x-if="question.type === 'radio'">
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                                                <template x-for="answer in sortedAnswers(question)" :key="answer.id">
                                                    <label class="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            :name="'radio-' + question.id"
                                                            class="w-4 h-4 text-[#003087]"
                                                            :checked="formData[question.id] === answer.text || (answerNeedsSpecify(answer.text) && (formData[question.id] || '').startsWith(answer.text + ': '))"
                                                            @change="onRadioChange(question, answer.text)"
                                                        >
                                                        <span class="text-sm" x-text="answer.text"></span>
                                                    </label>
                                                </template>
                                                {{-- Specify text box for Others/Self-describe --}}
                                                <template x-if="getRadioSpecifyLabel(question) && ((formData[question.id] || '') === getRadioSpecifyLabel(question) || (formData[question.id] || '').startsWith(getRadioSpecifyLabel(question) + ': '))">
                                                    <div class="col-span-full mt-1">
                                                        <input
                                                            type="text"
                                                            class="w-full md:w-1/2 px-4 py-2 border border-border rounded-lg text-sm"
                                                            placeholder="Please specify..."
                                                            :value="(formData[question.id] || '').includes(': ') ? formData[question.id].substring(formData[question.id].indexOf(': ') + 2) : ''"
                                                            @input="formData[question.id] = getRadioSpecifyLabel(question) + ': ' + $event.target.value"
                                                        >
                                                    </div>
                                                </template>
                                            </div>
                                        </template>

                                        {{-- Checkbox --}}
                                        <template x-if="question.type === 'checkbox'">
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                                                <template x-for="answer in sortedAnswers(question)" :key="answer.id">
                                                    <label class="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            class="w-4 h-4 text-[#003087] rounded"
                                                            :checked="(formData[question.id] || []).some(v => v === answer.text || (answer.text.toLowerCase().includes('other') && v.startsWith(answer.text + ': ')))"
                                                            @change="toggleCheckbox(question.id, answer.text, $event.target.checked)"
                                                        >
                                                        <span class="text-sm" x-text="answer.text"></span>
                                                    </label>
                                                </template>
                                                {{-- Others specify text box --}}
                                                <template x-if="sortedAnswers(question).some(a => a.text.toLowerCase().includes('other')) && (formData[question.id] || []).some(v => v.toLowerCase().startsWith('others'))">
                                                    <div class="col-span-full mt-1">
                                                        <input
                                                            type="text"
                                                            class="w-full md:w-1/2 px-4 py-2 border border-border rounded-lg text-sm"
                                                            placeholder="Please specify..."
                                                            :value="getOthersSpecifyValue(question.id)"
                                                            @input="setOthersSpecifyValue(question.id, $event.target.value)"
                                                        >
                                                    </div>
                                                </template>
                                            </div>
                                        </template>

                                        {{-- Select --}}
                                        <template x-if="question.type === 'select'">
                                            <select
                                                class="w-full px-4 py-3 border border-border rounded-lg"
                                                :value="formData[question.id] || ''"
                                                @change="formData[question.id] = $event.target.value"
                                            >
                                                <option value="">Select an option...</option>
                                                <template x-for="answer in sortedAnswers(question)" :key="answer.id">
                                                    <option :value="answer.text" x-text="answer.text" :selected="formData[question.id] === answer.text"></option>
                                                </template>
                                            </select>
                                        </template>

                                        {{-- Repeating Text (dynamic based on number from another question) --}}
                                        <template x-if="question.type === 'repeating_text'">
                                            <div class="space-y-3">
                                                <template x-for="(idx) in getRepeatingCount(question)" :key="'repeat-' + question.id + '-' + idx">
                                                    <div>
                                                        <label class="block text-xs font-medium text-gray-600 mb-1" x-text="'Item ' + idx + ' of ' + getRepeatingCount(question)"></label>
                                                        <input
                                                            type="text"
                                                            class="w-full px-4 py-3 border border-border rounded-lg"
                                                            :placeholder="question.placeholder || 'Enter details'"
                                                            :value="(formData[question.id] || [])[idx - 1] || ''"
                                                            @input="setRepeatingItem(question.id, idx - 1, $event.target.value)"
                                                        >
                                                    </div>
                                                </template>
                                            </div>
                                        </template>
                                    </div>
                                </template>
                            </div>

                            {{-- Thank-you on last section --}}
                            <template x-if="currentSection === totalSections && !isEditMode">
                                <div class="mt-8 p-6 bg-green-50 border-2 border-green-300 rounded-lg">
                                    <div class="flex items-center gap-3 mb-3">
                                        <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                                        </div>
                                        <div>
                                            <h4 class="font-medium text-green-900">Thank You for Your Participation!</h4>
                                            <p class="text-sm text-green-700">Your responses will help us improve our programs and better serve future students.</p>
                                        </div>
                                    </div>
                                    <p class="text-sm text-green-800 mb-4">Please review your responses if needed. When you're ready, click "Submit Survey" to complete the tracer study.</p>
                                    <p class="text-xs text-green-700"><strong>Confidentiality:</strong> All information you provide will be kept strictly confidential.</p>
                                </div>
                            </template>
                        </div>
                    </template>
                </div>
            </div>

            {{-- Navigation Footer --}}
            <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-6 shadow-lg z-50">
                <div class="max-w-4xl mx-auto flex items-center justify-between gap-4">
                    <button
                        @click="previousSection()"
                        :disabled="currentSection === 1"
                        :class="currentSection === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
                        class="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                        Previous Section
                    </button>

                    <template x-if="!isEditMode">
                        <button
                            @click="saveForLater()"
                            :disabled="saving"
                            class="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors disabled:opacity-50"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
                            <span x-text="saving ? 'Saving...' : 'Save for Later'"></span>
                        </button>
                    </template>

                    <template x-if="currentSection < totalSections">
                        <button
                            @click="nextSection()"
                            class="flex items-center gap-2 px-6 py-3 bg-[#003087] text-white rounded-lg font-medium hover:bg-[#002366] transition-colors"
                        >
                            Next Section
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                        </button>
                    </template>

                    <template x-if="currentSection >= totalSections">
                        <button
                            @click="submitSurvey()"
                            :disabled="saving"
                            class="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                            <span x-text="saving ? 'Saving...' : (isEditMode ? 'Update Answers' : 'Submit Survey')"></span>
                        </button>
                    </template>
                </div>
            </div>
        </div>
</div>

<script>
function surveyApp() {
    const categories = @json($categories);

    return {
        categories: categories.sort((a, b) => a.order - b.order),
        currentSection: 1,
        formData: {},
        respondentEmail: null,
        isEditMode: false,
        existingResponseId: null,
        resumeCode: null,
        showResumeDialog: false,
        resumeInput: '',
        resumeError: '',
        saving: false,
        showSavedBanner: false,

        init() {
            this.syncAutoCalculatedAge();
        },

        get totalSections() {
            return this.categories.length;
        },

        get currentCategory() {
            return this.categories[this.currentSection - 1] || null;
        },

        get visibleQuestions() {
            if (!this.currentCategory) return [];
            return this.currentCategory.questions
                .slice()
                .sort((a, b) => a.order - b.order)
                .filter(q => this.isConditionMet(q));
        },

        sortedAnswers(question) {
            return (question.answers || []).slice().sort((a, b) => a.order - b.order);
        },

        onRadioChange(question, value) {
            this.formData[question.id] = value;

            if (question.text === 'Is your current address in the Philippines or abroad?') {
                this.normalizeAddressFields(value);
            }
        },

        onDateChange(question, value) {
            this.formData[question.id] = value;
            if (this.isBirthdayQuestion(question)) {
                this.syncAutoCalculatedAge();
            }
        },

        isBirthdayQuestion(question) {
            return this.getCategoryOrderForQuestion(question.id) === 2 && (question.text === 'Birthday' || question.text === 'Month of birth');
        },

        isAutoCalculatedAgeQuestion(question) {
            return this.getCategoryOrderForQuestion(question.id) === 2 && question.text === 'Age on last birthday';
        },

        getCategoryOrderForQuestion(questionId) {
            const category = this.categories.find(c => (c.questions || []).some(q => q.id === questionId));
            return category ? category.order : null;
        },

        findQuestionIdByCategoryAndText(categoryOrder, text) {
            const category = this.categories.find(c => c.order === categoryOrder);
            if (!category) return null;

            const question = (category.questions || []).find(q => q.text === text);
            return question ? question.id : null;
        },

        calculateAgeFromBirthday(birthdayValue) {
            if (!birthdayValue) return '';

            const birthday = new Date(birthdayValue + 'T00:00:00');
            if (Number.isNaN(birthday.getTime())) return '';

            const today = new Date();
            let age = today.getFullYear() - birthday.getFullYear();
            const hasHadBirthdayThisYear =
                today.getMonth() > birthday.getMonth() ||
                (today.getMonth() === birthday.getMonth() && today.getDate() >= birthday.getDate());

            if (!hasHadBirthdayThisYear) {
                age -= 1;
            }

            return age >= 0 ? String(age) : '';
        },

        syncAutoCalculatedAge() {
            const birthdayQuestionId = this.findQuestionIdByCategoryAndText(2, 'Birthday') || this.findQuestionIdByCategoryAndText(2, 'Month of birth');
            const ageQuestionId = this.findQuestionIdByCategoryAndText(2, 'Age on last birthday');

            if (!birthdayQuestionId || !ageQuestionId) return;

            this.formData[ageQuestionId] = this.calculateAgeFromBirthday(this.formData[birthdayQuestionId]);
        },

        normalizeAddressFields(locationValue) {
            const localFieldLabels = [
                'Urban/Rural',
                'Address',
                'Barangay',
                'Municipality',
                'Province',
                'Region',
                'Zip Code',
                'Geocode',
            ];

            if (locationValue === 'Abroad') {
                localFieldLabels.forEach(label => {
                    const questionId = this.findIdentificationQuestionIdByText(label);
                    if (questionId) {
                        delete this.formData[questionId];
                    }
                });
            }

            if (locationValue === 'Philippines') {
                const countryQuestionId = this.findIdentificationQuestionIdByText('Which country are you currently in?');
                if (countryQuestionId) {
                    delete this.formData[countryQuestionId];
                }
            }
        },

        findIdentificationQuestionIdByText(text) {
            const identificationCategory = this.categories.find(c => c.order === 1);
            if (!identificationCategory) return null;

            const question = (identificationCategory.questions || []).find(q => q.text === text);
            return question ? question.id : null;
        },

        isConditionMet(question) {
            if (question.type === 'repeating_text' && question.repeating_ref) {
                const refQuestionId = this.findQuestionIdByRef(question.repeating_ref);
                if (refQuestionId) {
                    return Number(this.formData[refQuestionId] || 0) > 0;
                }
            }

            const cqid = question.condition_question_id;
            const op = question.condition_operator;
            if (!cqid || !op) return true;

            const actual = this.formData[cqid];
            const val = question.condition_value;

            switch (op) {
                case 'equals': return actual === val;
                case 'in': {
                    if (actual === undefined || actual === null || actual === '') return false;

                    let list = [];
                    try {
                        const parsed = JSON.parse(val);
                        if (Array.isArray(parsed)) {
                            list = parsed;
                        }
                    } catch (_) {
                        list = String(val || '').split(',').map(v => v.trim()).filter(v => v !== '');
                    }

                    return list.includes(actual);
                }
                case 'notEquals': return actual !== undefined && actual !== '' && actual !== val;
                case 'notEqualsStrict': return actual !== val;
                case 'includes': return Array.isArray(actual) && val !== undefined && actual.includes(val);
                case 'notEmpty': return actual !== undefined && actual !== '' && actual !== null;
                case 'greaterThan': return Number(actual) > Number(val);
                default: return true;
            }
        },

        toggleCheckbox(questionId, text, checked) {
            let current = this.formData[questionId] || [];
            if (checked) {
                this.formData[questionId] = [...current, text];
            } else {
                // Remove both exact match and "Others: ..." prefixed entries
                this.formData[questionId] = current.filter(v => v !== text && !(text.toLowerCase().includes('other') && v.startsWith(text + ': ')));
            }
        },

        answerNeedsSpecify(answerText) {
            const text = (answerText || '').toLowerCase();
            return text.includes('other') || text.includes('self-describe') || text.includes('self describe');
        },

        getRadioSpecifyLabel(question) {
            const specifyAnswer = this.sortedAnswers(question).find(a => this.answerNeedsSpecify(a.text));
            return specifyAnswer ? specifyAnswer.text : '';
        },

        getOthersLabel(question) {
            const othersAnswer = this.sortedAnswers(question).find(a => a.text.toLowerCase().includes('other'));
            return othersAnswer ? othersAnswer.text : 'Others';
        },

        getOthersSpecifyValue(questionId) {
            const values = this.formData[questionId] || [];
            const othersEntry = values.find(v => v.toLowerCase().startsWith('others'));
            if (othersEntry && othersEntry.includes(': ')) {
                return othersEntry.substring(othersEntry.indexOf(': ') + 2);
            }
            return '';
        },

        setOthersSpecifyValue(questionId, value) {
            let current = this.formData[questionId] || [];
            const idx = current.findIndex(v => v.toLowerCase().startsWith('others'));
            if (idx !== -1) {
                const label = current[idx].includes(': ') ? current[idx].substring(0, current[idx].indexOf(': ')) : current[idx];
                current[idx] = value ? label + ': ' + value : label;
                this.formData[questionId] = [...current];
            }
        },

        getRepeatingCount(question) {
            if (!question.repeating_ref) return 0;
            const refQuestion = this.visibleQuestions.find(q => q.id === this.findQuestionIdByRef(question.repeating_ref));
            if (!refQuestion || refQuestion.type !== 'number') return 0;
            const count = Math.max(0, Math.min(100, parseInt(this.formData[refQuestion.id] || 0)));
            return count;
        },

        findQuestionIdByRef(ref) {
            for (const cat of this.categories) {
                for (const q of cat.questions) {
                    if (q.ref === ref) return q.id;
                }
            }
            return null;
        },

        setRepeatingItem(questionId, index, value) {
            if (!this.formData[questionId]) {
                this.formData[questionId] = [];
            }
            if (!Array.isArray(this.formData[questionId])) {
                this.formData[questionId] = [];
            }
            this.formData[questionId][index] = value;
            this.formData[questionId] = [...this.formData[questionId]];
        },

        nextSection() {
            if (this.currentSection < this.totalSections) {
                this.currentSection++;
                window.scrollTo({ top: 0, behavior: 'instant' });
            }
        },

        previousSection() {
            if (this.currentSection > 1) {
                this.currentSection--;
                window.scrollTo({ top: 0, behavior: 'instant' });
            }
        },

        async saveForLater() {
            this.saving = true;
            try {
                const res = await fetch('/survey/save-draft', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content },
                    body: JSON.stringify({ formData: this.formData, currentSection: this.currentSection }),
                });
                const data = await res.json();
                this.resumeCode = data.code;
                this.showSavedBanner = true;
            } catch {
                alert('An error occurred while saving. Please try again.');
            } finally {
                this.saving = false;
            }
        },

        async resumeSurvey() {
            const code = this.resumeInput.trim().toUpperCase();
            if (!code) { this.resumeError = 'Please enter a resume code.'; return; }

            try {
                const res = await fetch('/survey/resume', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content },
                    body: JSON.stringify({ code }),
                });

                if (!res.ok) {
                    const err = await res.json();
                    this.resumeError = err.error || 'Invalid resume code.';
                    return;
                }

                const data = await res.json();
                this.formData = data.formData;
                this.currentSection = data.currentSection;
                this.syncAutoCalculatedAge();
                this.showResumeDialog = false;
                this.resumeInput = '';
                this.resumeError = '';
            } catch {
                this.resumeError = 'An error occurred. Please try again.';
            }
        },

        copyCode() {
            if (this.resumeCode) {
                navigator.clipboard.writeText(this.resumeCode);
                alert('Resume code copied to clipboard!');
            }
        },

        async submitSurvey() {
            this.saving = true;
            try {
                const res = await fetch('/survey/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content },
                    body: JSON.stringify({
                        email: this.respondentEmail,
                        formData: this.formData,
                        existingResponseId: this.existingResponseId,
                        resumeCode: this.resumeCode,
                    }),
                });

                if (res.ok) {
                    alert('Thank you for completing the tracer study. Your responses have been submitted successfully!');
                    this.formData = {};
                    this.respondentEmail = null;
                    this.currentSection = 1;
                    this.isEditMode = false;
                    this.existingResponseId = null;
                } else {
                    alert('Failed to submit. Please try again.');
                }
            } catch {
                alert('An error occurred. Please try again.');
            } finally {
                this.saving = false;
            }
        },
    };
}
</script>

<style>
[x-cloak] { display: none !important; }

.survey-progress-shell {
    position: relative;
    height: 12px;
    border-radius: 9999px;
    overflow: hidden;
    background: linear-gradient(90deg, #e9eef7 0%, #dde7f6 100%);
    box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.12);
}

.survey-progress-fill {
    position: relative;
    height: 100%;
    border-radius: inherit;
    transition: width 420ms cubic-bezier(0.22, 1, 0.36, 1);
    background: linear-gradient(90deg, #0f4ab7 0%, #003087 55%, #2457ba 100%);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.15) inset, 0 2px 10px rgba(0, 48, 135, 0.35);
}

.survey-progress-fill::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, rgba(255, 255, 255, 0) 35%, rgba(255, 255, 255, 0.35) 50%, rgba(255, 255, 255, 0) 65%);
    transform: translateX(-120%);
    animation: survey-progress-shimmer 2.2s ease-in-out infinite;
}

@keyframes survey-progress-shimmer {
    0%, 35% { transform: translateX(-120%); }
    100% { transform: translateX(140%); }
}
</style>
@endsection
