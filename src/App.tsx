// src/App.tsx
import { useTheme } from './hooks/useTheme';
import { useLocale } from './hooks/useLocale';
import { Header } from './components/Header';
import { UsernameForm } from './components/UsernameForm';
import { StatsCard } from './components/StatsCard';
import { LanguageChart } from './components/LanguageChart';
import { NarrativeCard } from './components/NarrativeCard';

// Dados de exemplo para o esqueleto visual (serão substituídos na fase 4)
const mockData = {
  username: 'Beatrizgon',
  publicRepos: 12,
  totalCommits: 482,
  peakHour: '21h',
  longestStreak: 14,
  mostActiveRepo: 'medbot-clone',
  mostActiveRepoEvents: 187,
  topLanguages: [
    { language: 'TypeScript', percentage: 45 },
    { language: 'JavaScript', percentage: 30 },
    { language: 'Python', percentage: 15 },
    { language: 'HTML / CSS', percentage: 10 },
  ],
};

function App() {
  const { isDark, toggleTheme } = useTheme();
  const { locale, toggleLocale, t } = useLocale();

  const handleSearch = (username: string) => {
    console.log('Buscar:', username);
    // Fase 4: conectar à API real
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

      <div className="stats-grid">
        <StatsCard
          icon="commit"
          label={t.stats.commits}
          value={mockData.totalCommits}
          subtitle={t.stats.commitsDesc}
        />
        <StatsCard
          icon="local_fire_department"
          label={t.stats.streak}
          value={`${mockData.longestStreak} ${t.stats.streakDays}`}
          subtitle={t.stats.streakDesc}
        />
        <StatsCard
          icon="folder_open"
          label={t.stats.repos}
          value={mockData.publicRepos}
          subtitle={t.stats.reposDesc}
        />
        <StatsCard
          icon="schedule"
          label={t.stats.peakHour}
          value={mockData.peakHour}
          subtitle={t.stats.peakHourDesc}
        />
      </div>

      <div className="middle-grid">
        <LanguageChart
          title={t.languages}
          languages={mockData.topLanguages}
        />

        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '18px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '16px',
            }}
          >
            <span
              className="material-symbols-rounded"
              style={{ fontSize: '18px', color: 'var(--accent)' }}
            >
              star
            </span>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              {t.mostActive}
            </span>
          </div>
          <div
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '14px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
              }}
            >
              <span
                className="material-symbols-rounded"
                style={{ fontSize: '16px', color: 'var(--accent)' }}
              >
                folder_special
              </span>
              <span style={{ fontSize: '14px', fontWeight: 700 }}>
                {mockData.mostActiveRepo}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '16px',
                fontSize: '12px',
                color: 'var(--text-secondary)',
              }}
            >
              <span
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span
                  className="material-symbols-rounded"
                  style={{ fontSize: '16px' }}
                >
                  commit
                </span>
                {mockData.mostActiveRepoEvents} {t.mostActiveEvents}
              </span>
            </div>
          </div>
        </div>
      </div>

      <NarrativeCard
        title={t.narrative}
        text={t.narrativePlaceholder}
      />
    </div>
  );
}

export default App;
