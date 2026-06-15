"use client";

import { motion } from "framer-motion";
import {
  socStats,
  severity,
  mitreTechniques,
  recentAlerts,
} from "@/lib/data";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import StatCard from "./StatCard";
import Donut from "./charts/Donut";

const SEV: Record<string, { color: string; bg: string }> = {
  High: { color: "var(--color-high)", bg: "rgba(240,85,109,0.14)" },
  Medium: { color: "var(--color-med)", bg: "rgba(245,166,35,0.14)" },
  Low: { color: "var(--color-low)", bg: "rgba(59,130,246,0.14)" },
};

function Panel({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className="glass rounded-2xl p-5">
      <h3 className="mb-4 font-display text-sm font-semibold tracking-wide text-white">
        {title}
      </h3>
      {children}
    </Reveal>
  );
}

export default function SocOperations() {
  const mitreMax = Math.max(...mitreTechniques.map((m) => m.value));

  return (
    <section id="soc" className="relative z-10 mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <SectionHeader
        kicker="SOC Operations"
        title="Live Operations Overview"
        blurb="A snapshot of real-time SOC operations and performance."
        link={{ label: "Explore My Insights", href: "#soc" }}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {socStats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06}>
            <StatCard stat={s} />
          </Reveal>
        ))}
      </div>

      {/* Detail panels */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Severity donut */}
        <Panel title="Alerts by Severity">
          <div className="flex items-center justify-between gap-4">
            <Donut data={severity} />
            <ul className="space-y-3">
              {severity.map((s) => (
                <li key={s.label} className="flex items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: s.color }}
                  />
                  <span className="text-sm text-dim">{s.label}</span>
                  <span className="ml-auto font-mono text-sm font-semibold text-white">
                    {s.value}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>

        {/* MITRE bars */}
        <Panel title="Top Attack Techniques (MITRE)" delay={0.08}>
          <ul className="space-y-3.5">
            {mitreTechniques.map((m, i) => (
              <li key={m.label}>
                <div className="mb-1.5 flex items-center justify-between text-[0.82rem]">
                  <span className="text-dim">{m.label}</span>
                  <span className="font-mono font-semibold text-white">{m.value}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, var(--color-accent-2), var(--color-cyan))",
                    }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(m.value / mitreMax) * 100}%` }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 1, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        {/* Recent alerts */}
        <Panel title="Recent Alerts" delay={0.16}>
          <ul className="divide-y divide-white/6">
            {recentAlerts.map((a) => {
              const sev = SEV[a.severity];
              return (
                <li key={a.time + a.name} className="flex items-center gap-3 py-2.5">
                  <span className="font-mono text-[0.7rem] text-muted">{a.time}</span>
                  <span className="flex-1 truncate text-[0.82rem] text-dim">{a.name}</span>
                  <span
                    className="rounded px-2 py-0.5 font-mono text-[0.62rem] font-semibold"
                    style={{ color: sev.color, background: sev.bg }}
                  >
                    {a.severity}
                  </span>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>
    </section>
  );
}
