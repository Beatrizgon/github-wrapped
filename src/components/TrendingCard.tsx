// src/components/TrendingCard.tsx
import { useNavigate } from 'react-router-dom';
import type { Locale } from '../i18n/translations';
import './TrendingCard.css';

interface TrendingCardProps {
  fullName: string;
  description: string | null;
  url: string;
  stars: number;
  language: string | null;
  ownerUsername: string;
  ownerAvatarUrl: string;
  locale: Locale;
}

const langColors: Record<string, string> = {
  TypeScript: '#8B5CF6',
  JavaScript: '#A78BFA',
  Python: '#7C3AED',
  Java: '#6D28D9',
  Go: '#C4B5FD',
  Rust: '#5B21B6',
  Ruby: '#8B5CF6',
  PHP: '#A78BFA',
  Swift: '#7C3AED',
  Kotlin: '#6D28D9',
  'C++': '#C4B5FD',
  'C#': '#5B21B6',
  C: '#8B5CF6',
  HTML: '#A78BFA',
  CSS: '#7C3AED',
};

function formatStars(n: number): string {
  if (n >= 1000) {
    return (n / 1000).toFixed(1).replace('.0', '') + 'k';
  }
  return String(n);
}

export function TrendingCard(props: TrendingCardProps) {
  const navigate = useNavigate();

  const labels = {
    pt: {
      viewRepo: 'Ver repo',
      generateWrap: 'Gerar wrap',
      by: 'por',
    },
    en: {
      viewRepo: 'View repo',
      generateWrap: 'Generate wrap',
      by: 'by',
    },
  };
  const l = labels[props.locale];

  const langColor = props.language
    ? langColors[props.language] || 'var(--accent)'
    : 'var(--text-secondary)';

  const handleGenerateWrap = () => {
    navigate(`/wrapped?u=${encodeURIComponent(props.ownerUsername)}`);
  };

  return (
    <div className="trending-card">
      <div className="trending-card-head">
        <div className="trending-card-icon-wrap">
          <span className="material-symbols-rounded trending-card-icon">
            folder_special
          </span>
        </div>
        <span className="trending-card-name">{props.fullName}</span>
      </div>

      {props.description && (
        <p className="trending-card-desc">{props.description}</p>
      )}

      <div className="trending-card-meta">
        {props.language && (
          <span className="trending-card-lang">
            <span
              className="trending-card-lang-dot"
              style={{ background: langColor, color: langColor }}
            />
            {props.language}
          </span>
        )}
        <span className="trending-card-stars">
          <span className="material-symbols-rounded trending-card-star-icon">
            star
          </span>
          {formatStars(props.stars)}
        </span>
      </div>

      <div className="trending-card-owner">
        <img
          src={props.ownerAvatarUrl}
          alt={props.ownerUsername}
          className="trending-card-avatar"
        />
        <span className="trending-card-owner-name">
          {l.by} <strong>@{props.ownerUsername}</strong>
        </span>
      </div>

      <div className="trending-card-actions">
        <a
          href={props.url}
          target="_blank"
          rel="noopener noreferrer"
          className="trending-btn trending-btn-secondary"
        >
          <span className="material-symbols-rounded trending-btn-icon">
            open_in_new
          </span>
          {l.viewRepo}
        </a>
        <button
          onClick={handleGenerateWrap}
          className="trending-btn trending-btn-primary"
        >
          <span className="material-symbols-rounded filled trending-btn-icon">
            auto_awesome
          </span>
          {l.generateWrap}
        </button>
      </div>
    </div>
  );
}
