import Link from 'next/link'
import styles from '@/components/dashboard/Docs.module.css'

export default function ApiExecutionsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.badge}>API Reference</div>
      <h1 className={styles.title}>Executions</h1>
      <p className={styles.lead}>Endpoints para consultar o log de execuções.</p>

      <hr className={styles.divider} />

      <h2 className={styles.h2}><span className={styles.method + ' ' + styles.get}>GET</span><span className={styles.endpoint}>/executions</span></h2>
      <p className={styles.p}>Lista execuções com filtros e paginação.</p>

      <table className={styles.table}>
        <thead><tr><th>Query param</th><th>Tipo</th><th>Descrição</th></tr></thead>
        <tbody>
          <tr><td><span className={styles.param}>page</span></td><td><span className={styles.type}>number</span></td><td>Página (padrão: 1)</td></tr>
          <tr><td><span className={styles.param}>limit</span></td><td><span className={styles.type}>number</span></td><td>Itens por página, máx 100 (padrão: 20)</td></tr>
          <tr><td><span className={styles.param}>status</span></td><td><span className={styles.type}>string</span></td><td>Filtrar por: success, failed, fallback</td></tr>
          <tr><td><span className={styles.param}>schema_id</span></td><td><span className={styles.type}>string</span></td><td>Filtrar por schema</td></tr>
        </tbody>
      </table>

      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>json — response</span></div>
        <div className={styles.code}>
{`{
  "executions": [
    {
      "id": "cmonavlcs0004ph01ska7i1tq",
      "schema_id": "cmonautso0002ph012m23m4au",
      "provider": "anthropic",
      "model": "claude-sonnet-4-20250514",
      "status": "success",
      "attempts": 1,
      "latency_ms": 743,
      "tokens_used": 218,
      "output": { ... },
      "created_at": "2026-05-01T19:21:39.634Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 142,
    "pages": 8
  }
}`}
        </div>
      </div>

      <hr className={styles.divider} />

      <h2 className={styles.h2}><span className={styles.method + ' ' + styles.get}>GET</span><span className={styles.endpoint}>/executions/:id</span></h2>
      <p className={styles.p}>Detalhe completo de uma execução incluindo input, output e erros de validação.</p>

      <div className={styles.pagination}>
        <Link href="/docs/api/schemas" className={styles.pageLink}>
          <span className={styles.pageLinkLabel}>← Anterior</span>
          <span className={styles.pageLinkTitle}>API — Schemas</span>
        </Link>
        <Link href="/docs/api/metrics" className={styles.pageLink} style={{ textAlign: 'right' }}>
          <span className={styles.pageLinkLabel}>Próximo →</span>
          <span className={styles.pageLinkTitle}>API — Metrics</span>
        </Link>
      </div>
    </div>
  )
}
