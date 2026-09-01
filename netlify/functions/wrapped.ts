import type { Context } from '@netlify/functions';
import {
  fetchUserRepos,
  fetchUserEvents,
  fetchUserProfile,
} from '../../lib/github.js';
import { aggregateStats } from '../../lib/aggregate.js';

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const username = url.searchParams.get('username');

  if (!username) {
    return new Response(
      JSON.stringify({ error: 'Parâmetro username é obrigatório' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const token = Netlify.env.get('GITHUB_TOKEN') || '';

  try {
    const [profile, repos, events] = await Promise.all([
      fetchUserProfile(username, token),
      fetchUserRepos(username, token),
      fetchUserEvents(username, token),
    ]);

    const stats = aggregateStats(repos, events);

    const result = {
      username,
      avatarUrl: profile.avatar_url,
      ...stats,
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
