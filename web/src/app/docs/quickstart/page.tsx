import Link from 'next/link'
import styles from '@/components/dashboard/Docs.module.css'

export default function QuickstartPage() {
  return (
    <div className={styles.page}>
      <div className={styles.badge}>Guia de Início Rápido</div>
      <h1 className={styles.title}>Quickstart</h1>
      <p className={styles.lead}>
        Integre o Reliant em menos de 10 minutos. Você vai precisar da sua API key — disponível nas Configurações do dashboard.
      </p>

      <hr className={styles.divider} />

      <div className={styles.steps}>

        {/* Step 1 */}
        <div className={styles.step}>
          <div className={styles.stepNum}>1</div>
          <div className={styles.stepContent}>
            <div className={styles.stepTitle}>Instale o SDK</div>
            <div className={styles.stepDesc}>Disponível para JavaScript/TypeScript e Python.</div>
            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span className={styles.codeLang}>bash</span>
              </div>
              <div className={styles.code}>
                {`# JavaScript / TypeScript
npm install reliant-js

# Python
pip install reliant-py`}
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className={styles.step}>
          <div className={styles.stepNum}>2</div>
          <div className={styles.stepContent}>
            <div className={styles.stepTitle}>Inicialize o cliente</div>
            <div className={styles.stepDesc}>
              Use sua API key disponível em <Link href="/dashboard/settings" style={{ color: 'var(--accent)' }}>Configurações</Link>.
            </div>
            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span className={styles.codeLang}>typescript</span>
              </div>
              <div className={styles.code}>
{`import { Reliant } from 'reliant-js'

const reliant = new Reliant({
  apiKey: 'rel_...',   // sua API key
  baseUrl: 'https://reliant-production.up.railway.app',
})`}
              </div>
            </div>
            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span className={styles.codeLang}>python</span>
              </div>
              <div className={styles.code}>
{`from reliant import Reliant

client = Reliant(
    api_key="rel_...",   # sua API key
    base_url="https://reliant-production.up.railway.app"
)`}
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className={styles.step}>
          <div className={styles.stepNum}>3</div>
          <div className={styles.stepContent}>
            <div className={styles.stepTitle}>Crie um Schema</div>
            <div className={styles.stepDesc}>
              Defina o contrato do output que você espera do LLM. Pode fazer pelo <Link href="/dashboard/schemas" style={{ color: 'var(--accent)' }}>Dashboard</Link> ou pelo código.
            </div>
            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span className={styles.codeLang}>typescript</span>
              </div>
              <div className={styles.code}>
{`const schema = await reliant.createSchema({
  name: 'Extração de Contato',
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
  safe_fallback: {
    name: null,
    email: null,
    phone: null,
  },
})

console.log(schema.id) // sch_abc123`}
              </div>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className={styles.step}>
          <div className={styles.stepNum}>4</div>
          <div className={styles.stepContent}>
            <div className={styles.stepTitle}>Execute com confiabilidade</div>
            <div className={styles.stepDesc}>
              Substitua sua chamada direta ao LLM pelo <span className={styles.inline}>reliant.execute()</span>. O output sempre vai chegar no formato correto.
            </div>
            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span className={styles.codeLang}>typescript</span>
              </div>
              <div className={styles.code}>
{`const result = await reliant.execute({
  prompt: 'Extraia os dados: João Silva, joao@email.com, 11999999999',
  schemaId: schema.id,
  provider: 'anthropic',
  model: 'claude-sonnet-4-20250514',
})

console.log(result.output)
// { name: 'João Silva', email: 'joao@email.com', phone: '11999999999' }

console.log(result.metadata)
// {
//   execution_id: 'exec_...',
//   status: 'success',
//   attempts: 1,
//   latency_ms: 743,
//   tokens_used: 218,
// }`}
              </div>
            </div>
          </div>
        </div>

        {/* Step 5 */}
        <div className={styles.step}>
          <div className={styles.stepNum}>5</div>
          <div className={styles.stepContent}>
            <div className={styles.stepTitle}>Monitore no Dashboard</div>
            <div className={styles.stepDesc}>
              Acesse o <Link href="/dashboard" style={{ color: 'var(--accent)' }}>Dashboard</Link> para ver todas as execuções, taxa de sucesso, latência e tokens consumidos em tempo real.
            </div>
          </div>
        </div>

      </div>

      <div className={styles.callout}>
        <strong>Dica:</strong> Use o <span className={styles.inline}>safe_fallback</span> para definir o que retornar quando todos os retries falharem. Isso garante que sua aplicação nunca quebre mesmo em cenários extremos.
      </div>

      <div className={styles.pagination}>
        <Link href="/docs" className={styles.pageLink}>
          <span className={styles.pageLinkLabel}>← Anterior</span>
          <span className={styles.pageLinkTitle}>O que é o Reliant?</span>
        </Link>
        <Link href="/docs/schemas" className={styles.pageLink} style={{ textAlign: 'right' }}>
          <span className={styles.pageLinkLabel}>Próximo →</span>
          <span className={styles.pageLinkTitle}>Schemas</span>
        </Link>
      </div>
    </div>
  )
}
