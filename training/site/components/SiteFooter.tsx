import Link from "next/link";
import { profile } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-white/[0.06] bg-void py-12">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-edge">Contact</p>
            <h2 className="font-display mt-4 text-2xl font-semibold tracking-tight text-fg">
              Let's connect
            </h2>
            <p className="mt-4 max-w-sm text-muted">
              Open to discussions about supply chain strategy, SAP APO implementations, and integrated planning solutions.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <a
              href={`mailto:${profile.email}`}
              className="font-mono text-sm text-muted underline decoration-white/10 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent/50"
            >
              {profile.email}
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-muted underline decoration-white/10 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent/50"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.06] pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-dim">
            © 2024 {profile.name}. Built with Next.js and Tailwind CSS.
          </p>
          <nav className="flex gap-6" aria-label="Footer">
            <Link
              href="#"
              className="font-mono text-sm text-muted underline decoration-white/10 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent/50"
            >
              Back to top
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}