import Link from 'next/link'
import styles from '@/components/dashboard/Docs.module.css'

export default function SdkPythonPage() {
  return (
    <div className={styles.page}>
      <div className={styles.badge}>SDKs</div>
      <h1 className={styles.title}>SDK Python</h1>
      <p className={styles.lead}>
        O SDK oficial para Python. Zero dependências externas, funciona com Python 3.8+.
      </p>

      <hr className={styles.divider} />

      <h2 className={styles.h2}>Instalação</h2>
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>bash</span></div>
        <div className={styles.code}>pip install reliant-py</div>
      </div>

      <hr className={styles.divider} />

      <h2 className={styles.h2}>Inicialização</h2>
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>python</span></div>
        <div className={styles.code}>
{`from reliant import Reliant

client = Reliant(
    api_key="rel_...",
    base_url="https://reliant-production.up.railway.app"
)`}
        </div>
      </div>

      <hr className={styles.divider} />

      <h2 className={styles.h2}>Métodos disponíveis</h2>

      <h3 className={styles.h3}>client.execute()</h3>
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>python</span></div>
        <div className={styles.code}>
{`result = client.execute(
    prompt="Extraia os dados: João Silva, joao@email.com",
    schema_id="sch_...",
    provider="anthropic",
    model="claude-sonnet-4-20250514",
    max_retries=3,  # opcional
)

print(result.output)           # dict com o output
print(result.success)          # True ou False
print(result.status)           # 'success', 'fallback' ou 'failed'
print(result.metadata.attempts)
print(result.metadata.latency_ms)
print(result.metadata.tokens_used)`}
        </div>
      </div>

      <h3 className={styles.h3}>client.create_schema()</h3>
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>python</span></div>
        <div className={styles.code}>
{`schema = client.create_schema(
    name="Extração de Contato",
    slug="contact-extraction",
    definition={
        "type": "object",
        "required": ["name", "email"],
        "properties": {
            "name": {"type": "string"},
            "email": {"type": "string"},
        }
    },
    safe_fallback={"name": None, "email": None}
)

print(schema.id)      # ID do schema criado
print(schema.version) # versão atual`}
        </div>
      </div>

      <h3 className={styles.h3}>client.list_schemas()</h3>
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>python</span></div>
        <div className={styles.code}>
{`schemas = client.list_schemas()
for schema in schemas:
    print(schema.id, schema.name, schema.version)`}
        </div>
      </div>

      <h3 className={styles.h3}>client.get_metrics()</h3>
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>python</span></div>
        <div className={styles.code}>
{`metrics = client.get_metrics()

print(metrics['total_executions'])
print(metrics['success_rate'])
print(metrics['avg_latency_ms'])`}
        </div>
      </div>

      <hr className={styles.divider} />

      <h2 className={styles.h2}>Tratamento de erros</h2>
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>python</span></div>
        <div className={styles.code}>
{`from reliant import Reliant, ReliantError

try:
    result = client.execute(...)
except ReliantError as e:
    print(f"Erro {e.status_code}: {e}")`}
        </div>
      </div>

      <div className={styles.pagination}>
        <Link href="/docs/sdk-js" className={styles.pageLink}>
          <span className={styles.pageLinkLabel}>← Anterior</span>
          <span className={styles.pageLinkTitle}>SDK JavaScript</span>
        </Link>
        <Link href="/docs/api/execute" className={styles.pageLink} style={{ textAlign: 'right' }}>
          <span className={styles.pageLinkLabel}>Próximo →</span>
          <span className={styles.pageLinkTitle}>API — Execute</span>
        </Link>
      </div>
    </div>
  )
}
