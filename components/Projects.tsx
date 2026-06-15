"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { projects } from "@/lib/data";
import ProjectCard from "./ProjectCard";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Track scroll progress from section-top-at-viewport-top → section-bottom-at-viewport-bottom.
  // The section is min-h-[200vh] so this range spans ~100vh of pinned scroll.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // City background: zooms from 110% down to 100% as section opens, then drifts upward.
  const bgScale = useTransform(scrollYProgress, [0, 0.4], [1.1, 1.0]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.18], [0, 1]);
  const bgYRaw = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  // Spring gives the parallax a weighted, cinematic lag.
  const bgY = useSpring(bgYRaw, { stiffness: 55, damping: 22 });

  // Content: slides up and fades in after the city has established itself.
  const contentOpacity = useTransform(scrollYProgress, [0.12, 0.35], [0, 1]);
  const contentYRaw = useTransform(scrollYProgress, [0.12, 0.35], [50, 0]);
  const contentY = useSpring(contentYRaw, { stiffness: 80, damping: 22 });

  const update = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setAtStart(scrollLeft < 8);
    setAtEnd(scrollLeft > scrollWidth - clientWidth - 8);
    const cards = Array.from(el.children) as HTMLElement[];
    let nearest = 0;
    let min = Infinity;
    cards.forEach((c, i) => {
      const d = Math.abs(c.offsetLeft - el.offsetLeft - scrollLeft);
      if (d < min) { min = d; nearest = i; }
    });
    setActive(nearest);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const nudge = (dir: number) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.children[0] as HTMLElement | undefined;
    const stride = card ? card.offsetWidth + 56 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * stride, behavior: "smooth" });
  };

  const goTo = (i: number) => {
    const el = scroller.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };

  return (
    // min-h-[200vh]: gives 100vh of extra scroll space so the sticky panel
    // stays pinned long enough for the city reveal + content fade-in to finish.
    <section id="projects" ref={sectionRef} className="relative z-10 min-h-[200vh]">

      {/* ── Sticky panel: pins to viewport top while section scrolls ── */}
      <div className="sticky top-0 h-dvh">

        {/* City backdrop — overflow-hidden clips the parallax movement */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/hero-city-close.png')",
              scale: bgScale,
              opacity: bgOpacity,
              y: bgY,
            }}
          />
          {/* Cinematic vignette: dark at edges, semi-transparent in the middle */}
          <div className="absolute inset-0 bg-linear-to-b from-bg/80 via-bg/35 to-bg/80" />
        </div>

        {/* Content layer — no overflow-hidden so the carousel can scroll freely */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-center py-16 overflow-visible"
          style={{ opacity: contentOpacity, y: contentY }}
        >
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
            <SectionHeader
              kicker="Featured Projects"
              title="Projects"
              blurb="A selection of real-world projects focused on detection engineering, threat analysis, and automation."
              link={{ label: "View All Projects", href: "#projects" }}
            />

            <Reveal>
              <div className="relative">
                <button
                  type="button"
                  aria-label="Previous projects"
                  onClick={() => nudge(-1)}
                  className={`absolute -left-3 top-1/2 -translate-y-1/2 z-20 grid h-11 w-11 place-items-center rounded-full text-white transition-all duration-300 glass-solid hover:border-white/30 ${
                    atStart ? "pointer-events-none opacity-0" : "opacity-100"
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  aria-label="Next projects"
                  onClick={() => nudge(1)}
                  className={`absolute -right-3 top-1/2 -translate-y-1/2 z-20 grid h-11 w-11 place-items-center rounded-full text-white transition-all duration-300 glass-solid hover:border-white/30 ${
                    atEnd ? "pointer-events-none opacity-0" : "opacity-100"
                  }`}
                >
                  <ChevronRight size={20} />
                </button>

                <div
                  ref={scroller}
                  onScroll={update}
                  className="flex snap-x snap-mandatory gap-14 overflow-x-auto pl-24 pr-10 py-24 scroll-pl-24 scrollbar-none"
                >
                  {projects.map((p) => (
                    <div key={p.title} className="w-72.5 shrink-0 snap-start sm:w-85">
                      <ProjectCard project={p} />
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <div className="mt-7 flex justify-center gap-2">
              {projects.map((p, i) => (
                <button
                  key={p.title}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to ${p.title}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    active === i ? "w-7 bg-cyan" : "w-1.5 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
