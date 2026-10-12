// src/App.tsx
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from './hooks/useTheme';
import { useLocale } from './hooks/useLocale';
import { Header } from './components/Header';
import { UsernameForm } from './components/UsernameForm';
import { WrapSection } from './sections/WrapSection';
import { TrendingSection } from './sections/TrendingSection';

function App() {
  const { isDark, toggleTheme } = useTheme();
  const { locale, toggleLocale, t } = useLocale();
  const [activeSection, setActiveSection] = useState<'home' | 'wrap' | 'trending'>('home');
  const [wrapUsername, setWrapUsername] = useState('');
  const [triggerCount, setTriggerCount] = useState(0);
  const [wrapLoading, setWrapLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const u = params.get('u');
    if (u) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWrapUsername(u);
      setTriggerCount((c) => c + 1);
    }
  }, []);

  const handleGenerateWrap = useCallback((username: string) => {
    setWrapUsername(username);
    setTriggerCount((c) => c + 1);
    setActiveSection('wrap');
    const url = new URL(window.location.href);
    url.searchParams.set('u', username);
    window.history.replaceState({}, '', url.toString());
    document.getElementById('wrap-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleSurpriseMe = useCallback(async () => {
    try {
      const response = await fetch('/.netlify/functions/trending?period=week');
      if (!response.ok) return;
      const data = await response.json();
      const repos = data.repos || [];
      if (repos.length === 0) return;
      const owners: string[] = [...new Set<string>(repos.map((r: { owner: { username: string } }) => r.owner.username))];
      const filtered = owners.filter((o) => o !== wrapUsername);
      const pick = filtered.length > 0 ? filtered : owners;
      handleGenerateWrap(pick[Math.floor(Math.random() * pick.length)]);
    } catch { /* silent */ }
  }, [wrapUsername, handleGenerateWrap]);

  const handleNavigate = (section: 'home' | 'wrap' | 'trending') => {
    setActiveSection(section);
    const targetId = section === 'home' ? 'home-section' : `${section}-section`;
    document.getElementById(targetId)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      {/* Header com linha de ponta a ponta */}
      <div className="header-bar">
        <div className="app-container" style={{ paddingBottom: 0 }}>
          <Header
            isDark={isDark} locale={locale} activeSection={activeSection}
            onToggleTheme={toggleTheme} onToggleLocale={toggleLocale} onNavigate={handleNavigate}
          />
        </div>
      </div>

      {/* Hero com gradiente e linha inferior */}
      <div id="home-section" className="hero-section">
        <div className="app-container" style={{ paddingBottom: 0 }}>
          <div className="hero-inner">
            <div className="hero-left">
              <h1 className="hero-title" style={{ whiteSpace: 'pre-line' }}>{t.heroTitle}</h1>
            </div>
            <div className="hero-right">
              <img src="/hero-illustration.png" alt="" className="hero-illustration" />
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo: Wrap + Trending */}
      <div className="app-container content-section">
        <div id="wrap-section" style={{ paddingTop: '64px' }}>
          <div className="wrap-section-heading">
            <h2>{t.wrapHeading}</h2>
            <p>{t.wrapDescription}</p>
          </div>
          <div className="wrap-search">
            <UsernameForm
              placeholder={t.searchPlaceholder} buttonText={t.searchButton}
              onSubmit={handleGenerateWrap} onSurpriseMe={handleSurpriseMe}
              locale={locale} isLoading={wrapLoading}
            />
          </div>
          <WrapSection
            username={wrapUsername} triggerCount={triggerCount} locale={locale} t={t}
            onLoadingChange={setWrapLoading}
          />
        </div>

        <div className="section-divider" />

        <div id="trending-section">
          <TrendingSection locale={locale} t={t} onGenerateWrap={handleGenerateWrap} />
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}

export default App;
