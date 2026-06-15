"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

type CountUpProps = {
  to: number;
  duration?: number;
  decimals?: number;
  separator?: boolean;
  prefix?: string;
  suffix?: string;
  className?: string;
};

function format(n: number, decimals: number, separator: boolean) {
  const fixed = n.toFixed(decimals);
  if (!separator) return fixed;
  const [intPart, dec] = fixed.split(".");
  const withSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return dec ? `${withSep}.${dec}` : withSep;
}

export default function CountUp({
  to,
  duration = 1700,
  decimals = 0,
  separator = true,
  prefix = "",
  suffix = "",
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setValue(to);
      return;
    }
    let raf = 0;
    let startTime: number | null = null;
    const tick = (t: number) => {
      if (startTime === null) startTime = t;
      const p = Math.min((t - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {format(value, decimals, separator)}
      {suffix}
    </span>
  );
}
