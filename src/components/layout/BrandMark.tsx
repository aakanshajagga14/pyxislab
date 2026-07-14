import Link from "next/link";
import type { MouseEvent } from "react";

interface BrandMarkProps {
  /** Set false for inline hero H1 (not a nested link). Defaults true for nav. */
  linked?: boolean;
  href?: string;
  /** Compact for nav; larger for hero display. */
  size?: "nav" | "hero";
  className?: string;
  confirmMessage?: string | null;
}

/**
 * Singular PYXIS LAB lockup — one weight, one tracking, with a lime P mark.
 */
export function BrandMark({
  linked = true,
  href = "/",
  size = "nav",
  className = "",
  confirmMessage = null,
}: BrandMarkProps) {
  const isHero = size === "hero";

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!confirmMessage) return;
    if (!window.confirm(confirmMessage)) e.preventDefault();
  };

  const content = (
    <span
      className={`inline-flex items-center gap-2.5 ${className}`}
      style={{ fontFamily: "var(--font-display), sans-serif" }}
    >
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-[4px] border border-[var(--brand-line)] bg-[var(--brand-surface)] ${
          isHero ? "h-9 w-9 sm:h-10 sm:w-10" : "h-5 w-5"
        }`}
        aria-hidden
      >
        <span
          className={`font-semibold leading-none text-[var(--brand-accent)] ${
            isHero ? "text-base sm:text-lg" : "text-[10px]"
          }`}
        >
          P
        </span>
      </span>
      <span
        className={`font-semibold uppercase text-[var(--brand-ink)] ${
          isHero
            ? "text-5xl tracking-[0.08em] sm:text-6xl lg:text-7xl"
            : "text-sm tracking-[0.14em]"
        }`}
      >
        Pyxis Lab
      </span>
    </span>
  );

  if (!linked) return content;

  return (
    <Link
      href={href}
      onClick={onClick}
      className="inline-flex items-center transition-opacity hover:opacity-90"
      aria-label="Pyxis Lab home"
    >
      {content}
    </Link>
  );
}
