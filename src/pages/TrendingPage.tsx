// src/pages/TrendingPage.tsx
import type { Locale, translations } from '../i18n/translations';

interface TrendingPageProps {
  locale: Locale;
  t: (typeof translations)[Locale];
}

export function TrendingPage({ locale, t }: TrendingPageProps) {
  const messages = {
    pt: {
      title: 'Trending no GitHub',
      subtitle: 'Em breve: descubra os repositórios em alta e explore quem está por trás deles.',
    },
    en: {
      title: 'GitHub Trending',
      subtitle: 'Coming soon: discover trending repos and explore who is behind them.',
    },
  };

  const m = messages[locale];

  // referências para evitar warning de "não usado" enquanto é placeholder
  void t;

  return (
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
        trending_up
      </span>
      <div style={{
        fontSize: '18px',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: '8px',
      }}>
        {m.title}
      </div>
      <div style={{ maxWidth: '400px', margin: '0 auto', lineHeight: 1.6 }}>
        {m.subtitle}
      </div>
    </div>
  );
}
