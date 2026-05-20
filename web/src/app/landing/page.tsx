// @ts-nocheck
'use client'
import { useEffect } from 'react'

export default function LandingEnPage() {
  useEffect(() => {
    // Google Tag Manager
    const gtmScript = document.createElement('script')
    gtmScript.innerHTML = `!function(){"use strict";function l(e){for(var t=e,r=0,n=document.cookie.split(";");r<n.length;r++){var o=n[r].split("=");if(o[0].trim()===t)return o[1]}}function s(e){return localStorage.getItem(e)}function u(e){return window[e]}function A(e,t){e=document.querySelector(e);return t?null==e?void 0:e.getAttribute(t):null==e?void 0:e.textContent}var e=window,t=document,r="script",n="dataLayer",o="https://api.celeirosw.com.br",a="https://load.api.celeirosw.com.br",i="1vttqsinnu",c="316k=HApTLic8WSMkNlktNSkwUgNTXEdCVxAaSA0LBRYYBhsGGUAKHBxaFgc%3D",g="stapeUserId",v="",E="",d=!1;try{var d=!!g&&(m=navigator.userAgent,!!(m=new RegExp("Version/([0-9._]+)(.Mobile)?.*Safari.").exec(m)))&&16.4<=parseFloat(m[1]),f="stapeUserId"===g,I=d&&!f?function(e,t,r){void 0===t&&(t="");var n={cookie:l,localStorage:s,jsVariable:u,cssSelector:A},t=Array.isArray(t)?t:[t];if(e&&n[e])for(var o=n[e],a=0,i=t;a<i.length;a++){var c=i[a],c=r?o(c,r):o(c);if(c)return c}else console.warn("invalid uid source",e)}(g,v,E):void 0;d=d&&(!!I||f)}catch(e){console.error(e)}var m=e,g=(m[n]=m[n]||[],m[n].push({"gtm.start":(new Date).getTime(),event:"gtm.js"}),t.getElementsByTagName(r)[0]),v=I?"&bi="+encodeURIComponent(I):"",E=t.createElement(r),f=(d&&(i=8<i.length?i.replace(/([a-z]{8}$)/,"kp$1"):"kp"+i),!d&&a?a:o);E.async=!0,E.src=f+"/"+i+".js?"+c+v,null!=(e=g.parentNode)&&e.insertBefore(E,g)}();`
    document.head.insertBefore(gtmScript, document.head.firstChild)
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
    :root {
      --bg: #030604;
      --bg-2: #071008;
      --panel: rgba(11, 22, 13, .78);
      --panel-2: rgba(15, 26, 18, .94);
      --border: rgba(139, 255, 68, .18);
      --border-2: rgba(255,255,255,.09);
      --text: #f6f7f4;
      --muted: #a9b0a6;
      --muted-2: #747d72;
      --green: #84f542;
      --green-2: #a7ff6c;
      --green-dim: rgba(132,245,66,.13);
      --red: #ff563f;
      --red-dim: rgba(255,86,63,.13);
      --yellow: #f6ce4f;
      --shadow: 0 30px 90px rgba(0,0,0,.54);
      --mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      --sans: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: var(--sans);
      background:
        radial-gradient(circle at 75% 0%, rgba(132,245,66,.16), transparent 34%),
        radial-gradient(circle at 4% 18%, rgba(132,245,66,.08), transparent 24%),
        linear-gradient(180deg, #030604 0%, #030604 44%, #050807 100%);
      color: var(--text);
      line-height: 1.55;
      overflow-x: hidden;
    }
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
      background-size: 64px 64px;
      mask-image: radial-gradient(circle at center, black, transparent 78%);
      pointer-events: none;
      z-index: -1;
    }
    a { color: inherit; text-decoration: none; }
    .container { width: min(1180px, calc(100% - 40px)); margin: 0 auto; }

    .nav {
      position: sticky;
      top: 0;
      z-index: 50;
      border-bottom: 1px solid rgba(255,255,255,.06);
      background: rgba(3,6,4,.78);
      backdrop-filter: blur(18px);
    }
    .nav-inner {
      height: 76px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 22px;
    }
    .brand { display: flex; align-items: center; gap: 11px; font-weight: 850; letter-spacing: -.03em; font-size: 21px; }
    .brand-mark {
      width: 36px; height: 36px;
      display: grid; place-items: center;
      border-radius: 10px;
      color: #061004;
      font-weight: 950;
      background: linear-gradient(135deg, var(--green), #58d91e);
      box-shadow: 0 0 34px rgba(132,245,66,.28);
    }
    .nav-links { display: flex; align-items: center; gap: 23px; color: var(--muted); font-size: 14px; font-weight: 600; }
    .nav-links a:hover { color: var(--text); }
    .nav-actions { display: flex; align-items: center; gap: 12px; }
    .lang-switch { display: flex; align-items: center; gap: 4px; padding: 4px; border: 1px solid var(--border-2); border-radius: 999px; background: rgba(255,255,255,.035); }
    .lang-switch button {
      border: 0; background: transparent; color: var(--muted); font: 700 12px var(--mono); padding: 8px 10px; border-radius: 999px; cursor: pointer;
    }
    .lang-switch button.active { background: var(--green); color: #071005; }
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 9px;
      min-height: 46px;
      padding: 0 18px;
      border-radius: 12px;
      border: 1px solid var(--border-2);
      font-weight: 800;
      font-size: 14px;
      transition: .2s ease;
      cursor: pointer;
      white-space: nowrap;
    }
    .btn-primary { color: #061004; background: linear-gradient(135deg, var(--green), #62dc2b); border-color: transparent; box-shadow: 0 16px 40px rgba(132,245,66,.21); }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 20px 50px rgba(132,245,66,.27); }
    .btn-secondary { background: rgba(255,255,255,.04); color: var(--text); }
    .btn-secondary:hover { border-color: rgba(132,245,66,.45); background: rgba(132,245,66,.06); }

    .hero { padding: 92px 0 68px; position: relative; }
    .hero-grid { display: grid; grid-template-columns: 1.02fr .98fr; gap: 54px; align-items: center; }
    .eyebrow {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 9px 13px;
      background: var(--green-dim);
      border: 1px solid var(--border);
      color: var(--green-2);
      border-radius: 999px;
      font: 700 12px var(--mono);
      margin-bottom: 26px;
      box-shadow: inset 0 0 24px rgba(132,245,66,.04);
    }
    .pulse { width: 8px; height: 8px; border-radius: 99px; background: var(--green); box-shadow: 0 0 18px var(--green); }
    h1 {
      font-size: clamp(46px, 6.2vw, 82px);
      line-height: .95;
      letter-spacing: -.075em;
      font-weight: 920;
      margin-bottom: 24px;
    }
    .gradient-word { color: var(--green); text-shadow: 0 0 24px rgba(132,245,66,.18); }
    .hero-sub { max-width: 650px; font-size: clamp(18px, 2vw, 21px); color: var(--muted); margin-bottom: 30px; }
    .hero-actions { display: flex; flex-wrap: wrap; gap: 14px; margin-bottom: 21px; }
    .trust-line { color: var(--muted-2); font-size: 14px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
    .trust-line span { color: var(--green-2); }

    .hero-card {
      position: relative;
      border: 1px solid var(--border);
      border-radius: 26px;
      background: linear-gradient(180deg, rgba(17,34,21,.76), rgba(5,9,6,.92));
      box-shadow: var(--shadow), inset 0 0 0 1px rgba(255,255,255,.035);
      overflow: hidden;
    }
    .hero-card::before { content:""; position:absolute; inset:-1px; background: radial-gradient(circle at 50% 0%, rgba(132,245,66,.22), transparent 43%); pointer-events:none; }
    .card-top { height: 48px; display: flex; align-items: center; gap: 9px; padding: 0 18px; border-bottom: 1px solid rgba(255,255,255,.07); color: var(--muted); font: 700 12px var(--mono); position: relative; }
    .dot { width: 11px; height: 11px; border-radius: 50%; background: #ff5f57; box-shadow: 17px 0 #ffbd2e, 34px 0 #28c840; margin-right: 42px; }
    .code { padding: 24px; font: 500 13px/1.85 var(--mono); color: #dce6d8; position: relative; overflow-x: auto; }
    .code .muted { color: #6d766a; }
    .code .key { color: var(--green-2); }
    .code .str { color: #e1f6d6; }
    .code .fn { color: #f1cc67; }
    .timeline { margin: 0 24px 24px; border: 1px solid rgba(255,255,255,.08); border-radius: 18px; overflow: hidden; background: rgba(0,0,0,.19); position: relative; }
    .event { display: grid; grid-template-columns: 24px 1fr auto; gap: 11px; padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,.06); align-items: center; }
    .event:last-child { border-bottom: 0; }
    .status { width: 13px; height: 13px; border-radius: 99px; background: var(--red); box-shadow: 0 0 14px rgba(255,86,63,.4); }
    .status.ok { background: var(--green); box-shadow: 0 0 14px rgba(132,245,66,.4); }
    .event strong { font-size: 13px; }
    .event p { color: var(--muted-2); font-size: 12px; margin-top: 1px; }
    .pill { border: 1px solid rgba(255,255,255,.08); border-radius: 999px; padding: 5px 8px; color: var(--muted); font: 700 10px var(--mono); }
    .pill.red { color: #ff8b7b; border-color: rgba(255,86,63,.28); background: var(--red-dim); }
    .pill.green { color: var(--green-2); border-color: rgba(132,245,66,.28); background: var(--green-dim); }

    section { padding: 82px 0; border-top: 1px solid rgba(255,255,255,.06); }
    .section-head { max-width: 760px; margin-bottom: 38px; }
    .label { color: var(--green-2); font: 800 12px var(--mono); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 13px; }
    h2 { font-size: clamp(32px, 4vw, 56px); line-height: 1.03; letter-spacing: -.055em; font-weight: 900; margin-bottom: 17px; }
    .section-copy { color: var(--muted); font-size: 18px; max-width: 790px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
    .feature, .pain, .price, .use, .faq, .compare-cell {
      border: 1px solid var(--border-2);
      border-radius: 22px;
      background: linear-gradient(180deg, rgba(255,255,255,.045), rgba(255,255,255,.018));
      padding: 22px;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,.01);
    }
    .pain { min-height: 182px; }
    .icon { width: 42px; height: 42px; border-radius: 13px; display: grid; place-items: center; margin-bottom: 16px; color: var(--green); background: var(--green-dim); border: 1px solid var(--border); font-size: 21px; }
    .red-icon { color: var(--red); background: var(--red-dim); border-color: rgba(255,86,63,.22); }
    h3 { font-size: 20px; line-height: 1.16; letter-spacing: -.025em; margin-bottom: 10px; }
    .card-copy { color: var(--muted); font-size: 14px; }

    .contrast { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
    .compare-col { border: 1px solid var(--border-2); border-radius: 24px; overflow: hidden; background: rgba(255,255,255,.03); }
    .compare-col h3 { padding: 20px 22px; border-bottom: 1px solid rgba(255,255,255,.07); margin: 0; }
    .compare-col ul { list-style: none; }
    .compare-col li { padding: 16px 22px; border-bottom: 1px solid rgba(255,255,255,.055); color: var(--muted); display: flex; gap: 12px; }
    .compare-col li:last-child { border-bottom: 0; }
    .x { color: var(--red); font-weight: 900; }
    .check { color: var(--green); font-weight: 900; }

    .steps { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; }
    .step { border: 1px solid var(--border-2); border-radius: 18px; padding: 18px; background: rgba(255,255,255,.025); min-height: 190px; }
    .step-num { font: 900 12px var(--mono); color: var(--green); margin-bottom: 18px; }
    .step h3 { font-size: 17px; }

    .positioning { border: 1px solid var(--border); border-radius: 28px; background: linear-gradient(135deg, rgba(132,245,66,.08), rgba(255,255,255,.025)); padding: 28px; }
    .positioning-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px; margin-top: 22px; }
    .positioning-grid .compare-cell h3 { font-size: 16px; }

    .dev-section { display: grid; grid-template-columns: .9fr 1.1fr; gap: 36px; align-items: center; }
    .terminal { border: 1px solid var(--border); border-radius: 24px; background: rgba(0,0,0,.42); overflow: hidden; box-shadow: var(--shadow); }
    .terminal pre { padding: 24px; font: 500 13px/1.8 var(--mono); color: #d7e2d3; overflow-x: auto; }
    .terminal .green { color: var(--green-2); }
    .terminal .dim { color: #707a6e; }

    .price { position: relative; overflow: hidden; }
    .price.featured { border-color: var(--border); background: linear-gradient(180deg, rgba(132,245,66,.105), rgba(255,255,255,.03)); }
    .tag { display: inline-flex; color: #061004; background: var(--green); border-radius: 999px; padding: 6px 10px; font: 900 10px var(--mono); margin-bottom: 15px; }
    .price-name { color: var(--muted); font-weight: 800; margin-bottom: 5px; }
    .price-value { font-size: 38px; line-height: 1; letter-spacing: -.05em; font-weight: 900; margin-bottom: 20px; }
    .price ul { list-style: none; display: grid; gap: 12px; margin: 24px 0; color: var(--muted); }
    .price li::before { content: "✓"; color: var(--green); font-weight: 900; margin-right: 9px; }

    .faq-list { display: grid; gap: 14px; }
    .faq h3 { font-size: 18px; }

    .final-cta { text-align: center; padding: 92px 0; }
    .final-cta h2 { max-width: 900px; margin: 0 auto 18px; }
    .final-cta p { max-width: 680px; margin: 0 auto 30px; color: var(--muted); font-size: 19px; }
    footer { border-top: 1px solid rgba(255,255,255,.07); padding: 30px 0; color: var(--muted-2); }
    .footer-inner { display: flex; justify-content: space-between; gap: 20px; align-items: center; flex-wrap: wrap; }
    .footer-links { display: flex; gap: 18px; color: var(--muted); }

    [data-lang-content] { opacity: 1; transition: opacity .16s ease; }
    body.switching [data-lang-content] { opacity: .12; }

    @media (max-width: 980px) {
      .nav-links { display: none; }
      .hero-grid, .dev-section, .grid-2, .contrast { grid-template-columns: 1fr; }
      .grid-4, .grid-3 { grid-template-columns: repeat(2, 1fr); }
      .steps { grid-template-columns: repeat(2, 1fr); }
      .positioning-grid { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 640px) {
      .container { width: min(100% - 28px, 1180px); }
      .nav-inner { height: auto; padding: 14px 0; align-items: flex-start; }
      .nav-actions { flex-direction: column; align-items: flex-end; }
      .hero { padding-top: 60px; }
      h1 { font-size: 44px; }
      .grid-4, .grid-3, .steps, .positioning-grid { grid-template-columns: 1fr; }
      .hero-actions { flex-direction: column; align-items: stretch; }
      .btn { width: 100%; }
      .brand span { display: none; }
    }
  ` }} />
      <div dangerouslySetInnerHTML={{ __html: `
  <nav class="nav">
    <div class="container nav-inner">
      <a href="#top" class="brand" aria-label="Reliant home">
        <img src="/logo-icon.png" width="32" height="32" style="border-radius:6px;display:block;" alt="Reliant" />
        <span>Reliant</span>
      </a>
      <div class="nav-links">
        <a href="#features" data-i18n="nav.features">Features</a>
        <a href="#how" data-i18n="nav.how">How it works</a>
        <a href="#pricing" data-i18n="nav.pricing">Pricing</a>
        <a href="#faq" data-i18n="nav.faq">FAQ</a>
        <a href="https://www.npmjs.com/package/reliant-js" target="_blank" rel="noreferrer">npm</a>
      </div>
      <div class="nav-actions">
        <div class="lang-switch" aria-label="Language selector">
          <button type="button" data-lang="en" class="active">EN</button>
          <button type="button" data-lang="pt">PT</button>
          <button type="button" data-lang="es">ES</button>
        </div>
        <a class="btn btn-primary" href="#pricing" data-i18n="nav.cta">Start free →</a>
      </div>
    </div>
  </nav>

  <main id="top">
    <section class="hero" style="border-top:0;">
      <div class="container hero-grid">
        <div>
          <div class="eyebrow"><span class="pulse"></span><span data-i18n="hero.badge">reliant-js v1.0.0 · production reliability for LLM outputs</span></div>
          <h1 data-i18n-html="hero.title">Ship LLM features without <span class="gradient-word">broken JSON</span>, manual retries, or blind debugging.</h1>
          <p class="hero-sub" data-i18n="hero.sub">Reliant sits between your app and any LLM to validate structured outputs, retry failed responses, apply safe fallbacks, and log every execution before bad data reaches production.</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#pricing" data-i18n="hero.primary">Start free</a>
            <a class="btn btn-secondary" href="#dev" data-i18n="hero.secondary">View docs</a>
          </div>
          <div class="trust-line" data-i18n-html="hero.trust">Self-host in minutes. <span>No vendor lock-in.</span> Works with OpenAI, Anthropic, Gemini, and any LLM API.</div>
        </div>
        <div class="hero-card" aria-label="Reliant code example">
          <div class="card-top"><div class="dot"></div>example.ts</div>
          <div class="code">
            <span class="muted">const</span> { output } = <span class="muted">await</span> reliant.<span class="fn">execute</span>({<br>
            &nbsp;&nbsp;<span class="key">prompt</span>,<br>
            &nbsp;&nbsp;<span class="key">schemaId</span>: <span class="str">'lead-qualification'</span>,<br>
            &nbsp;&nbsp;<span class="key">provider</span>: <span class="str">'anthropic'</span>,<br>
            &nbsp;&nbsp;<span class="key">model</span>: <span class="str">'claude-sonnet-4-20250514'</span><br>
            })<br><br>
            <span class="muted">// validated · retried if needed · logged</span>
          </div>
          <div class="timeline">
            <div class="event"><span class="status"></span><div><strong data-i18n="hero.event1.title">Attempt 1</strong><p data-i18n="hero.event1.copy">Schema validation failed</p></div><span class="pill red" data-i18n="hero.event1.pill">failed</span></div>
            <div class="event"><span class="status"></span><div><strong data-i18n="hero.event2.title">Attempt 2</strong><p data-i18n="hero.event2.copy">Corrected and retried</p></div><span class="pill red" data-i18n="hero.event2.pill">retry</span></div>
            <div class="event"><span class="status ok"></span><div><strong data-i18n="hero.event3.title">Output</strong><p data-i18n="hero.event3.copy">Validated before delivery</p></div><span class="pill green" data-i18n="hero.event3.pill">ok</span></div>
          </div>
        </div>
      </div>
    </section>

    <section id="problem">
      <div class="container">
        <div class="section-head">
          <div class="label" data-i18n="problem.label">The production gap</div>
          <h2 data-i18n="problem.title">LLMs do not only fail when they are wrong. They fail when they are almost right.</h2>
          <p class="section-copy" data-i18n="problem.copy">In a demo, a nearly valid response looks acceptable. In production, one missing field, renamed key, malformed JSON block, or unexpected structure can break a workflow, corrupt downstream data, or silently trigger the wrong action.</p>
        </div>
        <div class="grid-4">
          <div class="pain"><div class="icon red-icon">{}</div><h3 data-i18n="problem.card1.title">Almost-valid JSON</h3><p class="card-copy" data-i18n="problem.card1.copy">A response can look right to a human and still fail your parser.</p></div>
          <div class="pain"><div class="icon red-icon">↻</div><h3 data-i18n="problem.card2.title">Manual retry logic</h3><p class="card-copy" data-i18n="problem.card2.copy">Every project ends up with its own try/catch, sanitizer, reprompt, and fallback logic.</p></div>
          <div class="pain"><div class="icon red-icon">?</div><h3 data-i18n="problem.card3.title">No execution visibility</h3><p class="card-copy" data-i18n="problem.card3.copy">When the pipeline fails, it is hard to know whether the issue came from the prompt, model, provider, schema, retry, or downstream code.</p></div>
          <div class="pain"><div class="icon red-icon">⇄</div><h3 data-i18n="problem.card4.title">Provider inconsistency</h3><p class="card-copy" data-i18n="problem.card4.copy">OpenAI, Anthropic, Gemini, and other APIs do not behave exactly the same around structured responses.</p></div>
        </div>
      </div>
    </section>

    <section id="positioning">
      <div class="container positioning">
        <div class="section-head" style="margin-bottom:22px;">
          <div class="label" data-i18n="positioning.label">Why Reliant exists</div>
          <h2 data-i18n="positioning.title">Structured output is not the same as production reliability.</h2>
          <p class="section-copy" data-i18n="positioning.copy">Native structured output features are useful. They help models return data in a predictable format. But production systems need validation, retries, fallbacks, logs, and traces around every execution.</p>
        </div>
        <div class="contrast">
          <div class="compare-col">
            <h3 data-i18n="positioning.col1">Structured output</h3>
            <ul>
              <li><span class="check">✓</span><span data-i18n="positioning.s1">Helps format a model response</span></li>
              <li><span class="x">×</span><span data-i18n="positioning.s2">Depends on provider behavior</span></li>
              <li><span class="x">×</span><span data-i18n="positioning.s3">Does not explain every failure</span></li>
              <li><span class="x">×</span><span data-i18n="positioning.s4">Leaves retry logic to your app</span></li>
            </ul>
          </div>
          <div class="compare-col">
            <h3>Reliant</h3>
            <ul>
              <li><span class="check">✓</span><span data-i18n="positioning.r1">Validates the response before your app uses it</span></li>
              <li><span class="check">✓</span><span data-i18n="positioning.r2">Works across providers through one interface</span></li>
              <li><span class="check">✓</span><span data-i18n="positioning.r3">Logs attempts, errors, latency, model, schema, and output</span></li>
              <li><span class="check">✓</span><span data-i18n="positioning.r4">Retries with context from the validation error</span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section id="how">
      <div class="container">
        <div class="section-head">
          <div class="label" data-i18n="how.label">How it works</div>
          <h2 data-i18n="how.title">One API call. A reliable output contract.</h2>
        </div>
        <div class="steps">
          <div class="step"><div class="step-num">01</div><h3 data-i18n="how.step1.title">Define the schema</h3><p class="card-copy" data-i18n="how.step1.copy">Create the output contract your app expects.</p></div>
          <div class="step"><div class="step-num">02</div><h3 data-i18n="how.step2.title">Call any LLM</h3><p class="card-copy" data-i18n="how.step2.copy">Send the prompt, schema, model, and provider through a single interface.</p></div>
          <div class="step"><div class="step-num">03</div><h3 data-i18n="how.step3.title">Validate before delivery</h3><p class="card-copy" data-i18n="how.step3.copy">Reliant checks the response before returning it to your application.</p></div>
          <div class="step"><div class="step-num">04</div><h3 data-i18n="how.step4.title">Retry with context</h3><p class="card-copy" data-i18n="how.step4.copy">If validation fails, Reliant retries with the exact validation error.</p></div>
          <div class="step"><div class="step-num">05</div><h3 data-i18n="how.step5.title">Log the execution</h3><p class="card-copy" data-i18n="how.step5.copy">Every attempt is recorded with model, provider, latency, tokens, schema, error, and final output.</p></div>
          <div class="step"><div class="step-num">06</div><h3 data-i18n="how.step6.title">Fallback safely</h3><p class="card-copy" data-i18n="how.step6.copy">If retries fail, your app receives a predictable fallback instead of broken data.</p></div>
        </div>
      </div>
    </section>

    <section id="features">
      <div class="container">
        <div class="section-head">
          <div class="label" data-i18n="features.label">Features</div>
          <h2 data-i18n="features.title">Everything your LLM pipeline needs before production.</h2>
        </div>
        <div class="grid-3">
          <div class="feature"><div class="icon">✓</div><h3 data-i18n="features.f1.title">Schema validation</h3><p class="card-copy" data-i18n="features.f1.copy">Validate model responses against the exact contract your app expects.</p></div>
          <div class="feature"><div class="icon">↻</div><h3 data-i18n="features.f2.title">Intelligent retries</h3><p class="card-copy" data-i18n="features.f2.copy">Retry failed outputs with structured error context, not blind reprompting.</p></div>
          <div class="feature"><div class="icon">↳</div><h3 data-i18n="features.f3.title">Safe fallbacks</h3><p class="card-copy" data-i18n="features.f3.copy">Define what your app should receive when all retries fail.</p></div>
          <div class="feature"><div class="icon">▤</div><h3 data-i18n="features.f4.title">Execution logs</h3><p class="card-copy" data-i18n="features.f4.copy">Trace each attempt, model, provider, schema, error, latency, and output.</p></div>
          <div class="feature"><div class="icon">⇄</div><h3 data-i18n="features.f5.title">Provider-agnostic interface</h3><p class="card-copy" data-i18n="features.f5.copy">Use OpenAI, Anthropic, Gemini, or any LLM API without rewriting your pipeline.</p></div>
          <div class="feature"><div class="icon">⌘</div><h3 data-i18n="features.f6.title">Schema registry</h3><p class="card-copy" data-i18n="features.f6.copy">Version and manage output contracts as your product evolves.</p></div>
        </div>
      </div>
    </section>

    <section id="use-cases">
      <div class="container">
        <div class="section-head">
          <div class="label" data-i18n="use.label">Use cases</div>
          <h2 data-i18n="use.title">Built for workflows where LLM output becomes production data.</h2>
        </div>
        <div class="grid-3">
          <div class="use"><h3 data-i18n="use.u1.title">Data extraction</h3><p class="card-copy" data-i18n="use.u1.copy">Turn unstructured text into validated objects before writing to your database.</p></div>
          <div class="use"><h3 data-i18n="use.u2.title">Lead qualification</h3><p class="card-copy" data-i18n="use.u2.copy">Classify and route leads without relying on fragile free-form responses.</p></div>
          <div class="use"><h3 data-i18n="use.u3.title">AI agents</h3><p class="card-copy" data-i18n="use.u3.copy">Keep multi-step agent workflows from breaking because one response came back malformed.</p></div>
          <div class="use"><h3 data-i18n="use.u4.title">Internal automation</h3><p class="card-copy" data-i18n="use.u4.copy">Use LLMs in back-office workflows with safer outputs and traceable failures.</p></div>
          <div class="use"><h3 data-i18n="use.u5.title">SaaS AI features</h3><p class="card-copy" data-i18n="use.u5.copy">Ship AI-powered product features without leaving output reliability to custom code.</p></div>
          <div class="use"><h3 data-i18n="use.u6.title">CRM and operations</h3><p class="card-copy" data-i18n="use.u6.copy">Protect downstream systems from malformed classifications, summaries, or extracted fields.</p></div>
        </div>
      </div>
    </section>

    <section id="competitive">
      <div class="container">
        <div class="section-head">
          <div class="label" data-i18n="competitive.label">Positioning</div>
          <h2 data-i18n="competitive.title">Not another observability dashboard. Not just JSON mode.</h2>
          <p class="section-copy" data-i18n="competitive.copy">Reliant focuses on the point where LLM output becomes application logic. It sits in the execution path to validate, retry, fallback, and log before invalid data reaches your system.</p>
        </div>
        <div class="positioning-grid">
          <div class="compare-cell"><h3 data-i18n="competitive.c1.title">JSON mode</h3><p class="card-copy" data-i18n="competitive.c1.copy">Helps shape responses, but leaves validation, retry, fallback, and traces to your app.</p></div>
          <div class="compare-cell"><h3 data-i18n="competitive.c2.title">Observability tools</h3><p class="card-copy" data-i18n="competitive.c2.copy">Help inspect what happened, but usually do not prevent invalid output before delivery.</p></div>
          <div class="compare-cell"><h3 data-i18n="competitive.c3.title">Custom code</h3><p class="card-copy" data-i18n="competitive.c3.copy">Gives control, but creates repeated logic across every project and endpoint.</p></div>
          <div class="compare-cell"><h3>Reliant</h3><p class="card-copy" data-i18n="competitive.c4.copy">Runtime reliability for structured outputs before your app consumes the response.</p></div>
        </div>
      </div>
    </section>

    <section id="dev">
      <div class="container dev-section">
        <div>
          <div class="label" data-i18n="dev.label">Developer first</div>
          <h2 data-i18n="dev.title">Install it before your next parser bug.</h2>
          <p class="section-copy" data-i18n="dev.copy">Self-host or use managed cloud. Built for JavaScript and Python teams.</p>
          <div class="hero-actions" style="margin-top:24px; margin-bottom:0;"><a class="btn btn-primary" href="#pricing" data-i18n="dev.cta">Start free</a></div>
        </div>
        <div class="terminal">
          <div class="card-top"><div class="dot"></div>terminal</div>
          <pre><span class="green">$ npm install reliant-js</span>

<span class="dim">import</span> { Reliant } <span class="dim">from</span> <span class="green">'reliant-js'</span>

<span class="dim">const</span> reliant = <span class="dim">new</span> Reliant({
  apiKey: <span class="green">'rel_...'</span>,
})

<span class="dim">const</span> { output } = <span class="dim">await</span> reliant.execute({
  prompt: <span class="green">'Extract name, email, and buying intent'</span>,
  schemaId: <span class="green">'lead-intent'</span>,
  provider: <span class="green">'anthropic'</span>
})</pre>
        </div>
      </div>
    </section>

    <section id="pricing">
      <div class="container">
        <div class="section-head">
          <div class="label" data-i18n="pricing.label">Pricing</div>
          <h2 data-i18n="pricing.title">Start free. Scale when your LLM traffic becomes production-critical.</h2>
        </div>
        <div class="grid-3">
          <div class="price">
            <div class="price-name" data-i18n="pricing.free.name">Free</div>
            <div class="price-value" data-i18n="pricing.free.price">$0</div>
            <p class="card-copy" data-i18n="pricing.free.copy">For testing and small production workflows.</p>
            <ul><li data-i18n="pricing.free.li1">1,000 executions/month</li><li data-i18n="pricing.free.li2">Full dashboard</li><li data-i18n="pricing.free.li3">JavaScript + Python SDK</li><li data-i18n="pricing.free.li4">All providers</li><li data-i18n="pricing.free.li5">Self-host available</li></ul>
            <a class="btn btn-secondary" href="https://github.com/celeirosoftwares/reliant" target="_blank" rel="noreferrer" data-i18n="pricing.free.cta">Start free</a>
          </div>
          <div class="price featured">
            <div class="tag" data-i18n="pricing.pro.tag">Most popular</div>
            <div class="price-name" data-i18n="pricing.pro.name">Pro</div>
            <div class="price-value" data-i18n="pricing.pro.price">$29/mo</div>
            <p class="card-copy" data-i18n="pricing.pro.copy">For teams running LLM features in production.</p>
            <ul><li data-i18n="pricing.pro.li1">250,000 executions/month</li><li data-i18n="pricing.pro.li2">Failure alerts</li><li data-i18n="pricing.pro.li3">60-day logs</li><li data-i18n="pricing.pro.li4">All providers</li><li data-i18n="pricing.pro.li5">Priority support</li></ul>
            <a class="btn btn-primary" href="mailto:hello@reliant.dev" data-i18n="pricing.pro.cta">Get early access</a>
          </div>
          <div class="price">
            <div class="price-name" data-i18n="pricing.enterprise.name">Enterprise</div>
            <div class="price-value" data-i18n="pricing.enterprise.price">Custom</div>
            <p class="card-copy" data-i18n="pricing.enterprise.copy">For scale, compliance, and dedicated deployments.</p>
            <ul><li data-i18n="pricing.enterprise.li1">Custom volume</li><li data-i18n="pricing.enterprise.li2">Unlimited projects</li><li data-i18n="pricing.enterprise.li3">Custom guardrails</li><li data-i18n="pricing.enterprise.li4">SSO + RBAC</li><li data-i18n="pricing.enterprise.li5">On-premise deployment</li></ul>
            <a class="btn btn-secondary" href="mailto:hello@reliant.dev" data-i18n="pricing.enterprise.cta">Talk to us</a>
          </div>
        </div>
      </div>
    </section>

    <section id="faq">
      <div class="container">
        <div class="section-head">
          <div class="label">FAQ</div>
          <h2 data-i18n="faq.title">Questions technical teams ask before adopting Reliant.</h2>
        </div>
        <div class="faq-list">
          <div class="faq"><h3 data-i18n="faq.q1">Does Reliant replace OpenAI structured outputs, Anthropic tools, or Gemini schemas?</h3><p class="card-copy" data-i18n="faq.a1">No. Reliant uses provider capabilities when available and adds the operational layer around them: validation, retry, fallback, logs, and provider-agnostic execution.</p></div>
          <div class="faq"><h3 data-i18n="faq.q2">Why not just write this logic in my app?</h3><p class="card-copy" data-i18n="faq.a2">You can. Most teams do at first. Reliant exists because parser logic, retries, fallbacks, and trace context become repetitive and inconsistent across projects.</p></div>
          <div class="faq"><h3 data-i18n="faq.q3">Does it add latency?</h3><p class="card-copy" data-i18n="faq.a3">Validation and logging add minimal overhead. Retries add latency only when the model returns an invalid output.</p></div>
          <div class="faq"><h3 data-i18n="faq.q4">What happens when all retries fail?</h3><p class="card-copy" data-i18n="faq.a4">You define a fallback response, so your application receives a predictable result instead of malformed data or an unhandled exception.</p></div>
          <div class="faq"><h3 data-i18n="faq.q5">Who is Reliant for?</h3><p class="card-copy" data-i18n="faq.a5">Developers, technical founders, AI product teams, software houses, and SaaS teams shipping LLM-powered workflows into production.</p></div>
        </div>
      </div>
    </section>

    <section class="final-cta">
      <div class="container">
        <h2 data-i18n="final.title">Stop treating LLM output like text. Treat it like production data.</h2>
        <p data-i18n="final.copy">Validate it. Retry it. Log it. Fallback safely when it fails.</p>
        <div class="hero-actions" style="justify-content:center;"><a class="btn btn-primary" href="#pricing" data-i18n="final.cta1">Start free</a><a class="btn btn-secondary" href="#dev" data-i18n="final.cta2">View docs</a></div>
      </div>
    </section>
  </main>

  <footer>
    <div class="container footer-inner">
      <div class="brand" style="font-size:17px;"><img src="/logo-icon.png" width="28" height="28" style="border-radius:6px;display:block;" alt="Reliant" /><span data-i18n="footer.copy">Reliant · Production reliability for LLM outputs</span></div>
      <div class="footer-links"><a href="https://github.com/celeirosoftwares/reliant" target="_blank" rel="noreferrer">GitHub</a><a href="https://www.npmjs.com/package/reliant-js" target="_blank" rel="noreferrer">npm</a><a href="mailto:hello@reliant.dev" data-i18n="footer.contact">Contact</a></div>
    </div>
  </footer>

  <script>
    const translations = {
      en: {
        metaTitle: 'Reliant — Production reliability for LLM outputs',
        metaDescription: 'Reliant validates structured LLM outputs, retries failed responses, applies safe fallbacks, and logs every execution before bad data reaches production.',
        'nav.features': 'Features', 'nav.how': 'How it works', 'nav.pricing': 'Pricing', 'nav.faq': 'FAQ', 'nav.cta': 'Start free →',
        'hero.badge': 'reliant-js v1.0.0 · production reliability for LLM outputs',
        'hero.title': 'Ship LLM features without <span class="gradient-word">broken JSON</span>, manual retries, or blind debugging.',
        'hero.sub': 'Reliant sits between your app and any LLM to validate structured outputs, retry failed responses, apply safe fallbacks, and log every execution before bad data reaches production.',
        'hero.primary': 'Start free', 'hero.secondary': 'View docs',
        'hero.trust': 'Self-host in minutes. <span>No vendor lock-in.</span> Works with OpenAI, Anthropic, Gemini, and any LLM API.',
        'hero.event1.title': 'Attempt 1', 'hero.event1.copy': 'Schema validation failed', 'hero.event1.pill': 'failed',
        'hero.event2.title': 'Attempt 2', 'hero.event2.copy': 'Corrected and retried', 'hero.event2.pill': 'retry',
        'hero.event3.title': 'Output', 'hero.event3.copy': 'Validated before delivery', 'hero.event3.pill': 'ok',
        'problem.label': 'The production gap', 'problem.title': 'LLMs do not only fail when they are wrong. They fail when they are almost right.',
        'problem.copy': 'In a demo, a nearly valid response looks acceptable. In production, one missing field, renamed key, malformed JSON block, or unexpected structure can break a workflow, corrupt downstream data, or silently trigger the wrong action.',
        'problem.card1.title': 'Almost-valid JSON', 'problem.card1.copy': 'A response can look right to a human and still fail your parser.',
        'problem.card2.title': 'Manual retry logic', 'problem.card2.copy': 'Every project ends up with its own try/catch, sanitizer, reprompt, and fallback logic.',
        'problem.card3.title': 'No execution visibility', 'problem.card3.copy': 'When the pipeline fails, it is hard to know whether the issue came from the prompt, model, provider, schema, retry, or downstream code.',
        'problem.card4.title': 'Provider inconsistency', 'problem.card4.copy': 'OpenAI, Anthropic, Gemini, and other APIs do not behave exactly the same around structured responses.',
        'positioning.label': 'Why Reliant exists', 'positioning.title': 'Structured output is not the same as production reliability.',
        'positioning.copy': 'Native structured output features are useful. They help models return data in a predictable format. But production systems need validation, retries, fallbacks, logs, and traces around every execution.',
        'positioning.col1': 'Structured output', 'positioning.s1': 'Helps format a model response', 'positioning.s2': 'Depends on provider behavior', 'positioning.s3': 'Does not explain every failure', 'positioning.s4': 'Leaves retry logic to your app',
        'positioning.r1': 'Validates the response before your app uses it', 'positioning.r2': 'Works across providers through one interface', 'positioning.r3': 'Logs attempts, errors, latency, model, schema, and output', 'positioning.r4': 'Retries with context from the validation error',
        'how.label': 'How it works', 'how.title': 'One API call. A reliable output contract.',
        'how.step1.title': 'Define the schema', 'how.step1.copy': 'Create the output contract your app expects.',
        'how.step2.title': 'Call any LLM', 'how.step2.copy': 'Send the prompt, schema, model, and provider through a single interface.',
        'how.step3.title': 'Validate before delivery', 'how.step3.copy': 'Reliant checks the response before returning it to your application.',
        'how.step4.title': 'Retry with context', 'how.step4.copy': 'If validation fails, Reliant retries with the exact validation error.',
        'how.step5.title': 'Log the execution', 'how.step5.copy': 'Every attempt is recorded with model, provider, latency, tokens, schema, error, and final output.',
        'how.step6.title': 'Fallback safely', 'how.step6.copy': 'If retries fail, your app receives a predictable fallback instead of broken data.',
        'features.label': 'Features', 'features.title': 'Everything your LLM pipeline needs before production.',
        'features.f1.title': 'Schema validation', 'features.f1.copy': 'Validate model responses against the exact contract your app expects.',
        'features.f2.title': 'Intelligent retries', 'features.f2.copy': 'Retry failed outputs with structured error context, not blind reprompting.',
        'features.f3.title': 'Safe fallbacks', 'features.f3.copy': 'Define what your app should receive when all retries fail.',
        'features.f4.title': 'Execution logs', 'features.f4.copy': 'Trace each attempt, model, provider, schema, error, latency, and output.',
        'features.f5.title': 'Provider-agnostic interface', 'features.f5.copy': 'Use OpenAI, Anthropic, Gemini, or any LLM API without rewriting your pipeline.',
        'features.f6.title': 'Schema registry', 'features.f6.copy': 'Version and manage output contracts as your product evolves.',
        'use.label': 'Use cases', 'use.title': 'Built for workflows where LLM output becomes production data.',
        'use.u1.title': 'Data extraction', 'use.u1.copy': 'Turn unstructured text into validated objects before writing to your database.',
        'use.u2.title': 'Lead qualification', 'use.u2.copy': 'Classify and route leads without relying on fragile free-form responses.',
        'use.u3.title': 'AI agents', 'use.u3.copy': 'Keep multi-step agent workflows from breaking because one response came back malformed.',
        'use.u4.title': 'Internal automation', 'use.u4.copy': 'Use LLMs in back-office workflows with safer outputs and traceable failures.',
        'use.u5.title': 'SaaS AI features', 'use.u5.copy': 'Ship AI-powered product features without leaving output reliability to custom code.',
        'use.u6.title': 'CRM and operations', 'use.u6.copy': 'Protect downstream systems from malformed classifications, summaries, or extracted fields.',
        'competitive.label': 'Positioning', 'competitive.title': 'Not another observability dashboard. Not just JSON mode.',
        'competitive.copy': 'Reliant focuses on the point where LLM output becomes application logic. It sits in the execution path to validate, retry, fallback, and log before invalid data reaches your system.',
        'competitive.c1.title': 'JSON mode', 'competitive.c1.copy': 'Helps shape responses, but leaves validation, retry, fallback, and traces to your app.',
        'competitive.c2.title': 'Observability tools', 'competitive.c2.copy': 'Help inspect what happened, but usually do not prevent invalid output before delivery.',
        'competitive.c3.title': 'Custom code', 'competitive.c3.copy': 'Gives control, but creates repeated logic across every project and endpoint.',
        'competitive.c4.copy': 'Runtime reliability for structured outputs before your app consumes the response.',
        'dev.label': 'Developer first', 'dev.title': 'Install it before your next parser bug.', 'dev.copy': 'Self-host or use managed cloud. Built for JavaScript and Python teams.', 'dev.cta': 'Start free',
        'pricing.label': 'Pricing', 'pricing.title': 'Start free. Scale when your LLM traffic becomes production-critical.',
        'pricing.free.name': 'Free', 'pricing.free.price': '$0', 'pricing.free.copy': 'For testing and small production workflows.', 'pricing.free.li1': '1,000 executions/month', 'pricing.free.li2': 'Full dashboard', 'pricing.free.li3': 'JavaScript + Python SDK', 'pricing.free.li4': 'All providers', 'pricing.free.li5': 'Self-host available', 'pricing.free.cta': 'Start free',
        'pricing.pro.tag': 'Most popular', 'pricing.pro.name': 'Pro', 'pricing.pro.price': '$29/mo', 'pricing.pro.copy': 'For teams running LLM features in production.', 'pricing.pro.li1': '250,000 executions/month', 'pricing.pro.li2': 'Failure alerts', 'pricing.pro.li3': '60-day logs', 'pricing.pro.li4': 'All providers', 'pricing.pro.li5': 'Priority support', 'pricing.pro.cta': 'Get early access',
        'pricing.enterprise.name': 'Enterprise', 'pricing.enterprise.price': 'Custom', 'pricing.enterprise.copy': 'For scale, compliance, and dedicated deployments.', 'pricing.enterprise.li1': 'Custom volume', 'pricing.enterprise.li2': 'Unlimited projects', 'pricing.enterprise.li3': 'Custom guardrails', 'pricing.enterprise.li4': 'SSO + RBAC', 'pricing.enterprise.li5': 'On-premise deployment', 'pricing.enterprise.cta': 'Talk to us',
        'faq.title': 'Questions technical teams ask before adopting Reliant.',
        'faq.q1': 'Does Reliant replace OpenAI structured outputs, Anthropic tools, or Gemini schemas?', 'faq.a1': 'No. Reliant uses provider capabilities when available and adds the operational layer around them: validation, retry, fallback, logs, and provider-agnostic execution.',
        'faq.q2': 'Why not just write this logic in my app?', 'faq.a2': 'You can. Most teams do at first. Reliant exists because parser logic, retries, fallbacks, and trace context become repetitive and inconsistent across projects.',
        'faq.q3': 'Does it add latency?', 'faq.a3': 'Validation and logging add minimal overhead. Retries add latency only when the model returns an invalid output.',
        'faq.q4': 'What happens when all retries fail?', 'faq.a4': 'You define a fallback response, so your application receives a predictable result instead of malformed data or an unhandled exception.',
        'faq.q5': 'Who is Reliant for?', 'faq.a5': 'Developers, technical founders, AI product teams, software houses, and SaaS teams shipping LLM-powered workflows into production.',
        'final.title': 'Stop treating LLM output like text. Treat it like production data.', 'final.copy': 'Validate it. Retry it. Log it. Fallback safely when it fails.', 'final.cta1': 'Start free', 'final.cta2': 'View docs',
        'footer.copy': 'Reliant · Production reliability for LLM outputs', 'footer.contact': 'Contact'
      },
      pt: {
        metaTitle: 'Reliant — Confiabilidade de produção para outputs de LLM',
        metaDescription: 'A Reliant valida outputs estruturados de LLM, faz retry de respostas inválidas, aplica fallbacks seguros e registra cada execução antes que dados ruins cheguem à produção.',
        'nav.features': 'Funcionalidades', 'nav.how': 'Como funciona', 'nav.pricing': 'Preços', 'nav.faq': 'FAQ', 'nav.cta': 'Começar grátis →',
        'hero.badge': 'reliant-js v1.0.0 · confiabilidade de produção para outputs de LLM',
        'hero.title': 'Coloque features com LLM em produção sem <span class="gradient-word">JSON quebrado</span>, retry manual ou debug no escuro.',
        'hero.sub': 'A Reliant fica entre seu app e qualquer LLM para validar outputs estruturados, tentar novamente respostas inválidas, aplicar fallbacks seguros e registrar cada execução antes que dados ruins cheguem à produção.',
        'hero.primary': 'Começar grátis', 'hero.secondary': 'Ver docs',
        'hero.trust': 'Self-host em minutos. <span>Sem lock-in.</span> Compatível com OpenAI, Anthropic, Gemini e qualquer API de LLM.',
        'hero.event1.title': 'Tentativa 1', 'hero.event1.copy': 'Validação de schema falhou', 'hero.event1.pill': 'falhou',
        'hero.event2.title': 'Tentativa 2', 'hero.event2.copy': 'Corrigido e tentado novamente', 'hero.event2.pill': 'retry',
        'hero.event3.title': 'Output', 'hero.event3.copy': 'Validado antes da entrega', 'hero.event3.pill': 'ok',
        'problem.label': 'A lacuna da produção', 'problem.title': 'LLMs não falham só quando estão errados. Eles falham quando estão quase certos.',
        'problem.copy': 'Em um demo, uma resposta quase válida parece aceitável. Em produção, um campo ausente, chave renomeada, JSON malformado ou estrutura inesperada pode quebrar um fluxo, corromper dados ou acionar a ação errada em silêncio.',
        'problem.card1.title': 'JSON quase válido', 'problem.card1.copy': 'A resposta pode parecer certa para uma pessoa e ainda quebrar seu parser.',
        'problem.card2.title': 'Retry manual', 'problem.card2.copy': 'Todo projeto acaba com seu próprio try/catch, sanitizer, reprompt e fallback.',
        'problem.card3.title': 'Pouca visibilidade', 'problem.card3.copy': 'Quando o pipeline falha, é difícil saber se o erro veio do prompt, modelo, provider, schema, retry ou código downstream.',
        'problem.card4.title': 'Providers inconsistentes', 'problem.card4.copy': 'OpenAI, Anthropic, Gemini e outras APIs não se comportam igual em respostas estruturadas.',
        'positioning.label': 'Por que a Reliant existe', 'positioning.title': 'Structured output não é a mesma coisa que confiabilidade de produção.',
        'positioning.copy': 'Recursos nativos de structured output ajudam. Eles orientam modelos a retornar dados em formato previsível. Mas sistemas em produção precisam de validação, retries, fallbacks, logs e rastros em cada execução.',
        'positioning.col1': 'Structured output', 'positioning.s1': 'Ajuda a formatar a resposta do modelo', 'positioning.s2': 'Depende do comportamento do provider', 'positioning.s3': 'Não explica cada falha', 'positioning.s4': 'Deixa o retry para seu app',
        'positioning.r1': 'Valida a resposta antes do app usar', 'positioning.r2': 'Funciona entre providers por uma interface única', 'positioning.r3': 'Registra tentativas, erros, latência, modelo, schema e output', 'positioning.r4': 'Tenta novamente com contexto do erro de validação',
        'how.label': 'Como funciona', 'how.title': 'Uma chamada de API. Um contrato confiável de output.',
        'how.step1.title': 'Defina o schema', 'how.step1.copy': 'Crie o contrato de output que seu app espera.',
        'how.step2.title': 'Chame qualquer LLM', 'how.step2.copy': 'Envie prompt, schema, modelo e provider por uma interface única.',
        'how.step3.title': 'Valide antes de entregar', 'how.step3.copy': 'A Reliant checa a resposta antes de retornar para sua aplicação.',
        'how.step4.title': 'Retry com contexto', 'how.step4.copy': 'Se a validação falhar, a Reliant tenta novamente com o erro exato.',
        'how.step5.title': 'Registre a execução', 'how.step5.copy': 'Cada tentativa fica registrada com modelo, provider, latência, tokens, schema, erro e output final.',
        'how.step6.title': 'Fallback seguro', 'how.step6.copy': 'Se os retries falharem, seu app recebe uma resposta previsível em vez de dados quebrados.',
        'features.label': 'Funcionalidades', 'features.title': 'Tudo que seu pipeline de LLM precisa antes da produção.',
        'features.f1.title': 'Validação de schema', 'features.f1.copy': 'Valide respostas do modelo contra o contrato exato que seu app espera.',
        'features.f2.title': 'Retries inteligentes', 'features.f2.copy': 'Tente novamente outputs inválidos com contexto estruturado do erro, não reprompt cego.',
        'features.f3.title': 'Fallbacks seguros', 'features.f3.copy': 'Defina o que seu app deve receber quando todos os retries falharem.',
        'features.f4.title': 'Logs de execução', 'features.f4.copy': 'Rastreie cada tentativa, modelo, provider, schema, erro, latência e output.',
        'features.f5.title': 'Interface provider-agnostic', 'features.f5.copy': 'Use OpenAI, Anthropic, Gemini ou qualquer API de LLM sem reescrever seu pipeline.',
        'features.f6.title': 'Schema registry', 'features.f6.copy': 'Versione e gerencie contratos de output conforme seu produto evolui.',
        'use.label': 'Casos de uso', 'use.title': 'Feito para fluxos onde output de LLM vira dado de produção.',
        'use.u1.title': 'Extração de dados', 'use.u1.copy': 'Transforme texto livre em objetos validados antes de gravar no banco.',
        'use.u2.title': 'Qualificação de leads', 'use.u2.copy': 'Classifique e roteie leads sem depender de respostas em texto livre frágeis.',
        'use.u3.title': 'Agentes de IA', 'use.u3.copy': 'Evite que fluxos multi-etapa quebrem porque uma resposta veio malformada.',
        'use.u4.title': 'Automação interna', 'use.u4.copy': 'Use LLMs em backoffice com outputs mais seguros e falhas rastreáveis.',
        'use.u5.title': 'Features de IA em SaaS', 'use.u5.copy': 'Lance recursos com IA sem deixar confiabilidade de output para código customizado.',
        'use.u6.title': 'CRM e operações', 'use.u6.copy': 'Proteja sistemas downstream de classificações, resumos e campos extraídos malformados.',
        'competitive.label': 'Posicionamento', 'competitive.title': 'Não é só dashboard de observabilidade. Não é só JSON mode.',
        'competitive.copy': 'A Reliant atua no ponto em que output de LLM vira lógica da aplicação. Ela fica no caminho da execução para validar, tentar novamente, aplicar fallback e logar antes que dados inválidos cheguem ao sistema.',
        'competitive.c1.title': 'JSON mode', 'competitive.c1.copy': 'Ajuda a moldar respostas, mas deixa validação, retry, fallback e rastros para seu app.',
        'competitive.c2.title': 'Observabilidade', 'competitive.c2.copy': 'Ajuda a inspecionar o que aconteceu, mas geralmente não impede output inválido antes da entrega.',
        'competitive.c3.title': 'Código customizado', 'competitive.c3.copy': 'Dá controle, mas cria lógica repetida em cada projeto e endpoint.',
        'competitive.c4.copy': 'Confiabilidade em runtime para outputs estruturados antes do app consumir a resposta.',
        'dev.label': 'Developer first', 'dev.title': 'Instale antes do próximo bug de parser.', 'dev.copy': 'Use self-host ou cloud gerenciada. Feito para times JavaScript e Python.', 'dev.cta': 'Começar grátis',
        'pricing.label': 'Preços', 'pricing.title': 'Comece grátis. Escale quando seu tráfego com LLM virar crítico em produção.',
        'pricing.free.name': 'Free', 'pricing.free.price': '$0', 'pricing.free.copy': 'Para testar e rodar fluxos pequenos em produção.', 'pricing.free.li1': '1.000 execuções/mês', 'pricing.free.li2': 'Dashboard completo', 'pricing.free.li3': 'SDK JavaScript + Python', 'pricing.free.li4': 'Todos os providers', 'pricing.free.li5': 'Self-host disponível', 'pricing.free.cta': 'Começar grátis',
        'pricing.pro.tag': 'Mais popular', 'pricing.pro.name': 'Pro', 'pricing.pro.price': '$29/mês', 'pricing.pro.copy': 'Para times rodando features com LLM em produção.', 'pricing.pro.li1': '250.000 execuções/mês', 'pricing.pro.li2': 'Alertas de falha', 'pricing.pro.li3': 'Logs por 60 dias', 'pricing.pro.li4': 'Todos os providers', 'pricing.pro.li5': 'Suporte prioritário', 'pricing.pro.cta': 'Acesso antecipado',
        'pricing.enterprise.name': 'Enterprise', 'pricing.enterprise.price': 'Sob consulta', 'pricing.enterprise.copy': 'Para escala, compliance e deployments dedicados.', 'pricing.enterprise.li1': 'Volume customizado', 'pricing.enterprise.li2': 'Projetos ilimitados', 'pricing.enterprise.li3': 'Guardrails customizados', 'pricing.enterprise.li4': 'SSO + RBAC', 'pricing.enterprise.li5': 'Deploy on-premise', 'pricing.enterprise.cta': 'Fale conosco',
        'faq.title': 'Perguntas que times técnicos fazem antes de adotar a Reliant.',
        'faq.q1': 'A Reliant substitui structured outputs da OpenAI, tools da Anthropic ou schemas do Gemini?', 'faq.a1': 'Não. A Reliant usa recursos dos providers quando disponíveis e adiciona a camada operacional: validação, retry, fallback, logs e execução provider-agnostic.',
        'faq.q2': 'Por que não escrever essa lógica direto no app?', 'faq.a2': 'Você pode. A maioria dos times faz isso no começo. A Reliant existe porque parser, retries, fallbacks e contexto de trace viram lógica repetida e inconsistente entre projetos.',
        'faq.q3': 'Isso adiciona latência?', 'faq.a3': 'Validação e logs adicionam pouco overhead. Retries adicionam latência apenas quando o modelo retorna output inválido.',
        'faq.q4': 'O que acontece quando todos os retries falham?', 'faq.a4': 'Você define uma resposta de fallback, então sua aplicação recebe um resultado previsível em vez de dado malformado ou exceção sem tratamento.',
        'faq.q5': 'Para quem é a Reliant?', 'faq.a5': 'Devs, founders técnicos, times de produto com IA, software houses e SaaS que colocam fluxos com LLM em produção.',
        'final.title': 'Pare de tratar output de LLM como texto. Trate como dado de produção.', 'final.copy': 'Valide. Tente novamente. Registre. Aplique fallback com segurança quando falhar.', 'final.cta1': 'Começar grátis', 'final.cta2': 'Ver docs',
        'footer.copy': 'Reliant · Confiabilidade de produção para outputs de LLM', 'footer.contact': 'Contato'
      },
      es: {
        metaTitle: 'Reliant — Confiabilidad en producción para outputs de LLM',
        metaDescription: 'Reliant valida outputs estructurados de LLM, reintenta respuestas fallidas, aplica fallbacks seguros y registra cada ejecución antes de que datos inválidos lleguen a producción.',
        'nav.features': 'Funcionalidades', 'nav.how': 'Cómo funciona', 'nav.pricing': 'Precios', 'nav.faq': 'FAQ', 'nav.cta': 'Empezar gratis →',
        'hero.badge': 'reliant-js v1.0.0 · confiabilidad en producción para outputs de LLM',
        'hero.title': 'Lanza features con LLM sin <span class="gradient-word">JSON roto</span>, retries manuales ni debugging a ciegas.',
        'hero.sub': 'Reliant se ubica entre tu app y cualquier LLM para validar outputs estructurados, reintentar respuestas inválidas, aplicar fallbacks seguros y registrar cada ejecución antes de que datos malos lleguen a producción.',
        'hero.primary': 'Empezar gratis', 'hero.secondary': 'Ver docs',
        'hero.trust': 'Self-host en minutos. <span>Sin lock-in.</span> Compatible con OpenAI, Anthropic, Gemini y cualquier API de LLM.',
        'hero.event1.title': 'Intento 1', 'hero.event1.copy': 'Falló la validación del schema', 'hero.event1.pill': 'falló',
        'hero.event2.title': 'Intento 2', 'hero.event2.copy': 'Corregido y reintentado', 'hero.event2.pill': 'retry',
        'hero.event3.title': 'Output', 'hero.event3.copy': 'Validado antes de entregar', 'hero.event3.pill': 'ok',
        'problem.label': 'La brecha de producción', 'problem.title': 'Los LLM no fallan solo cuando se equivocan. Fallan cuando están casi bien.',
        'problem.copy': 'En una demo, una respuesta casi válida parece aceptable. En producción, un campo faltante, una clave renombrada, JSON malformado o una estructura inesperada puede romper un flujo, corromper datos o activar la acción equivocada en silencio.',
        'problem.card1.title': 'JSON casi válido', 'problem.card1.copy': 'Una respuesta puede parecer correcta para una persona y aun así romper tu parser.',
        'problem.card2.title': 'Retry manual', 'problem.card2.copy': 'Cada proyecto termina con su propio try/catch, sanitizer, reprompt y fallback.',
        'problem.card3.title': 'Poca visibilidad', 'problem.card3.copy': 'Cuando el pipeline falla, es difícil saber si el problema vino del prompt, modelo, provider, schema, retry o código downstream.',
        'problem.card4.title': 'Providers inconsistentes', 'problem.card4.copy': 'OpenAI, Anthropic, Gemini y otras APIs no se comportan igual con respuestas estructuradas.',
        'positioning.label': 'Por qué existe Reliant', 'positioning.title': 'Structured output no es lo mismo que confiabilidad en producción.',
        'positioning.copy': 'Las funciones nativas de structured output ayudan. Orientan a los modelos a devolver datos en formato predecible. Pero los sistemas en producción necesitan validación, retries, fallbacks, logs y trazas alrededor de cada ejecución.',
        'positioning.col1': 'Structured output', 'positioning.s1': 'Ayuda a formatear la respuesta del modelo', 'positioning.s2': 'Depende del comportamiento del provider', 'positioning.s3': 'No explica cada falla', 'positioning.s4': 'Deja la lógica de retry a tu app',
        'positioning.r1': 'Valida la respuesta antes de que tu app la use', 'positioning.r2': 'Funciona entre providers con una interfaz única', 'positioning.r3': 'Registra intentos, errores, latencia, modelo, schema y output', 'positioning.r4': 'Reintenta con contexto del error de validación',
        'how.label': 'Cómo funciona', 'how.title': 'Una llamada de API. Un contrato confiable de output.',
        'how.step1.title': 'Define el schema', 'how.step1.copy': 'Crea el contrato de output que tu app espera.',
        'how.step2.title': 'Llama cualquier LLM', 'how.step2.copy': 'Envía prompt, schema, modelo y provider por una interfaz única.',
        'how.step3.title': 'Valida antes de entregar', 'how.step3.copy': 'Reliant verifica la respuesta antes de devolverla a tu aplicación.',
        'how.step4.title': 'Retry con contexto', 'how.step4.copy': 'Si la validación falla, Reliant reintenta con el error exacto.',
        'how.step5.title': 'Registra la ejecución', 'how.step5.copy': 'Cada intento queda registrado con modelo, provider, latencia, tokens, schema, error y output final.',
        'how.step6.title': 'Fallback seguro', 'how.step6.copy': 'Si los retries fallan, tu app recibe una respuesta predecible en vez de datos rotos.',
        'features.label': 'Funcionalidades', 'features.title': 'Todo lo que tu pipeline de LLM necesita antes de producción.',
        'features.f1.title': 'Validación de schema', 'features.f1.copy': 'Valida respuestas del modelo contra el contrato exacto que tu app espera.',
        'features.f2.title': 'Retries inteligentes', 'features.f2.copy': 'Reintenta outputs fallidos con contexto estructurado del error, no con reprompt ciego.',
        'features.f3.title': 'Fallbacks seguros', 'features.f3.copy': 'Define qué debe recibir tu app cuando todos los retries fallan.',
        'features.f4.title': 'Logs de ejecución', 'features.f4.copy': 'Rastrea cada intento, modelo, provider, schema, error, latencia y output.',
        'features.f5.title': 'Interfaz provider-agnostic', 'features.f5.copy': 'Usa OpenAI, Anthropic, Gemini o cualquier API de LLM sin reescribir tu pipeline.',
        'features.f6.title': 'Schema registry', 'features.f6.copy': 'Versiona y gestiona contratos de output a medida que tu producto evoluciona.',
        'use.label': 'Casos de uso', 'use.title': 'Diseñado para flujos donde el output de LLM se convierte en dato de producción.',
        'use.u1.title': 'Extracción de datos', 'use.u1.copy': 'Convierte texto no estructurado en objetos validados antes de escribir en tu base de datos.',
        'use.u2.title': 'Calificación de leads', 'use.u2.copy': 'Clasifica y enruta leads sin depender de respuestas libres frágiles.',
        'use.u3.title': 'Agentes de IA', 'use.u3.copy': 'Evita que flujos multi-step se rompan porque una respuesta vino malformada.',
        'use.u4.title': 'Automación interna', 'use.u4.copy': 'Usa LLMs en backoffice con outputs más seguros y fallas trazables.',
        'use.u5.title': 'Features de IA en SaaS', 'use.u5.copy': 'Lanza features con IA sin dejar la confiabilidad del output a código customizado.',
        'use.u6.title': 'CRM y operaciones', 'use.u6.copy': 'Protege sistemas downstream de clasificaciones, resúmenes o campos extraídos malformados.',
        'competitive.label': 'Posicionamiento', 'competitive.title': 'No es otro dashboard de observabilidad. No es solo JSON mode.',
        'competitive.copy': 'Reliant se enfoca en el punto donde el output de LLM se convierte en lógica de aplicación. Está en la ruta de ejecución para validar, reintentar, aplicar fallback y registrar antes de que datos inválidos lleguen al sistema.',
        'competitive.c1.title': 'JSON mode', 'competitive.c1.copy': 'Ayuda a moldear respuestas, pero deja validación, retry, fallback y trazas a tu app.',
        'competitive.c2.title': 'Observabilidad', 'competitive.c2.copy': 'Ayuda a inspeccionar qué pasó, pero normalmente no evita output inválido antes de entregar.',
        'competitive.c3.title': 'Código custom', 'competitive.c3.copy': 'Da control, pero crea lógica repetida en cada proyecto y endpoint.',
        'competitive.c4.copy': 'Confiabilidad runtime para outputs estructurados antes de que tu app consuma la respuesta.',
        'dev.label': 'Developer first', 'dev.title': 'Instálalo antes de tu próximo bug de parser.', 'dev.copy': 'Usa self-host o cloud gestionada. Hecho para equipos JavaScript y Python.', 'dev.cta': 'Empezar gratis',
        'pricing.label': 'Precios', 'pricing.title': 'Empieza gratis. Escala cuando tu tráfico con LLM sea crítico en producción.',
        'pricing.free.name': 'Free', 'pricing.free.price': '$0', 'pricing.free.copy': 'Para probar y ejecutar flujos pequeños en producción.', 'pricing.free.li1': '1.000 ejecuciones/mes', 'pricing.free.li2': 'Dashboard completo', 'pricing.free.li3': 'SDK JavaScript + Python', 'pricing.free.li4': 'Todos los providers', 'pricing.free.li5': 'Self-host disponible', 'pricing.free.cta': 'Empezar gratis',
        'pricing.pro.tag': 'Más popular', 'pricing.pro.name': 'Pro', 'pricing.pro.price': '$29/mes', 'pricing.pro.copy': 'Para equipos ejecutando features con LLM en producción.', 'pricing.pro.li1': '250.000 ejecuciones/mes', 'pricing.pro.li2': 'Alertas de falla', 'pricing.pro.li3': 'Logs por 60 días', 'pricing.pro.li4': 'Todos los providers', 'pricing.pro.li5': 'Soporte prioritario', 'pricing.pro.cta': 'Acceso anticipado',
        'pricing.enterprise.name': 'Enterprise', 'pricing.enterprise.price': 'Custom', 'pricing.enterprise.copy': 'Para escala, compliance y deployments dedicados.', 'pricing.enterprise.li1': 'Volumen customizado', 'pricing.enterprise.li2': 'Proyectos ilimitados', 'pricing.enterprise.li3': 'Guardrails customizados', 'pricing.enterprise.li4': 'SSO + RBAC', 'pricing.enterprise.li5': 'Deploy on-premise', 'pricing.enterprise.cta': 'Hablar con nosotros',
        'faq.title': 'Preguntas que equipos técnicos hacen antes de adoptar Reliant.',
        'faq.q1': '¿Reliant reemplaza structured outputs de OpenAI, tools de Anthropic o schemas de Gemini?', 'faq.a1': 'No. Reliant usa capacidades del provider cuando están disponibles y agrega la capa operacional: validación, retry, fallback, logs y ejecución provider-agnostic.',
        'faq.q2': '¿Por qué no escribir esta lógica en mi app?', 'faq.a2': 'Puedes hacerlo. La mayoría de equipos lo hace al inicio. Reliant existe porque parser, retries, fallbacks y contexto de trace se vuelven repetitivos e inconsistentes entre proyectos.',
        'faq.q3': '¿Agrega latencia?', 'faq.a3': 'Validación y logs agregan overhead mínimo. Los retries agregan latencia solo cuando el modelo devuelve un output inválido.',
        'faq.q4': '¿Qué pasa cuando todos los retries fallan?', 'faq.a4': 'Defines una respuesta de fallback, para que tu aplicación reciba un resultado predecible en vez de datos malformados o una excepción no gestionada.',
        'faq.q5': '¿Para quién es Reliant?', 'faq.a5': 'Devs, founders técnicos, equipos de producto con IA, software houses y SaaS que llevan flujos con LLM a producción.',
        'final.title': 'Deja de tratar el output de LLM como texto. Trátalo como dato de producción.', 'final.copy': 'Valídalo. Reinténtalo. Regístralo. Aplica fallback seguro cuando falle.', 'final.cta1': 'Empezar gratis', 'final.cta2': 'Ver docs',
        'footer.copy': 'Reliant · Confiabilidad en producción para outputs de LLM', 'footer.contact': 'Contacto'
      }
    };

    const html = document.documentElement;
    const buttons = document.querySelectorAll('[data-lang]');
    const titleTag = document.querySelector('title');
    const descTag = document.querySelector('meta[name="description"]');

    function applyLanguage(lang) {
      const dict = translations[lang] || translations.en;
      document.body.classList.add('switching');
      setTimeout(() => {
        document.querySelectorAll('[data-i18n]').forEach(el => {
          const key = el.getAttribute('data-i18n');
          if (dict[key]) el.textContent = dict[key];
        });
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
          const key = el.getAttribute('data-i18n-html');
          if (dict[key]) el.innerHTML = dict[key];
        });
        html.setAttribute('lang', lang === 'pt' ? 'pt-BR' : lang === 'es' ? 'es' : 'en');
        titleTag.textContent = dict.metaTitle;
        descTag.setAttribute('content', dict.metaDescription);
        buttons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
        localStorage.setItem('reliant_lp_lang', lang);
        document.body.classList.remove('switching');
      }, 120);
    }

    buttons.forEach(button => button.addEventListener('click', () => applyLanguage(button.dataset.lang)));
    applyLanguage(localStorage.getItem('reliant_lp_lang') || 'en');
  </script>` }} />
    </>
  )
}
