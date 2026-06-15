import { ArrowRight, TrendingUp, Crosshair, ShieldCheck, type LucideIcon } from "lucide-react";
import { about, profile } from "@/lib/data";
import Reveal from "./Reveal";
import TerminalCard from "./TerminalCard";

const ICONS: Record<string, LucideIcon> = { TrendingUp, Crosshair, ShieldCheck };

export default function About() {
  return (
    <section id="about" className="relative z-10 mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left — bio */}
        <Reveal>
          <span className="kicker">About Me</span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-[2.6rem]">
            About Me
          </h2>

          <div className="mt-5 space-y-4 text-[0.95rem] leading-relaxed text-dim">
            {about.bio.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>

          <ul className="mt-7 space-y-3">
            {about.highlights.map((h) => {
              const Icon = ICONS[h.icon] ?? ShieldCheck;
              return (
                <li key={h.label} className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg border border-cyan/25 bg-cyan/10 text-cyan">
                    <Icon size={16} />
                  </span>
                  <span className="text-[0.92rem] font-medium text-text">{h.label}</span>
                </li>
              );
            })}
          </ul>

          <div className="mt-7 flex flex-wrap gap-2">
            {about.tags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>

          <a href={profile.cvUrl} className="section-link mt-7 inline-flex">
            Download CV <ArrowRight size={16} />
          </a>
        </Reveal>

        {/* Right — terminal */}
        <Reveal delay={0.12}>
          <TerminalCard />
        </Reveal>
      </div>
    </section>
  );
}
