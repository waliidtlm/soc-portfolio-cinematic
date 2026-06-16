"use client";

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
    />
  );
}
