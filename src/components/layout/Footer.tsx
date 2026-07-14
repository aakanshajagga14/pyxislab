import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--brand-line)] bg-[var(--brand-navy-deep)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
        <div className="max-w-md">
          <p
            className="text-sm font-semibold tracking-[0.12em] text-[var(--brand-ink)]"
            style={{ fontFamily: "var(--font-display), sans-serif" }}
          >
            Pyxis Lab
          </p>
          <p className="mt-3 text-xs leading-relaxed text-[var(--brand-muted)]">
            Browser-based laparoscopic simulation for educational purposes. Not
            intended for clinical diagnosis or treatment.
          </p>
        </div>
        <nav
          className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[var(--brand-muted)]"
          aria-label="Footer"
        >
          <Link href="/training" className="hover:text-[var(--brand-ink)]">
            Training
          </Link>
          <Link href="/assessment" className="hover:text-[var(--brand-ink)]">
            Assessment
          </Link>
          <Link href="/report" className="hover:text-[var(--brand-ink)]">
            Reports
          </Link>
          <Link href="/#how-it-works" className="hover:text-[var(--brand-ink)]">
            How it works
          </Link>
        </nav>
      </div>
    </footer>
  );
}
