"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { projects } from "@/lib/data";
import ProjectCard from "./ProjectCard";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

export default function Projects() {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

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
      if (d < min) {
        min = d;
        nearest = i;
      }
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
    <section id="projects" className="relative z-10 mx-auto max-w-7xl px-5 py-24 sm:px-8">
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
    </section>
  );
}
