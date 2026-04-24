<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CareerPosting;
use App\Models\EngagementEvent;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function careerApplicants(CareerPosting $careerPosting)
    {
        $rows = $careerPosting->applications()
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($application) => [
                'Applicant Name' => $application->applicant_name,
                'Email' => $application->applicant_email,
                'Phone' => $application->applicant_phone,
                'Applied At' => optional($application->created_at)->toDateTimeString(),
            ])
            ->all();

        return $this->streamCsv(
            'career-applicants-' . $careerPosting->id . '.csv',
            ['Applicant Name', 'Email', 'Phone', 'Applied At'],
            $rows
        );
    }

    public function participants(Request $request)
    {
        $events = EngagementEvent::with('registrations')
            ->orderByDesc('event_date')
            ->get();

        $rows = [];
        foreach ($events as $event) {
            foreach ($event->registrations->where('is_guest', false) as $registration) {
                $rows[] = [
                    'Event' => $event->title,
                    'Participant Name' => trim($registration->first_name . ' ' . $registration->last_name),
                    'Email' => $registration->email,
                    'Registered At' => optional($registration->created_at)->toDateTimeString(),
                ];
            }
        }

        return $this->downloadOrJson($request, 'engagement-participants.csv', ['Event', 'Participant Name', 'Email', 'Registered At'], $rows);
    }

    public function guests(Request $request)
    {
        $events = EngagementEvent::with('registrations')
            ->orderByDesc('event_date')
            ->get();

        $rows = [];
        foreach ($events as $event) {
            foreach ($event->registrations->where('is_guest', true) as $registration) {
                $rows[] = [
                    'Event' => $event->title,
                    'Guest Name' => trim($registration->first_name . ' ' . $registration->last_name),
                    'Email' => $registration->email,
                    'Guest Count' => $registration->guest_count,
                    'Registered At' => optional($registration->created_at)->toDateTimeString(),
                ];
            }
        }

        return $this->downloadOrJson($request, 'engagement-guest-list.csv', ['Event', 'Guest Name', 'Email', 'Guest Count', 'Registered At'], $rows);
    }

    public function attendance(Request $request)
    {
        $rows = EngagementEvent::with('attendances')
            ->orderByDesc('event_date')
            ->get()
            ->flatMap(fn ($event) => $event->attendances->map(fn ($attendance) => [
                'Event' => $event->title,
                'Attendee Name' => $attendance->attendee_name,
                'Email' => $attendance->attendee_email,
                'Attended' => $attendance->attended ? 'Yes' : 'No',
                'Checked In At' => optional($attendance->attended_at)->toDateTimeString(),
            ]))
            ->all();

        return $this->downloadOrJson($request, 'engagement-attendance-report.csv', ['Event', 'Attendee Name', 'Email', 'Attended', 'Checked In At'], $rows);
    }

    public function income(Request $request)
    {
        $rows = EngagementEvent::with('payments')
            ->orderByDesc('event_date')
            ->get()
            ->flatMap(fn ($event) => $event->payments->map(fn ($payment) => [
                'Event' => $event->title,
                'Payer Name' => $payment->payer_name,
                'Email' => $payment->payer_email,
                'Amount' => $payment->amount,
                'Method' => $payment->payment_method,
                'Status' => $payment->status,
                'Paid At' => optional($payment->paid_at)->toDateTimeString(),
            ]))
            ->all();

        return $this->downloadOrJson($request, 'engagement-income-report.csv', ['Event', 'Payer Name', 'Email', 'Amount', 'Method', 'Status', 'Paid At'], $rows);
    }

    private function downloadOrJson(Request $request, string $filename, array $headers, array $rows)
    {
        if ($request->boolean('download', true)) {
            return $this->streamCsv($filename, $headers, $rows);
        }

        return response()->json([
            'headers' => $headers,
            'rows' => $rows,
        ]);
    }

    private function streamCsv(string $filename, array $headers, array $rows)
    {
        return response()->streamDownload(function () use ($headers, $rows) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, $headers);

            foreach ($rows as $row) {
                fputcsv($handle, array_values($row));
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}