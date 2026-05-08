# reliant-php

SDK oficial PHP para o [Reliant](https://reliant.dev.br) — LLM Reliability Layer.

## Instalação

```bash
composer require reliant/reliant-php
```

## Início rápido

```php
<?php

require 'vendor/autoload.php';

use Reliant\Reliant;

$client = new Reliant([
    'api_key'  => 'rel_...',   // Dashboard → Configurações
    'user_id'  => 'seu-user-id', // Dashboard → Configurações
    'base_url' => 'https://reliant-production.up.railway.app',
]);

// Executar com validação garantida
$result = $client->execute([
    'prompt'    => 'Extraia os dados: João Silva, joao@email.com',
    'schema_id' => 'id-do-seu-schema',
    'provider'  => 'anthropic',
    'model'     => 'claude-sonnet-4-20250514',
]);

echo $result['output']['name'];  // João Silva
echo $result['output']['email']; // joao@email.com
echo $result['metadata']['attempts']; // 1
```

## Métodos disponíveis

### execute(array $params): array

```php
$result = $client->execute([
    'prompt'    => 'seu prompt',
    'schema_id' => 'sch_...',
    'provider'  => 'anthropic', // anthropic | openai | gemini | groq | mistral
    'model'     => 'claude-sonnet-4-20250514',
    'options'   => ['max_retries' => 3],
]);

// $result['success']  → bool
// $result['output']   → array com o output validado
// $result['status']   → 'success' | 'fallback' | 'failed'
// $result['metadata'] → execution_id, attempts, latency_ms, tokens_used
```

### listSchemas(): array

```php
$schemas = $client->listSchemas();
foreach ($schemas['schemas'] as $schema) {
    echo $schema['name'] . ' — ' . $schema['id'];
}
```

### createSchema(array $params): array

```php
$schema = $client->createSchema([
    'name'       => 'Extração de Contato',
    'slug'       => 'contact-extraction',
    'definition' => [
        'type'       => 'object',
        'required'   => ['name', 'email'],
        'properties' => [
            'name'  => ['type' => 'string'],
            'email' => ['type' => 'string'],
        ],
    ],
    'safe_fallback' => ['name' => null, 'email' => null],
]);
```

### listExecutions(array $filters = []): array

```php
$executions = $client->listExecutions([
    'limit'  => 20,
    'status' => 'failed',
]);
```

### getMetrics(int $days = 30): array

```php
$metrics = $client->getMetrics(30);
echo $metrics['success_rate']; // 98.5
echo $metrics['total_executions']; // 1420
echo $metrics['estimated_cost_usd']; // 0.0842
```

### getMetricsBySchema(): array / getMetricsByProvider(): array

```php
$bySchema   = $client->getMetricsBySchema(30);
$byProvider = $client->getMetricsByProvider(30);
```

## Tratamento de erros

```php
use Reliant\ReliantException;

try {
    $result = $client->execute([...]);
} catch (ReliantException $e) {
    echo 'Erro ' . $e->getCode() . ': ' . $e->getMessage();
}
```

## Requisitos

- PHP >= 7.4
- Extensões: `curl`, `json`
