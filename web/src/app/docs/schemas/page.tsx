import Link from 'next/link'
import styles from '@/components/dashboard/Docs.module.css'

export default function SchemasPage() {
  return (
    <div className={styles.page}>
      <div className={styles.badge}>Conceitos</div>
      <h1 className={styles.title}>Schemas</h1>
      <p className={styles.lead}>
        Schemas definem o contrato do output esperado do LLM. São a base do Reliant — sem um schema, não há validação.
      </p>

      <hr className={styles.divider} />

      <h2 className={styles.h2}>O que é um Schema?</h2>
      <p className={styles.p}>
        Um schema é um JSON Schema (draft-7) que descreve exatamente o formato que o LLM deve retornar. O Reliant usa esse schema para validar cada output e reescrever o prompt quando necessário.
      </p>

      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>json — exemplo de schema</span></div>
        <div className={styles.code}>
{`{
  "type": "object",
  "required": ["name", "email"],
  "properties": {
    "name": {
      "type": "string",
      "description": "Nome completo da pessoa"
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "phone": {
      "type": "string"
    },
    "age": {
      "type": "number",
      "minimum": 0,
      "maximum": 150
    }
  }
}`}
        </div>
      </div>

      <hr className={styles.divider} />

      <h2 className={styles.h2}>Criando um Schema</h2>
      <p className={styles.p}>Você pode criar schemas pelo Dashboard ou pela API/SDK.</p>

      <h3 className={styles.h3}>Pelo Dashboard</h3>
      <p className={styles.p}>
        Acesse <Link href="/dashboard/schemas" style={{ color: 'var(--accent)' }}>Dashboard → Schemas</Link> → clique em <strong style={{ color: 'var(--text)' }}>+ Novo Schema</strong> e preencha o formulário.
      </p>

      <h3 className={styles.h3}>Pelo SDK</h3>
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>typescript</span></div>
        <div className={styles.code}>
{`const schema = await reliant.createSchema({
  name: 'Análise de Sentimento',
  slug: 'sentiment-analysis',
  description: 'Analisa o sentimento de um texto',
  definition: {
    type: 'object',
    required: ['sentiment', 'confidence'],
    properties: {
      sentiment: {
        type: 'string',
        enum: ['positive', 'negative', 'neutral']
      },
      confidence: {
        type: 'number',
        minimum: 0,
        maximum: 1
      },
      summary: {
        type: 'string'
      }
    }
  },
  safe_fallback: {
    sentiment: 'neutral',
    confidence: 0,
    summary: null
  }
})`}
        </div>
      </div>

      <hr className={styles.divider} />

      <h2 className={styles.h2}>Versionamento</h2>
      <p className={styles.p}>
        Cada atualização de schema cria uma nova versão automaticamente. As execuções anteriores ficam vinculadas à versão do schema que estava ativa no momento — garantindo rastreabilidade completa.
      </p>

      <table className={styles.table}>
        <thead>
          <tr><th>Campo</th><th>Tipo</th><th>Descrição</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><span className={styles.param}>name</span></td>
            <td><span className={styles.type}>string</span></td>
            <td>Nome legível do schema</td>
          </tr>
          <tr>
            <td><span className={styles.param}>slug</span></td>
            <td><span className={styles.type}>string</span></td>
            <td>Identificador único, minúsculas com hífens</td>
          </tr>
          <tr>
            <td><span className={styles.param}>definition</span></td>
            <td><span className={styles.type}>object</span></td>
            <td>JSON Schema draft-7 que define o contrato</td>
          </tr>
          <tr>
            <td><span className={styles.param}>safe_fallback</span></td>
            <td><span className={styles.type}>object</span></td>
            <td>Retornado quando todos os retries falham</td>
          </tr>
          <tr>
            <td><span className={styles.param}>version</span></td>
            <td><span className={styles.type}>number</span></td>
            <td>Incrementado automaticamente a cada atualização</td>
          </tr>
        </tbody>
      </table>

      <div className={styles.pagination}>
        <Link href="/docs/quickstart" className={styles.pageLink}>
          <span className={styles.pageLinkLabel}>← Anterior</span>
          <span className={styles.pageLinkTitle}>Quickstart</span>
        </Link>
        <Link href="/docs/execute" className={styles.pageLink} style={{ textAlign: 'right' }}>
          <span className={styles.pageLinkLabel}>Próximo →</span>
          <span className={styles.pageLinkTitle}>Execute & Retry</span>
        </Link>
      </div>
    </div>
  )
}
