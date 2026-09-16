// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { useLocale } from './hooks/useLocale';
import { Header } from './components/Header';
import { Nav } from './components/Nav';
import { WrappedPage } from './pages/WrappedPage';
import { TrendingPage } from './pages/TrendingPage';
import type { Locale } from './i18n/translations';

interface HeroProps {
  locale: Locale;
}

function Hero({ locale }: HeroProps) {
  const location = useLocation();
  const isTrending = location.pathname === '/trending';

  const heroContent = {
    pt: {
      badge: 'Powered by IA · Gemini',
      wrappedTitle: 'Descubra sua\npersonalidade dev',
      wrappedSubtitle: 'Analise o perfil de qualquer usuário do GitHub e receba um resumo visual com narrativa gerada por IA.',
      trendingBadge: 'Atualizado agora',
      trendingTitle: 'Repositórios em alta',
      trendingSubtitle: 'Descubra o que está bombando no GitHub e explore os devs por trás',
    },
    en: {
      badge: 'Powered by AI · Gemini',
      wrappedTitle: 'Discover your\ndev personality',
      wrappedSubtitle: 'Analyze any GitHub profile and get a visual summary with AI-generated narrative.',
      trendingBadge: 'Updated now',
      trendingTitle: 'Trending repositories',
      trendingSubtitle: 'Discover what is trending on GitHub and explore the devs behind it',
    },
  };
  const c = heroContent[locale];

  return (
    <div className="hero-content" style={{ marginTop: '40px' }}>
      <div className="nav-wrapper">
        <Nav locale={locale} />
      </div>

      <div className="hero-badge">
        <span className="hero-badge-dot" />
        {isTrending ? c.trendingBadge : c.badge}
      </div>

      {isTrending ? (
        <>
          <h1 className="hero-title-small">{c.trendingTitle}</h1>
          <p className="hero-subtitle-small">{c.trendingSubtitle}</p>
        </>
      ) : (
        <>
          <h1 className="hero-title" style={{ whiteSpace: 'pre-line' }}>
            {c.wrappedTitle}
          </h1>
          <p className="hero-subtitle">{c.wrappedSubtitle}</p>
        </>
      )}
    </div>
  );
}

function AppLayout() {
  const { isDark, toggleTheme } = useTheme();
  const { locale, toggleLocale, t } = useLocale();

  return (
    <>
      <div className="hero-section">
        <div className="app-container" style={{ paddingBottom: 0 }}>
          <Header
            isDark={isDark}
            locale={locale}
            onToggleTheme={toggleTheme}
            onToggleLocale={toggleLocale}
          />
          <Hero locale={locale} />
        </div>
      </div>

      <div className="app-container content-section">
        <Routes>
          <Route path="/" element={<Navigate to="/wrapped" replace />} />
          <Route
            path="/wrapped"
            element={<WrappedPage locale={locale} t={t} />}
          />
          <Route
            path="/trending"
            element={<TrendingPage locale={locale} t={t} />}
          />
        </Routes>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
