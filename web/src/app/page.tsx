'use client'

import { useEffect } from 'react'

export default function LandingPage() {
  useEffect(() => {
    // Expose functions globally for HTML onclick handlers
    // i18n and interactions script
    // TRANSLATIONS
const i18n = {
  pt: {
    'nav.features': 'Funcionalidades',
    'nav.how': 'Como funciona',
    'nav.pricing': 'Preços',
    'nav.cta': 'Começar →',
    'hero.badge': 'Disponível agora — reliant-js v1.0.0',
    'hero.title1': 'Seu pipeline de IA,',
    'hero.title2': 'finalmente confiável.',
    'hero.sub': 'Reliant fica entre seu app e qualquer LLM. Outputs estruturados garantidos, retry inteligente e observabilidade completa — para seus pipelines de IA funcionarem em produção.',
    'hero.cta1': 'Começar a construir →',
    'hero.cta2': 'Ver como funciona',
    'logos.label': 'Compatível com qualquer provedor de LLM',
    'logos.any': 'Qualquer API de LLM',
    'problem.label': 'O problema',
    'problem.title': 'LLMs quebram pipelines.\nTodo dia.',
    'problem.sub': 'JSON que não parseia. Schemas que falham na validação. Zero visibilidade do que deu errado.',
    'problem.1.title': 'JSON malformado derruba seu app',
    'problem.1.desc': 'LLMs retornam texto válido mas JSON inválido. Uma resposta ruim quebra o pipeline inteiro.',
    'problem.2.title': 'Retry manual é frágil',
    'problem.2.desc': 'Devs escrevem lógica de retry customizada em cada projeto. É inconsistente e sem testes.',
    'problem.3.title': 'Zero visibilidade em produção',
    'problem.3.desc': 'Você não sabe quais schemas falham mais, quando drift acontece, ou por que os outputs mudam.',
    'problem.4.title': 'Provedores se comportam diferente',
    'problem.4.desc': 'OpenAI, Anthropic e Gemini tratam outputs estruturados de formas diferentes. Cross-provider é um pesadelo.',
    'features.label': 'A solução',
    'features.title': 'Tudo que seu pipeline de IA precisa.\nNada que não precisa.',
    'f1.title': 'Structured Output Engine',
    'f1.desc': 'Defina JSON schemas uma vez. Reliant garante que toda resposta do LLM bate — ou faz retry automaticamente com um prompt corrigido.',
    'f2.title': 'Retry Inteligente',
    'f2.desc': 'Validação falhou? Reliant reescreve o prompt com os erros exatos, reduz a temperatura e tenta até 3x antes de usar o fallback seguro.',
    'f3.title': 'Observabilidade Completa',
    'f3.desc': 'Toda execução logada. Taxa de sucesso, latência, tokens e drift por schema. Saiba exatamente o que acontece em produção.',
    'f4.title': 'Provider Agnóstico',
    'f4.desc': 'OpenAI, Anthropic, Gemini — uma API para tudo. Troque de provider sem mudar seu código de aplicação.',
    'f5.title': 'Safe Fallbacks',
    'f5.desc': 'Defina o que acontece quando todos os retries falham. Seu app continua rodando com uma resposta previsível e segura.',
    'f6.title': 'Schema Registry',
    'f6.desc': 'Versione seus contratos de output. Acompanhe mudanças. Nunca quebre compatibilidade retroativa por acidente.',
    'how.label': 'Como funciona',
    'how.title': 'Uma chamada de API.\nOutput garantido.',
    'how.1.title': 'Você chama o Reliant',
    'how.1.desc': 'Envie seu prompt, schema ID e provedor escolhido. Um endpoint, qualquer LLM.',
    'how.2.title': 'Reliant chama o LLM',
    'how.2.desc': 'Com um system prompt otimizado que força a estrutura do seu schema automaticamente.',
    'how.3.title': 'Output validado',
    'how.3.valid': 'Válido?',
    'how.3.return': 'Retorna imediatamente.',
    'how.3.invalid': 'Inválido?',
    'how.3.retry': 'Reescreve prompt + retry.',
    'how.4.title': 'Tudo logado',
    'how.4.desc': 'Cada tentativa, latência, tokens e erros registrados. Trilha de auditoria completa sempre disponível.',
    'install.label': 'Comece em minutos',
    'install.title': 'Integre em\nmenos de 10 linhas.',
    'install.sub': 'Sem configuração complexa. Sem lock-in. Self-host no Railway em minutos.',
    'install.copy': 'copiar',
    'install.steps': '3 passos para produção',
    'metrics.label': 'Feito para produção',
    'metrics.title': 'Números que importam.',
    'metrics.1': 'Taxa de sucesso',
    'metrics.2': 'Retries inteligentes',
    'metrics.3': 'Overhead por chamada',
    'metrics.4': 'Provedores suportados',
    'pricing.label': 'Preços',
    'pricing.title': 'Simples. Transparente.\nEscale quando precisar.',
    'pricing.free': 'Grátis',
    'pricing.free.period': 'para sempre · self-hosted',
    'pricing.free.1': 'Até 1.000 execuções/mês',
    'pricing.free.2': '1 projeto',
    'pricing.free.3': 'Dashboard completo',
    'pricing.free.4': 'SDKs JS + Python',
    'pricing.free.5': 'Suporte OpenAI + Anthropic',
    'pricing.free.6': 'Suporte comunidade',
    'pricing.free.cta': 'Deploy no Railway →',
    'pricing.pro.badge': 'Mais popular',
    'pricing.pro.period': 'por projeto · cloud gerenciado',
    'pricing.pro.1': 'Execuções ilimitadas',
    'pricing.pro.2': '5 projetos',
    'pricing.pro.3': 'Observabilidade + alertas',
    'pricing.pro.4': 'Todos os provedores',
    'pricing.pro.5': 'Fallback multi-modelo',
    'pricing.pro.6': 'Suporte prioritário',
    'pricing.pro.cta': 'Acesso antecipado →',
    'pricing.ent': 'Sob consulta',
    'pricing.ent.period': 'volume · on-premise disponível',
    'pricing.ent.1': 'Tudo ilimitado',
    'pricing.ent.2': 'Projetos ilimitados',
    'pricing.ent.3': 'Guardrails customizados',
    'pricing.ent.4': 'Deploy on-premise',
    'pricing.ent.5': 'Suporte dedicado',
    'pricing.ent.cta': 'Fale conosco →',
    'cta.title': 'Pare de babysitting\nseus outputs de LLM.',
    'cta.sub': 'Comece com o plano gratuito. Self-host em minutos. Escale quando precisar.',
    'cta.cta1': 'Começar de graça →',
    'cta.cta2': 'Fale conosco',
    'footer.text': 'Reliant · A camada de confiabilidade para produtos com LLM',
    'footer.contact': 'Contato',
  },
  en: {
    'nav.features': 'Features',
    'nav.how': 'How it works',
    'nav.pricing': 'Pricing',
    'nav.cta': 'Get started →',
    'hero.badge': 'Now available — reliant-js v1.0.0',
    'hero.title1': 'Your LLM pipeline,',
    'hero.title2': 'finally reliable.',
    'hero.sub': 'Reliant sits between your app and any LLM. Guaranteed structured outputs, intelligent retry, and full observability — so your AI pipelines work in production.',
    'hero.cta1': 'Start building →',
    'hero.cta2': 'See how it works',
    'logos.label': 'Works with any LLM provider',
    'logos.any': 'Any LLM API',
    'problem.label': 'The problem',
    'problem.title': 'LLMs break pipelines.\nEvery day.',
    'problem.sub': 'JSON that doesn\'t parse. Schemas that fail validation. Zero visibility into what went wrong.',
    'problem.1.title': 'Malformed JSON crashes your app',
    'problem.1.desc': 'LLMs return valid text but invalid JSON. One bad response breaks the entire pipeline.',
    'problem.2.title': 'Manual retry is fragile',
    'problem.2.desc': 'Developers write custom retry logic for every project. It\'s inconsistent and untested.',
    'problem.3.title': 'Zero visibility in production',
    'problem.3.desc': 'You don\'t know which schemas fail most, when drift happens, or why outputs change over time.',
    'problem.4.title': 'Providers behave differently',
    'problem.4.desc': 'OpenAI, Anthropic and Gemini handle structured outputs differently. Cross-provider is a nightmare.',
    'features.label': 'The solution',
    'features.title': 'Everything your LLM pipeline needs.\nNothing it doesn\'t.',
    'f1.title': 'Structured Output Engine',
    'f1.desc': 'Define JSON schemas once. Reliant guarantees every LLM response matches — or retries automatically with a corrected prompt.',
    'f2.title': 'Intelligent Retry',
    'f2.desc': 'Failed validation? Reliant rewrites the prompt with the exact errors, reduces temperature, and retries up to 3x before falling back safely.',
    'f3.title': 'Full Observability',
    'f3.desc': 'Every execution logged. Success rates, latency, tokens, and drift tracked per schema. Know exactly what\'s happening in production.',
    'f4.title': 'Provider Agnostic',
    'f4.desc': 'OpenAI, Anthropic, Gemini — one API to rule them all. Switch providers without changing your application code.',
    'f5.title': 'Safe Fallbacks',
    'f5.desc': 'Define what happens when all retries fail. Your app keeps running with a predictable, safe response instead of crashing.',
    'f6.title': 'Schema Registry',
    'f6.desc': 'Version your output contracts. Track changes over time. Never break backward compatibility by accident.',
    'how.label': 'How it works',
    'how.title': 'One API call.\nGuaranteed output.',
    'how.1.title': 'You call Reliant',
    'how.1.desc': 'Send your prompt, schema ID, and chosen provider. One endpoint, any LLM.',
    'how.2.title': 'Reliant calls the LLM',
    'how.2.desc': 'With an optimized system prompt that enforces your schema structure automatically.',
    'how.3.title': 'Output validated',
    'how.3.valid': 'Valid?',
    'how.3.return': 'Return immediately.',
    'how.3.invalid': 'Invalid?',
    'how.3.retry': 'Rewrite prompt + retry.',
    'how.4.title': 'Everything logged',
    'how.4.desc': 'Every attempt, latency, tokens, and errors recorded. Full audit trail always available.',
    'install.label': 'Get started in minutes',
    'install.title': 'Integrate in\nunder 10 lines.',
    'install.sub': 'No complex setup. No vendor lock-in. Self-host on Railway in minutes.',
    'install.copy': 'copy',
    'install.steps': '3 steps to production',
    'metrics.label': 'Built for production',
    'metrics.title': 'Numbers that matter.',
    'metrics.1': 'Output success rate',
    'metrics.2': 'Intelligent retries',
    'metrics.3': 'Overhead per call',
    'metrics.4': 'Providers supported',
    'pricing.label': 'Pricing',
    'pricing.title': 'Simple. Transparent.\nScale when you\'re ready.',
    'pricing.free': 'Free',
    'pricing.free.period': 'forever · self-hosted',
    'pricing.free.1': 'Up to 1,000 executions/mo',
    'pricing.free.2': '1 project',
    'pricing.free.3': 'Full observability dashboard',
    'pricing.free.4': 'JS + Python SDKs',
    'pricing.free.5': 'OpenAI + Anthropic support',
    'pricing.free.6': 'Community support',
    'pricing.free.cta': 'Deploy on Railway →',
    'pricing.pro.badge': 'Most popular',
    'pricing.pro.period': 'per project · managed cloud',
    'pricing.pro.1': 'Unlimited executions',
    'pricing.pro.2': '5 projects',
    'pricing.pro.3': 'Observability + alerts',
    'pricing.pro.4': 'All providers',
    'pricing.pro.5': 'Multi-model fallback',
    'pricing.pro.6': 'Priority support',
    'pricing.pro.cta': 'Get early access →',
    'pricing.ent': 'Custom',
    'pricing.ent.period': 'volume · on-premise available',
    'pricing.ent.1': 'Unlimited everything',
    'pricing.ent.2': 'Unlimited projects',
    'pricing.ent.3': 'Custom guardrails',
    'pricing.ent.4': 'On-premise deployment',
    'pricing.ent.5': 'Dedicated support',
    'pricing.ent.cta': 'Talk to us →',
    'cta.title': 'Stop babysitting\nyour LLM outputs.',
    'cta.sub': 'Start with the free tier. Self-host in minutes. Scale when you need to.',
    'cta.cta1': 'Start building for free →',
    'cta.cta2': 'Talk to us',
    'footer.text': 'Reliant · The reliability layer for LLM-powered products',
    'footer.contact': 'Contact',
  }
}

let currentLang = 'pt'

function setLang(lang) {
  currentLang = lang
  document.documentElement.lang = lang

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')
    if (i18n[lang][key]) {
      el.textContent = i18n[lang][key]
    }
  })

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === lang.toUpperCase())
  })

  // Sync mobile menu i18n links
  document.querySelectorAll('.mobile-menu [data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')
    if (i18n[lang][key]) el.textContent = i18n[lang][key]
  })

  document.title = lang === 'pt'
    ? 'Reliant — A Camada de Confiabilidade para Produtos com LLM'
    : 'Reliant — The Reliability Layer for LLM-Powered Products'

  localStorage.setItem('reliant_lang', lang)
}

