<?php

namespace Reliant;

class ReliantException extends \Exception {}

class Reliant
{
    private string $apiKey;
    private string $userId;
    private string $baseUrl;
    private int $timeout;

    public function __construct(array $config)
    {
        if (empty($config['api_key'])) {
            throw new ReliantException('api_key is required');
        }
        if (empty($config['user_id'])) {
            throw new ReliantException('user_id is required');
        }

        $this->apiKey  = $config['api_key'];
        $this->userId  = $config['user_id'];
        $this->baseUrl = rtrim($config['base_url'] ?? 'https://reliant-production.up.railway.app', '/');
        $this->timeout = $config['timeout'] ?? 120;
    }

    /**
     * Execute a prompt with schema validation and retry.
     */
    public function execute(array $params): array
    {
        $required = ['prompt', 'schema_id', 'provider', 'model'];
        foreach ($required as $field) {
            if (empty($params[$field])) {
                throw new ReliantException("$field is required");
            }
        }

        $body = [
            'prompt'    => $params['prompt'],
            'schema_id' => $params['schema_id'],
            'provider'  => $params['provider'],
            'model'     => $params['model'],
            'user_id'   => $params['user_id'] ?? $this->userId,
        ];

        if (!empty($params['options'])) {
            $body['options'] = $params['options'];
        }

        return $this->request('POST', '/execute', $body);
    }

    /**
     * List all schemas for the project.
     */
    public function listSchemas(): array
    {
        return $this->request('GET', '/schemas');
    }

    /**
     * Get a schema by ID.
     */
    public function getSchema(string $id): array
    {
        return $this->request('GET', "/schemas/$id");
    }

    /**
     * Create a new schema.
     */
    public function createSchema(array $params): array
    {
        $required = ['name', 'slug', 'definition'];
        foreach ($required as $field) {
            if (empty($params[$field])) {
                throw new ReliantException("$field is required");
            }
        }

        return $this->request('POST', '/schemas', $params);
    }

    /**
     * List executions with optional filters.
     */
    public function listExecutions(array $filters = []): array
    {
        $query = http_build_query($filters);
        return $this->request('GET', '/executions' . ($query ? "?$query" : ''));
    }

    /**
     * Get execution details by ID.
     */
    public function getExecution(string $id): array
    {
        return $this->request('GET', "/executions/$id");
    }

    /**
     * Get metrics summary.
     */
    public function getMetrics(int $days = 30): array
    {
        return $this->request('GET', "/metrics/summary?days=$days");
    }

    /**
     * Get metrics by schema.
     */
    public function getMetricsBySchema(int $days = 30): array
    {
        return $this->request('GET', "/metrics/by-schema?days=$days");
    }

    /**
     * Get metrics by provider.
     */
    public function getMetricsByProvider(int $days = 30): array
    {
        return $this->request('GET', "/metrics/by-provider?days=$days");
    }

    private function request(string $method, string $path, array $body = []): array
    {
        $url = $this->baseUrl . $path;

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, $this->timeout);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'X-Reliant-Key: ' . $this->apiKey,
        ]);

        if ($method === 'POST') {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
        } elseif ($method !== 'GET') {
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
            if (!empty($body)) {
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
            }
        }

        $response = curl_exec($ch);
        $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            throw new ReliantException("cURL error: $error");
        }

        $data = json_decode($response, true);

        if ($statusCode >= 400) {
            $message = $data['message'] ?? $data['error'] ?? 'Unknown error';
            throw new ReliantException("Reliant API error ($statusCode): $message", $statusCode);
        }

        return $data;
    }
}
