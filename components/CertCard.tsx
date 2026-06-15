import { Award } from "lucide-react";
import type { Cert } from "@/lib/data";

export default function CertCard({ cert }: { cert: Cert }) {
  return (
    <div className="glass glass-hover flex flex-col items-center rounded-2xl p-6 text-center">
      {/* Badge — fallback emblem with abbr; real image overlays when present */}
      <div className="relative grid h-20 w-20 place-items-center">
        <div
          className="absolute inset-0 rounded-full border"
          style={{
            borderColor: "rgba(122,167,255,0.35)",
            background:
              "radial-gradient(circle at 50% 35%, rgba(34,211,238,0.16), rgba(13,20,36,0.6))",
            boxShadow: "0 0 30px -12px rgba(34,211,238,0.6)",
          }}
        />
        <Award size={18} className="absolute top-3 text-cyan/50" />
        <span className="relative mt-3 font-mono text-[0.62rem] font-bold tracking-wide text-accent-bright">
          {cert.abbr}
        </span>
        {cert.image && (
          <div
            className="absolute inset-0 rounded-full bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${cert.image}')` }}
          />
        )}
      </div>

      <h3 className="mt-4 text-[0.86rem] font-semibold leading-snug text-white">
        {cert.title}
      </h3>
      <span className="mt-1.5 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted">
        {cert.issuer}
      </span>
    </div>
  );
}
