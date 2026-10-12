// src/components/UsernameForm.tsx
import { useState } from 'react';
import type { Locale } from '../i18n/translations';
import './UsernameForm.css';

interface UsernameFormProps {
  placeholder: string; buttonText: string;
  onSubmit: (username: string) => void; onSurpriseMe: () => void; locale: Locale;
  isLoading: boolean;
}

export function UsernameForm({ placeholder, buttonText, onSubmit, onSurpriseMe, locale, isLoading }: UsernameFormProps) {
  const [value, setValue] = useState('');
  const [surpriseLoading, setSurpriseLoading] = useState(false);
  const handleSubmit = () => { const v = value.trim(); if (v) onSubmit(v); };
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSubmit(); };
  const handleSurprise = async () => { setSurpriseLoading(true); await onSurpriseMe(); setSurpriseLoading(false); };

  return (
    <div className="search-area">
      <div className={`search-bar${isLoading ? ' is-loading' : ''}`} aria-busy={isLoading}>
        <span className="material-symbols-rounded search-icon">search</span>
        <input type="text" className="search-input" placeholder={placeholder} value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown} />
        <button className="search-btn" onClick={handleSubmit}>
          <span className="material-symbols-rounded filled" style={{ fontSize: '16px' }}>auto_awesome</span>
          {buttonText}
        </button>
      </div>
      <span className="visually-hidden" role="status" aria-live="polite">
        {isLoading ? (locale === 'pt' ? 'Buscando dados...' : 'Fetching data...') : ''}
      </span>
      <button className="surprise-btn" onClick={handleSurprise} disabled={surpriseLoading}>
        <span className="material-symbols-rounded" style={{ fontSize: '16px' }}>{surpriseLoading ? 'progress_activity' : 'casino'}</span>
        {surpriseLoading ? (locale === 'pt' ? 'Buscando...' : 'Searching...') : (locale === 'pt' ? 'Surpreenda-me' : 'Surprise me')}
      </button>
    </div>
  );
}
