// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { useLocale } from './hooks/useLocale';
import { Header } from './components/Header';
import { Nav } from './components/Nav';
import { WrappedPage } from './pages/WrappedPage';
import { TrendingPage } from './pages/TrendingPage';

function App() {
  const { isDark, toggleTheme } = useTheme();
  const { locale, toggleLocale, t } = useLocale();

  return (
    <BrowserRouter>
      <div className="app-container">
        <Header
          isDark={isDark}
          locale={locale}
          onToggleTheme={toggleTheme}
          onToggleLocale={toggleLocale}
        />

        <Nav locale={locale} />

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
    </BrowserRouter>
  );
}

export default App;
