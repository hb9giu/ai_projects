"use client";

import { motion, useReducedMotion } from "framer-motion";
import { portfolioLinks } from "@/lib/content";

export function PortfolioSection() {
  const reduce = useReducedMotion();

  return (
    <section id="portfolio" className="relative scroll-mt-24 border-t border-white/[0.06] bg-surface py-24 sm:py-32">
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent-hot/5 blur-[90px]" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-edge">Portfolio</p>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
              Work in the open — coming soon.
            </h2>
            <p className="mt-4 max-w-xl text-muted">
              Reserved spaces for case studies, deep dives, and public artifacts. Links activate as material goes
              live.
            </p>
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-dim">Placeholder routes</span>
        </motion.div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {portfolioLinks.map((item, i) => (
            <motion.article
              key={item.title}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: reduce ? 0 : i * 0.08, duration: 0.5 }}
              className="group relative flex flex-col overflow-hidden rounded-lg border border-white/[0.08] bg-elevated/60 p-6 backdrop-blur-sm transition-[transform,box-shadow,border-color] hover:-translate-y-1 hover:border-accent/25 hover:shadow-[0_20px_50px_-25px_rgba(45,212,191,0.15)]"
            >
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-accent/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden
              />
              <h3 className="font-display text-xl font-semibold text-fg">{item.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{item.description}</p>
              <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/[0.06] pt-5">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-dim">Coming soon</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}