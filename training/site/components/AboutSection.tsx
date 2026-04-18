"use client";

import { motion, useReducedMotion } from "framer-motion";
import { about, skills, languages, certifications } from "@/lib/content";

export function AboutSection() {
  const reduce = useReducedMotion();

  return (
    <section id="about" className="relative scroll-mt-24 border-t border-white/[0.06] bg-surface py-24 sm:py-32">
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
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-edge">About</p>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
              Bridging operations & systems
            </h2>
            <p className="mt-4 max-w-xl text-muted">
              {about.lead}
            </p>
          </div>
        </motion.div>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: reduce ? 0 : 0.1, duration: 0.5 }}
          >
            <h3 className="font-display text-xl font-semibold text-fg">Core Skills</h3>
            <ul className="mt-4 space-y-2">
              {skills.map((skill) => (
                <li key={skill} className="text-muted">
                  {skill}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: reduce ? 0 : 0.2, duration: 0.5 }}
          >
            <h3 className="font-display text-xl font-semibold text-fg">Languages</h3>
            <ul className="mt-4 space-y-2">
              {languages.map((lang) => (
                <li key={lang.name} className="text-muted">
                  {lang.name} ({lang.level})
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}