import type { Context } from '@netlify/functions';
import { fetchTrendingRepos } from '../../lib/github-trending.js';
import type { TrendingPeriod } from '../../lib/github-trending.js';

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const language = url.searchParams.get('language') || undefined;
  const periodParam = url.searchParams.get('period') || 'week';

  // Validar período
  const validPeriods: TrendingPeriod[] = ['day', 'week', 'month'];
  const period = validPeriods.includes(periodParam as TrendingPeriod)
    ? (periodParam as TrendingPeriod)
    : 'week';

  const githubToken = Netlify.env.get('GITHUB_TOKEN') || '';

  try {
    const repos = await fetchTrendingRepos(githubToken, language, period);

    return new Response(
      JSON.stringify({
        period,
        language: language || null,
        count: repos.length,
        repos,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=300',
        },
      }
    );
  } catch (error) {
    console.error('Trending error:', error);
    return new Response(
      JSON.stringify({
        error: 'Não foi possível buscar os repositórios em alta.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
