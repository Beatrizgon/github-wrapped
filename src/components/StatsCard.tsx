// src/components/StatsCard.tsx
import './StatsCard.css';

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  subtitle: string;
}

export function StatsCard({ icon, label, value, subtitle }: StatsCardProps) {
  return (
    <div className="stats-card">
      <div className="stats-card-head">
        <span className="material-symbols-rounded stats-card-icon">
          {icon}
        </span>
        <span className="stats-card-label">{label}</span>
      </div>
      <div className="stats-card-value">{value}</div>
      <div className="stats-card-sub">{subtitle}</div>
    </div>
  );
}
