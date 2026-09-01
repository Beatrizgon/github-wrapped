import type { Context } from '@netlify/functions';
import {
  fetchUserRepos,
  fetchUserEvents,
  fetchUserProfile,
} from '../../lib/github.js';

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

    const ownRepos = repos.filter((r) => !r.fork);

    // Linguagens mais usadas
    const langCount: Record<string, number> = {};
    ownRepos.forEach((r) => {
      if (r.language) {
        langCount[r.language] = (langCount[r.language] || 0) + 1;
      }
    });
    const totalLang = Object.values(langCount).reduce((a, b) => a + b, 0);
    const topLanguages = Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([language, count]) => ({
        language,
        percentage: Math.round((count / totalLang) * 100),
      }));

    // Commits (PushEvents)
    const pushEvents = events.filter((e) => e.type === 'PushEvent');
    const totalCommits = pushEvents.length;

    // Horário de pico
    const hourCount: Record<number, number> = {};
    pushEvents.forEach((e) => {
      const hour = new Date(e.created_at).getHours();
      hourCount[hour] = (hourCount[hour] || 0) + 1;
    });
    const peakHour = Object.entries(hourCount)
      .sort((a, b) => Number(b[1]) - Number(a[1]))[0];

    // Repositório mais ativo (mais eventos)
    const repoEventCount: Record<string, number> = {};
    events.forEach((e) => {
      const name = e.repo.name.split('/')[1] || e.repo.name;
      repoEventCount[name] = (repoEventCount[name] || 0) + 1;
    });
    const mostActiveRepo = Object.entries(repoEventCount)
      .sort((a, b) => b[1] - a[1])[0];

    const result = {
      username,
      avatarUrl: profile.avatar_url,
      publicRepos: ownRepos.length,
      totalCommits,
      topLanguages,
      peakHour: peakHour ? `${peakHour[0]}h` : 'N/A',
      mostActiveRepo: mostActiveRepo ? mostActiveRepo[0] : 'N/A',
      mostActiveRepoEvents: mostActiveRepo ? mostActiveRepo[1] : 0,
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