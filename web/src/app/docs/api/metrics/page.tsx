import Link from 'next/link'
import styles from '@/components/dashboard/Docs.module.css'

export default function ApiMetricsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.badge}>API Reference</div>
      <h1 className={styles.title}>Metrics</h1>
      <p className={styles.lead}>Endpoints para consultar métricas agregadas do projeto.</p>

      <hr className={styles.divider} />

      <h2 className={styles.h2}><span className={styles.method + ' ' + styles.get}>GET</span><span className={styles.endpoint}>/metrics/summary</span></h2>
      <p className={styles.p}>Métricas agregadas do projeto para um período.</p>

      <table className={styles.table}>
        <thead><tr><th>Query param</th><th>Tipo</th><th>Descrição</th></tr></thead>
        <tbody>
          <tr><td><span className={styles.param}>days</span></td><td><span className={styles.type}>number</span></td><td>Período em dias (padrão: 30, máx: 90)</td></tr>
        </tbody>
      </table>

      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>json — response</span></div>
        <div className={styles.code}>
{`{
  "period_days": 30,
  "total_executions": 1420,
  "success_rate": 98.5,
  "status_breakdown": {
    "success": 1398,
    "failed": 8,
    "fallback": 14
  },
  "avg_latency_ms": 743,
  "avg_attempts": 1.08,
  "total_tokens": 308640,
  "daily": [
    {
      "date": "2026-05-01",
      "total": 48,
      "success": 47,
      "failed": 1,
      "tokens": 10416
    }
  ]
}`}
        </div>
      </div>

      <hr className={styles.divider} />

      <h2 className={styles.h2}><span className={styles.method + ' ' + styles.get}>GET</span><span className={styles.endpoint}>/metrics/schemas/:id</span></h2>
      <p className={styles.p}>Métricas detalhadas por schema — útil para identificar schemas com alta taxa de falha.</p>

      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>json — response</span></div>
        <div className={styles.code}>
{`{
  "schema_id": "cmonautso0002ph012m23m4au",
  "schema_name": "Contact Extraction",
  "schema_slug": "contact-extraction",
  "total_executions": 342,
  "success_rate": 97.4,
  "avg_latency_ms": 698,
  "total_tokens": 74196,
  "avg_attempts": 1.06
}`}
        </div>
      </div>

      <div className={styles.pagination}>
        <Link href="/docs/api/executions" className={styles.pageLink}>
          <span className={styles.pageLinkLabel}>← Anterior</span>
          <span className={styles.pageLinkTitle}>API — Executions</span>
        </Link>
        <div />
      </div>
    </div>
  )
}
