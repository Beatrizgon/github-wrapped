// src/components/Header.tsx
import type { Locale } from '../i18n/translations';
import './Header.css';

interface HeaderProps {
  isDark: boolean;
  locale: Locale;
  activeSection: 'home' | 'wrap' | 'trending';
  onToggleTheme: () => void;
  onToggleLocale: () => void;
  onNavigate: (section: 'home' | 'wrap' | 'trending') => void;
}

export function Header({ isDark, locale, activeSection, onToggleTheme, onToggleLocale, onNavigate }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-logo">
        <img src="/logo-icon.png" alt="GitWrapped" className="header-logo-img" />
        <img src="/logo-text.png" alt="GitWrapped" className="header-logo-text" />
      </div>

      <nav className="header-nav">
        <button onClick={() => onNavigate('home')} className={activeSection === 'home' ? 'header-nav-link header-nav-active' : 'header-nav-link'}>Home</button>
        <button onClick={() => onNavigate('wrap')} className={activeSection === 'wrap' ? 'header-nav-link header-nav-active' : 'header-nav-link'}>Wrap</button>
        <button onClick={() => onNavigate('trending')} className={activeSection === 'trending' ? 'header-nav-link header-nav-active' : 'header-nav-link'}>Trending</button>
      </nav>

      <div className="header-actions">
        <button className="header-btn" onClick={onToggleLocale}>
          <span className="material-symbols-rounded" style={{ fontSize: '16px' }}>translate</span>
          {locale === 'pt' ? 'PT' : 'EN'}
        </button>
        <button className="header-btn header-btn-icon" onClick={onToggleTheme}>
          <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>{isDark ? 'light_mode' : 'dark_mode'}</span>
        </button>
      </div>
    </header>
  );
}
