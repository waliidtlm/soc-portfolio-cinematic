import { certifications } from "@/lib/data";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import CertCard from "./CertCard";

export default function Certifications() {
  return (
    <section id="certifications" className="relative z-10 mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <SectionHeader
        kicker="Certifications"
        title="Certifications"
        blurb="Continuous learning, always leveling up."
        link={{ label: "View All Certifications", href: "#certifications" }}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {certifications.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.06}>
            <CertCard cert={c} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
