// src/pages/TrendingPage.tsx
import { useState, useEffect } from 'react';
import { TrendingCard } from '../components/TrendingCard';
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

export function TrendingPage({ locale, t }: TrendingPageProps) {
  const [repos, setRepos] = useState<TrendingRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const messages = {
    pt: {
      title: 'Repositórios em alta',
      subtitle: 'Descubra o que está bombando no GitHub esta semana',
      empty: 'Nenhum repositório encontrado.',
      loading: 'Buscando repositórios em alta...',
    },
    en: {
      title: 'Trending repositories',
      subtitle: 'Discover what is trending on GitHub this week',
      empty: 'No repositories found.',
      loading: 'Fetching trending repos...',
    },
  };
  const m = messages[locale];

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/.netlify/functions/trending?period=week');
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
  }, [t.error]);

  return (
    <div>
      <div style={{
        textAlign: 'center',
        marginBottom: '28px',
      }}>
        <div style={{
          fontSize: '20px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '6px',
        }}>
          {m.title}
        </div>
        <div style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
        }}>
          {m.subtitle}
        </div>
      </div>

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
          {m.loading}
        </div>
      )}

      {error && !loading && (
        <div style={{
          textAlign: 'center',
          padding: '60px 0',
          color: '#ef4444',
          fontSize: '14px',
        }}>
          {error}
        </div>
      )}

      {!loading && !error && repos.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 0',
          color: 'var(--text-secondary)',
          fontSize: '14px',
        }}>
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
