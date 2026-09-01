// lib/aggregate.ts
// Lógica pura de agregação — sem chamadas externas, fácil de testar.

export interface GitHubRepo {
  name: string;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  updated_at: string;
}

export interface GitHubEvent {
  type: string;
  created_at: string;
  repo: { name: string };
}

export interface LanguageStat {
  language: string;
  percentage: number;
}

export interface WrappedStats {
  publicRepos: number;
  totalCommits: number;
  topLanguages: LanguageStat[];
  peakHour: string;
  longestStreak: number;
  mostActiveRepo: string;
  mostActiveRepoEvents: number;
}

/**
 * Calcula as linguagens mais usadas a partir dos repositórios.
 * Conta quantos repos usam cada linguagem (exclui forks e repos sem linguagem).
 */
export function calcTopLanguages(repos: GitHubRepo[], limit = 5): LanguageStat[] {
  const ownRepos = repos.filter((r) => !r.fork);

  const langCount: Record<string, number> = {};
  ownRepos.forEach((r) => {
    if (r.language) {
      langCount[r.language] = (langCount[r.language] || 0) + 1;
    }
  });

  const total = Object.values(langCount).reduce((a, b) => a + b, 0);

  if (total === 0) return [];

  return Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([language, count]) => ({
      language,
      percentage: Math.round((count / total) * 100),
    }));
}

/**
 * Conta o total de commits baseado nos PushEvents.
 */
export function calcTotalCommits(events: GitHubEvent[]): number {
  return events.filter((e) => e.type === 'PushEvent').length;
}

/**
 * Encontra o horário com mais PushEvents (0-23).
 * Retorna string no formato "14h" ou "N/A" se não houver eventos.
 */
export function calcPeakHour(events: GitHubEvent[]): string {
  const pushEvents = events.filter((e) => e.type === 'PushEvent');

  if (pushEvents.length === 0) return 'N/A';

  const hourCount: Record<number, number> = {};
  pushEvents.forEach((e) => {
    const hour = new Date(e.created_at).getHours();
    hourCount[hour] = (hourCount[hour] || 0) + 1;
  });

  const peak = Object.entries(hourCount)
    .sort((a, b) => Number(b[1]) - Number(a[1]))[0];

  return peak ? `${peak[0]}h` : 'N/A';
}

/**
 * Encontra o repositório com mais eventos.
 * Retorna o nome e a quantidade de eventos.
 */
export function calcMostActiveRepo(
  events: GitHubEvent[]
): { name: string; events: number } {
  if (events.length === 0) return { name: 'N/A', events: 0 };

  const repoCount: Record<string, number> = {};
  events.forEach((e) => {
    const name = e.repo.name.split('/')[1] || e.repo.name;
    repoCount[name] = (repoCount[name] || 0) + 1;
  });

  const top = Object.entries(repoCount)
    .sort((a, b) => b[1] - a[1])[0];

  return top ? { name: top[0], events: top[1] } : { name: 'N/A', events: 0 };
}

/**
 * Calcula a maior sequência consecutiva de dias com pelo menos um PushEvent.
 */
export function calcLongestStreak(events: GitHubEvent[]): number {
  const pushEvents = events.filter((e) => e.type === 'PushEvent');

  if (pushEvents.length === 0) return 0;

  // Pegar datas únicas (sem hora), ordenadas
  const uniqueDays = [
    ...new Set(
      pushEvents.map((e) => {
        const d = new Date(e.created_at);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      })
    ),
  ].sort();

  let longest = 1;
  let current = 1;

  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = new Date(uniqueDays[i - 1]);
    const curr = new Date(uniqueDays[i]);
    const diffMs = curr.getTime() - prev.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
}

/**
 * Função principal: recebe repos e eventos brutos, retorna tudo agregado.
 */
export function aggregateStats(
  repos: GitHubRepo[],
  events: GitHubEvent[]
): WrappedStats {
  const ownRepos = repos.filter((r) => !r.fork);
  const mostActive = calcMostActiveRepo(events);

  return {
    publicRepos: ownRepos.length,
    totalCommits: calcTotalCommits(events),
    topLanguages: calcTopLanguages(repos),
    peakHour: calcPeakHour(events),
    longestStreak: calcLongestStreak(events),
    mostActiveRepo: mostActive.name,
    mostActiveRepoEvents: mostActive.events,
  };
}
