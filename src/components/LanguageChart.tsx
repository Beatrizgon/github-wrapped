// src/components/LanguageChart.tsx
import './LanguageChart.css';

interface LanguageStat {
  language: string;
  percentage: number;
}

interface LanguageChartProps {
  title: string;
  languages: LanguageStat[];
}

const barColors = [
  '#8B5CF6',
  '#A78BFA',
  '#7C3AED',
  '#6D28D9',
  '#5B21B6',
];

export function LanguageChart({ title, languages }: LanguageChartProps) {
  return (
    <div className="lang-card">
      <div className="lang-card-head">
        <span className="material-symbols-rounded lang-card-icon">code</span>
        <span className="lang-card-title">{title}</span>
      </div>
      <div className="lang-list">
        {languages.map((lang, i) => (
          <div className="lang-item" key={lang.language}>
            <div className="lang-item-row">
              <span className="lang-name">{lang.language}</span>
              <span className="lang-pct">{lang.percentage}%</span>
            </div>
            <div className="lang-bar-bg">
              <div
                className="lang-bar-fill"
                style={{
                  width: `${lang.percentage}%`,
                  background: barColors[i] || barColors[barColors.length - 1],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
