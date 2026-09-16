// src/pages/WrappedPage.tsx
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { UsernameForm } from '../components/UsernameForm';
import { StatsCard } from '../components/StatsCard';
import { LanguageChart } from '../components/LanguageChart';
import { WeekChart } from '../components/WeekChart';
import { NarrativeCard } from '../components/NarrativeCard';
import type { Locale, translations } from '../i18n/translations';

interface TopRepo {
  name: string;
  events: number;
}

interface WrappedData {
  username: string;
  avatarUrl: string;
  publicRepos: number;
  totalCommits: number;
  totalStars: number;
  topLanguages: { language: string; percentage: number }[];
  peakHour: string;
  longestStreak: number;
  topRepos: TopRepo[];
  weekActivity: number[];
  narrative: string;
}

interface WrappedPageProps {
  locale: Locale;
  t: (typeof translations)[Locale];
}

const subtleGradientCard: React.CSSProperties = {
  background:
    'linear-gradient(315deg, rgba(139, 92, 246, 0.04) 0%, transparent 60%), var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: '14px',
  backdropFilter: 'blur(10px)',
  boxShadow: 'var(--shadow)',
};

export function WrappedPage({ locale, t }: WrappedPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const usernameFromUrl = searchParams.get('u') || '';

  const [data, setData] = useState<WrappedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');

  const fetchWrapped = useCallback(
    async (username: string) => {
      setLoading(true);
      setError('');
      setData(null);
      setCurrentUsername(username);

      try {
        const response = await fetch(
          `/.netlify/functions/wrapped?username=${encodeURIComponent(username)}&locale=${locale}`
        );
        if (!response.ok) throw new Error('API error');
        const result: WrappedData = await response.json();
        setData(result);
      } catch {
        setError(t.error);
      } finally {
        setLoading(false);
      }
    },
    [locale, t.error]
  );

  useEffect(() => {
    if (usernameFromUrl && usernameFromUrl !== currentUsername) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchWrapped(usernameFromUrl);
    }
  }, [usernameFromUrl, currentUsername, fetchWrapped]);

  const handleSearch = (username: string) => {
    setSearchParams({ u: username });
  };

  return (
    <>
      <div className="search-wrapper">
        <UsernameForm
          placeholder={t.searchPlaceholder}
          buttonText={t.searchButton}
          onSubmit={handleSearch}
        />
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
          <span
            className="material-symbols-rounded"
            style={{
              fontSize: '32px',
              color: 'var(--accent)',
              display: 'block',
              marginBottom: '12px',
              animation: 'spin 1s linear infinite',
            }}
          >
            progress_activity
          </span>
          {t.loading}
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#ef4444', fontSize: '14px' }}>
          {error}
        </div>
      )}

      {data && (
        <>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '18px',
            padding: '18px 22px',
            ...subtleGradientCard,
          }}>
            <img
              src={data.avatarUrl}
              alt={data.username}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                border: '2px solid var(--border-strong)',
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.3px' }}>
                {data.username}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                {t.activity} 2025 {t.to} 2026 · <span style={{ color: 'var(--accent-light)' }}>{data.publicRepos} {t.stats.repos.toLowerCase()}</span>
              </div>
            </div>
            <div style={{
              padding: '6px 14px',
              background: 'rgba(139, 92, 246, 0.15)',
              border: '1px solid var(--border-strong)',
              borderRadius: '100px',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--accent-lighter)',
              letterSpacing: '0.5px',
            }}>
              2026 {t.wrap.toUpperCase()}
            </div>
          </div>

          <div className="stats-grid">
            <StatsCard
              featured
              icon="commit"
              label={t.stats.commits}
              value={data.totalCommits}
              subtitle={t.stats.commitsDesc}
            />
            <StatsCard
              icon="local_fire_department"
              label={t.stats.streak}
              value={`${data.longestStreak} ${t.stats.streakDays}`}
              subtitle={t.stats.streakDesc}
            />
            <StatsCard
              icon="folder_open"
              label={t.stats.repos}
              value={data.publicRepos}
              subtitle={t.stats.reposDesc}
            />
            <StatsCard
              icon="schedule"
              label={t.stats.peakHour}
              value={data.peakHour}
              subtitle={t.stats.peakHourDesc}
            />
            <StatsCard
              icon="star"
              label={t.stats.stars}
              value={data.totalStars}
              subtitle={t.stats.starsDesc}
            />
            <StatsCard
              icon="calendar_month"
              label="ANO"
              value="2026"
              subtitle="wrap atual"
            />
          </div>

          <div className="middle-grid">
            <LanguageChart title={t.languages} languages={data.topLanguages} />

            <div style={{ padding: '20px', ...subtleGradientCard }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span className="material-symbols-rounded" style={{ fontSize: '18px', color: 'var(--accent-light)' }}>
                  star
                </span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>
                  {t.topRepos}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginLeft: '4px' }}>
                  {t.topReposDesc}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {data.topRepos.map((repo, i) => (
                  <div key={repo.name} style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: '10px',
                    padding: '14px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span
                        className="material-symbols-rounded"
                        style={{ fontSize: '16px', color: 'var(--accent-light)' }}
                      >
                        {i === 0 ? 'emoji_events' : 'folder_special'}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 700 }}>{repo.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span className="material-symbols-rounded" style={{ fontSize: '14px' }}>commit</span>
                        {repo.events} {t.events}
                      </span>
                    </div>
                  </div>
                ))}
                {data.topRepos.length === 0 && (
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
                    N/A
                  </div>
                )}
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
