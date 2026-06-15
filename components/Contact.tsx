"use client";

import { useState } from "react";
import { Mail, MapPin, Send } from "lucide-react";
import { LinkedinIcon } from "./BrandIcons";
import { profile } from "@/lib/data";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-text placeholder:text-muted outline-none transition focus:border-cyan/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-cyan/15";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  // TODO: wire to a form service (Formspree/Resend) for true async submit.
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio contact — ${form.name || "Hello"}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="relative z-10 mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <SectionHeader
        kicker="Let's Connect"
        title="Get In Touch"
        blurb="Have a project or just want to say hi? I'd love to hear from you."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Info */}
        <Reveal className="flex flex-col gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="glass glass-hover flex items-center gap-4 rounded-2xl p-4"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-cyan/25 bg-cyan/10 text-cyan">
              <Mail size={18} />
            </span>
            <span className="text-sm text-dim">{profile.email}</span>
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="glass glass-hover flex items-center gap-4 rounded-2xl p-4"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-cyan/25 bg-cyan/10 text-cyan">
              <LinkedinIcon width={18} height={18} />
            </span>
            <span className="text-sm text-dim">LinkedIn</span>
          </a>
          <div className="glass flex items-center gap-4 rounded-2xl p-4">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-cyan/25 bg-cyan/10 text-cyan">
              <MapPin size={18} />
            </span>
            <span className="text-sm text-dim">{profile.location}</span>
          </div>
        </Reveal>

        {/* Form over dotted "world map" backdrop */}
        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} className="glass relative overflow-hidden rounded-2xl p-6">
            {/* TODO: drop a real dotted world map at /images/world-map-dots.svg */}
            <div
              className="pointer-events-none absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(122,167,255,0.16) 1px, transparent 1px)",
                backgroundSize: "15px 15px",
                maskImage: "radial-gradient(ellipse 80% 80% at 70% 40%, #000, transparent 75%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 80% 80% at 70% 40%, #000, transparent 75%)",
              }}
            />
            <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-[0.78rem] font-medium text-dim">Name</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[0.78rem] font-medium text-dim">Email</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  className={inputClass}
                />
              </label>
            </div>
            <label className="relative mt-4 block">
              <span className="mb-1.5 block text-[0.78rem] font-medium text-dim">Message</span>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Your message"
                className={`${inputClass} resize-none`}
              />
            </label>
            <button type="submit" className="btn btn-primary relative mt-5 w-full justify-center">
              Send Message <Send size={16} />
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
