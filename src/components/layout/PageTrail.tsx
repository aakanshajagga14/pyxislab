import Link from "next/link";
import type { MouseEvent } from "react";

export interface TrailItem {
  label: string;
  href?: string;
}

interface PageTrailProps {
  items: TrailItem[];
  className?: string;
  /** Confirm before following any non-current crumb link. */
  confirmMessage?: string | null;
}

/** Small breadcrumb trail — last item is current (non-link). */
export function PageTrail({
  items,
  className = "",
  confirmMessage = null,
}: PageTrailProps) {
  if (items.length === 0) return null;

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!confirmMessage) return;
    if (!window.confirm(confirmMessage)) e.preventDefault();
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex min-w-0 flex-wrap items-center gap-1.5 text-[11px] tracking-wide text-[var(--brand-muted)] ${className}`}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span
            key={`${item.label}-${i}`}
            className="inline-flex min-w-0 items-center gap-1.5"
          >
            {i > 0 && (
              <span className="text-[var(--brand-line)]" aria-hidden>
                /
              </span>
            )}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                onClick={onClick}
                className="truncate transition-colors hover:text-[var(--brand-ink)]"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={`truncate ${isLast ? "text-[var(--brand-ink)]/80" : ""}`}
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
