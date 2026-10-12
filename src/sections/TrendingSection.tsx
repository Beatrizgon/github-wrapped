// src/sections/TrendingSection.tsx
import { useState, useEffect } from 'react';
import { TrendingCard } from '../components/TrendingCard';
import type { Locale, translations } from '../i18n/translations';

type Period = 'day' | 'week' | 'month';
interface TrendingRepo {
  name: string; fullName: string; description: string | null; readmePreview: string | null;
  hasReadme: boolean; url: string;
  stars: number; language: string | null;
  owner: { username: string; avatarUrl: string };
}
interface TrendingSectionProps { locale: Locale; t: (typeof translations)[Locale]; onGenerateWrap: (u: string) => void; }

const LANGUAGES = [
  { value: '', pt: 'Todas linguagens', en: 'All languages' },
  { value: 'typescript', pt: 'TypeScript', en: 'TypeScript' },
  { value: 'javascript', pt: 'JavaScript', en: 'JavaScript' },
  { value: 'python', pt: 'Python', en: 'Python' },
  { value: 'java', pt: 'Java', en: 'Java' },
  { value: 'go', pt: 'Go', en: 'Go' },
  { value: 'rust', pt: 'Rust', en: 'Rust' },
  { value: 'php', pt: 'PHP', en: 'PHP' },
  { value: 'swift', pt: 'Swift', en: 'Swift' },
  { value: 'kotlin', pt: 'Kotlin', en: 'Kotlin' },
];
const PERIODS: { value: Period; pt: string; en: string }[] = [
  { value: 'day', pt: 'Hoje', en: 'Today' },
  { value: 'week', pt: 'Semana', en: 'Week' },
  { value: 'month', pt: 'Mês', en: 'Month' },
];

export function TrendingSection({ locale, t, onGenerateWrap }: TrendingSectionProps) {
  const [language, setLanguage] = useState('');
  const [period, setPeriod] = useState<Period>('week');
  const [repos, setRepos] = useState<TrendingRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const f = async () => {
      setLoading(true); setError('');
      const p = new URLSearchParams({ period }); if (language) p.set('language', language);
      try {
        const r = await fetch(`/.netlify/functions/trending?${p.toString()}`);
        if (!r.ok) throw new Error('err');
        setRepos((await r.json()).repos || []);
      } catch { setError(t.trendingError); }
      finally { setLoading(false); }
    };
    f();
  }, [language, locale, period, t.trendingError]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="material-symbols-rounded filled" style={{ color: 'var(--accent-light)', fontSize: '28px' }}>local_fire_department</span>
          <span style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
            {locale === 'pt' ? 'Em alta no GitHub' : 'Trending on GitHub'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-strong)', background: 'var(--bg-primary)', color: 'var(--text-secondary)', fontFamily: 'inherit', fontSize: '13px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
            {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l[locale]}</option>)}
          </select>
          <div style={{ display: 'flex', gap: '2px', border: '1px solid var(--border-strong)', borderRadius: '8px', padding: '3px' }}>
            {PERIODS.map(p => (
              <button key={p.value} onClick={() => setPeriod(p.value)}
                style={{ padding: '6px 14px', borderRadius: '6px', border: 'none',
                  background: p.value === period ? 'var(--gradient-accent)' : 'transparent',
                  color: p.value === period ? '#fff' : 'var(--text-muted)',
                  fontFamily: 'inherit', fontSize: '13px', fontWeight: p.value === period ? 700 : 600, cursor: 'pointer',
                  boxShadow: p.value === period ? '0 2px 8px rgba(139,92,246,0.4)' : 'none',
                }}>
                {p[locale]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
          <span className="material-symbols-rounded" style={{ fontSize: '32px', color: 'var(--accent)', display: 'block', marginBottom: '12px', animation: 'spin 1s linear infinite' }}>progress_activity</span>
          {locale === 'pt' ? 'Buscando...' : 'Loading...'}
        </div>
      )}
      {error && !loading && <div style={{ textAlign: 'center', padding: '60px 0', color: '#ef4444', fontSize: '14px' }}>{error}</div>}
      {!loading && !error && repos.length === 0 && <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>{locale === 'pt' ? 'Nenhum repositório encontrado.' : 'No repos found.'}</div>}

      {!loading && !error && repos.length > 0 && (
        <div className="trending-grid">
          {repos.map((repo) => (
            <TrendingCard key={repo.fullName} fullName={repo.fullName} description={repo.description}
              readmePreview={repo.readmePreview} hasReadme={repo.hasReadme}
              url={repo.url} stars={repo.stars} language={repo.language}
              ownerUsername={repo.owner.username} ownerAvatarUrl={repo.owner.avatarUrl}
              locale={locale} t={t} onGenerateWrap={onGenerateWrap} />
          ))}
        </div>
      )}
    </div>
  );
}
