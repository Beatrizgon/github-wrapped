# 🟣 GitHub Wrapped

**Seu ano de código, resumido.** Um dashboard que analisa a atividade pública de qualquer usuário do GitHub e gera um resumo visual + uma narrativa personalizada escrita por IA.

🔗 **[Ver demo ao vivo](https://github-wrapped-bg.netlify.app/)**

---

## ✨ Funcionalidades

- **Dashboard de estatísticas** — commits, streak, repositórios, horário de pico e estrelas recebidas
- **Top linguagens** — gráfico com as linguagens mais usadas nos repositórios
- **Projetos mais ativos** — os 2 repositórios com mais atividade recente
- **Atividade por dia da semana** — gráfico de barras mostrando quando o dev mais contribui
- **Narrativa gerada por IA** — a Gemini API analisa os dados e escreve um parágrafo personalizado sobre o perfil dev
- **Dark / Light mode** — tema escuro (preto + roxo) e claro (branco + roxo)
- **Bilíngue (PT / EN)** — interface e narrativa em português ou inglês

---

## 🛠 Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | React + TypeScript (Vite) |
| Backend | Netlify Functions (serverless) |
| Dados | GitHub REST API |
| IA | Google Gemini API |
| Hospedagem | Netlify (plano gratuito) |
| Testes | Vitest |
| Design | Open Sans, Material Symbols, CSS Variables |

---

## 📁 Estrutura do projeto

```
github-wrapped/
├── src/
│   ├── App.tsx                  → tela principal
│   ├── main.tsx                 → ponto de entrada
│   ├── components/
│   │   ├── Header.tsx           → logo + toggles tema/idioma
│   │   ├── UsernameForm.tsx     → campo de busca
│   │   ├── StatsCard.tsx        → cards de estatísticas
│   │   ├── LanguageChart.tsx    → barras de linguagens
│   │   ├── WeekChart.tsx        → gráfico de atividade semanal
│   │   └── NarrativeCard.tsx    → narrativa gerada por IA
│   ├── hooks/
│   │   ├── useTheme.ts          → dark/light mode
│   │   └── useLocale.ts         → PT/EN
│   ├── i18n/
│   │   └── translations.ts     → textos em ambos idiomas
│   └── styles/
│       └── theme.css            → variáveis de cor e layout
├── lib/
│   ├── github.ts                → chamadas à API do GitHub
│   ├── gemini.ts                → geração de narrativa com IA
│   ├── aggregate.ts             → lógica pura de agregação
│   └── aggregate.test.ts        → testes unitários
├── netlify/
│   └── functions/
│       └── wrapped.ts           → função serverless principal
├── netlify.toml                 → configuração do Netlify
└── package.json
```

---

## 🏗 Arquitetura

```
Usuário digita username
        │
        ▼
  Frontend (React + TS)
        │
        ▼
  Netlify Function → /.netlify/functions/wrapped
        │                 │
        ▼                 ▼
  GitHub API          Gemini API
  (dados brutos)      (narrativa)
        │
        ▼
  lib/aggregate.ts
  (lógica de agregação)
```

O frontend nunca fala diretamente com as APIs externas — tudo passa pela função serverless, que é onde ficam as chaves secretas.

---

## 🚀 Rodando localmente

**Pré-requisitos:** Node.js 18+ e npm

```bash
# Clonar o repositório
git clone https://github.com/Beatrizgon/github-wrapped.git
cd github-wrapped

# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Crie um arquivo .env na raiz com:
# GITHUB_TOKEN=seu_token_do_github
# GEMINI_API_KEY=sua_chave_do_gemini

# Rodar em modo dev (frontend + funções serverless)
npx netlify dev

# Rodar testes
npm test
```

**Onde conseguir as chaves:**
- `GITHUB_TOKEN` → [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
- `GEMINI_API_KEY` → [Google AI Studio](https://aistudio.google.com) (gratuito, sem cartão)

---

## 🧪 Testes

O projeto inclui testes unitários para toda a lógica de agregação:

```bash
npm test
```

Cobertura: cálculo de linguagens, contagem de commits, horário de pico, streak consecutivo, repositório mais ativo e atividade semanal.

---

## 📄 Licença

MIT

---

Feito com 💜 por [Beatriz Gonçalves](https://github.com/Beatrizgon)
