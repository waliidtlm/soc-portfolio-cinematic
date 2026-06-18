"use client";

import { ShieldCheck, ArrowRight } from "lucide-react";
import ScrollExpandMedia from "./ScrollExpandMedia";
import { profile } from "@/lib/data";

export default function HeroExpand() {
  return (
    <ScrollExpandMedia
      mediaType="video"
      mediaSrc="/Hero.mp4"
      posterSrc="/images/hero-bg.png"
      bgImageSrc="/images/hero-bg.png"
      textBlend={false}
      overlay={(release) => (
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* Proof point */}
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-4 py-1.5 font-mono text-xs font-medium tracking-wide text-cyan backdrop-blur-sm">
            <ShieldCheck size={14} /> CompTIA Security+
          </span>

          {/* Headline — name */}
          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.6)] sm:text-6xl lg:text-7xl">
            {profile.name}
          </h1>

          {/* Tagline — attached directly under the headline */}
          <p className="mt-4 max-w-2xl text-balance text-lg leading-relaxed text-blue-100/90 sm:text-xl">
            <span className="font-semibold text-white">SOC Analyst</span> — I
            detect, investigate, and shut down threats before they spread.
          </p>

          {/* CTA + availability */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                release();
                setTimeout(
                  () =>
                    document
                      .querySelector("#projects")
                      ?.scrollIntoView({ behavior: "smooth" }),
                  60,
                );
              }}
              className="inline-flex items-center gap-2 rounded-full bg-cyan px-6 py-3 text-sm font-semibold text-black shadow-[0_8px_30px_-8px_rgba(34,211,238,0.7)] transition-transform hover:scale-[1.03]"
            >
              View my work <ArrowRight size={16} />
            </a>

            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-3 backdrop-blur-md">
              <span className="dot" />
              <span className="font-mono text-[0.62rem] font-semibold tracking-[0.18em] text-dim">
                AVAILABLE
              </span>
            </span>
          </div>
        </div>
      )}
    />
  );
}
