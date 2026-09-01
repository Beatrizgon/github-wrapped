// src/components/NarrativeCard.tsx
import './NarrativeCard.css';

interface NarrativeCardProps {
  title: string;
  text: string;
}

export function NarrativeCard({ title, text }: NarrativeCardProps) {
  return (
    <div className="narrative-card">
      <div className="narrative-bg-circle narrative-bg-1" />
      <div className="narrative-bg-circle narrative-bg-2" />
      <div className="narrative-head">
        <span className="material-symbols-rounded filled narrative-icon">
          auto_awesome
        </span>
        <span className="narrative-title">{title}</span>
      </div>
      <p className="narrative-text">{text}</p>
    </div>
  );
}
