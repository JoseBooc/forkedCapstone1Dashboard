<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>GiveBack Payment Receipt</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; color: #1f2937; }
        .header { text-align: center; margin-bottom: 24px; }
        .title { font-size: 20px; font-weight: bold; color: #003087; }
        .section { margin-bottom: 16px; }
        .label { font-weight: bold; width: 160px; display: inline-block; }
        .box { border: 1px solid #e5e7eb; padding: 12px; border-radius: 6px; background: #f9fafb; }
        .footer { margin-top: 24px; font-style: italic; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">GiveBack Payment Receipt</div>
        <div>Receipt ID: {{ $registration->id }}</div>
    </div>

    <div class="section box">
        <div><span class="label">Name:</span> {{ $registration->full_name }}</div>
        <div><span class="label">Email:</span> {{ $registration->email }}</div>
        <div><span class="label">Event / Project:</span> {{ $activity->title }}</div>
        <div><span class="label">Amount Paid:</span> PHP {{ number_format((float) $registration->amount_due, 2) }}</div>
        <div><span class="label">Payment Method:</span> {{ ucfirst(str_replace('_', ' ', $registration->payment_method)) }}</div>
        <div><span class="label">Reference Number:</span> {{ $registration->reference_number ?? 'N/A' }}</div>
        <div><span class="label">Date Paid:</span> {{ $registration->created_at->format('F d, Y') }}</div>
        <div><span class="label">Status:</span> {{ ucfirst($registration->payment_status) }}</div>
    </div>

    <div class="footer">
        Thank you for paying and supporting our GiveBack initiative. Your contribution helps build stronger communities.
    </div>
</body>
</html>
