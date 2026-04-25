<?php

use Illuminate\Support\Facades\Route;

// Serve the React SPA frontend - catch all routes and let React Router handle them
Route::get('/{any?}', function () {
    // Check if the React app has been built and the file exists
    $reactIndex = public_path('index.html');
    
    if (file_exists($reactIndex)) {
        return file_get_contents($reactIndex);
    }
    
    // Fallback: Return a message indicating the frontend needs to be built
    return <<<HTML
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ADDU Alumni Portal</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                background: #f8fafc;
            }
            #root {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }
            .message {
                text-align: center;
            }
            h1 {
                color: #003087;
                margin-bottom: 10px;
            }
            p {
                color: #666;
            }
        </style>
    </head>
    <body>
        <div id="root">
            <div class="message">
                <h1>ADDU Alumni Portal</h1>
                <p>Please build the React frontend first by running:</p>
                <p><code>cd frontend && npm run build</code></p>
            </div>
        </div>
    </body>
    </html>
    HTML;
})->where('any', '.*');
