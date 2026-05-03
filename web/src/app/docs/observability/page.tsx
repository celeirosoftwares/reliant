import Link from 'next/link'
import styles from '@/components/dashboard/Docs.module.css'

export default function ObservabilityPage() {
  return (
    <div className={styles.page}>
      <div className={styles.badge}>Conceitos</div>
      <h1 className={styles.title}>Observabilidade</h1>
      <p className={styles.lead}>
        Toda execução é registrada automaticamente. Você tem visibilidade completa do que está acontecendo em produção — sem configurar nada.
      </p>

      <hr className={styles.divider} />

      <h2 className={styles.h2}>O que é registrado</h2>
      <p className={styles.p}>Para cada execução o Reliant registra:</p>

      <table className={styles.table}>
        <thead>
          <tr><th>Campo</th><th>Descrição</th></tr>
        </thead>
        <tbody>
          <tr><td><span className={styles.param}>execution_id</span></td><td>ID único para rastreamento e debug</td></tr>
          <tr><td><span className={styles.param}>status</span></td><td>success, fallback ou failed</td></tr>
          <tr><td><span className={styles.param}>attempts</span></td><td>Quantas tentativas foram necessárias</td></tr>
          <tr><td><span className={styles.param}>latency_ms</span></td><td>Latência total incluindo todos os retries</td></tr>
          <tr><td><span className={styles.param}>tokens_used</span></td><td>Total de tokens consumidos em todas as tentativas</td></tr>
          <tr><td><span className={styles.param}>input_prompt</span></td><td>O prompt enviado pelo usuário</td></tr>
          <tr><td><span className={styles.param}>output</span></td><td>O output final retornado</td></tr>
          <tr><td><span className={styles.param}>validation_errors</span></td><td>Erros de validação das tentativas com falha</td></tr>
          <tr><td><span className={styles.param}>schema_version</span></td><td>Versão do schema usada na execução</td></tr>
          <tr><td><span className={styles.param}>provider / model</span></td><td>Provider e modelo utilizados</td></tr>
        </tbody>
      </table>

      <hr className={styles.divider} />

      <h2 className={styles.h2}>Dashboard</h2>
      <p className={styles.p}>
        O <Link href="/dashboard" style={{ color: 'var(--accent)' }}>Dashboard</Link> exibe métricas agregadas em tempo real:
      </p>

      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.cardIcon}>📊</div>
          <div className={styles.cardTitle}>Taxa de Sucesso</div>
          <div className={styles.cardDesc}>Percentual de execuções que retornaram output válido sem precisar do fallback.</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardIcon}>⚡</div>
          <div className={styles.cardTitle}>Latência Média</div>
          <div className={styles.cardDesc}>Tempo médio de resposta incluindo todos os retries necessários.</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardIcon}>🔁</div>
          <div className={styles.cardTitle}>Tentativas Médias</div>
          <div className={styles.cardDesc}>Média de tentativas por execução — indica a dificuldade do schema para o modelo.</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardIcon}>🪙</div>
          <div className={styles.cardTitle}>Tokens Consumidos</div>
          <div className={styles.cardDesc}>Total de tokens usados no período — útil para controle de custos.</div>
        </div>
      </div>

      <hr className={styles.divider} />

      <h2 className={styles.h2}>Consultando execuções via API</h2>
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>typescript</span></div>
        <div className={styles.code}>
{`// Listar execuções recentes
const executions = await reliant.listExecutions({
  limit: 20,
  status: 'failed',      // filtrar por status
  schema_id: 'sch_...',  // filtrar por schema
})

// Buscar execução específica
const execution = await reliant.getExecution('exec_...')
console.log(execution.validation_errors) // ver erros de validação

// Métricas do projeto
const metrics = await reliant.getMetricsSummary(30) // últimos 30 dias
console.log(metrics.success_rate)   // ex: 98.5
console.log(metrics.avg_latency_ms) // ex: 743`}
        </div>
      </div>

      <div className={styles.pagination}>
        <Link href="/docs/execute" className={styles.pageLink}>
          <span className={styles.pageLinkLabel}>← Anterior</span>
          <span className={styles.pageLinkTitle}>Execute & Retry</span>
        </Link>
        <Link href="/docs/fallbacks" className={styles.pageLink} style={{ textAlign: 'right' }}>
          <span className={styles.pageLinkLabel}>Próximo →</span>
          <span className={styles.pageLinkTitle}>Safe Fallbacks</span>
        </Link>
      </div>
    </div>
  )
}
