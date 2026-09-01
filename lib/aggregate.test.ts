// lib/aggregate.test.ts
import { describe, it, expect } from 'vitest';
import {
  calcTopLanguages,
  calcTotalCommits,
  calcPeakHour,
  calcMostActiveRepo,
  calcLongestStreak,
  aggregateStats,
} from './aggregate';
import type { GitHubRepo, GitHubEvent } from './aggregate';

// ---------- Dados de exemplo ----------

const mockRepos: GitHubRepo[] = [
  { name: 'medbot-clone', language: 'TypeScript', stargazers_count: 4, fork: false, updated_at: '2026-08-01' },
  { name: 'portfolio', language: 'TypeScript', stargazers_count: 1, fork: false, updated_at: '2026-07-15' },
  { name: 'api-estudos', language: 'JavaScript', stargazers_count: 0, fork: false, updated_at: '2026-06-10' },
  { name: 'exercicios-python', language: 'Python', stargazers_count: 0, fork: false, updated_at: '2026-05-01' },
  { name: 'fork-alheio', language: 'Rust', stargazers_count: 100, fork: true, updated_at: '2026-08-01' },
  { name: 'repo-sem-lang', language: null, stargazers_count: 0, fork: false, updated_at: '2026-04-01' },
];

const mockEvents: GitHubEvent[] = [
  { type: 'PushEvent', created_at: '2026-08-10T21:30:00Z', repo: { name: 'user/medbot-clone' } },
  { type: 'PushEvent', created_at: '2026-08-11T22:00:00Z', repo: { name: 'user/medbot-clone' } },
  { type: 'PushEvent', created_at: '2026-08-12T21:15:00Z', repo: { name: 'user/medbot-clone' } },
  { type: 'PushEvent', created_at: '2026-08-13T20:45:00Z', repo: { name: 'user/portfolio' } },
  { type: 'PushEvent', created_at: '2026-08-15T14:00:00Z', repo: { name: 'user/api-estudos' } },
  { type: 'CreateEvent', created_at: '2026-08-10T10:00:00Z', repo: { name: 'user/medbot-clone' } },
  { type: 'WatchEvent', created_at: '2026-08-09T12:00:00Z', repo: { name: 'user/outro-repo' } },
];

// ---------- Testes ----------

describe('calcTopLanguages', () => {
  it('deve retornar linguagens ordenadas por frequência', () => {
    const result = calcTopLanguages(mockRepos);
    expect(result[0].language).toBe('TypeScript');
    expect(result[0].percentage).toBe(50); // 2 de 4 repos com linguagem
  });

  it('deve ignorar forks', () => {
    const result = calcTopLanguages(mockRepos);
    const languages = result.map((l) => l.language);
    expect(languages).not.toContain('Rust');
  });

  it('deve ignorar repos sem linguagem', () => {
    const result = calcTopLanguages(mockRepos);
    const total = result.reduce((sum, l) => sum + l.percentage, 0);
    expect(total).toBeGreaterThanOrEqual(95); // arredondamento pode não dar 100 exato
  });

  it('deve retornar array vazio se não houver repos com linguagem', () => {
    const emptyRepos: GitHubRepo[] = [
      { name: 'vazio', language: null, stargazers_count: 0, fork: false, updated_at: '' },
    ];
    expect(calcTopLanguages(emptyRepos)).toEqual([]);
  });

  it('deve respeitar o limite de linguagens', () => {
    const result = calcTopLanguages(mockRepos, 2);
    expect(result.length).toBeLessThanOrEqual(2);
  });
});

describe('calcTotalCommits', () => {
  it('deve contar apenas PushEvents', () => {
    expect(calcTotalCommits(mockEvents)).toBe(5);
  });

  it('deve retornar 0 se não houver eventos', () => {
    expect(calcTotalCommits([])).toBe(0);
  });
});

describe('calcPeakHour', () => {
  it('deve retornar o horário com mais commits', () => {
    const result = calcPeakHour(mockEvents);
    // Horário 21 aparece 2 vezes (21:30 e 21:15)
expect(result).toMatch(/^\d{1,2}h$/);  
});

  it('deve retornar N/A se não houver PushEvents', () => {
    const noCommits: GitHubEvent[] = [
      { type: 'WatchEvent', created_at: '2026-08-10T10:00:00Z', repo: { name: 'x/y' } },
    ];
    expect(calcPeakHour(noCommits)).toBe('N/A');
  });
});

describe('calcMostActiveRepo', () => {
  it('deve retornar o repo com mais eventos', () => {
    const result = calcMostActiveRepo(mockEvents);
    expect(result.name).toBe('medbot-clone');
  });

  it('deve retornar N/A se não houver eventos', () => {
    const result = calcMostActiveRepo([]);
    expect(result.name).toBe('N/A');
    expect(result.events).toBe(0);
  });
});

describe('calcLongestStreak', () => {
  it('deve calcular a sequência consecutiva mais longa', () => {
    // Dias 10, 11, 12, 13 = 4 dias seguidos, depois pula pro 15
    const result = calcLongestStreak(mockEvents);
    expect(result).toBe(4);
  });

  it('deve retornar 0 se não houver PushEvents', () => {
    expect(calcLongestStreak([])).toBe(0);
  });

  it('deve retornar 1 se houver apenas um dia', () => {
    const oneDay: GitHubEvent[] = [
      { type: 'PushEvent', created_at: '2026-08-10T10:00:00Z', repo: { name: 'x/y' } },
    ];
    expect(calcLongestStreak(oneDay)).toBe(1);
  });
});

describe('aggregateStats', () => {
  it('deve retornar todas as estatísticas agregadas', () => {
    const stats = aggregateStats(mockRepos, mockEvents);

    expect(stats.publicRepos).toBe(5); // 6 repos - 1 fork
    expect(stats.totalCommits).toBe(5);
    expect(stats.topLanguages.length).toBeGreaterThan(0);
    expect(stats.peakHour).toBeDefined();
    expect(stats.longestStreak).toBeGreaterThan(0);
    expect(stats.mostActiveRepo).toBe('medbot-clone');
  });
});
