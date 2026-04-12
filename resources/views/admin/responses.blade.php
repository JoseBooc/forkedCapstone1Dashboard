@extends('layouts.app')

@section('title', 'Responses - Admin')

@section('content')
<div x-data="responsesApp()" x-cloak>
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
                   class="px-4 py-2.5 text-sm font-medium border-b-2 transition-colors border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap">
                    Dashboard
                </a>
                <a href="/admin/responses"
                   class="px-4 py-2.5 text-sm font-medium border-b-2 transition-colors border-[#003087] text-[#003087] whitespace-nowrap">
                    Responses
                </a>
            </nav>
        </div>
    </div>

    {{-- Main Content --}}
    <div class="max-w-7xl mx-auto px-6 py-8">
        <div class="bg-white rounded-lg shadow-sm p-8">
            {{-- Header --}}
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Survey Responses</h1>
                    <p class="text-sm text-gray-500 mt-1" x-text="responses.length + ' total submission' + (responses.length !== 1 ? 's' : '')"></p>
                </div>
                <template x-if="responses.length > 0">
                    <a href="/admin/export-csv" class="flex items-center gap-2 px-4 py-2 bg-[#003087] text-white rounded-lg hover:bg-[#002366] transition-colors text-sm font-medium">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        Export CSV
                    </a>
                </template>
            </div>

            <template x-if="responses.length === 0">
                <div class="text-center py-20">
                    <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    <h2 class="text-lg font-semibold text-gray-600 mb-1">No responses yet</h2>
                    <p class="text-sm text-gray-400">Responses will appear here once someone submits the survey.</p>
                </div>
            </template>

            <template x-if="responses.length > 0">
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {{-- Table Header --}}
                    <div class="grid grid-cols-[60px_1fr_200px_100px] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <span>#</span>
                        <span>Response ID</span>
                        <button class="flex items-center gap-1 hover:text-gray-700" @click="sortAsc = !sortAsc">
                            Submitted
                            <template x-if="sortAsc">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/></svg>
                            </template>
                            <template x-if="!sortAsc">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                            </template>
                        </button>
                        <span class="text-center">View</span>
                    </div>

                    {{-- Rows --}}
                    <template x-for="(r, i) in sortedResponses" :key="r.id">
                        <div>
                            <div
                                :class="selectedResponse === r.id ? 'bg-blue-50' : ''"
                                class="grid grid-cols-[60px_1fr_200px_100px] gap-4 px-6 py-4 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors"
                            >
                                <span class="text-sm text-gray-400" x-text="i + 1"></span>
                                <span class="text-sm font-mono text-gray-700 truncate" x-text="r.id"></span>
                                <span class="text-sm text-gray-600" x-text="formatDate(r.submitted_at)"></span>
                                <div class="text-center">
                                    <button
                                        @click="viewResponse(r.id)"
                                        class="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md bg-[#003087] text-white hover:bg-[#002366] transition-colors"
                                    >
                                        <template x-if="selectedResponse === r.id">
                                            <span class="flex items-center gap-1">
                                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                                Close
                                            </span>
                                        </template>
                                        <template x-if="selectedResponse !== r.id">
                                            <span class="flex items-center gap-1">
                                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                                View
                                            </span>
                                        </template>
                                    </button>
                                </div>
                            </div>

                            {{-- Expanded detail --}}
                            <template x-if="selectedResponse === r.id">
                                <div class="px-6 py-6 bg-gray-50 border-b border-gray-200">
                                    <template x-if="detailsLoading">
                                        <p class="text-sm text-gray-400">Loading answers...</p>
                                    </template>
                                    <template x-if="!detailsLoading && responseDetails.length === 0">
                                        <p class="text-sm text-gray-400">No answers recorded for this response.</p>
                                    </template>
                                    <template x-if="!detailsLoading && responseDetails.length > 0">
                                        <div class="space-y-4">
                                            <template x-for="group in groupedDetails" :key="group.title">
                                                <div>
                                                    <h3 class="text-xs font-bold text-[#003087] uppercase tracking-wider mb-2 border-b border-blue-100 pb-1" x-text="group.title"></h3>
                                                    <div class="space-y-1">
                                                        <template x-for="item in group.items" :key="item.id">
                                                            <div class="grid grid-cols-[1fr_1fr] gap-4 py-1.5 text-sm">
                                                                <span class="text-gray-600" x-text="item.question_text"></span>
                                                                <span class="font-medium text-gray-900" x-text="formatAnswer(item)"></span>
                                                            </div>
                                                        </template>
                                                    </div>
                                                </div>
                                            </template>
                                        </div>
                                    </template>
                                </div>
                            </template>
                        </div>
                    </template>
                </div>
            </template>
        </div>
    </div>
</div>

<script>
function responsesApp() {
    return {
        responses: @json($responses),
        selectedResponse: null,
        responseDetails: [],
        detailsLoading: false,
        sortAsc: false,

        get sortedResponses() {
            return [...this.responses].sort((a, b) => {
                const da = new Date(a.submitted_at).getTime();
                const db = new Date(b.submitted_at).getTime();
                return this.sortAsc ? da - db : db - da;
            });
        },

        get groupedDetails() {
            const grouped = {};
            for (const ra of this.responseDetails) {
                const cat = ra.category_title || 'Unknown';
                if (!grouped[cat]) grouped[cat] = [];
                grouped[cat].push(ra);
            }
            return Object.entries(grouped).map(([title, items]) => ({ title, items }));
        },

        formatDate(dateStr) {
            return new Date(dateStr).toLocaleString('en-PH', {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit',
            });
        },

        formatAnswer(ra) {
            if (ra.values && ra.values.length > 0) return ra.values.join(', ');
            return ra.value || '—';
        },

        async viewResponse(responseId) {
            if (this.selectedResponse === responseId) {
                this.selectedResponse = null;
                return;
            }

            this.detailsLoading = true;
            this.selectedResponse = responseId;

            try {
                const res = await fetch('/admin/responses/' + responseId + '/details');
                this.responseDetails = await res.json();
            } catch {
                this.responseDetails = [];
            }
            this.detailsLoading = false;
        },
    };
}
</script>

<style>
[x-cloak] { display: none !important; }
</style>
@endsection
