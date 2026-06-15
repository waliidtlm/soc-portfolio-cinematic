"use client";

import { useId } from "react";

type SparklineProps = {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fill?: boolean;
  strokeWidth?: number;
  animate?: boolean;
  className?: string;
};

export default function Sparkline({
  data,
  width = 120,
  height = 38,
  color = "var(--color-cyan)",
  fill = true,
  strokeWidth = 2,
  animate = true,
  className,
}: SparklineProps) {
  const uid = useId().replace(/:/g, "");
  if (data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const pad = 3;

  const pts = data.map((d, i) => {
    const x = i * stepX;
    const y = height - ((d - min) / range) * (height - pad * 2) - pad;
    return [x, y] as const;
  });

  const line = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
    .join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`spark-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#spark-${uid})`} />}
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? "draw-line" : undefined}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
