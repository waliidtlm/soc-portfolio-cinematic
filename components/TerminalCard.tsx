"use client";

import { motion } from "framer-motion";
import { about } from "@/lib/data";

const line = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export default function TerminalCard() {
  return (
    <div className="glass-solid overflow-hidden rounded-2xl">
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-[0.72rem] text-muted">analyst@portfolio</span>
      </div>

      {/* body */}
      <motion.div
        className="p-5 font-mono text-[0.84rem] leading-relaxed"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        transition={{ staggerChildren: 0.18 }}
      >
        <motion.p variants={line} className="text-dim">
          <span className="text-ok">analyst@portfolio</span>
          <span className="text-muted">:~$</span> whoami
        </motion.p>

        <div className="mt-3 space-y-1.5">
          {about.terminal.map((row) => (
            <motion.p key={row.k} variants={line} className="flex">
              <span className="w-24 text-accent-bright">{row.k}</span>
              <span className="text-muted">: </span>
              <span className="ml-1 text-text">{row.v}</span>
            </motion.p>
          ))}
        </div>

        <motion.p variants={line} className="mt-4 text-dim">
          <span className="text-ok">analyst@portfolio</span>
          <span className="text-muted">:~$</span>{" "}
          <span className="cursor-blink inline-block h-4 w-2 translate-y-0.5 bg-cyan" />
        </motion.p>
      </motion.div>
    </div>
  );
}
