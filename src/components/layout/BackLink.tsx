"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { MouseEvent } from "react";

interface BackLinkProps {
  href: string;
  label?: string;
  /** If set, show a confirm dialog before navigating away. */
  confirmMessage?: string | null;
  className?: string;
}

export function BackLink({
  href,
  label = "Back",
  confirmMessage = null,
  className = "",
}: BackLinkProps) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!confirmMessage) return;
    if (!window.confirm(confirmMessage)) {
      e.preventDefault();
    }
  };

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-1 text-sm text-[var(--brand-muted)] transition-colors hover:text-[var(--brand-ink)] ${className}`}
    >
      <ChevronLeft className="h-4 w-4" aria-hidden />
      {label}
    </Link>
  );
}
