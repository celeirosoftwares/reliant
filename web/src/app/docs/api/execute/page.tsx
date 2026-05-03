import Link from 'next/link'
import styles from '@/components/dashboard/Docs.module.css'

export default function ApiExecutePage() {
  return (
    <div className={styles.page}>
      <div className={styles.badge}>API Reference</div>
      <h1 className={styles.title}>POST /execute</h1>
      <p className={styles.lead}>
        Executa um prompt contra um schema com validação automática e retry inteligente.
      </p>

      <hr className={styles.divider} />

      <h2 className={styles.h2}>Endpoint</h2>
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>http</span></div>
        <div className={styles.code}>
{`POST https://reliant-production.up.railway.app/execute

Headers:
  Content-Type: application/json
  X-Reliant-Key: rel_...`}
        </div>
      </div>

      <h2 className={styles.h2}>Request Body</h2>
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>json</span></div>
        <div className={styles.code}>
{`{
  "prompt": "Extraia os dados: João Silva, joao@email.com",
  "schema_id": "cmonautso0002ph012m23m4au",
  "provider": "anthropic",
  "model": "claude-sonnet-4-20250514",
  "options": {
    "max_retries": 3,
    "temperature": 0.2
  }
}`}
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr><th>Campo</th><th>Tipo</th><th></th><th>Descrição</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><span className={styles.param}>prompt</span></td>
            <td><span className={styles.type}>string</span></td>
            <td><span className={styles.required}>obrigatório</span></td>
            <td>Prompt enviado ao LLM</td>
          </tr>
          <tr>
            <td><span className={styles.param}>schema_id</span></td>
            <td><span className={styles.type}>string</span></td>
            <td><span className={styles.required}>obrigatório</span></td>
            <td>ID do schema de validação</td>
          </tr>
          <tr>
            <td><span className={styles.param}>provider</span></td>
            <td><span className={styles.type}>string</span></td>
            <td><span className={styles.required}>obrigatório</span></td>
            <td>anthropic | openai | gemini</td>
          </tr>
          <tr>
            <td><span className={styles.param}>model</span></td>
            <td><span className={styles.type}>string</span></td>
            <td><span className={styles.required}>obrigatório</span></td>
            <td>Modelo do provider</td>
          </tr>
          <tr>
            <td><span className={styles.param}>options.max_retries</span></td>
            <td><span className={styles.type}>number</span></td>
            <td><span className={styles.optional}>opcional</span></td>
            <td>Máximo de tentativas. Padrão: 3</td>
          </tr>
          <tr>
            <td><span className={styles.param}>options.temperature</span></td>
            <td><span className={styles.type}>number</span></td>
            <td><span className={styles.optional}>opcional</span></td>
            <td>Temperatura do modelo. Padrão: 0.2</td>
          </tr>
        </tbody>
      </table>

      <h2 className={styles.h2}>Response — 200 OK</h2>
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>json</span></div>
        <div className={styles.code}>
{`{
  "success": true,
  "status": "success",
  "output": {
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": null
  },
  "metadata": {
    "execution_id": "cmonavlcs0004ph01ska7i1tq",
    "attempts": 1,
    "latency_ms": 743,
    "tokens_used": 218,
    "provider": "anthropic",
    "model": "claude-sonnet-4-20250514"
  }
}`}
        </div>
      </div>

      <h2 className={styles.h2}>Response — 207 (Fallback usado)</h2>
      <p className={styles.p}>Retornado quando todos os retries falharam e o safe_fallback foi utilizado.</p>
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>json</span></div>
        <div className={styles.code}>
{`{
  "success": false,
  "status": "fallback",
  "output": {
    "name": null,
    "email": null,
    "phone": null
  },
  "metadata": {
    "execution_id": "exec_...",
    "attempts": 3,
    "latency_ms": 4821,
    ...
  }
}`}
        </div>
      </div>

      <h2 className={styles.h2}>Exemplo completo</h2>
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>typescript</span></div>
        <div className={styles.code}>
{`const response = await fetch('https://reliant-production.up.railway.app/execute', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Reliant-Key': 'rel_...',
  },
  body: JSON.stringify({
    prompt: 'Extraia os dados: João Silva, joao@email.com',
    schema_id: 'seu-schema-id',
    provider: 'anthropic',
    model: 'claude-sonnet-4-20250514',
  }),
})

const data = await response.json()
console.log(data.output)`}
        </div>
      </div>

      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>curl</span></div>
        <div className={styles.code}>
{`curl -X POST https://reliant-production.up.railway.app/execute \\
  -H "Content-Type: application/json" \\
  -H "X-Reliant-Key: rel_..." \\
  -d '{
    "prompt": "Extraia os dados: João Silva, joao@email.com",
    "schema_id": "seu-schema-id",
    "provider": "anthropic",
    "model": "claude-sonnet-4-20250514"
  }'`}
        </div>
      </div>

      <div className={styles.pagination}>
        <Link href="/docs/sdk-python" className={styles.pageLink}>
          <span className={styles.pageLinkLabel}>← Anterior</span>
          <span className={styles.pageLinkTitle}>SDK Python</span>
        </Link>
        <Link href="/docs/api/schemas" className={styles.pageLink} style={{ textAlign: 'right' }}>
          <span className={styles.pageLinkLabel}>Próximo →</span>
          <span className={styles.pageLinkTitle}>API — Schemas</span>
        </Link>
      </div>
    </div>
  )
}
