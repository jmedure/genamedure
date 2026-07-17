import Link from "next/link";
import { SITE } from "@/lib/content";

type LegalDocProps = {
  title: string;
  updated: string;
  children: React.ReactNode;
};

export function LegalDoc({ title, updated, children }: LegalDocProps) {
  return (
    <div className="min-h-screen bg-white text-ink">
      <header className="w-full border-b border-ink/10">
        <div className="mx-auto flex w-full max-w-[720px] items-end justify-between px-4 pb-4 pt-[max(1.5rem,env(safe-area-inset-top))] md:pt-10">
          <Link
            href="/"
            className="font-display text-[clamp(2rem,6vw,2.75rem)] leading-none text-ink transition-opacity duration-200 hover:opacity-60"
          >
            {SITE.name}
          </Link>
          <nav className="flex items-end gap-4 pb-1 font-body text-base tracking-[-0.12px] text-ink md:text-lg">
            <Link
              href="/privacy"
              className="transition-opacity duration-200 hover:opacity-60"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="transition-opacity duration-200 hover:opacity-60"
            >
              Terms
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[720px] px-4 pb-20 pt-12 md:pt-16">
        <p className="font-body text-sm text-muted">Last updated {updated}</p>
        <h1 className="mt-3 font-display text-[clamp(2.5rem,8vw,3.5rem)] leading-none text-ink">
          {title}
        </h1>
        <div className="legal-prose mt-10 font-body text-base leading-[1.65] tracking-[-0.005em] text-ink md:text-lg">
          {children}
        </div>
      </main>
    </div>
  );
}
