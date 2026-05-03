import Link from 'next/link'
import styles from '../../docs.module.css'

export default function ExecutePage() {
  return (
    <div className={styles.page}>
      <div className={styles.badge}>Conceitos</div>
      <h1 className={styles.title}>Execute & Retry</h1>
      <p className={styles.lead}>
        O núcleo do Reliant. Cada chamada ao <span className={styles.inline}>execute()</span> passa por um pipeline de validação e retry automático que garante o output correto.
      </p>

      <hr className={styles.divider} />

      <h2 className={styles.h2}>O pipeline de execução</h2>
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>fluxo</span></div>
        <div className={styles.code}>
{`reliant.execute(prompt, schemaId, provider, model)
        │
        ▼
  Monta system prompt com o schema
        │
        ▼
  Chama o LLM provider
        │
        ▼
  Parseia o output como JSON
        │
     válido? ──── sim ──→ retorna output + metadata
        │
       não
        │
        ▼
  Tentativa 2: reescreve prompt com erros
        │
     válido? ──── sim ──→ retorna output + metadata
        │
       não
        │
        ▼
  Tentativa 3: prompt simplificado, temperatura 0
        │
     válido? ──── sim ──→ retorna output + metadata
        │
       não
        │
        ▼
  Retorna safe_fallback (se configurado)`}
        </div>
      </div>

      <hr className={styles.divider} />

      <h2 className={styles.h2}>Retry inteligente</h2>
      <p className={styles.p}>
        Quando o LLM retorna um output inválido, o Reliant não apenas tenta de novo — ele reescreve o prompt incluindo os erros de validação exatos, para que o modelo saiba o que corrigir.
      </p>

      <h3 className={styles.h3}>Tentativa 1 — chamada normal</h3>
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>system prompt (tentativa 1)</span></div>
        <div className={styles.code}>
{`You are a data extraction assistant. You MUST respond with ONLY 
a valid JSON object that strictly follows this JSON Schema:

{ "type": "object", "required": ["name", "email"], ... }

Rules:
- Return ONLY the JSON object, no markdown, no explanation
- Every required field must be present`}
        </div>
      </div>

      <h3 className={styles.h3}>Tentativa 2 — prompt com erros</h3>
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>system prompt (tentativa 2)</span></div>
        <div className={styles.code}>
{`Your previous response had validation errors:
- /email: must match format "email"
- /phone: must be string

You MUST respond with ONLY a valid JSON object that strictly 
follows this JSON Schema: { ... }

Fix ALL the validation errors listed above.`}
        </div>
      </div>

      <hr className={styles.divider} />

      <h2 className={styles.h2}>Parâmetros do execute()</h2>
      <table className={styles.table}>
        <thead>
          <tr><th>Parâmetro</th><th>Tipo</th><th>Obrigatório</th><th>Descrição</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><span className={styles.param}>prompt</span></td>
            <td><span className={styles.type}>string</span></td>
            <td><span className={styles.required}>obrigatório</span></td>
            <td>O prompt do usuário enviado ao LLM</td>
          </tr>
          <tr>
            <td><span className={styles.param}>schemaId</span></td>
            <td><span className={styles.type}>string</span></td>
            <td><span className={styles.required}>obrigatório</span></td>
            <td>ID do schema que define o contrato do output</td>
          </tr>
          <tr>
            <td><span className={styles.param}>provider</span></td>
            <td><span className={styles.type}>'anthropic' | 'openai' | 'gemini'</span></td>
            <td><span className={styles.required}>obrigatório</span></td>
            <td>Provider do LLM a ser utilizado</td>
          </tr>
          <tr>
            <td><span className={styles.param}>model</span></td>
            <td><span className={styles.type}>string</span></td>
            <td><span className={styles.required}>obrigatório</span></td>
            <td>Modelo específico do provider</td>
          </tr>
          <tr>
            <td><span className={styles.param}>options.max_retries</span></td>
            <td><span className={styles.type}>number</span></td>
            <td><span className={styles.optional}>opcional</span></td>
            <td>Número máximo de tentativas (padrão: 3)</td>
          </tr>
          <tr>
            <td><span className={styles.param}>options.temperature</span></td>
            <td><span className={styles.type}>number</span></td>
            <td><span className={styles.optional}>opcional</span></td>
            <td>Temperatura do modelo (padrão: 0.2)</td>
          </tr>
        </tbody>
      </table>

      <hr className={styles.divider} />

      <h2 className={styles.h2}>Objeto de retorno</h2>
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>typescript</span></div>
        <div className={styles.code}>
{`{
  success: boolean,        // true se output válido, false se usou fallback
  output: object,          // o output do LLM validado (ou safe_fallback)
  metadata: {
    execution_id: string,  // ID único da execução para rastreamento
    status: 'success' | 'fallback' | 'failed',
    attempts: number,      // quantas tentativas foram necessárias
    latency_ms: number,    // latência total em milissegundos
    tokens_used: number,   // tokens consumidos em todas as tentativas
    model_used: string,    // modelo que retornou o resultado final
  }
}`}
        </div>
      </div>

      <div className={styles.pagination}>
        <Link href="/docs/schemas" className={styles.pageLink}>
          <span className={styles.pageLinkLabel}>← Anterior</span>
          <span className={styles.pageLinkTitle}>Schemas</span>
        </Link>
        <Link href="/docs/observability" className={styles.pageLink} style={{ textAlign: 'right' }}>
          <span className={styles.pageLinkLabel}>Próximo →</span>
          <span className={styles.pageLinkTitle}>Observabilidade</span>
        </Link>
      </div>
    </div>
  )
}
