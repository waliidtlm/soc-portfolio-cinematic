import { Heart } from "lucide-react";
import Logo from "./Logo";
import { profile } from "@/lib/data";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 border-t border-white/8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row sm:px-8">
        <div className="flex items-center gap-2.5">
          <Logo size={24} />
          <span className="text-sm text-muted">
            © {year} {profile.name}. All rights reserved.
          </span>
        </div>
        <span className="flex items-center gap-1.5 text-sm text-muted">
          Built with passion and <Heart size={14} className="text-high" fill="currentColor" />
        </span>
      </div>
    </footer>
  );
}
