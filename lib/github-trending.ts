// lib/github-trending.ts

const GITHUB_API = 'https://api.github.com';

export type TrendingPeriod = 'day' | 'week' | 'month';

interface GitHubSearchRepo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface GitHubSearchResponse {
  total_count: number;
  items: GitHubSearchRepo[];
}

export interface TrendingRepo {
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  stars: number;
  language: string | null;
  owner: {
    username: string;
    avatarUrl: string;
  };
}

/**
 * Calcula a data de corte baseada no período.
 * Retorna string no formato YYYY-MM-DD.
 */
function getDateFromPeriod(period: TrendingPeriod): string {
  const now = new Date();
  const daysBack = period === 'day' ? 1 : period === 'week' ? 7 : 30;

  now.setDate(now.getDate() - daysBack);

  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Busca repositórios em alta no GitHub usando o endpoint /search/repositories.
 * Como o GitHub não tem API oficial de trending, usamos a search com filtros de data + sort por estrelas.
 */
export async function fetchTrendingRepos(
  token: string,
  language?: string,
  period: TrendingPeriod = 'week',
  limit: number = 12
): Promise<TrendingRepo[]> {
  const dateFilter = getDateFromPeriod(period);

  let query = `created:>${dateFilter}`;
  if (language) {
    query += ` language:${language}`;
  }

  const url = `${GITHUB_API}/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=${limit}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub search error: ${response.status}`);
  }

  const data: GitHubSearchResponse = await response.json();

  return data.items.map((repo) => ({
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    url: repo.html_url,
    stars: repo.stargazers_count,
    language: repo.language,
    owner: {
      username: repo.owner.login,
      avatarUrl: repo.owner.avatar_url,
    },
  }));
}
