import Link from 'next/link'
import styles from '../docs.module.css'

export default function DocsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.badge}>Documentação v1.0</div>
      <h1 className={styles.title}>O que é o Reliant?</h1>
      <p className={styles.lead}>
        Reliant é uma camada de infraestrutura que senta entre sua aplicação e qualquer LLM, garantindo outputs estruturados, retry inteligente e observabilidade completa em produção.
      </p>

      <hr className={styles.divider} />

      <h2 className={styles.h2}>O problema que resolvemos</h2>
      <p className={styles.p}>
        Qualquer desenvolvedor que coloca LLMs em produção enfrenta os mesmos problemas: JSON que não parseia, schemas que falham silenciosamente, zero visibilidade sobre o que está quebrando e por quê.
      </p>
      <p className={styles.p}>
        A solução comum é escrever lógica de retry manual em cada projeto — frágil, inconsistente e sem testes. O Reliant resolve isso de uma vez com uma API simples.
      </p>

      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.cardIcon}>💥</div>
          <div className={styles.cardTitle}>Sem Reliant</div>
          <div className={styles.cardDesc}>JSON inválido derruba o pipeline. Retry manual em cada projeto. Zero visibilidade em produção.</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardIcon}>🛡️</div>
          <div className={styles.cardTitle}>Com Reliant</div>
          <div className={styles.cardDesc}>Output sempre válido. Retry automático com prompt reescrito. Log completo de cada execução.</div>
        </div>
      </div>

      <hr className={styles.divider} />

      <h2 className={styles.h2}>Como funciona</h2>
      <p className={styles.p}>
        O Reliant intercepta cada chamada ao LLM, valida o output contra o schema definido e faz retry inteligente quando necessário — tudo transparente para sua aplicação.
      </p>

      <div className={styles.steps}>
        <div className={styles.step}>
          <div className={styles.stepNum}>1</div>
          <div className={styles.stepContent}>
            <div className={styles.stepTitle}>Você define um Schema</div>
            <div className={styles.stepDesc}>Um JSON Schema que descreve o contrato do output esperado. O Reliant garante que o LLM sempre retorne nesse formato.</div>
          </div>
        </div>
        <div className={styles.step}>
          <div className={styles.stepNum}>2</div>
          <div className={styles.stepContent}>
            <div className={styles.stepTitle}>Você chama reliant.execute()</div>
            <div className={styles.stepDesc}>Em vez de chamar o LLM diretamente, você passa pelo Reliant com seu prompt, schema e provider escolhido.</div>
          </div>
        </div>
        <div className={styles.step}>
          <div className={styles.stepNum}>3</div>
          <div className={styles.stepContent}>
            <div className={styles.stepTitle}>Reliant garante o output</div>
            <div className={styles.stepDesc}>Se o LLM retornar inválido, o Reliant reescreve o prompt com os erros e tenta novamente — até 3x antes de usar o fallback seguro.</div>
          </div>
        </div>
        <div className={styles.step}>
          <div className={styles.stepNum}>4</div>
          <div className={styles.stepContent}>
            <div className={styles.stepTitle}>Tudo logado no Dashboard</div>
            <div className={styles.stepDesc}>Cada execução registrada — tentativas, latência, tokens, erros de validação. Visibilidade completa em produção.</div>
          </div>
        </div>
      </div>

      <hr className={styles.divider} />

      <h2 className={styles.h2}>Providers suportados</h2>
      <p className={styles.p}>
        O Reliant é provider-agnóstico. Você pode usar qualquer combinação:
      </p>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Provider</th>
            <th>Modelos testados</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span className={styles.param}>anthropic</span></td>
            <td>claude-sonnet-4, claude-opus-4, claude-haiku</td>
            <td>✅ Suportado</td>
          </tr>
          <tr>
            <td><span className={styles.param}>openai</span></td>
            <td>gpt-4o, gpt-4o-mini, gpt-4-turbo</td>
            <td>✅ Suportado</td>
          </tr>
          <tr>
            <td><span className={styles.param}>gemini</span></td>
            <td>gemini-1.5-pro, gemini-1.5-flash</td>
            <td>✅ Suportado</td>
          </tr>
        </tbody>
      </table>

      <div className={styles.pagination}>
        <div />
        <Link href="/docs/quickstart" className={styles.pageLink} style={{ textAlign: 'right' }}>
          <span className={styles.pageLinkLabel}>Próximo →</span>
          <span className={styles.pageLinkTitle}>Quickstart</span>
        </Link>
      </div>
    </div>
  )
}
