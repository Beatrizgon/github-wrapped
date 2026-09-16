// src/components/StatsCard.tsx
import './StatsCard.css';

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  subtitle: string;
  featured?: boolean;
}

export function StatsCard({ icon, label, value, subtitle, featured }: StatsCardProps) {
  return (
    <div className={featured ? 'stats-card stats-card-featured' : 'stats-card'}>
      <div className="stats-card-glow" />
      <div className="stats-card-head">
        <span className="material-symbols-rounded stats-card-icon">{icon}</span>
        <span className="stats-card-label">{label}</span>
      </div>
      <div className={featured ? 'stats-card-value stats-card-value-featured' : 'stats-card-value'}>
        {value}
      </div>
      <div className="stats-card-sub">{subtitle}</div>
    </div>
  );
}
