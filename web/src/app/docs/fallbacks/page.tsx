import Link from 'next/link'
import styles from '@/components/dashboard/Docs.module.css'

export default function FallbacksPage() {
  return (
    <div className={styles.page}>
      <div className={styles.badge}>Conceitos</div>
      <h1 className={styles.title}>Safe Fallbacks</h1>
      <p className={styles.lead}>
        Quando todos os retries falham, o Reliant retorna um fallback seguro em vez de lançar um erro — garantindo que sua aplicação nunca quebre.
      </p>

      <hr className={styles.divider} />

      <h2 className={styles.h2}>Como funciona</h2>
      <p className={styles.p}>
        O <span className={styles.inline}>safe_fallback</span> é um objeto que você define ao criar o schema. Se após todas as tentativas o LLM ainda não retornar um output válido, o Reliant retorna esse objeto com <span className={styles.inline}>success: false</span> e <span className={styles.inline}>status: "fallback"</span>.
      </p>

      <div className={styles.callout}>
        <strong>Importante:</strong> O fallback não precisa passar pela validação do schema. Ele é retornado diretamente como último recurso.
      </div>

      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>typescript</span></div>
        <div className={styles.code}>
{`const schema = await reliant.createSchema({
  name: 'Extração de Dados',
  slug: 'data-extraction',
  definition: {
    type: 'object',
    required: ['name', 'email'],
    properties: {
      name: { type: 'string' },
      email: { type: 'string' },
    }
  },
  // Fallback retornado quando todos os retries falham
  safe_fallback: {
    name: null,
    email: null,
  }
})`}
        </div>
      </div>

      <hr className={styles.divider} />

      <h2 className={styles.h2}>Detectando uso do fallback</h2>
      <p className={styles.p}>
        Você pode detectar quando o fallback foi usado verificando o <span className={styles.inline}>status</span> e o <span className={styles.inline}>success</span> da resposta:
      </p>

      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>typescript</span></div>
        <div className={styles.code}>
{`const result = await reliant.execute({
  prompt: '...',
  schemaId: schema.id,
  provider: 'anthropic',
  model: 'claude-sonnet-4-20250514',
})

if (result.success) {
  // Output válido retornado pelo LLM
  console.log('Output:', result.output)
} else if (result.metadata.status === 'fallback') {
  // Fallback foi usado — tratar adequadamente
  console.warn('Fallback usado após', result.metadata.attempts, 'tentativas')
  // result.output contém o safe_fallback definido no schema
}`}
        </div>
      </div>

      <hr className={styles.divider} />

      <h2 className={styles.h2}>Boas práticas</h2>

      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.cardIcon}>✅</div>
          <div className={styles.cardTitle}>Sempre defina um fallback</div>
          <div className={styles.cardDesc}>Mesmo que seja tudo null. É melhor retornar um objeto vazio previsível do que um erro inesperado.</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardIcon}>🔔</div>
          <div className={styles.cardTitle}>Monitore uso de fallback</div>
          <div className={styles.cardDesc}>Alta taxa de fallback indica que o schema é muito rígido ou o prompt está mal formulado.</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardIcon}>🎯</div>
          <div className={styles.cardTitle}>Fallback com valores padrão</div>
          <div className={styles.cardDesc}>Em vez de null, use valores padrão que façam sentido para seu negócio quando os dados não estão disponíveis.</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardIcon}>📊</div>
          <div className={styles.cardTitle}>Acompanhe no Dashboard</div>
          <div className={styles.cardDesc}>O Dashboard mostra a taxa de fallback separada da taxa de sucesso para fácil monitoramento.</div>
        </div>
      </div>

      <div className={styles.pagination}>
        <Link href="/docs/observability" className={styles.pageLink}>
          <span className={styles.pageLinkLabel}>← Anterior</span>
          <span className={styles.pageLinkTitle}>Observabilidade</span>
        </Link>
        <Link href="/docs/sdk-js" className={styles.pageLink} style={{ textAlign: 'right' }}>
          <span className={styles.pageLinkLabel}>Próximo →</span>
          <span className={styles.pageLinkTitle}>SDK JavaScript</span>
        </Link>
      </div>
    </div>
  )
}
