// src/pages/TrendingPage.tsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TrendingCard } from '../components/TrendingCard';
import { FilterBar } from '../components/FilterBar';
import type { Period } from '../components/FilterBar';
import type { Locale, translations } from '../i18n/translations';

interface TrendingRepo {
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

interface TrendingPageProps {
  locale: Locale;
  t: (typeof translations)[Locale];
}

const VALID_PERIODS: Period[] = ['day', 'week', 'month'];

export function TrendingPage({ locale, t }: TrendingPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const language = searchParams.get('language') || '';
  const periodFromUrl = searchParams.get('period') || 'week';
  const period: Period = VALID_PERIODS.includes(periodFromUrl as Period)
    ? (periodFromUrl as Period)
    : 'week';

  const [repos, setRepos] = useState<TrendingRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const messages = {
    pt: {
      empty: 'Nenhum repositório encontrado com esses filtros.',
      loading: 'Buscando repositórios em alta...',
    },
    en: {
      empty: 'No repositories found with these filters.',
      loading: 'Fetching trending repos...',
    },
  };
  const m = messages[locale];

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      params.set('period', period);
      if (language) params.set('language', language);

      try {
        const response = await fetch(
          `/.netlify/functions/trending?${params.toString()}`
        );
        if (!response.ok) throw new Error('API error');
        const data = await response.json();
        setRepos(data.repos || []);
      } catch {
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, [language, period, t.error]);

  const handleLanguageChange = (lang: string) => {
    const next = new URLSearchParams(searchParams);
    if (lang) next.set('language', lang);
    else next.delete('language');
    setSearchParams(next);
  };

  const handlePeriodChange = (p: Period) => {
    const next = new URLSearchParams(searchParams);
    next.set('period', p);
    setSearchParams(next);
  };

  return (
    <div>
      <FilterBar
        locale={locale}
        language={language}
        period={period}
        onLanguageChange={handleLanguageChange}
        onPeriodChange={handlePeriodChange}
      />

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
          {m.loading}
        </div>
      )}

      {error && !loading && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#ef4444', fontSize: '14px' }}>
          {error}
        </div>
      )}

      {!loading && !error && repos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
          {m.empty}
        </div>
      )}

      {!loading && !error && repos.length > 0 && (
        <div className="trending-grid">
          {repos.map((repo) => (
            <TrendingCard
              key={repo.fullName}
              fullName={repo.fullName}
              description={repo.description}
              url={repo.url}
              stars={repo.stars}
              language={repo.language}
              ownerUsername={repo.owner.username}
              ownerAvatarUrl={repo.owner.avatarUrl}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}
