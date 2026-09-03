// src/components/WeekChart.tsx
import './WeekChart.css';

interface WeekChartProps {
  title: string;
  dayLabels: readonly string[];
  data: number[];
}

export function WeekChart({ title, dayLabels, data }: WeekChartProps) {
  const max = Math.max(...data, 1);

  return (
    <div className="week-card">
      <div className="week-card-head">
        <span className="material-symbols-rounded week-card-icon">
          calendar_month
        </span>
        <span className="week-card-title">{title}</span>
      </div>
      <div className="week-bars">
        {data.map((value, i) => (
          <div className="week-bar-col" key={i}>
            <div className="week-bar-track">
              <div
                className="week-bar-fill"
                style={{ height: `${(value / max) * 100}%` }}
              />
            </div>
            <span className="week-bar-label">{dayLabels[i]}</span>
            <span className="week-bar-value">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
