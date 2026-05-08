import Link from 'next/link'
import styles from '@/components/dashboard/Docs.module.css'

export default function N8nPage() {
  return (
    <div className={styles.page}>
      <div className={styles.badge}>Integrações</div>
      <h1 className={styles.title}>Integração com n8n</h1>
      <p className={styles.lead}>
        O Reliant tem um node nativo para o n8n. Instale com um clique e use outputs estruturados garantidos em qualquer automação — sem escrever código.
      </p>

      <hr className={styles.divider} />

      <h2 className={styles.h2}>Instalação</h2>
      <p className={styles.p}>No seu n8n (Cloud ou Self-hosted):</p>

      <div className={styles.steps}>
        <div className={styles.step}>
          <div className={styles.stepNum}>1</div>
          <div className={styles.stepContent}>
            <div className={styles.stepTitle}>Acesse Community Nodes</div>
            <div className={styles.stepDesc}>Vá em <strong>Settings → Community Nodes → Install</strong></div>
          </div>
        </div>
        <div className={styles.step}>
          <div className={styles.stepNum}>2</div>
          <div className={styles.stepContent}>
            <div className={styles.stepTitle}>Instale o pacote</div>
            <div className={styles.stepDesc}>Digite o nome do pacote e clique em Install:</div>
            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}><span className={styles.codeLang}>npm package</span></div>
              <div className={styles.code}>n8n-nodes-reliant</div>
            </div>
          </div>
        </div>
        <div className={styles.step}>
          <div className={styles.stepNum}>3</div>
          <div className={styles.stepContent}>
            <div className={styles.stepTitle}>Reinicie o n8n</div>
            <div className={styles.stepDesc}>Após instalar, reinicie o n8n para o node aparecer na lista.</div>
          </div>
        </div>
        <div className={styles.step}>
          <div className={styles.stepNum}>4</div>
          <div className={styles.stepContent}>
            <div className={styles.stepTitle}>Configure as credenciais</div>
            <div className={styles.stepDesc}>
              Busque por <strong>Reliant</strong> nos nodes, adicione e configure as credenciais:
            </div>
            <table className={styles.table}>
              <thead><tr><th>Campo</th><th>Onde encontrar</th></tr></thead>
              <tbody>
                <tr>
                  <td><span className={styles.param}>API Key</span></td>
                  <td><Link href="/dashboard/settings" style={{ color: 'var(--accent)' }}>Dashboard → Configurações</Link></td>
                </tr>
                <tr>
                  <td><span className={styles.param}>User ID</span></td>
                  <td><Link href="/dashboard/settings" style={{ color: 'var(--accent)' }}>Dashboard → Configurações</Link></td>
                </tr>
                <tr>
                  <td><span className={styles.param}>API URL</span></td>
                  <td><code>https://reliant-production.up.railway.app</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <hr className={styles.divider} />

      <h2 className={styles.h2}>Operações disponíveis</h2>

      <h3 className={styles.h3}>Execute</h3>
      <p className={styles.p}>Executa um prompt com validação e retry automático. É a operação principal.</p>
      <table className={styles.table}>
        <thead><tr><th>Campo</th><th>Descrição</th></tr></thead>
        <tbody>
          <tr><td><span className={styles.param}>Prompt</span></td><td>O texto enviado ao LLM. Pode usar expressões do n8n como <code>{'{{$json.text}}'}</code></td></tr>
          <tr><td><span className={styles.param}>Schema ID</span></td><td>ID do schema criado no Dashboard → Schemas</td></tr>
          <tr><td><span className={styles.param}>Provider</span></td><td>anthropic, openai, gemini, groq ou mistral</td></tr>
          <tr><td><span className={styles.param}>Model</span></td><td>Ex: claude-sonnet-4-20250514, gpt-4o</td></tr>
          <tr><td><span className={styles.param}>Max Retries</span></td><td>Tentativas máximas (padrão: 3)</td></tr>
        </tbody>
      </table>

      <h3 className={styles.h3}>List Schemas</h3>
      <p className={styles.p}>Retorna todos os schemas do seu projeto. Útil para workflows dinâmicos.</p>

      <h3 className={styles.h3}>Get Execution</h3>
      <p className={styles.p}>Busca detalhes de uma execução pelo ID. Use o <code>execution_id</code> retornado pelo Execute.</p>

      <h3 className={styles.h3}>Get Metrics</h3>
      <p className={styles.p}>Retorna métricas do projeto para um período. Útil para relatórios automáticos.</p>

      <hr className={styles.divider} />

      <h2 className={styles.h2}>Exemplos de fluxos</h2>

      <h3 className={styles.h3}>Extração de dados de formulário</h3>
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>fluxo n8n</span></div>
        <div className={styles.code}>
{`[Webhook] → recebe submissão do formulário
      ↓
[Reliant — Execute]
  prompt: "Extraia os dados: {{ $json.body.text }}"
  schema_id: "seu-schema-de-contato"
  provider: anthropic
  model: claude-sonnet-4-20250514
      ↓
[Google Sheets] → salva {{ $json.output.name }}, {{ $json.output.email }}
      ↓
[Gmail] → envia confirmação para {{ $json.output.email }}`}
        </div>
      </div>

      <h3 className={styles.h3}>Classificação automática de tickets</h3>
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>fluxo n8n</span></div>
        <div className={styles.code}>
{`[Email Trigger] → novo email recebido
      ↓
[Reliant — Execute]
  prompt: "Classifique este ticket: {{ $json.body }}"
  schema_id: "ticket-classification"
  provider: openai
  model: gpt-4o-mini
      ↓
[IF] → {{ $json.output.priority }} === "high"
  ↓ sim                    ↓ não
[Slack — urgente]    [Trello — backlog]`}
        </div>
      </div>

      <hr className={styles.divider} />

      <h2 className={styles.h2}>Output do node</h2>
      <p className={styles.p}>O node Reliant retorna o seguinte objeto para o próximo node:</p>
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}><span className={styles.codeLang}>json</span></div>
        <div className={styles.code}>
{`{
  "success": true,
  "status": "success",
  "output": {
    // seus campos do schema aqui
    "name": "João Silva",
    "email": "joao@email.com"
  },
  "metadata": {
    "execution_id": "exec_...",
    "attempts": 1,
    "latency_ms": 743,
    "tokens_used": 218,
    "provider": "anthropic",
    "model": "claude-sonnet-4-20250514"
  }
}`}
        </div>
      </div>

      <div className={styles.callout}>
        <strong>Dica:</strong> Use <code>{'{{ $json.output.campo }}'}</code> nos nodes seguintes para acessar os dados extraídos. Se <code>success</code> for <code>false</code>, o node retornou o <code>safe_fallback</code> do schema.
      </div>

      <div className={styles.pagination}>
        <Link href="/docs/sdk-python" className={styles.pageLink}>
          <span className={styles.pageLinkLabel}>← Anterior</span>
          <span className={styles.pageLinkTitle}>SDK Python</span>
        </Link>
        <Link href="/docs/api/execute" className={styles.pageLink} style={{ textAlign: 'right' }}>
          <span className={styles.pageLinkLabel}>Próximo →</span>
          <span className={styles.pageLinkTitle}>API — Execute</span>
        </Link>
      </div>
    </div>
  )
}
