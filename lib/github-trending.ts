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
  readmePreview: string | null;
  hasReadme: boolean;
  url: string;
  stars: number;
  language: string | null;
  owner: {
    username: string;
    avatarUrl: string;
  };
}

function createReadmePreview(markdown: string): string | null {
  const preview = markdown
    .replace(/^\s*(?:```|~~~)[^\r\n]*\r?$/gm, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]*>/g, ' ')
    .replace(/^\s{0,3}(?:#{1,6}\s*|>\s*|[-*+]\s+|\d+\.\s+)/gm, '')
    .replace(/[`*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 700);

  return preview || null;
}

export async function fetchRepoReadme(
  fullName: string,
  token: string
): Promise<string | null> {
  const [owner, repo] = fullName.split('/');
  const response = await fetch(`${GITHUB_API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.raw',
    },
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`GitHub README error for ${fullName}: ${response.status}`);
  }

  return response.text();
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

  const readmes = await Promise.allSettled(
    data.items.map((repo) => fetchRepoReadme(repo.full_name, token))
  );

  const previews = data.items.map((repo, index) => {
    const readmeResult = readmes[index];
    if (readmeResult.status === 'rejected') {
      console.warn(`Could not fetch README for ${repo.full_name}:`, readmeResult.reason);
      return repo.description || '';
    }
    return readmeResult.value ? createReadmePreview(readmeResult.value) || repo.description || '' : repo.description || '';
  });
  return data.items.map((repo, index) => {
    const readmeResult = readmes[index];
    return {
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      readmePreview: previews[index] || null,
      hasReadme: readmeResult.status === 'fulfilled' && readmeResult.value !== null,
      url: repo.html_url,
      stars: repo.stargazers_count,
      language: repo.language,
      owner: {
        username: repo.owner.login,
        avatarUrl: repo.owner.avatar_url,
      },
    };
  });
}
