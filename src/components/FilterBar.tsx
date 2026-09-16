// src/components/FilterBar.tsx
import type { Locale } from '../i18n/translations';
import './FilterBar.css';

export type Period = 'day' | 'week' | 'month';

interface FilterBarProps {
  locale: Locale;
  language: string;
  period: Period;
  onLanguageChange: (lang: string) => void;
  onPeriodChange: (period: Period) => void;
}

const LANGUAGES = [
  { value: '', labelPt: 'Todas', labelEn: 'All' },
  { value: 'typescript', labelPt: 'TypeScript', labelEn: 'TypeScript' },
  { value: 'javascript', labelPt: 'JavaScript', labelEn: 'JavaScript' },
  { value: 'python', labelPt: 'Python', labelEn: 'Python' },
  { value: 'java', labelPt: 'Java', labelEn: 'Java' },
  { value: 'go', labelPt: 'Go', labelEn: 'Go' },
  { value: 'rust', labelPt: 'Rust', labelEn: 'Rust' },
  { value: 'ruby', labelPt: 'Ruby', labelEn: 'Ruby' },
  { value: 'php', labelPt: 'PHP', labelEn: 'PHP' },
  { value: 'swift', labelPt: 'Swift', labelEn: 'Swift' },
  { value: 'kotlin', labelPt: 'Kotlin', labelEn: 'Kotlin' },
  { value: 'c++', labelPt: 'C++', labelEn: 'C++' },
  { value: 'c#', labelPt: 'C#', labelEn: 'C#' },
];

export function FilterBar({
  locale,
  language,
  period,
  onLanguageChange,
  onPeriodChange,
}: FilterBarProps) {
  const labels = {
    pt: {
      language: 'Linguagem',
      period: 'Período',
      day: 'Hoje',
      week: 'Semana',
      month: 'Mês',
    },
    en: {
      language: 'Language',
      period: 'Period',
      day: 'Today',
      week: 'Week',
      month: 'Month',
    },
  };
  const l = labels[locale];

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <span className="material-symbols-rounded filter-icon">code</span>
        <label className="filter-label">{l.language}:</label>
        <select
          className="filter-select"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {locale === 'pt' ? lang.labelPt : lang.labelEn}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <span className="material-symbols-rounded filter-icon">schedule</span>
        <label className="filter-label">{l.period}:</label>
        <div className="period-pills">
          {(['day', 'week', 'month'] as Period[]).map((p) => (
            <button
              key={p}
              className={
                p === period ? 'period-pill period-pill-active' : 'period-pill'
              }
              onClick={() => onPeriodChange(p)}
            >
              {l[p]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
