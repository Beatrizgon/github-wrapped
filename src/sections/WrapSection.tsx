// src/sections/WrapSection.tsx
import { useState, useEffect, useCallback } from 'react';
import { StatsCard } from '../components/StatsCard';
import { LanguageChart } from '../components/LanguageChart';
import { WeekChart } from '../components/WeekChart';
import { NarrativeCard } from '../components/NarrativeCard';
import type { Locale, translations } from '../i18n/translations';

interface TopRepo { name: string; events: number; }
interface WrappedData {
  username: string; avatarUrl: string; publicRepos: number; totalCommits: number;
  totalStars: number; topLanguages: { language: string; percentage: number }[];
  peakHour: string; longestStreak: number; topRepos: TopRepo[];
  weekActivity: number[]; narrative: string;
}

interface WrapSectionProps {
  username: string; triggerCount: number; locale: Locale;
  t: (typeof translations)[Locale];
  onLoadingChange: (loading: boolean) => void;
}

const card: React.CSSProperties = {
  background: 'linear-gradient(315deg, rgba(139,92,246,0.04) 0%, transparent 60%), var(--bg-card)',
  border: '1px solid var(--border)', borderRadius: '14px', boxShadow: 'var(--shadow)',
};

export function WrapSection({ username, triggerCount, locale, t, onLoadingChange }: WrapSectionProps) {
  const [data, setData] = useState<WrappedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWrapped = useCallback(async (user: string) => {
    setLoading(true); onLoadingChange(true); setError(''); setData(null);
    try {
      const r = await fetch(`/.netlify/functions/wrapped?username=${encodeURIComponent(user)}&locale=${locale}`);
      if (!r.ok) throw new Error('err');
      setData(await r.json());
    } catch { setError(t.error); }
    finally { setLoading(false); onLoadingChange(false); }
  }, [locale, t.error, onLoadingChange]);

  useEffect(() => { if (username && triggerCount > 0) fetchWrapped(username); }, [username, triggerCount, fetchWrapped]);

  if (!username && !loading && !error && !data) return null;

  // Calcular porcentagem dos top repos
  const totalRepoEvents = data ? data.topRepos.reduce((s, r) => s + r.events, 0) : 0;

  return (
    <>
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
          {t.loading}
        </div>
      )}
      {error && <div style={{ textAlign: 'center', padding: '60px 0', color: '#ef4444', fontSize: '14px' }}>{error}</div>}

      {data && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px', padding: '18px 24px', ...card }}>
            <img src={data.avatarUrl} alt={data.username} style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid var(--border-strong)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>{data.username}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {t.activity} 2025 {t.to} 2026 · <span style={{ color: 'var(--accent-light)' }}>{data.publicRepos} {t.stats.repos.toLowerCase()}</span>
              </div>
            </div>
            <div style={{ padding: '6px 16px', background: 'rgba(139,92,246,0.15)', border: '1px solid var(--border-strong)', borderRadius: '100px', fontSize: '12px', fontWeight: 700, color: 'var(--accent-lighter)' }}>
              2026 {t.wrap.toUpperCase()}
            </div>
          </div>

          <div className="stats-grid">
            <StatsCard icon="commit" label={t.stats.commits} value={data.totalCommits} subtitle={t.stats.commitsDesc} />
            <StatsCard icon="local_fire_department" label={t.stats.streak} value={`${data.longestStreak} ${t.stats.streakDays}`} subtitle={t.stats.streakDesc} />
            <StatsCard icon="folder_open" label={t.stats.repos} value={data.publicRepos} subtitle={t.stats.reposDesc} />
            <StatsCard icon="schedule" label={t.stats.peakHour} value={data.peakHour} subtitle={t.stats.peakHourDesc} />
            <StatsCard icon="star" label={t.stats.stars} value={data.totalStars} subtitle={t.stats.starsDesc} />
            <StatsCard icon="calendar_month" label="ANO" value="2026" subtitle="wrap atual" />
          </div>

          <div className="middle-grid">
            <LanguageChart title={t.languages} languages={data.topLanguages} />

            <div style={{ padding: '20px', ...card }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                <span className="material-symbols-rounded" style={{ fontSize: '18px', color: 'var(--accent-light)' }}>star</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{t.topRepos}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '4px' }}>{t.topReposDesc}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {data.topRepos.map((repo) => {
                  const pct = totalRepoEvents > 0 ? Math.round((repo.events / totalRepoEvents) * 100) : 0;
                  return (
                    <div key={repo.name}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="material-symbols-rounded" style={{ fontSize: '16px', color: 'var(--accent-light)' }}>emoji_events</span>
                          <span style={{ fontSize: '13px', fontWeight: 700 }}>{repo.name}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{repo.events} {t.events}</span>
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--accent-light)', fontWeight: 700 }}>{pct}%</span>
                      </div>
                      <div style={{ height: '6px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: 'var(--gradient-accent)', borderRadius: '4px', transition: 'width 0.4s ease' }} />
                      </div>
                    </div>
                  );
                })}
                {data.topRepos.length === 0 && <div style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>N/A</div>}
              </div>
            </div>
          </div>

          <div className="bottom-grid">
            <WeekChart title={t.weekActivity} dayLabels={t.days} data={data.weekActivity} />
            <NarrativeCard title={t.narrative} text={data.narrative || t.narrativePlaceholder} />
          </div>
        </>
      )}
    </>
  );
}