// Restore saved lang
const saved = localStorage.getItem('reliant_lang')
if (saved && saved !== 'pt') setLang(saved)

// Nav scroll
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 20)
})

// Reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80)
      observer.unobserve(entry.target)
    }
  })
}, { threshold: 0.1 })
document.querySelectorAll('.reveal').forEach(el => observer.observe(el))

// Copy
function copyInstall() {
  navigator.clipboard.writeText('npm install reliant-js')
  const btn = document.getElementById('copy-btn')
  btn.textContent = currentLang === 'pt' ? 'copiado!' : 'copied!'
  btn.style.color = 'var(--accent)'
  setTimeout(() => {
    btn.textContent = currentLang === 'pt' ? 'copiar' : 'copy'
    btn.style.color = ''
  }, 2000)
}
    // Expose to window for HTML onclick handlers
    if (typeof window !== 'undefined') {
      ;(window as any).setLang = setLang
      ;(window as any).toggleMenu = toggleMenu
      ;(window as any).copyInstall = copyInstall
    }
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #050505;
      --bg-2: #0d0d0d;
      --bg-3: #141414;
      --border: #1e1e1e;
      --border-2: #2a2a2a;
      --text: #f0f0f0;
      --text-2: #888;
      --text-3: #444;
      --accent: #00ff88;
      --accent-2: #00cc6e;
      --accent-dim: rgba(0, 255, 136, 0.08);
      --red: #ff4455;
      --font-display: 'Syne', sans-serif;
      --font-mono: 'DM Mono', monospace;
      --font-body: 'DM Sans', sans-serif;
    }

    html { scroll-behavior: smooth; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-body);
      font-size: 16px;
      line-height: 1.6;
      overflow-x: hidden;
    }

    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 1000;
      opacity: 0.4;
    }

    /* NAV */
    nav {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 100;
      padding: 20px 48px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid transparent;
      transition: all 0.3s;
    }

    nav.scrolled {
      background: rgba(5,5,5,0.92);
      border-bottom-color: var(--border);
      backdrop-filter: blur(12px);
    }

    .nav-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
    }

    .nav-logo-mark {
      width: 32px; height: 32px;
      background: var(--accent);
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-mono);
      font-weight: 500;
      font-size: 14px;
      color: #000;
    }

    .nav-logo-text {
      font-family: var(--font-display);
      font-size: 18px;
      font-weight: 700;
      color: var(--text);
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 32px;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 32px;
    }

    .nav-links a {
      font-family: var(--font-mono);
      font-size: 13px;
      color: var(--text-2);
      text-decoration: none;
      transition: color 0.2s;
    }

    .nav-links a:hover { color: var(--text); }

    .nav-cta {
      padding: 8px 20px;
      background: var(--accent);
      color: #000 !important;
      border-radius: 3px;
      font-weight: 500 !important;
    }

    .nav-cta:hover { background: var(--accent-2) !important; }

    /* LANG TOGGLE */
    .lang-toggle {
      display: flex;
      align-items: center;
      background: var(--bg-3);
      border: 1px solid var(--border-2);
      border-radius: 3px;
      overflow: hidden;
    }

    .lang-btn {
      padding: 5px 10px;
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-3);
      cursor: pointer;
      background: none;
      border: none;
      transition: all 0.15s;
      letter-spacing: 0.04em;
    }

    .lang-btn.active {
      background: var(--accent);
      color: #000;
      font-weight: 500;
    }

    .lang-btn:not(.active):hover { color: var(--text-2); }

    /* HERO */
    .hero {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 120px 48px 80px;
      position: relative;
      text-align: center;
    }

    .hero-glow {
      position: absolute;
      top: 20%; left: 50%;
      transform: translateX(-50%);
      width: 600px; height: 600px;
      background: radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%);
      pointer-events: none;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: var(--accent-dim);
      border: 1px solid rgba(0,255,136,0.2);
      border-radius: 100px;
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--accent);
      margin-bottom: 32px;
      animation: fadeUp 0.6s ease both;
    }

    .badge-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--accent);
      animation: pulse 2s ease infinite;
    }

    @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.3} }

    .hero-title {
      font-family: var(--font-display);
      font-size: clamp(44px, 7vw, 84px);
      font-weight: 800;
      line-height: 1.0;
      letter-spacing: -0.03em;
      margin-bottom: 24px;
      max-width: 900px;
      animation: fadeUp 0.6s 0.1s ease both;
    }

    .hero-title .accent { color: var(--accent); }

    .hero-sub {
      font-size: clamp(16px, 2vw, 20px);
      color: var(--text-2);
      max-width: 560px;
      margin-bottom: 48px;
      font-weight: 300;
      animation: fadeUp 0.6s 0.2s ease both;
    }

    .hero-actions {
      display: flex;
      gap: 16px;
      align-items: center;
      margin-bottom: 80px;
      animation: fadeUp 0.6s 0.3s ease both;
    }

    .btn-primary {
      padding: 14px 28px;
      background: var(--accent);
      color: #000;
      font-family: var(--font-mono);
      font-size: 14px;
      font-weight: 500;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .btn-primary:hover {
      background: var(--accent-2);
      transform: translateY(-1px);
      box-shadow: 0 8px 24px rgba(0,255,136,0.2);
    }

    .btn-ghost {
      padding: 14px 28px;
      background: transparent;
      color: var(--text-2);
      font-family: var(--font-mono);
      font-size: 14px;
      border: 1px solid var(--border-2);
      border-radius: 3px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .btn-ghost:hover { border-color: var(--text-3); color: var(--text); }

    .hero-code {
      width: 100%;
      max-width: 700px;
      background: var(--bg-2);
      border: 1px solid var(--border-2);
      border-radius: 6px;
      overflow: hidden;
      text-align: left;
      animation: fadeUp 0.6s 0.4s ease both;
      box-shadow: 0 32px 80px rgba(0,0,0,0.5);
    }

    .code-bar {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--bg-3);
    }

    .code-dot { width: 10px; height: 10px; border-radius: 50%; }

    .code-bar-title {
      margin-left: 8px;
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--text-3);
    }

    .code-body {
      padding: 24px;
      font-family: var(--font-mono);
      font-size: 13px;
      line-height: 1.8;
      overflow-x: auto;
    }

    .c-import{color:#888} .c-key{color:#4499ff} .c-str{color:#00ff88}
    .c-fn{color:#ffcc00} .c-comment{color:#444} .c-val{color:#ff8844}

    /* LOGOS */
    .logos-section {
      padding: 0 48px 80px;
      text-align: center;
    }

    .logos-label {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-3);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 24px;
    }

    .logos-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 48px;
      flex-wrap: wrap;
    }

    .logo-item {
      font-family: var(--font-mono);
      font-size: 14px;
      color: var(--text-3);
    }

    /* SECTION */
    section {
      padding: 100px 48px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .section-label {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 16px;
    }

    .section-title {
      font-family: var(--font-display);
      font-size: clamp(32px, 4vw, 52px);
      font-weight: 700;
      letter-spacing: -0.02em;
      line-height: 1.1;
      margin-bottom: 16px;
    }

    .section-sub {
      font-size: 18px;
      color: var(--text-2);
      max-width: 560px;
      font-weight: 300;
    }

    /* PROBLEM */
    .problem-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      margin-top: 64px;
      align-items: center;
    }

    .problem-list { display: flex; flex-direction: column; gap: 20px; }

    .problem-item {
      display: flex;
      gap: 16px;
      padding: 20px;
      background: var(--bg-2);
      border: 1px solid var(--border);
      border-radius: 4px;
      border-left: 3px solid var(--red);
    }

    .problem-icon { font-size: 20px; flex-shrink: 0; margin-top: 2px; }

    .problem-title {
      font-family: var(--font-display);
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .problem-desc { font-size: 14px; color: var(--text-2); }

    .problem-code {
      background: var(--bg-2);
      border: 1px solid var(--border-2);
      border-radius: 6px;
      overflow: hidden;
    }

    /* FEATURES */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1px;
      background: var(--border);
      border: 1px solid var(--border);
      border-radius: 6px;
      overflow: hidden;
      margin-top: 64px;
    }

    .feature-card {
      background: var(--bg);
      padding: 36px 32px;
      transition: background 0.2s;
    }

    .feature-card:hover { background: var(--bg-2); }

    .feature-icon {
      width: 40px; height: 40px;
      background: var(--accent-dim);
      border: 1px solid rgba(0,255,136,0.15);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      font-size: 18px;
    }

    .feature-title {
      font-family: var(--font-display);
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 10px;
    }

    .feature-desc { font-size: 14px; color: var(--text-2); line-height: 1.7; }

    /* FLOW */
    .flow {
      display: flex;
      margin-top: 64px;
      background: var(--bg-2);
      border: 1px solid var(--border-2);
      border-radius: 6px;
      overflow: hidden;
    }

    .flow-step {
      flex: 1;
      padding: 32px 28px;
      border-right: 1px solid var(--border);
    }

    .flow-step:last-child { border-right: none; }

    .flow-num {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-3);
      margin-bottom: 12px;
    }

    .flow-title {
      font-family: var(--font-display);
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .flow-desc { font-size: 13px; color: var(--text-2); line-height: 1.6; }
    .flow-accent { color: var(--accent); }
    .flow-red { color: var(--red); }

    /* METRICS */
    .metrics-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1px;
      background: var(--border);
      border: 1px solid var(--border);
      border-radius: 6px;
      overflow: hidden;
      margin-top: 64px;
    }

    .metric-card { background: var(--bg); padding: 40px 32px; text-align: center; }

    .metric-value {
      font-family: var(--font-display);
      font-size: 48px;
      font-weight: 800;
      color: var(--accent);
      letter-spacing: -0.03em;
      line-height: 1;
      margin-bottom: 8px;
    }

    .metric-label {
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--text-3);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    /* INSTALL */
    .install-section {
      background: var(--bg-2);
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
      padding: 100px 48px;
    }

    .install-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
      align-items: center;
    }

    .install-cmd {
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--bg);
      border: 1px solid var(--border-2);
      border-radius: 4px;
      padding: 16px 20px;
      font-family: var(--font-mono);
      font-size: 16px;
      color: var(--accent);
      margin-top: 32px;
      cursor: pointer;
      transition: border-color 0.2s;
    }

    .install-cmd:hover { border-color: var(--accent); }
    .install-cmd .prompt { color: var(--text-3); }

    .copy-btn {
      margin-left: auto;
      background: none;
      border: none;
      color: var(--text-3);
      cursor: pointer;
      font-size: 14px;
      font-family: var(--font-mono);
      transition: color 0.2s;
    }

    .copy-btn:hover { color: var(--text); }

    /* PRICING */
    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1px;
      background: var(--border);
      border: 1px solid var(--border);
      border-radius: 6px;
      overflow: hidden;
      margin-top: 64px;
    }

    .pricing-card { background: var(--bg); padding: 40px 32px; }

    .pricing-card.featured {
      background: var(--bg-2);
      border-left: 2px solid var(--accent);
      border-right: 2px solid var(--accent);
    }

    .pricing-badge {
      display: inline-block;
      padding: 3px 10px;
      background: var(--accent-dim);
      border: 1px solid rgba(0,255,136,0.2);
      border-radius: 100px;
      font-family: var(--font-mono);
      font-size: 10px;
      color: var(--accent);
      margin-bottom: 16px;
    }

    .pricing-name {
      font-family: var(--font-display);
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .pricing-price {
      font-family: var(--font-display);
      font-size: 40px;
      font-weight: 800;
      letter-spacing: -0.03em;
      margin-bottom: 4px;
    }

    .pricing-period {
      font-size: 13px;
      color: var(--text-3);
      margin-bottom: 32px;
      font-family: var(--font-mono);
    }

    .pricing-features {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 32px;
    }

    .pricing-features li {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      color: var(--text-2);
    }

    .pricing-features li::before {
      content: '→';
      color: var(--accent);
      font-family: var(--font-mono);
      font-size: 12px;
      flex-shrink: 0;
    }

    /* CTA */
    .cta-section {
      padding: 120px 48px;
      text-align: center;
      position: relative;
    }

    .cta-glow {
      position: absolute;
      bottom: 0; left: 50%;
      transform: translateX(-50%);
      width: 800px; height: 400px;
      background: radial-gradient(ellipse, rgba(0,255,136,0.05) 0%, transparent 70%);
      pointer-events: none;
    }

    .cta-title {
      font-family: var(--font-display);
      font-size: clamp(36px, 5vw, 64px);
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.05;
      margin-bottom: 24px;
    }

    .cta-sub {
      font-size: 18px;
      color: var(--text-2);
      max-width: 480px;
      margin: 0 auto 48px;
      font-weight: 300;
    }

    /* FOOTER */
    footer {
      border-top: 1px solid var(--border);
      padding: 40px 48px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .footer-logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: var(--font-mono);
      font-size: 13px;
      color: var(--text-3);
    }

    .footer-links { display: flex; gap: 24px; }

    .footer-links a {
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--text-3);
      text-decoration: none;
      transition: color 0.2s;
    }

    .footer-links a:hover { color: var(--text-2); }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .reveal {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .reveal.visible { opacity: 1; transform: translateY(0); }

    .divider { border: none; border-top: 1px solid var(--border); margin: 0; }

    /* ─── MOBILE MENU ──────────────────────────────────────────────────────── */
    .nav-hamburger {
      display: none;
      flex-direction: column;
      gap: 5px;
      cursor: pointer;
      padding: 4px;
      background: none;
      border: none;
    }

    .nav-hamburger span {
      display: block;
      width: 22px;
      height: 2px;
      background: var(--text-2);
      border-radius: 2px;
      transition: all 0.3s;
    }

    .nav-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .nav-hamburger.open span:nth-child(2) { opacity: 0; }
    .nav-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    .mobile-menu {
      display: none;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: var(--bg);
      z-index: 90;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 32px;
    }

    .mobile-menu.open { display: flex; }

    .mobile-menu a {
      font-family: var(--font-display);
      font-size: 28px;
      font-weight: 700;
      color: var(--text-2);
      text-decoration: none;
      transition: color 0.2s;
    }

    .mobile-menu a:hover { color: var(--text); }

    .mobile-menu .mobile-cta {
      color: var(--accent) !important;
    }

    .mobile-lang {
      display: flex;
      gap: 0;
      border: 1px solid var(--border-2);
      border-radius: 3px;
      overflow: hidden;
    }

    /* ─── TABLET: 768px ────────────────────────────────────────────────────── */
    @media (max-width: 900px) {
      .problem-grid { grid-template-columns: 1fr; gap: 32px; }
      .problem-code { display: none; }
      .features-grid { grid-template-columns: 1fr 1fr; }
      .flow { flex-direction: column; }
      .flow-step { border-right: none; border-bottom: 1px solid var(--border); }
      .flow-step:last-child { border-bottom: none; }
      .metrics-row { grid-template-columns: 1fr 1fr; }
      .install-inner { grid-template-columns: 1fr; gap: 40px; }
      .pricing-grid { grid-template-columns: 1fr; gap: 1px; }
      .pricing-card.featured { border-left: none; border-right: none; border-top: 2px solid var(--accent); border-bottom: 2px solid var(--accent); }
    }

    /* ─── MOBILE: 640px ────────────────────────────────────────────────────── */
    @media (max-width: 640px) {
      /* Nav */
      nav { padding: 16px 20px; }
      .nav-right { display: none; }
      .nav-hamburger { display: flex; }

      /* Hero */
      .hero { padding: 100px 20px 60px; }
      .hero-actions { flex-direction: column; width: 100%; }
      .hero-actions .btn-primary,
      .hero-actions .btn-ghost { width: 100%; justify-content: center; }
      .hero-code { max-width: 100%; }
      .code-body { font-size: 11px; padding: 16px; }

      /* Logos */
      .logos-section { padding: 0 20px 60px; }
      .logos-row { gap: 24px; }

      /* Sections */
      section { padding: 64px 20px; }
      .section-sub { font-size: 16px; }

      /* Features */
      .features-grid { grid-template-columns: 1fr; }

      /* Flow */
      .flow-step { padding: 24px 20px; }

      /* Metrics */
      .metrics-row { grid-template-columns: 1fr 1fr; }
      .metric-value { font-size: 36px; }
      .metric-card { padding: 28px 16px; }

      /* Install */
      .install-section { padding: 64px 20px; }
      .install-cmd { font-size: 13px; padding: 12px 14px; }

      /* Pricing */
      .pricing-card { padding: 28px 20px; }

      /* CTA */
      .cta-section { padding: 80px 20px; }
      .cta-section > .reveal { flex-direction: column; width: 100%; }
      .cta-section > .reveal .btn-primary,
      .cta-section > .reveal .btn-ghost { width: 100%; justify-content: center; }

      /* Footer */
      footer { flex-direction: column; gap: 20px; text-align: center; padding: 32px 20px; }
      .footer-links { flex-wrap: wrap; justify-content: center; }
    }` }} />
      <div dangerouslySetInnerHTML={{ __html: `<nav id="nav">
  <a href="#" class="nav-logo">
    <div class="nav-logo-mark">R</div>
    <span class="nav-logo-text">Reliant</span>
  </a>
  <div class="nav-right">
    <div class="nav-links">
      <a href="#features" data-i18n="nav.features">Funcionalidades</a>
      <a href="#how" data-i18n="nav.how">Como funciona</a>
      <a href="#pricing" data-i18n="nav.pricing">Preços</a>
      <a href="https://www.npmjs.com/package/reliant-js" target="_blank">npm</a>
      <a href="/auth/signup" class="nav-cta" data-i18n="nav.cta">Começar →</a>
    </div>
    <div class="lang-toggle">
      <button class="lang-btn active" onclick="setLang('pt')">PT</button>
      <button class="lang-btn" onclick="setLang('en')">EN</button>
    </div>
  </div>
  <button class="nav-hamburger" id="hamburger" onclick="toggleMenu()" aria-label="Menu">
    <span></span><span></span><span></span>
  </button>
</nav>

<!-- MOBILE MENU -->
<div class="mobile-menu" id="mobile-menu">
  <a href="#features" data-i18n="nav.features" onclick="toggleMenu()">Funcionalidades</a>
  <a href="#how" data-i18n="nav.how" onclick="toggleMenu()">Como funciona</a>
  <a href="#pricing" data-i18n="nav.pricing" onclick="toggleMenu()">Preços</a>
  <a href="https://www.npmjs.com/package/reliant-js" target="_blank" onclick="toggleMenu()">npm</a>
  <a href="/auth/signup" class="mobile-cta" onclick="toggleMenu()">Começar →</a>
  <div class="mobile-lang lang-toggle">
    <button class="lang-btn active" id="mobile-lang-pt" onclick="setLang('pt'); toggleMenu()">PT</button>
    <button class="lang-btn" id="mobile-lang-en" onclick="setLang('en'); toggleMenu()">EN</button>
  </div>
</div>

<!-- HERO -->
<div class="hero">
  <div class="hero-glow"></div>
  <div class="hero-badge">
    <div class="badge-dot"></div>
    <span data-i18n="hero.badge">Disponível agora — reliant-js v1.0.0</span>
  </div>
  <h1 class="hero-title">
    <span data-i18n="hero.title1">Seu pipeline de IA,</span><br>
    <span class="accent" data-i18n="hero.title2">finalmente confiável.</span>
  </h1>
  <p class="hero-sub" data-i18n="hero.sub">
    Reliant fica entre seu app e qualquer LLM. Outputs estruturados garantidos, retry inteligente e observabilidade completa — para seus pipelines de IA funcionarem em produção.
  </p>
  <div class="hero-actions">
    <a href="/auth/signup" class="btn-primary">Começar a construir →</a>
    <a href="#how" class="btn-ghost" data-i18n="hero.cta2">Ver como funciona</a>
  </div>
  <div class="hero-code">
    <div class="code-bar">
      <div class="code-dot" style="background:#ff5f57"></div>
      <div class="code-dot" style="background:#ffbd2e"></div>
      <div class="code-dot" style="background:#28c941"></div>
      <span class="code-bar-title">example.ts</span>
    </div>
    <div class="code-body">
<span class="c-import">import</span> { Reliant } <span class="c-import">from</span> <span class="c-str">'reliant-js'</span><br>
<br>
<span class="c-import">const</span> <span class="c-val">reliant</span> = <span class="c-import">new</span> <span class="c-fn">Reliant</span>({<br>
&nbsp;&nbsp;<span class="c-key">apiKey</span>: <span class="c-str">'rel_...'</span>,<br>
&nbsp;&nbsp;<span class="c-key">baseUrl</span>: <span class="c-str">'https://your-reliant-api.railway.app'</span>,<br>
})<br>
<br>
<span class="c-comment">// Execute com output estruturado garantido</span><br>
<span class="c-import">const</span> <span class="c-val">result</span> = <span class="c-import">await</span> reliant.<span class="c-fn">execute</span>({<br>
&nbsp;&nbsp;<span class="c-key">prompt</span>: <span class="c-str">'Extraia: João Silva, joao@email.com'</span>,<br>
&nbsp;&nbsp;<span class="c-key">schemaId</span>: <span class="c-str">'contact-extraction'</span>,<br>
&nbsp;&nbsp;<span class="c-key">provider</span>: <span class="c-str">'anthropic'</span>,<br>
&nbsp;&nbsp;<span class="c-key">model</span>: <span class="c-str">'claude-sonnet-4-20250514'</span>,<br>
})<br>
<br>
console.<span class="c-fn">log</span>(result.<span class="c-key">output</span>)<br>
<span class="c-comment">// ✅ { name: 'João Silva', email: 'joao@email.com' }</span><br>
<span class="c-comment">// ✅ Validado. Retry automático. Tudo logado.</span>
    </div>
  </div>
</div>

<hr class="divider">

<div class="logos-section">
  <div class="logos-label" data-i18n="logos.label">Compatível com qualquer provedor de LLM</div>
  <div class="logos-row">
    <span class="logo-item">OpenAI</span>
    <span class="logo-item" style="color:#555">·</span>
    <span class="logo-item">Anthropic</span>
    <span class="logo-item" style="color:#555">·</span>
    <span class="logo-item">Google Gemini</span>
    <span class="logo-item" style="color:#555">·</span>
    <span class="logo-item" data-i18n="logos.any">Qualquer API de LLM</span>
  </div>
</div>

<hr class="divider">

<!-- PROBLEM -->
<section>
  <div class="section-label" data-i18n="problem.label">O problema</div>
  <div class="section-title" data-i18n="problem.title">LLMs quebram pipelines.<br>Todo dia.</div>
  <p class="section-sub" data-i18n="problem.sub">JSON que não parseia. Schemas que falham na validação. Zero visibilidade do que deu errado.</p>

  <div class="problem-grid reveal">
    <div class="problem-list">
      <div class="problem-item">
        <div class="problem-icon">💥</div>
        <div>
          <div class="problem-title" data-i18n="problem.1.title">JSON malformado derruba seu app</div>
          <div class="problem-desc" data-i18n="problem.1.desc">LLMs retornam texto válido mas JSON inválido. Uma resposta ruim quebra o pipeline inteiro.</div>
        </div>
      </div>
      <div class="problem-item">
        <div class="problem-icon">🔄</div>
        <div>
          <div class="problem-title" data-i18n="problem.2.title">Retry manual é frágil</div>
          <div class="problem-desc" data-i18n="problem.2.desc">Devs escrevem lógica de retry customizada em cada projeto. É inconsistente e sem testes.</div>
        </div>
      </div>
      <div class="problem-item">
        <div class="problem-icon">🕳️</div>
        <div>
          <div class="problem-title" data-i18n="problem.3.title">Zero visibilidade em produção</div>
          <div class="problem-desc" data-i18n="problem.3.desc">Você não sabe quais schemas falham mais, quando drift acontece, ou por que os outputs mudam.</div>
        </div>
      </div>
      <div class="problem-item">
        <div class="problem-icon">🔀</div>
        <div>
          <div class="problem-title" data-i18n="problem.4.title">Provedores se comportam diferente</div>
          <div class="problem-desc" data-i18n="problem.4.desc">OpenAI, Anthropic e Gemini tratam outputs estruturados de formas diferentes. Cross-provider é um pesadelo.</div>
        </div>
      </div>
    </div>
    <div class="problem-code">
      <div class="code-bar">
        <div class="code-dot" style="background:#ff5f57"></div>
        <div class="code-dot" style="background:#444"></div>
        <div class="code-dot" style="background:#444"></div>
        <span class="code-bar-title">sem-reliant.ts — 😬</span>
      </div>
      <div class="code-body" style="font-size:12px;">
<span class="c-import">try</span> {<br>
&nbsp;&nbsp;<span class="c-import">const</span> raw = <span class="c-import">await</span> openai.<span class="c-fn">chat</span>(...)<br>
&nbsp;&nbsp;<span class="c-import">const</span> parsed = JSON.<span class="c-fn">parse</span>(raw) <span class="c-comment">// 💥 throws</span><br>
&nbsp;&nbsp;<span class="c-comment">// validação manual...</span><br>
&nbsp;&nbsp;<span class="c-comment">// retry manual...</span><br>
&nbsp;&nbsp;<span class="c-comment">// log manual...</span><br>
&nbsp;&nbsp;<span class="c-comment">// sem versionamento...</span><br>
&nbsp;&nbsp;<span class="c-comment">// sem cross-provider...</span><br>
} <span class="c-import">catch</span> (e) {<br>
&nbsp;&nbsp;<span class="c-comment">// 🤷 torcer pro melhor</span><br>
}<br>
<br>
<span class="c-comment">// repetir em todo endpoint.</span><br>
<span class="c-comment">// para sempre.</span>
      </div>
    </div>
  </div>
</section>

<hr class="divider">

<!-- FEATURES -->
<section id="features">
  <div class="section-label reveal" data-i18n="features.label">A solução</div>
  <div class="section-title reveal" data-i18n="features.title">Tudo que seu pipeline de IA precisa.<br>Nada que não precisa.</div>

  <div class="features-grid reveal">
    <div class="feature-card">
      <div class="feature-icon">⚡</div>
      <div class="feature-title" data-i18n="f1.title">Structured Output Engine</div>
      <div class="feature-desc" data-i18n="f1.desc">Defina JSON schemas uma vez. Reliant garante que toda resposta do LLM bate — ou faz retry automaticamente com um prompt corrigido.</div>
    </div>
    <div class="feature-card">
      <div class="feature-icon">🔁</div>
      <div class="feature-title" data-i18n="f2.title">Retry Inteligente</div>
      <div class="feature-desc" data-i18n="f2.desc">Validação falhou? Reliant reescreve o prompt com os erros exatos, reduz a temperatura e tenta até 3x antes de usar o fallback seguro.</div>
    </div>
    <div class="feature-card">
      <div class="feature-icon">📊</div>
      <div class="feature-title" data-i18n="f3.title">Observabilidade Completa</div>
      <div class="feature-desc" data-i18n="f3.desc">Toda execução logada. Taxa de sucesso, latência, tokens e drift por schema. Saiba exatamente o que acontece em produção.</div>
    </div>
    <div class="feature-card">
      <div class="feature-icon">🔀</div>
      <div class="feature-title" data-i18n="f4.title">Provider Agnóstico</div>
      <div class="feature-desc" data-i18n="f4.desc">OpenAI, Anthropic, Gemini — uma API para tudo. Troque de provider sem mudar seu código de aplicação.</div>
    </div>
    <div class="feature-card">
      <div class="feature-icon">🛡️</div>
      <div class="feature-title" data-i18n="f5.title">Safe Fallbacks</div>
      <div class="feature-desc" data-i18n="f5.desc">Defina o que acontece quando todos os retries falham. Seu app continua rodando com uma resposta previsível e segura.</div>
    </div>
    <div class="feature-card">
      <div class="feature-icon">📋</div>
      <div class="feature-title" data-i18n="f6.title">Schema Registry</div>
      <div class="feature-desc" data-i18n="f6.desc">Versione seus contratos de output. Acompanhe mudanças. Nunca quebre compatibilidade retroativa por acidente.</div>
    </div>
  </div>
</section>

<hr class="divider">

<!-- HOW -->
<section id="how">
  <div class="section-label reveal" data-i18n="how.label">Como funciona</div>
  <div class="section-title reveal" data-i18n="how.title">Uma chamada de API.<br>Output garantido.</div>

  <div class="flow reveal">
    <div class="flow-step">
      <div class="flow-num">01</div>
      <div class="flow-title" data-i18n="how.1.title">Você chama o Reliant</div>
      <div class="flow-desc" data-i18n="how.1.desc">Envie seu prompt, schema ID e provedor escolhido. Um endpoint, qualquer LLM.</div>
    </div>
    <div class="flow-step">
      <div class="flow-num">02</div>
      <div class="flow-title" data-i18n="how.2.title">Reliant chama o LLM</div>
      <div class="flow-desc" data-i18n="how.2.desc">Com um system prompt otimizado que força a estrutura do seu schema automaticamente.</div>
    </div>
    <div class="flow-step">
      <div class="flow-num">03</div>
      <div class="flow-title" data-i18n="how.3.title">Output validado</div>
      <div class="flow-desc">
        <span class="flow-accent" data-i18n="how.3.valid">Válido?</span> <span data-i18n="how.3.return">Retorna imediatamente.</span><br>
        <span class="flow-red" data-i18n="how.3.invalid">Inválido?</span> <span data-i18n="how.3.retry">Reescreve prompt + retry.</span>
      </div>
    </div>
    <div class="flow-step">
      <div class="flow-num">04</div>
      <div class="flow-title" data-i18n="how.4.title">Tudo logado</div>
      <div class="flow-desc" data-i18n="how.4.desc">Cada tentativa, latência, tokens e erros registrados. Trilha de auditoria completa sempre disponível.</div>
    </div>
  </div>
</section>

<hr class="divider">

<!-- INSTALL -->
<div class="install-section">
  <div class="install-inner">
    <div>
      <div class="section-label" data-i18n="install.label">Comece em minutos</div>
      <div class="section-title" style="font-size:clamp(28px,3vw,40px)" data-i18n="install.title">Integre em<br>menos de 10 linhas.</div>
      <p style="color:var(--text-2); margin-top:16px; font-size:15px; font-weight:300;" data-i18n="install.sub">Sem configuração complexa. Sem lock-in. Self-host no Railway em minutos.</p>
      <div class="install-cmd" onclick="copyInstall()">
        <span class="prompt">$</span>
        npm install reliant-js
        <button class="copy-btn" id="copy-btn" data-i18n="install.copy">copiar</button>
      </div>
    </div>
    <div class="hero-code" style="margin:0; box-shadow:none;">
      <div class="code-bar">
        <div class="code-dot" style="background:#ff5f57"></div>
        <div class="code-dot" style="background:#ffbd2e"></div>
        <div class="code-dot" style="background:#28c941"></div>
        <span class="code-bar-title" data-i18n="install.steps">3 passos para produção</span>
      </div>
      <div class="code-body" style="font-size:12px;">
<span class="c-comment">// 1. Instale</span><br>
<span class="c-comment">// npm install reliant-js</span><br>
<br>
<span class="c-comment">// 2. Inicialize</span><br>
<span class="c-import">const</span> <span class="c-val">reliant</span> = <span class="c-import">new</span> <span class="c-fn">Reliant</span>({ <span class="c-key">apiKey</span>: <span class="c-str">'rel_...'</span> })<br>
<br>
<span class="c-comment">// 3. Execute com confiabilidade</span><br>
<span class="c-import">const</span> { <span class="c-val">output</span> } = <span class="c-import">await</span> reliant.<span class="c-fn">execute</span>({<br>
&nbsp;&nbsp;<span class="c-key">prompt</span>: yourPrompt,<br>
&nbsp;&nbsp;<span class="c-key">schemaId</span>: <span class="c-str">'seu-schema'</span>,<br>
&nbsp;&nbsp;<span class="c-key">provider</span>: <span class="c-str">'anthropic'</span>,<br>
&nbsp;&nbsp;<span class="c-key">model</span>: <span class="c-str">'claude-sonnet-4-20250514'</span>,<br>
})<br>
<br>
<span class="c-comment">// output é sempre válido. sempre.</span>
      </div>
    </div>
  </div>
</div>

<!-- METRICS -->
<section>
  <div class="section-label reveal" data-i18n="metrics.label">Feito para produção</div>
  <div class="section-title reveal" data-i18n="metrics.title">Números que importam.</div>
  <div class="metrics-row reveal">
    <div class="metric-card">
      <div class="metric-value">99%</div>
      <div class="metric-label" data-i18n="metrics.1">Taxa de sucesso</div>
    </div>
    <div class="metric-card">
      <div class="metric-value">3x</div>
      <div class="metric-label" data-i18n="metrics.2">Retries inteligentes</div>
    </div>
    <div class="metric-card">
      <div class="metric-value">&lt;50ms</div>
      <div class="metric-label" data-i18n="metrics.3">Overhead por chamada</div>
    </div>
    <div class="metric-card">
      <div class="metric-value">∞</div>
      <div class="metric-label" data-i18n="metrics.4">Provedores suportados</div>
    </div>
  </div>
</section>

<hr class="divider">

<!-- PRICING -->
<section id="pricing">
  <div class="section-label reveal" data-i18n="pricing.label">Preços</div>
  <div class="section-title reveal" data-i18n="pricing.title">Simples. Transparente.<br>Escale quando precisar.</div>

  <div class="pricing-grid reveal">
    <div class="pricing-card">
      <div class="pricing-name">Free</div>
      <div class="pricing-price">Grátis</div>
      <div class="pricing-period">para sempre</div>
      <ul class="pricing-features">
        <li >1.000 execuções/mês</li>
        <li >Dashboard completo</li>
        <li >JS + Python SDK</li>
        <li >Todos os providers</li>
        <li >Suporte comunidade</li>
        <li </li>
      </ul>
      <a href="/auth/signup" class="btn-ghost" style="width:100%; justify-content:center;">Deploy no Railway →</a>
    </div>
    <div class="pricing-card featured">
      <div class="pricing-badge" data-i18n="pricing.pro.badge">Mais popular</div>
      <div class="pricing-name">Pro</div>
      <div class="pricing-price">$29<span style="font-size:20px; color:var(--text-2)">/mês</span></div>
      <div class="pricing-period" >por projeto · cloud</div>
      <ul class="pricing-features">
        <li >250.000 execuções/mês</li>
        <li >Todos os providers</li>
        <li >Alertas de falha</li>
        <li >Logs 60 dias</li>
        <li >Suporte prioritário</li>
        <li >SLA 99.9%</li>
        <li>SLA 99.9%</li>
      </ul>
      <a href="mailto:hello@reliant.dev" class="btn-primary" style="width:100%; justify-content:center;" data-i18n="pricing.pro.cta">Acesso antecipado →</a>
    </div>
    <div class="pricing-card">
      <div class="pricing-name">Enterprise</div>
      <div class="pricing-price" data-i18n="pricing.ent">Sob consulta</div>
      <div class="pricing-period" data-i18n="pricing.ent.period">volume · on-premise disponível</div>
      <ul class="pricing-features">
        <li data-i18n="pricing.ent.1">Tudo ilimitado</li>
        <li data-i18n="pricing.ent.2">Projetos ilimitados</li>
        <li data-i18n="pricing.ent.3">Guardrails customizados</li>
        <li>SSO + RBAC</li>
        <li data-i18n="pricing.ent.4">Deploy on-premise</li>
        <li data-i18n="pricing.ent.5">Suporte dedicado</li>
        <li>SLA customizado</li>
      </ul>
      <a href="mailto:hello@reliant.dev" class="btn-ghost" style="width:100%; justify-content:center;" data-i18n="pricing.ent.cta">Fale conosco →</a>
    </div>
  </div>
</section>

<!-- CTA -->
<div class="cta-section">
  <div class="cta-glow"></div>
  <div class="cta-title reveal" data-i18n="cta.title">Pare de babysitting<br>seus outputs de LLM.</div>
  <p class="cta-sub reveal" data-i18n="cta.sub">Comece com o plano gratuito. Self-host em minutos. Escale quando precisar.</p>
  <div class="reveal" style="display:flex; gap:16px; justify-content:center;">
    <a href="/auth/signup" class="btn-primary" data-i18n="cta.cta1">Começar de graça →</a>
    <a href="mailto:hello@reliant.dev" class="btn-ghost" data-i18n="cta.cta2">Fale conosco</a>
  </div>
</div>

<!-- FOOTER -->
<footer>
  <div class="footer-logo">
    <div class="nav-logo-mark" style="width:24px;height:24px;font-size:11px;">R</div>
    <span data-i18n="footer.text">Reliant · A camada de confiabilidade para produtos com LLM</span>
  </div>
  <div class="footer-links">
    <a href="https://github.com/celeirosoftwares/reliant" target="_blank">GitHub</a>
    <a href="https://www.npmjs.com/package/reliant-js" target="_blank">npm</a>
    <a href="mailto:hello@reliant.dev" data-i18n="footer.contact">Contato</a>
  </div>
</footer>

<script>
// TRANSLATIONS
const i18n = {
  pt: {
    'nav.features': 'Funcionalidades',
    'nav.how': 'Como funciona',
    'nav.pricing': 'Preços',
    'nav.cta': 'Começar →',
    'hero.badge': 'Disponível agora — reliant-js v1.0.0',
    'hero.title1': 'Seu pipeline de IA,',
    'hero.title2': 'finalmente confiável.',
    'hero.sub': 'Reliant fica entre seu app e qualquer LLM. Outputs estruturados garantidos, retry inteligente e observabilidade completa — para seus pipelines de IA funcionarem em produção.',
    'hero.cta1': 'Começar a construir →',
    'hero.cta2': 'Ver como funciona',
    'logos.label': 'Compatível com qualquer provedor de LLM',
    'logos.any': 'Qualquer API de LLM',
    'problem.label': 'O problema',
    'problem.title': 'LLMs quebram pipelines.\\nTodo dia.',
    'problem.sub': 'JSON que não parseia. Schemas que falham na validação. Zero visibilidade do que deu errado.',
    'problem.1.title': 'JSON malformado derruba seu app',
    'problem.1.desc': 'LLMs retornam texto válido mas JSON inválido. Uma resposta ruim quebra o pipeline inteiro.',
    'problem.2.title': 'Retry manual é frágil',
    'problem.2.desc': 'Devs escrevem lógica de retry customizada em cada projeto. É inconsistente e sem testes.',
    'problem.3.title': 'Zero visibilidade em produção',
    'problem.3.desc': 'Você não sabe quais schemas falham mais, quando drift acontece, ou por que os outputs mudam.',
    'problem.4.title': 'Provedores se comportam diferente',
    'problem.4.desc': 'OpenAI, Anthropic e Gemini tratam outputs estruturados de formas diferentes. Cross-provider é um pesadelo.',
    'features.label': 'A solução',
    'features.title': 'Tudo que seu pipeline de IA precisa.\\nNada que não precisa.',
    'f1.title': 'Structured Output Engine',
    'f1.desc': 'Defina JSON schemas uma vez. Reliant garante que toda resposta do LLM bate — ou faz retry automaticamente com um prompt corrigido.',
    'f2.title': 'Retry Inteligente',
    'f2.desc': 'Validação falhou? Reliant reescreve o prompt com os erros exatos, reduz a temperatura e tenta até 3x antes de usar o fallback seguro.',
    'f3.title': 'Observabilidade Completa',
    'f3.desc': 'Toda execução logada. Taxa de sucesso, latência, tokens e drift por schema. Saiba exatamente o que acontece em produção.',
    'f4.title': 'Provider Agnóstico',
    'f4.desc': 'OpenAI, Anthropic, Gemini — uma API para tudo. Troque de provider sem mudar seu código de aplicação.',
    'f5.title': 'Safe Fallbacks',
    'f5.desc': 'Defina o que acontece quando todos os retries falham. Seu app continua rodando com uma resposta previsível e segura.',
    'f6.title': 'Schema Registry',
    'f6.desc': 'Versione seus contratos de output. Acompanhe mudanças. Nunca quebre compatibilidade retroativa por acidente.',
    'how.label': 'Como funciona',
    'how.title': 'Uma chamada de API.\\nOutput garantido.',
    'how.1.title': 'Você chama o Reliant',
    'how.1.desc': 'Envie seu prompt, schema ID e provedor escolhido. Um endpoint, qualquer LLM.',
    'how.2.title': 'Reliant chama o LLM',
    'how.2.desc': 'Com um system prompt otimizado que força a estrutura do seu schema automaticamente.',
    'how.3.title': 'Output validado',
    'how.3.valid': 'Válido?',
    'how.3.return': 'Retorna imediatamente.',
    'how.3.invalid': 'Inválido?',
    'how.3.retry': 'Reescreve prompt + retry.',
    'how.4.title': 'Tudo logado',
    'how.4.desc': 'Cada tentativa, latência, tokens e erros registrados. Trilha de auditoria completa sempre disponível.',
    'install.label': 'Comece em minutos',
    'install.title': 'Integre em\\nmenos de 10 linhas.',
    'install.sub': 'Sem configuração complexa. Sem lock-in. Self-host no Railway em minutos.',
    'install.copy': 'copiar',
    'install.steps': '3 passos para produção',
    'metrics.label': 'Feito para produção',
    'metrics.title': 'Números que importam.',
    'metrics.1': 'Taxa de sucesso',
    'metrics.2': 'Retries inteligentes',
    'metrics.3': 'Overhead por chamada',
    'metrics.4': 'Provedores suportados',
    'pricing.label': 'Preços',
    'pricing.title': 'Simples. Transparente.\\nEscale quando precisar.',
    'pricing.free': 'Grátis',
    'pricing.free.period': 'para sempre · self-hosted',
    'pricing.free.1': 'Até 1.000 execuções/mês',
    'pricing.free.2': '1 projeto',
    'pricing.free.3': 'Dashboard completo',
    'pricing.free.4': 'SDKs JS + Python',
    'pricing.free.5': 'Suporte OpenAI + Anthropic',
    'pricing.free.6': 'Suporte comunidade',
    'pricing.free.cta': 'Deploy no Railway →',
    'pricing.pro.badge': 'Mais popular',
    'pricing.pro.period': 'por projeto · cloud gerenciado',
    'pricing.pro.1': 'Execuções ilimitadas',
    'pricing.pro.2': '5 projetos',
    'pricing.pro.3': 'Observabilidade + alertas',
    'pricing.pro.4': 'Todos os provedores',
    'pricing.pro.5': 'Fallback multi-modelo',
    'pricing.pro.6': 'Suporte prioritário',
    'pricing.pro.cta': 'Acesso antecipado →',
    'pricing.ent': 'Sob consulta',
    'pricing.ent.period': 'volume · on-premise disponível',
    'pricing.ent.1': 'Tudo ilimitado',
    'pricing.ent.2': 'Projetos ilimitados',
    'pricing.ent.3': 'Guardrails customizados',
    'pricing.ent.4': 'Deploy on-premise',
    'pricing.ent.5': 'Suporte dedicado',
    'pricing.ent.cta': 'Fale conosco →',
    'cta.title': 'Pare de babysitting\\nseus outputs de LLM.',
    'cta.sub': 'Comece com o plano gratuito. Self-host em minutos. Escale quando precisar.',
    'cta.cta1': 'Começar de graça →',
    'cta.cta2': 'Fale conosco',
    'footer.text': 'Reliant · A camada de confiabilidade para produtos com LLM',
    'footer.contact': 'Contato',
  },
  en: {
    'nav.features': 'Features',
    'nav.how': 'How it works',
    'nav.pricing': 'Pricing',
    'nav.cta': 'Get started →',
    'hero.badge': 'Now available — reliant-js v1.0.0',
    'hero.title1': 'Your LLM pipeline,',
    'hero.title2': 'finally reliable.',
    'hero.sub': 'Reliant sits between your app and any LLM. Guaranteed structured outputs, intelligent retry, and full observability — so your AI pipelines work in production.',
    'hero.cta1': 'Start building →',
    'hero.cta2': 'See how it works',
    'logos.label': 'Works with any LLM provider',
    'logos.any': 'Any LLM API',
    'problem.label': 'The problem',
    'problem.title': 'LLMs break pipelines.\\nEvery day.',
    'problem.sub': 'JSON that doesn\\'t parse. Schemas that fail validation. Zero visibility into what went wrong.',
    'problem.1.title': 'Malformed JSON crashes your app',
    'problem.1.desc': 'LLMs return valid text but invalid JSON. One bad response breaks the entire pipeline.',
    'problem.2.title': 'Manual retry is fragile',
    'problem.2.desc': 'Developers write custom retry logic for every project. It\\'s inconsistent and untested.',
    'problem.3.title': 'Zero visibility in production',
    'problem.3.desc': 'You don\\'t know which schemas fail most, when drift happens, or why outputs change over time.',
    'problem.4.title': 'Providers behave differently',
    'problem.4.desc': 'OpenAI, Anthropic and Gemini handle structured outputs differently. Cross-provider is a nightmare.',
    'features.label': 'The solution',
    'features.title': 'Everything your LLM pipeline needs.\\nNothing it doesn\\'t.',
    'f1.title': 'Structured Output Engine',
    'f1.desc': 'Define JSON schemas once. Reliant guarantees every LLM response matches — or retries automatically with a corrected prompt.',
    'f2.title': 'Intelligent Retry',
    'f2.desc': 'Failed validation? Reliant rewrites the prompt with the exact errors, reduces temperature, and retries up to 3x before falling back safely.',
    'f3.title': 'Full Observability',
    'f3.desc': 'Every execution logged. Success rates, latency, tokens, and drift tracked per schema. Know exactly what\\'s happening in production.',
    'f4.title': 'Provider Agnostic',
    'f4.desc': 'OpenAI, Anthropic, Gemini — one API to rule them all. Switch providers without changing your application code.',
    'f5.title': 'Safe Fallbacks',
    'f5.desc': 'Define what happens when all retries fail. Your app keeps running with a predictable, safe response instead of crashing.',
    'f6.title': 'Schema Registry',
    'f6.desc': 'Version your output contracts. Track changes over time. Never break backward compatibility by accident.',
    'how.label': 'How it works',
    'how.title': 'One API call.\\nGuaranteed output.',
    'how.1.title': 'You call Reliant',
    'how.1.desc': 'Send your prompt, schema ID, and chosen provider. One endpoint, any LLM.',
    'how.2.title': 'Reliant calls the LLM',
    'how.2.desc': 'With an optimized system prompt that enforces your schema structure automatically.',
    'how.3.title': 'Output validated',
    'how.3.valid': 'Valid?',
    'how.3.return': 'Return immediately.',
    'how.3.invalid': 'Invalid?',
    'how.3.retry': 'Rewrite prompt + retry.',
    'how.4.title': 'Everything logged',
    'how.4.desc': 'Every attempt, latency, tokens, and errors recorded. Full audit trail always available.',
    'install.label': 'Get started in minutes',
    'install.title': 'Integrate in\\nunder 10 lines.',
    'install.sub': 'No complex setup. No vendor lock-in. Self-host on Railway in minutes.',
    'install.copy': 'copy',
    'install.steps': '3 steps to production',
    'metrics.label': 'Built for production',
    'metrics.title': 'Numbers that matter.',
    'metrics.1': 'Output success rate',
    'metrics.2': 'Intelligent retries',
    'metrics.3': 'Overhead per call',
    'metrics.4': 'Providers supported',
    'pricing.label': 'Pricing',
    'pricing.title': 'Simple. Transparent.\\nScale when you\\'re ready.',
    'pricing.free': 'Free',
    'pricing.free.period': 'forever · self-hosted',
    'pricing.free.1': 'Up to 1,000 executions/mo',
    'pricing.free.2': '1 project',
    'pricing.free.3': 'Full observability dashboard',
    'pricing.free.4': 'JS + Python SDKs',
    'pricing.free.5': 'OpenAI + Anthropic support',
    'pricing.free.6': 'Community support',
    'pricing.free.cta': 'Deploy on Railway →',
    'pricing.pro.badge': 'Most popular',
    'pricing.pro.period': 'per project · managed cloud',
    'pricing.pro.1': 'Unlimited executions',
    'pricing.pro.2': '5 projects',
    'pricing.pro.3': 'Observability + alerts',
    'pricing.pro.4': 'All providers',
    'pricing.pro.5': 'Multi-model fallback',
    'pricing.pro.6': 'Priority support',
    'pricing.pro.cta': 'Get early access →',
    'pricing.ent': 'Custom',
    'pricing.ent.period': 'volume · on-premise available',
    'pricing.ent.1': 'Unlimited everything',
    'pricing.ent.2': 'Unlimited projects',
    'pricing.ent.3': 'Custom guardrails',
    'pricing.ent.4': 'On-premise deployment',
    'pricing.ent.5': 'Dedicated support',
    'pricing.ent.cta': 'Talk to us →',
    'cta.title': 'Stop babysitting\\nyour LLM outputs.',
    'cta.sub': 'Start with the free tier. Self-host in minutes. Scale when you need to.',
    'cta.cta1': 'Start building for free →',
    'cta.cta2': 'Talk to us',
    'footer.text': 'Reliant · The reliability layer for LLM-powered products',
    'footer.contact': 'Contact',
  }
}

let currentLang = 'pt'

function setLang(lang) {
  currentLang = lang
  document.documentElement.lang = lang

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')
    if (i18n[lang][key]) {
      el.textContent = i18n[lang][key]
    }
  })

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === lang.toUpperCase())
  })

  // Sync mobile menu i18n links
  document.querySelectorAll('.mobile-menu [data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')
    if (i18n[lang][key]) el.textContent = i18n[lang][key]
  })

  document.title = lang === 'pt'
    ? 'Reliant — A Camada de Confiabilidade para Produtos com LLM'
    : 'Reliant — The Reliability Layer for LLM-Powered Products'

  localStorage.setItem('reliant_lang', lang)
}

// Restore saved lang
const saved = localStorage.getItem('reliant_lang')
if (saved && saved !== 'pt') setLang(saved)

// Nav scroll
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 20)
})

// Reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80)
      observer.unobserve(entry.target)
    }
  })
}, { threshold: 0.1 })
document.querySelectorAll('.reveal').forEach(el => observer.observe(el))

// Copy
function copyInstall() {
  navigator.clipboard.writeText('npm install reliant-js')
  const btn = document.getElementById('copy-btn')
  btn.textContent = currentLang === 'pt' ? 'copiado!' : 'copied!'
  btn.style.color = 'var(--accent)'
  setTimeout(() => {
    btn.textContent = currentLang === 'pt' ? 'copiar' : 'copy'
    btn.style.color = ''
  }, 2000)
}
</script>` }} />
    </>
  )
}
