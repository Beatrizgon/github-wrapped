// src/components/TrendingCard.tsx
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Locale, translations } from '../i18n/translations';
import './TrendingCard.css';

interface TrendingCardProps {
  fullName: string; description: string | null; readmePreview?: string | null;
  hasReadme: boolean;
  url: string; stars: number; language: string | null;
  ownerUsername: string; ownerAvatarUrl: string; locale: Locale;
  t: (typeof translations)[Locale];
  onGenerateWrap: (username: string) => void;
}

const langColors: Record<string, string> = {
  TypeScript: '#8B5CF6', JavaScript: '#A78BFA', Python: '#7C3AED',
  Java: '#6D28D9', Go: '#C4B5FD', Rust: '#5B21B6', Ruby: '#8B5CF6',
  PHP: '#A78BFA', Swift: '#7C3AED', Kotlin: '#6D28D9',
  'C++': '#C4B5FD', 'C#': '#5B21B6', C: '#8B5CF6', HTML: '#A78BFA', CSS: '#7C3AED',
};

function formatStars(n: number): string { return n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '') + 'k' : String(n); }

export function TrendingCard(props: TrendingCardProps) {
  const l = { pt: { repo: 'Repo', wrap: 'Wrap', by: 'por' }, en: { repo: 'Repo', wrap: 'Wrap', by: 'by' } }[props.locale];
  const langColor = props.language ? langColors[props.language] || 'var(--accent)' : 'var(--text-muted)';
  const previewText = props.readmePreview || props.description;
  const [isReadmeOpen, setIsReadmeOpen] = useState(false);
  const [readme, setReadme] = useState<string | null>(null);
  const [readmeLocale, setReadmeLocale] = useState<Locale | null>(null);
  const [readmeErrorLocale, setReadmeErrorLocale] = useState<Locale | null>(null);
  const modalRef = useRef<HTMLElement>(null);
  const readmeTitleId = `readme-title-${props.fullName.replace(/[^a-zA-Z0-9_-]/g, '-')}`;

  useEffect(() => {
    if (!isReadmeOpen || !props.hasReadme) return;

    const controller = new AbortController();
    const params = new URLSearchParams({ readme: props.fullName, locale: props.locale });
    fetch(`/.netlify/functions/trending?${params.toString()}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('README request failed');
        const data: { readme: string } = await response.json();
        setReadme(data.readme);
        setReadmeLocale(props.locale);
      })
      .catch(() => {
        if (!controller.signal.aborted) setReadmeErrorLocale(props.locale);
      });

    return () => controller.abort();
  }, [isReadmeOpen, props.fullName, props.hasReadme, props.locale]);

  useEffect(() => {
    if (!isReadmeOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsReadmeOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isReadmeOpen]);

  const handleModalKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Tab') return;
    const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable?.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="trending-card">
      {previewText && (
        props.hasReadme ? (
          <button
            type="button"
            className="trending-card-readme"
            onClick={() => {
              setReadme(null);
              setReadmeLocale(null);
              setReadmeErrorLocale(null);
              setIsReadmeOpen(true);
            }}
            aria-haspopup="dialog"
            aria-expanded={isReadmeOpen}
            aria-label={`${props.fullName}: ${props.t.readmeOpen}`}
          >
            <span><strong>README · </strong>{previewText}</span>
            <span className="trending-card-readme-hint">{props.t.readmeOpen} · {props.t.readmeOriginal}</span>
          </button>
        ) : (
          <div className="trending-card-readme">{previewText}</div>
        )
      )}
      <div className="trending-card-body">
        <div className="trending-card-head">
          <span className="trending-card-name">{props.fullName}</span>
          <span className="trending-card-stars">
            <span className="material-symbols-rounded" style={{ fontSize: '14px' }}>star</span>
            {formatStars(props.stars)}
          </span>
        </div>
        <div className="trending-card-meta">
          {props.language && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: langColor }} />
              {props.language}
            </span>
          )}
          <img src={props.ownerAvatarUrl} alt="" style={{ width: '18px', height: '18px', borderRadius: '50%' }} />
          <span style={{ color: 'var(--text-muted)' }}>
            {l.by} <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>@{props.ownerUsername}</strong>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <a href={props.url} target="_blank" rel="noopener noreferrer" className="trending-btn trending-btn-secondary">
            <span className="material-symbols-rounded" style={{ fontSize: '14px' }}>open_in_new</span>{l.repo}
          </a>
          <button onClick={() => props.onGenerateWrap(props.ownerUsername)} className="trending-btn trending-btn-primary">
            <span className="material-symbols-rounded filled" style={{ fontSize: '14px' }}>auto_awesome</span>{l.wrap}
          </button>
        </div>
      </div>
      {isReadmeOpen && createPortal(
        <div className="readme-modal-backdrop" onClick={() => setIsReadmeOpen(false)}>
          <section
            className="readme-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={readmeTitleId}
            ref={modalRef}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={handleModalKeyDown}
          >
            <header className="readme-modal-header">
              <div>
                <span className="readme-modal-eyebrow">README</span>
                <h2 id={readmeTitleId}>{props.fullName}</h2>
              </div>
              <button
                type="button"
                className="readme-modal-close"
                onClick={() => setIsReadmeOpen(false)}
                aria-label={`${props.t.readmeClose} README`}
                autoFocus
              >
                <span className="material-symbols-rounded">close</span>
              </button>
            </header>
            <div className="readme-modal-content" aria-live="polite">
              {readmeErrorLocale === props.locale ? (
                <p className="readme-modal-message">{props.t.readmeError}</p>
              ) : readme === null || readmeLocale !== props.locale ? (
                <p className="readme-modal-message">{props.t.readmeLoading}</p>
              ) : (
                <>
                  <p className="readme-original-notice">{props.t.readmeOriginal}</p>
                  <pre>{readme}</pre>
                </>
              )}
            </div>
          </section>
        </div>,
        document.body
      )}
    </div>
  );
}
