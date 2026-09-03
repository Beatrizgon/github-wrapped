// lib/aggregate.ts

export interface GitHubRepo {
  name: string;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  updated_at: string;
  description?: string | null;
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

export interface TopRepo {
  name: string;
  events: number;
}

export interface WrappedStats {
  publicRepos: number;
  totalCommits: number;
  totalStars: number;
  topLanguages: LanguageStat[];
  peakHour: string;
  longestStreak: number;
  topRepos: TopRepo[];
  weekActivity: number[];
}

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

export function calcTotalCommits(events: GitHubEvent[]): number {
  return events.filter((e) => e.type === 'PushEvent').length;
}

export function calcTotalStars(repos: GitHubRepo[]): number {
  return repos
    .filter((r) => !r.fork)
    .reduce((sum, r) => sum + r.stargazers_count, 0);
}

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

export function calcTopRepos(
  events: GitHubEvent[],
  limit = 2
): TopRepo[] {
  if (events.length === 0) return [];

  const repoCount: Record<string, number> = {};
  events.forEach((e) => {
    const name = e.repo.name.split('/')[1] || e.repo.name;
    repoCount[name] = (repoCount[name] || 0) + 1;
  });

  return Object.entries(repoCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, events]) => ({ name, events }));
}

export function calcWeekActivity(events: GitHubEvent[]): number[] {
  const pushEvents = events.filter((e) => e.type === 'PushEvent');
  // [dom, seg, ter, qua, qui, sex, sab]
  const days = [0, 0, 0, 0, 0, 0, 0];

  pushEvents.forEach((e) => {
    const day = new Date(e.created_at).getDay();
    days[day]++;
  });

  return days;
}

export function calcLongestStreak(events: GitHubEvent[]): number {
  const pushEvents = events.filter((e) => e.type === 'PushEvent');

  if (pushEvents.length === 0) return 0;

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

export function aggregateStats(
  repos: GitHubRepo[],
  events: GitHubEvent[]
): WrappedStats {
  const ownRepos = repos.filter((r) => !r.fork);

  return {
    publicRepos: ownRepos.length,
    totalCommits: calcTotalCommits(events),
    totalStars: calcTotalStars(repos),
    topLanguages: calcTopLanguages(repos),
    peakHour: calcPeakHour(events),
    longestStreak: calcLongestStreak(events),
    topRepos: calcTopRepos(events, 2),
    weekActivity: calcWeekActivity(events),
  };
}
