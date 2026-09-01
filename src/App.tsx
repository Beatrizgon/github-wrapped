// src/App.tsx
import { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { useLocale } from './hooks/useLocale';
import { Header } from './components/Header';
import { UsernameForm } from './components/UsernameForm';
import { StatsCard } from './components/StatsCard';
import { LanguageChart } from './components/LanguageChart';
import { NarrativeCard } from './components/NarrativeCard';

interface WrappedData {
  username: string;
  avatarUrl: string;
  publicRepos: number;
  totalCommits: number;
  topLanguages: { language: string; percentage: number }[];
  peakHour: string;
  longestStreak: number;
  mostActiveRepo: string;
  mostActiveRepoEvents: number;
}

function App() {
  const { isDark, toggleTheme } = useTheme();
  const { locale, toggleLocale, t } = useLocale();

  const [data, setData] = useState<WrappedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (username: string) => {
    setLoading(true);
    setError('');
    setData(null);

    try {
      const response = await fetch(
        `/.netlify/functions/wrapped?username=${encodeURIComponent(username)}`
      );

      if (!response.ok) {
        throw new Error('API error');
      }

      const result: WrappedData = await response.json();
      setData(result);
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Header
        isDark={isDark}
        locale={locale}
        onToggleTheme={toggleTheme}
        onToggleLocale={toggleLocale}
      />

      <UsernameForm
        placeholder={t.searchPlaceholder}
        buttonText={t.searchButton}
        onSubmit={handleSearch}
      />

      {loading && (
        <div style={{
          textAlign: 'center',
          padding: '60px 0',
          color: 'var(--text-secondary)',
          fontSize: '14px',
        }}>
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
        <div style={{
          textAlign: 'center',
          padding: '60px 0',
          color: '#ef4444',
          fontSize: '14px',
        }}>
          {error}
        </div>
      )}

      {!data && !loading && !error && (
        <div style={{
          textAlign: 'center',
          padding: '80px 0',
          color: 'var(--text-secondary)',
          fontSize: '14px',
        }}>
          <span
            className="material-symbols-rounded"
            style={{
              fontSize: '48px',
              color: 'var(--accent)',
              display: 'block',
              marginBottom: '16px',
              opacity: 0.4,
            }}
          >
            person_search
          </span>
          {t.subtitle}
        </div>
      )}

      {data && (
        <>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginBottom: '24px',
            padding: '16px 18px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
          }}>
            <img
              src={data.avatarUrl}
              alt={data.username}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
              }}
            />
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700 }}>
                {data.username}
              </div>
              <div style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginTop: '2px',
              }}>
                {t.activity} 2025 {t.to} 2026
              </div>
            </div>
            <div style={{
              marginLeft: 'auto',
              background: 'rgba(139, 92, 246, 0.12)',
              color: 'var(--accent)',
              fontSize: '11px',
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: '6px',
            }}>
              2026 {t.wrap}
            </div>
          </div>

          <div className="stats-grid">
            <StatsCard
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
          </div>

          <div className="middle-grid">
            <LanguageChart
              title={t.languages}
              languages={data.topLanguages}
            />

            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '18px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '16px',
              }}>
                <span
                  className="material-symbols-rounded"
                  style={{ fontSize: '18px', color: 'var(--accent)' }}
                >
                  star
                </span>
                <span style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}>
                  {t.mostActive}
                </span>
              </div>
              <div style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '14px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                }}>
                  <span
                    className="material-symbols-rounded"
                    style={{ fontSize: '16px', color: 'var(--accent)' }}
                  >
                    folder_special
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 700 }}>
                    {data.mostActiveRepo}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <span
                      className="material-symbols-rounded"
                      style={{ fontSize: '16px' }}
                    >
                      commit
                    </span>
                    {data.mostActiveRepoEvents} {t.mostActiveEvents}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <NarrativeCard
            title={t.narrative}
            text={t.narrativePlaceholder}
          />
        </>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
