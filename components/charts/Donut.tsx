"use client";

type Segment = { label: string; value: number; color: string };

export default function Donut({
  data,
  size = 156,
  thickness = 16,
}: {
  data: Segment[];
  size?: number;
  thickness?: number;
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={thickness}
        />
        {data.map((d) => {
          const frac = d.value / total;
          const len = Math.max(frac * c - 2.5, 0);
          const seg = (
            <circle
              key={d.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={thickness}
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 6px ${d.color}66)` }}
            />
          );
          offset += frac * c;
          return seg;
        })}
      </g>
    </svg>
  );
}
