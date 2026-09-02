import type { Context } from '@netlify/functions';
import {
  fetchUserRepos,
  fetchUserEvents,
  fetchUserProfile,
} from '../../lib/github.js';
import { aggregateStats } from '../../lib/aggregate.js';
import { generateNarrative } from '../../lib/gemini.js';

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const username = url.searchParams.get('username');
  const locale = url.searchParams.get('locale') || 'pt';

  if (!username) {
    return new Response(
      JSON.stringify({ error: 'Parâmetro username é obrigatório' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const githubToken = Netlify.env.get('GITHUB_TOKEN') || '';
  const geminiKey = Netlify.env.get('GEMINI_API_KEY') || '';

  try {
    const [profile, repos, events] = await Promise.all([
      fetchUserProfile(username, githubToken),
      fetchUserRepos(username, githubToken),
      fetchUserEvents(username, githubToken),
    ]);

    const stats = aggregateStats(repos, events);

    // Gerar narrativa com IA (se a chave existir)
    let narrative = '';
    if (geminiKey) {
      try {
        narrative = await generateNarrative(
          { username, ...stats },
          geminiKey,
          locale
        );
      } catch (err) {
        console.error('Gemini error:', err);
        narrative =
          locale === 'en'
            ? 'Narrative could not be generated at this time.'
            : 'A narrativa não pôde ser gerada neste momento.';
      }
    }

    const result = {
      username,
      avatarUrl: profile.avatar_url,
      ...stats,
      narrative,
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Não foi possível buscar os dados. Verifique o username.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
