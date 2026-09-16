// src/components/Nav.tsx
import { NavLink } from 'react-router-dom';
import type { Locale } from '../i18n/translations';
import './Nav.css';

interface NavProps {
  locale: Locale;
}

export function Nav({ locale }: NavProps) {
  const labels = {
    pt: {
      wrapped: 'Meu Wrapped',
      trending: 'Trending',
    },
    en: {
      wrapped: 'My Wrapped',
      trending: 'Trending',
    },
  };

  const t = labels[locale];

  return (
    <nav className="main-nav">
      <NavLink
        to="/wrapped"
        className={({ isActive }) =>
          isActive ? 'nav-link nav-link-active' : 'nav-link'
        }
      >
        <span className="material-symbols-rounded nav-icon">
          person
        </span>
        {t.wrapped}
      </NavLink>

      <NavLink
        to="/trending"
        className={({ isActive }) =>
          isActive ? 'nav-link nav-link-active' : 'nav-link'
        }
      >
        <span className="material-symbols-rounded nav-icon">
          trending_up
        </span>
        {t.trending}
      </NavLink>
    </nav>
  );
}
