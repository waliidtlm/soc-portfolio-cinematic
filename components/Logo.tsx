type LogoProps = { size?: number; className?: string };

export default function Logo({ size = 44, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={(size * 30) / 46}
      viewBox="0 0 46 30"
      fill="none"
      className={className}
      role="img"
      aria-label="TW monogram"
    >
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7aa7ff" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>

      {/* T */}
      <path
        d="M4 6 H18"
        stroke="url(#logoGrad)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M11 6 V24"
        stroke="url(#logoGrad)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* W */}
      <path
        d="M22 6 L27 24 L32 13 L37 24 L42 6"
        stroke="url(#logoGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
