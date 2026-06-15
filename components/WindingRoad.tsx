// Simplified illuminated "winding road" that threads down the page behind sections.
const PATH =
  "M50 0 C28 90, 74 170, 50 290 S20 470, 58 600 S82 760, 44 880 S30 970, 52 1100";

export default function WindingRoad() {
  return (
    <div
      className="pointer-events-none absolute inset-0 top-[90vh] z-0 overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 100 1100"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5a623" stopOpacity="0" />
            <stop offset="8%" stopColor="#f5a623" stopOpacity="0.45" />
            <stop offset="92%" stopColor="#f5a623" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f5a623" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* soft glow base */}
        <path
          d={PATH}
          stroke="#f5a623"
          strokeOpacity="0.18"
          strokeWidth="6"
          vectorEffect="non-scaling-stroke"
          style={{ filter: "blur(3px)" }}
        />
        {/* core line */}
        <path
          d={PATH}
          stroke="url(#roadGrad)"
          strokeWidth="1.4"
          vectorEffect="non-scaling-stroke"
        />
        {/* travelling light pulses */}
        <path
          d={PATH}
          stroke="#ffd07a"
          strokeWidth="2"
          strokeDasharray="2 26"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ animation: "dash-flow 9s linear infinite" }}
        />
      </svg>
    </div>
  );
}
