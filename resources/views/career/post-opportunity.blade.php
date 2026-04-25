<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Post Opportunity</title>
    @vite(['resources/css/app.css', 'resources/js/post-opportunity.tsx'])
</head>
<body class="bg-gray-50 min-h-screen">
    <div id="post-opportunity-root"></div>
</body>
</html>
