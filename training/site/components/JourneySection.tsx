"use client";

import { motion, useReducedMotion } from "framer-motion";
import { journey } from "@/lib/content";

export function JourneySection() {
  const reduce = useReducedMotion();

  return (
    <section id="journey" className="relative scroll-mt-24 border-t border-white/[0.06] bg-void py-24 sm:py-32">
      <div className="pointer-events-none absolute top-0 left-0 h-80 w-80 rounded-full bg-accent/5 blur-[90px]" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-edge">Journey</p>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
              From engineering to global supply chain leadership
            </h2>
            <p className="mt-4 max-w-xl text-muted">
              A career spanning integrated engineering, logistics, and strategic planning across international organizations.
            </p>
          </div>
        </motion.div>

        <div className="mt-14 space-y-8">
          {journey.map((item, i) => (
            <motion.article
              key={item.period}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: reduce ? 0 : i * 0.1, duration: 0.5 }}
              className="relative flex flex-col gap-4 border-l border-white/[0.08] pl-8 md:flex-row md:gap-8 md:pl-0"
            >
              <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-accent" />
              <div className="font-mono text-sm text-accent md:w-32 md:flex-shrink-0">
                {item.period}
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-semibold text-fg">
                  {item.role}
                </h3>
                <p className="mt-1 text-muted">{item.org} · {item.location}</p>
                {item.highlight && (
                  <p className="mt-3 text-sm text-dim">{item.highlight}</p>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}