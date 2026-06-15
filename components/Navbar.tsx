"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Sun } from "lucide-react";
import Logo from "./Logo";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import { navLinks, profile } from "@/lib/data";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(navLinks[0].href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight the link for the section currently in view.
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.querySelector(l.href))
      .filter((el): el is Element => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-accent/40 bg-[#070b16]/80 shadow-[0_4px_24px_-12px_rgba(59,130,246,0.6)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8">
        {/* Left — brand */}
        <a href="#home" className="flex items-center justify-self-start" aria-label="Home">
          <Logo size={42} />
        </a>

        {/* Center — links (tubelight) */}
        <ul className="led-border hidden h-10 items-center gap-1 justify-self-center rounded-full bg-white/5 p-1 backdrop-blur-md lg:flex">
          {navLinks.map((l) => {
            const isActive = active === l.href;
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setActive(l.href)}
                  className={`relative block rounded-full px-3.5 py-1.5 text-[0.86rem] font-medium transition-all duration-300 hover:bg-cyan/10 hover:shadow-[0_0_18px_-2px_rgba(34,211,238,0.65)] ${
                    isActive ? "text-cyan" : "text-dim hover:text-white"
                  }`}
                >
                  <span className="relative z-10">{l.label}</span>
                  {/* light bar — only moves when an item is selected */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-lamp"
                      className="absolute inset-0 z-0"
                      transition={{ type: "spring", stiffness: 320, damping: 30 }}
                    >
                      <span className="absolute -top-[5px] left-1/2 h-1 w-7 -translate-x-1/2 rounded-full bg-cyan">
                        <span className="absolute -left-2 -top-2 h-6 w-11 rounded-full bg-cyan/30 blur-md" />
                        <span className="absolute -top-1 left-0 h-5 w-7 rounded-full bg-cyan/25 blur-md" />
                      </span>
                    </motion.span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Right — actions */}
        <div className="flex items-center gap-2 justify-self-end">
          <span className="led-border mr-1 hidden h-10 items-center gap-2 rounded-full bg-white/5 px-4 backdrop-blur-md md:inline-flex">
            <span className="dot" />
            <span className="font-mono text-[0.62rem] font-semibold tracking-[0.18em] text-dim">
              AVAILABLE
            </span>
          </span>

          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="led-border grid h-10 w-10 place-items-center rounded-full text-dim transition-colors hover:bg-white/5 hover:text-white"
          >
            <GithubIcon width={18} height={18} />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="led-border grid h-10 w-10 place-items-center rounded-full text-dim transition-colors hover:bg-white/5 hover:text-white"
          >
            <LinkedinIcon width={18} height={18} />
          </a>
          {/* TODO: light theme not implemented in v1 — icon present per design */}
          <button
            type="button"
            aria-label="Theme (dark)"
            title="Dark mode"
            className="led-border grid h-10 w-10 place-items-center rounded-full text-dim transition-colors hover:bg-white/5 hover:text-white"
          >
            <Sun size={18} />
          </button>

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
            className="led-border grid h-10 w-10 place-items-center rounded-full text-white transition-colors hover:bg-white/5 lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-accent/40 bg-[#070b16]/95 backdrop-blur-xl lg:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col px-5 py-3">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-[0.95rem] font-medium text-dim transition-colors hover:bg-white/5 hover:text-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
