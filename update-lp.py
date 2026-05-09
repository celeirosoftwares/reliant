import re

with open('web/src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add new PT features after f6
old_pt = """    'f6.title': 'Schema Registry',
    'f6.desc': 'Versione seus contratos de output. Acompanhe mudanças. Nunca quebre compatibilidade retroativa por acidente.',"""

new_pt = """    'f6.title': 'Schema Registry',
    'f6.desc': 'Versione seus contratos de output. Acompanhe mudanças. Nunca quebre compatibilidade retroativa por acidente.',
    'f7.title': 'System Prompt Customizado',
    'f7.desc': 'Configure o prompt do sistema por schema. Instrua o LLM com contexto específico do seu negócio — sem alterar o código.',
    'f8.title': 'Fallback Multi-Provider',
    'f8.desc': 'Se a Anthropic falhar, tente a OpenAI. Configure uma cadeia de fallback entre providers — seu pipeline nunca para.',
    'f9.title': 'Analytics Avançado',
    'f9.desc': 'Taxa de sucesso por schema e provider, custo estimado por execução e tendência diária dos últimos 30 dias.',
    'f10.title': 'Integração com n8n',
    'f10.desc': 'Node nativo no n8n. Instale com um clique e use o Reliant em qualquer automação sem escrever código.',
    'f11.title': 'SDKs para JS, Python e PHP',
    'f11.desc': 'SDKs oficiais para as linguagens mais usadas em software houses brasileiras. Integre em minutos.',"""

# Add new EN features after f6 EN
old_en = """    'f6.title': 'Schema Registry',
    'f6.desc': 'Version your output contracts. Track changes over time. Never break backward compatibility by accident.',"""

new_en = """    'f6.title': 'Schema Registry',
    'f6.desc': 'Version your output contracts. Track changes over time. Never break backward compatibility by accident.',
    'f7.title': 'Custom System Prompt',
    'f7.desc': 'Configure the system prompt per schema. Instruct the LLM with your business-specific context — without changing code.',
    'f8.title': 'Multi-Provider Fallback',
    'f8.desc': 'If Anthropic fails, try OpenAI. Configure a provider fallback chain — your pipeline never stops.',
    'f9.title': 'Advanced Analytics',
    'f9.desc': 'Success rate by schema and provider, estimated cost per execution, and 30-day daily trend.',
    'f10.title': 'n8n Integration',
    'f10.desc': 'Native n8n node. Install with one click and use Reliant in any automation without writing code.',
    'f11.title': 'JS, Python & PHP SDKs',
    'f11.desc': 'Official SDKs for the most popular languages. Integrate in minutes with full TypeScript support.',"""

if old_pt in content:
    content = content.replace(old_pt, new_pt)
    print('✅ PT features updated')
else:
    print('❌ PT features NOT found')

if old_en in content:
    content = content.replace(old_en, new_en)
    print('✅ EN features updated')
else:
    print('❌ EN features NOT found')

# Update hero badge
content = content.replace(
    "'hero.badge': 'Disponível agora — reliant-js v1.0.0'",
    "'hero.badge': 'Disponível agora — JS, Python e PHP SDKs + n8n'"
)
content = content.replace(
    "'hero.badge': 'Available now — reliant-js v1.0.0'",
    "'hero.badge': 'Available now — JS, Python & PHP SDKs + n8n'"
)

with open('web/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done! Run: git add web/src/app/page.tsx && git commit -m "feat: update LP with new features" && git push origin HEAD:main')
