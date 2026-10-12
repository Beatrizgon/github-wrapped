import type { Context } from '@netlify/functions';
import { fetchRepoReadme, fetchTrendingRepos } from '../../lib/github-trending.js';
import type { TrendingPeriod } from '../../lib/github-trending.js';

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300',
    },
  });
}

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const language = url.searchParams.get('language') || undefined;
  const periodParam = url.searchParams.get('period') || 'week';
  const readmeRepo = url.searchParams.get('readme');

  // Validar período
  const validPeriods: TrendingPeriod[] = ['day', 'week', 'month'];
  const period = validPeriods.includes(periodParam as TrendingPeriod)
    ? (periodParam as TrendingPeriod)
    : 'week';

  const githubToken = Netlify.env.get('GITHUB_TOKEN') || '';

  try {
    if (readmeRepo !== null) {
      if (!/^[A-Za-z0-9][A-Za-z0-9-]{0,38}\/[A-Za-z0-9_.-]{1,100}$/.test(readmeRepo)) {
        return jsonResponse({ error: 'Invalid repository name.' }, 400);
      }

      const readme = await fetchRepoReadme(readmeRepo, githubToken);
      if (!readme) return jsonResponse({ error: 'README not found.' }, 404);
      return jsonResponse({ readme });
    }

    const repos = await fetchTrendingRepos(githubToken, language, period);

    return jsonResponse({
      period,
      language: language || null,
      count: repos.length,
      repos,
    });
  } catch (error) {
    console.error('Trending error:', error);
    return jsonResponse({ error: 'Não foi possível buscar os repositórios em alta.' }, 500);
  }
};
