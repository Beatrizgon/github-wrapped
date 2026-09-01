// src/components/Header.tsx
import type { Locale } from '../i18n/translations';
import './Header.css';

interface HeaderProps {
  isDark: boolean;
  locale: Locale;
  onToggleTheme: () => void;
  onToggleLocale: () => void;
}

export function Header({
  isDark,
  locale,
  onToggleTheme,
  onToggleLocale,
}: HeaderProps) {
  return (
    <header className="header">
      <div className="header-logo">
        <span className="material-symbols-rounded filled header-icon">
          terminal
        </span>
        <span className="header-title">github wrapped</span>
      </div>

      <div className="header-actions">
        <button
          className="header-btn"
          onClick={onToggleLocale}
          title={locale === 'pt' ? 'Switch to English' : 'Mudar para Português'}
        >
          <span className="material-symbols-rounded">translate</span>
          <span className="header-btn-label">
            {locale === 'pt' ? 'EN' : 'PT'}
          </span>
        </button>

        <button
          className="header-btn"
          onClick={onToggleTheme}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          <span className="material-symbols-rounded">
            {isDark ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
      </div>
    </header>
  );
}
