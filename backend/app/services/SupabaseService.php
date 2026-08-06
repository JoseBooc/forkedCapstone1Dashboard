<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SupabaseService
{
    // Base URL of your Supabase Data API
    protected string $baseUrl = 'https://dfysdsuzfdiytjocxbge.supabase.co/rest/v1';

    // API key (leave empty if RLS is off)
    protected string $apiKey = 'sb_publishable_C5TMl37bLp2v3fDOgk_ixg_dE4GDl_A';

    // Default headers
    protected array $headers = [];

    // Whether to actually call Supabase
    protected bool $enabled = false;

    public function __construct()
    {
        $this->enabled = filter_var(env('USE_SUPABASE', false), FILTER_VALIDATE_BOOLEAN);

        $this->headers = [
            'apikey' => $this->apiKey,
            'Authorization' => 'Bearer ' . $this->apiKey,
            'Content-Type' => 'application/json',
            'Accept' => 'application/json'
        ];
    }

    /**
     * Perform HTTP call safely. Returns array on success or empty array on failure/disabled.
     */
    protected function safeCall(string $method, string $url, $payload = []): array
    {
        if (! $this->enabled) {
            return [];
        }

        try {
            $request = Http::withHeaders($this->headers)->withoutVerifying();

            switch (strtolower($method)) {
                case 'get':
                    $response = $request->get($url, $payload);
                    break;
                case 'post':
                    $response = $request->post($url, $payload);
                    break;
                case 'patch':
                    $response = $request->patch($url, $payload);
                    break;
                case 'delete':
                    $response = $request->delete($url);
                    break;
                default:
                    throw new \InvalidArgumentException("Unsupported method: {$method}");
            }

            if ($response->successful()) {
                return $response->json() ?? [];
            }

            Log::warning('SupabaseService non-success response', ['status' => $response->status(), 'body' => $response->body()]);
            return [];
        } catch (\Throwable $e) {
            Log::error('SupabaseService error: ' . $e->getMessage());
            return [];
        }
    }

    public function insert(string $table, array $data): array
    {
        return $this->safeCall('post', "{$this->baseUrl}/{$table}", $data);
    }

    public function get(string $table, array $query = []): array
    {
        return $this->safeCall('get', "{$this->baseUrl}/{$table}", $query);
    }

    public function update(string $table, array $data, string $filter): array
    {
        return $this->safeCall('patch', "{$this->baseUrl}/{$table}?{$filter}", $data);
    }

    public function delete(string $table, string $filter): array
    {
        return $this->safeCall('delete', "{$this->baseUrl}/{$table}?{$filter}");
    }
}
