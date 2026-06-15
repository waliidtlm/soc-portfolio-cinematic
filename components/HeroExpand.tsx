"use client";

import { ArrowRight, Download } from "lucide-react";
import { profile } from "@/lib/data";
import ScrollExpandMedia from "./ScrollExpandMedia";

export default function HeroExpand() {
  return (
    <ScrollExpandMedia
      mediaType="video"
      mediaSrc="/Hero.mp4"
      posterSrc="/images/hero-bg.png"
      bgImageSrc="/images/hero-bg.png"
      title="Actionable Intelligence"
      date="SOC Analyst · Cybersecurity"
      scrollToExpand="Scroll to enter"
      textBlend={false}
    >
      <div className="mx-auto max-w-3xl text-center [text-shadow:0_2px_24px_rgba(0,0,0,0.85)]">
        <span className="kicker">SOC Analyst &amp; Cybersecurity Professional</span>
        <p className="mt-6 text-base leading-relaxed text-dim sm:text-lg">
          I help organizations detect, investigate and respond to cyber threats
          before they become incidents.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <a href="#projects" className="btn btn-primary">
            View My Work <ArrowRight size={17} />
          </a>
          <a href={profile.cvUrl} className="btn btn-ghost">
            Download CV <Download size={16} />
          </a>
        </div>
      </div>
    </ScrollExpandMedia>
  );
}
