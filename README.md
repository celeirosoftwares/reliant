# 🛡️ Reliant

**The reliability layer for LLM-powered products.**

Reliant sits between your application and LLM providers, ensuring predictable outputs, automatic retries, and real-time observability.

---

## Architecture

```
Your App → SDK → Reliant API → LLM Provider (OpenAI / Anthropic / Gemini)
                     ↓
              Schema Validation
              Retry Orchestrator
              Observability Engine
                     ↓
                 Dashboard
```

## Quick Start

### 1. Start the API

```bash
cd api
cp .env.example .env    # Configure your database + LLM keys
npm install
npx prisma db push
npm run db:seed         # Creates a demo project with API key
npm run dev             # Runs on http://localhost:3100
```

### 2. Start the Dashboard

```bash
cd dashboard
cp .env.example .env.local
npm install
npm run dev             # Runs on http://localhost:3200
```

### 3. Integrate with the SDK

```bash
npm install reliant-js
```

```typescript
import { Reliant } from 'reliant-js';

const reliant = new Reliant({
  apiKey: 'rel_your_api_key_here',
  baseUrl: 'http://localhost:3100',
});

// Create a schema (output contract)
const schema = await reliant.createSchema({
  name: 'Contact Extraction',
  slug: 'contact-extraction',
  definition: {
    type: 'object',
    required: ['name', 'email'],
    properties: {
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      phone: { type: 'string' },
    },
  },
});

// Execute with validation + retry
const result = await reliant.execute({
  prompt: 'Extract: "John Doe, john@acme.com, +1 555-0123"',
  schemaId: schema.id,
  provider: 'openai',
  model: 'gpt-4o',
});

console.log(result.output);
// { name: "John Doe", email: "john@acme.com", phone: "+1 555-0123" }

console.log(result.metadata);
// { execution_id: "...", attempts: 1, latency_ms: 843, tokens_used: 312 }
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/projects` | Create a new project (returns API key) |
| `POST` | `/schemas` | Create a schema |
| `GET` | `/schemas` | List schemas |
| `GET` | `/schemas/:id` | Get schema detail |
| `PUT` | `/schemas/:id` | Update schema (creates new version) |
| `POST` | `/execute` | Execute prompt with schema validation |
| `GET` | `/executions` | List executions (paginated) |
| `GET` | `/executions/:id` | Get execution detail |
| `GET` | `/metrics/summary` | Project-level metrics |
| `GET` | `/metrics/schemas/:id` | Per-schema metrics |

All endpoints (except `/projects`) require `X-Reliant-Key` header.

## Retry Strategy

| Attempt | Strategy |
|---------|----------|
| 1st | Normal LLM call |
| 2nd | Append validation errors to prompt |
| 3rd | Simplified prompt + temperature=0 |
| Fallback | Return `safe_fallback` from schema |

## Tech Stack

- **API:** Node.js + Fastify + Prisma + PostgreSQL
- **Dashboard:** Next.js
- **SDK:** TypeScript (reliant-js)
- **Auth:** API Keys (`rel_` prefix)

## License

MIT
