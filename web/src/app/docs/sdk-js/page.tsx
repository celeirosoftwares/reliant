import Link from 'next/link'
import styles from '@/components/dashboard/Docs.module.css'

export default function SdkJsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.badge}>SDKs</div>
      <h1 className={styles.title}>SDK JavaScript / TypeScript</h1>
      <p className={styles.lead}>
        O SDK oficial para JavaScript e TypeScript. Totalmente tipado, suporte a ESM e CommonJS.
      </p>

      <hr className={styles.divider} />

      <h2 className={styles.h2}>Instalação</h2>
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>bash</span></div>
        <div className={styles.code}>npm install reliant-js</div>
      </div>

      <hr className={styles.divider} />

      <h2 className={styles.h2}>Inicialização</h2>
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>typescript</span></div>
        <div className={styles.code}>
{`import { Reliant } from 'reliant-js'

const reliant = new Reliant({
  apiKey: 'rel_...',        // obrigatório
  baseUrl: 'https://reliant-production.up.railway.app', // obrigatório
  timeout: 120000,          // opcional, padrão 120s
})`}
        </div>
      </div>

      <hr className={styles.divider} />

      <h2 className={styles.h2}>Métodos disponíveis</h2>

      <h3 className={styles.h3}>reliant.execute()</h3>
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>typescript</span></div>
        <div className={styles.code}>
{`const result = await reliant.execute({
  prompt: 'Seu prompt aqui',
  schemaId: 'sch_...',
  provider: 'anthropic',  // 'anthropic' | 'openai' | 'gemini'
  model: 'claude-sonnet-4-20250514',
  options: {
    max_retries: 3,      // opcional
    temperature: 0.2,    // opcional
  }
})

// result.success: boolean
// result.output: object
// result.metadata.execution_id: string
// result.metadata.attempts: number
// result.metadata.latency_ms: number
// result.metadata.tokens_used: number`}
        </div>
      </div>

      <h3 className={styles.h3}>reliant.createSchema()</h3>
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>typescript</span></div>
        <div className={styles.code}>
{`const schema = await reliant.createSchema({
  name: 'Nome do Schema',
  slug: 'nome-do-schema',
  description: 'Descrição opcional',
  definition: { /* JSON Schema */ },
  safe_fallback: { /* objeto de fallback */ },
})`}
        </div>
      </div>

      <h3 className={styles.h3}>reliant.listSchemas()</h3>
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>typescript</span></div>
        <div className={styles.code}>
{`const { schemas } = await reliant.listSchemas()
schemas.forEach(s => console.log(s.id, s.name, s.version))`}
        </div>
      </div>

      <h3 className={styles.h3}>reliant.listExecutions()</h3>
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>typescript</span></div>
        <div className={styles.code}>
{`const { executions, pagination } = await reliant.listExecutions({
  page: 1,
  limit: 20,
  status: 'failed',      // opcional
  schema_id: 'sch_...',  // opcional
})`}
        </div>
      </div>

      <h3 className={styles.h3}>reliant.getMetricsSummary()</h3>
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>typescript</span></div>
        <div className={styles.code}>
{`const metrics = await reliant.getMetricsSummary(30) // últimos 30 dias

console.log(metrics.total_executions)
console.log(metrics.success_rate)    // percentual
console.log(metrics.avg_latency_ms)
console.log(metrics.total_tokens)
console.log(metrics.daily)           // breakdown diário`}
        </div>
      </div>

      <hr className={styles.divider} />

      <h2 className={styles.h2}>Tratamento de erros</h2>
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>typescript</span></div>
        <div className={styles.code}>
{`import { Reliant, ReliantError } from 'reliant-js'

try {
  const result = await reliant.execute({ ... })
} catch (err) {
  if (err instanceof ReliantError) {
    console.error('Status:', err.status)   // HTTP status code
    console.error('Message:', err.message)
    console.error('Data:', err.data)       // resposta completa da API
  }
}`}
        </div>
      </div>

      <div className={styles.pagination}>
        <Link href="/docs/fallbacks" className={styles.pageLink}>
          <span className={styles.pageLinkLabel}>← Anterior</span>
          <span className={styles.pageLinkTitle}>Safe Fallbacks</span>
        </Link>
        <Link href="/docs/sdk-python" className={styles.pageLink} style={{ textAlign: 'right' }}>
          <span className={styles.pageLinkLabel}>Próximo →</span>
          <span className={styles.pageLinkTitle}>SDK Python</span>
        </Link>
      </div>
    </div>
  )
}
