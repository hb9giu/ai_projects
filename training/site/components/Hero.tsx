"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { profile } from "@/lib/content";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative min-h-[92vh] overflow-hidden pt-16">
      <div className="bg-mesh absolute inset-0" aria-hidden />
      <div className="bg-grid absolute inset-0" aria-hidden />

      <div className="relative mx-auto flex max-w-6xl flex-col justify-center px-5 pb-24 pt-20 sm:px-8 md:min-h-[85vh] md:pt-12">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-accent">
            Global supply chain
          </p>
          <h1 className="font-display mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-fg sm:text-5xl md:text-6xl lg:text-[4rem]">
            {profile.name}
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
            {profile.title}
          </p>
          <p className="font-mono mt-3 text-sm text-dim">{profile.location}</p>
          <Image
            src={profile.photo}
            alt={`${profile.name} photo`}
            width={160}
            height={128}
            className="mt-6 h-32 w-40 rounded-full object-cover"
            priority
          />
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduce ? 0 : 0.15, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex flex-wrap items-center gap-4"
        >
          <a
            href="#journey"
            className="group inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3 font-mono text-xs font-medium uppercase tracking-widest text-bg-void transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_0_40px_-8px_var(--glow)]"
          >
            Career journey
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
          <a
            href="#portfolio"
            className="rounded-sm border border-white/[0.12] bg-elevated/50 px-6 py-3 font-mono text-xs uppercase tracking-widest text-muted backdrop-blur-sm transition-colors hover:border-accent/40 hover:text-accent"
          >
            Portfolio (soon)
          </a>
          <a
            href="/chat"
            className="rounded-sm border border-white/[0.12] bg-elevated/50 px-6 py-3 font-mono text-xs uppercase tracking-widest text-muted backdrop-blur-sm transition-colors hover:border-accent/40 hover:text-accent"
          >
            AI Chat
          </a>
          <a
            href={profile.resume}
            download
            className="rounded-sm border border-white/[0.12] bg-elevated/50 px-6 py-3 font-mono text-xs uppercase tracking-widest text-muted backdrop-blur-sm transition-colors hover:border-accent/40 hover:text-accent"
          >
            Resume
          </a>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 0.45, duration: 0.8 }}
          className="mt-20 grid max-w-4xl gap-4 border-t border-white/[0.06] pt-10 sm:grid-cols-3"
        >
          {[
            { k: "Focus", v: "Demand · SAP APO · ERP vision" },
            { k: "Employer", v: "Roche" },
            { k: "Reach", v: "Basel & global SC" },
          ].map((item, i) => (
            <div key={item.k} className="relative">
              {i > 0 && (
                <div
                  className="absolute -left-4 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent sm:block"
                  aria-hidden
                />
              )}
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-dim">
                {item.k}
              </p>
              <p className="mt-2 font-display text-sm font-medium text-fg">{item.v}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <div
        className="animate-float-line pointer-events-none absolute bottom-8 left-1/2 h-px w-32 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/60 to-transparent"
        aria-hidden
      />
    </section>
  );
}
