// lib/gemini.ts

interface WrappedStats {
  username: string;
  publicRepos: number;
  totalCommits: number;
  topLanguages: { language: string; percentage: number }[];
  peakHour: string;
  longestStreak: number;
  mostActiveRepo: string;
  mostActiveRepoEvents: number;
}

async function callGemini(prompt: string, apiKey: string): Promise<string> {
  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error: ${response.status} — ${errorBody}`);
  }

  const data = await response.json();
  console.log(
    'Gemini finish:',
    data?.candidates?.[0]?.finishReason,
    '| text tokens:',
    data?.usageMetadata?.candidatesTokenCount,
    '| thought tokens:',
    data?.usageMetadata?.thoughtsTokenCount
  );

  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  if (!text) {
    throw new Error('Gemini returned empty response');
  }

  return text
    .trim()
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/^#+\s/gm, '')
    .replace(/^[-•]\s/gm, '')
    .trim();
}

async function withRetry(
  fn: () => Promise<string>,
  retries: number = 2,
  delayMs: number = 1500
): Promise<string> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      console.error(`Gemini attempt ${attempt + 1} failed:`, err);
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, delayMs));
      } else {
        throw err;
      }
    }
  }
  throw new Error('All retries failed');
}

function buildPrompt(stats: WrappedStats, locale: string): string {
  const langs = stats.topLanguages
    .map((l) => `${l.language} (${l.percentage}%)`)
    .join(', ');

  if (locale === 'en') {
    return `A GitHub user named ${stats.username} has ${stats.publicRepos} public repos, ${stats.totalCommits} recent commits, codes mostly at ${stats.peakHour}, had a streak of ${stats.longestStreak} consecutive days, their most active repo is ${stats.mostActiveRepo}, and their favorite languages are ${langs}.

Write exactly 4 complete sentences about this developer. Be friendly, positive and encouraging. Mention their main focus, their favorite coding time, and something motivating. Write plain text only, no formatting, no bullet points, no titles. End every sentence with a period.`;
  }

  return `Um usuário do GitHub chamado ${stats.username} tem ${stats.publicRepos} repositórios públicos, ${stats.totalCommits} commits recentes, programa mais às ${stats.peakHour}, teve uma sequência de ${stats.longestStreak} dias consecutivos, seu repositório mais ativo é o ${stats.mostActiveRepo}, e suas linguagens favoritas são ${langs}.

Escreva exatamente 4 frases completas sobre esse desenvolvedor. Seja amigável, positivo e encorajador. Fale sobre o foco principal, o horário favorito de programar, e algo motivador. Escreva apenas texto corrido, sem formatação, sem bullet points, sem títulos. Termine cada frase com ponto final.`;
}

export async function generateNarrative(
  stats: WrappedStats,
  apiKey: string,
  locale: string = 'pt'
): Promise<string> {
  const prompt = buildPrompt(stats, locale);
  return withRetry(() => callGemini(prompt, apiKey));
}