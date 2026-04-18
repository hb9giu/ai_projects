"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { profile } from "@/lib/content";

const nav = [
  { href: "#about", label: "About" },
  { href: "#journey", label: "Journey" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#contact", label: "Contact" },
];

const homeNav = [
  { href: "/", label: "Home" },
  { href: "/chat", label: "AI Chat" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const currentNav = pathname === "/" ? nav : homeNav;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      suppressHydrationWarning={true}
      className={`fixed top-0 z-40 w-full transition-[background,box-shadow,backdrop-filter] duration-300 ${
        scrolled || open
          ? "border-b border-white/[0.06] bg-void/85 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href={pathname === "/" ? "#" : "/"}
          className="font-display text-sm font-semibold tracking-tight text-fg sm:text-base"
          onClick={() => setOpen(false)}
        >
          {profile.name.split(" ")[0]}
          <span className="text-accent">.</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {currentNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden font-mono text-[11px] uppercase tracking-[0.15em] text-muted underline decoration-white/10 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent/50 sm:inline"
          >
            LinkedIn
          </a>
          <button
            type="button"
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`border-t border-white/[0.06] bg-void/95 backdrop-blur-xl md:hidden ${
          open ? "block" : "hidden"
        }`}
      >
        <nav className="flex flex-col px-5 py-6 sm:px-8" aria-label="Mobile">
          {currentNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border-b border-white/[0.04] py-4 font-mono text-xs uppercase tracking-[0.25em] text-muted transition-colors last:border-0 hover:text-accent"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
