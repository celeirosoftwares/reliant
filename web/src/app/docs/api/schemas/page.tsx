import Link from 'next/link'
import styles from '@/components/dashboard/Docs.module.css'

export default function ApiSchemasPage() {
  return (
    <div className={styles.page}>
      <div className={styles.badge}>API Reference</div>
      <h1 className={styles.title}>Schemas</h1>
      <p className={styles.lead}>Endpoints para criar, listar, atualizar e deletar schemas.</p>

      <hr className={styles.divider} />

      <h2 className={styles.h2}><span className={styles.method + ' ' + styles.post}>POST</span><span className={styles.endpoint}>/schemas</span></h2>
      <p className={styles.p}>Cria um novo schema.</p>
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>json — body</span></div>
        <div className={styles.code}>
{`{
  "name": "Extração de Contato",
  "slug": "contact-extraction",
  "description": "Extrai dados de contato de texto livre",
  "definition": {
    "type": "object",
    "required": ["name", "email"],
    "properties": {
      "name": { "type": "string" },
      "email": { "type": "string" }
    }
  },
  "safe_fallback": { "name": null, "email": null }
}`}
        </div>
      </div>

      <hr className={styles.divider} />

      <h2 className={styles.h2}><span className={styles.method + ' ' + styles.get}>GET</span><span className={styles.endpoint}>/schemas</span></h2>
      <p className={styles.p}>Lista todos os schemas do projeto.</p>
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>json — response</span></div>
        <div className={styles.code}>
{`{
  "schemas": [
    {
      "id": "cmonautso0002ph012m23m4au",
      "name": "Contact Extraction",
      "slug": "contact-extraction",
      "version": 1,
      "definition": { ... },
      "safe_fallback": { ... },
      "created_at": "2026-05-01T19:21:39.634Z"
    }
  ]
}`}
        </div>
      </div>

      <hr className={styles.divider} />

      <h2 className={styles.h2}><span className={styles.method + ' ' + styles.get}>GET</span><span className={styles.endpoint}>/schemas/:id</span></h2>
      <p className={styles.p}>Busca um schema pelo ID.</p>

      <hr className={styles.divider} />

      <h2 className={styles.h2}><span className={styles.method + ' ' + styles.post}>PUT</span><span className={styles.endpoint}>/schemas/:id</span></h2>
      <p className={styles.p}>Atualiza um schema. Cria uma nova versão automaticamente.</p>

      <hr className={styles.divider} />

      <h2 className={styles.h2}><span className={styles.method + ' ' + styles.delete}>DELETE</span><span className={styles.endpoint}>/schemas/:id</span></h2>
      <p className={styles.p}>Remove um schema. As execuções vinculadas são mantidas.</p>

      <div className={styles.pagination}>
        <Link href="/docs/api/execute" className={styles.pageLink}>
          <span className={styles.pageLinkLabel}>← Anterior</span>
          <span className={styles.pageLinkTitle}>API — Execute</span>
        </Link>
        <Link href="/docs/api/executions" className={styles.pageLink} style={{ textAlign: 'right' }}>
          <span className={styles.pageLinkLabel}>Próximo →</span>
          <span className={styles.pageLinkTitle}>API — Executions</span>
        </Link>
      </div>
    </div>
  )
}
