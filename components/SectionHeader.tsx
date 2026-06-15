import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

type SectionHeaderProps = {
  kicker: string;
  title: string;
  blurb?: string;
  link?: { label: string; href: string };
  align?: "left" | "center";
};

export default function SectionHeader({
  kicker,
  title,
  blurb,
  link,
  align = "left",
}: SectionHeaderProps) {
  if (align === "center") {
    return (
      <Reveal className="mx-auto mb-12 max-w-2xl text-center">
        <span className="kicker center justify-center">{kicker}</span>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-[2.6rem]">
          {title}
        </h2>
        {blurb && <p className="mx-auto mt-3 max-w-xl text-dim">{blurb}</p>}
      </Reveal>
    );
  }

  return (
    <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <Reveal className="max-w-2xl">
        <span className="kicker">{kicker}</span>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-[2.6rem]">
          {title}
        </h2>
        {blurb && <p className="mt-3 text-dim">{blurb}</p>}
      </Reveal>
      {link && (
        <Reveal delay={0.1}>
          <a href={link.href} className="section-link whitespace-nowrap">
            {link.label}
            <ArrowRight size={16} />
          </a>
        </Reveal>
      )}
    </div>
  );
}
