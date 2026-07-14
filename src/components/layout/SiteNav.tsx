"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/layout/BrandMark";

const links = [
  { href: "/#how-it-works", label: "How it works", match: "/#" },
  { href: "/training", label: "Training", match: "/training" },
  { href: "/assessment", label: "Assessment", match: "/assessment" },
  { href: "/report", label: "Reports", match: "/report" },
];

function isActive(pathname: string, match: string): boolean {
  if (match === "/#") return pathname === "/";
  return pathname === match || pathname.startsWith(`${match}/`);
}

export function SiteNav() {
  const pathname = usePathname() ?? "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-[var(--brand-line)] bg-[var(--brand-navy)] transition-[box-shadow] duration-300 ${
        scrolled ? "shadow-[0_8px_24px_rgba(0,0,0,0.35)]" : ""
      }`}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <BrandMark size="nav" />

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex"
          aria-label="Primary"
        >
          {links.map((link) => {
            const active = isActive(pathname, link.match);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[12px] tracking-wide transition-colors ${
                  active
                    ? "text-[var(--brand-ink)]"
                    : "text-[var(--brand-muted)] hover:text-[var(--brand-ink)]"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/training"
          className="rounded-full border border-[var(--brand-line)] bg-[var(--brand-surface)] px-4 py-1.5 text-[12px] font-medium text-[var(--brand-ink)] transition-colors hover:border-[var(--brand-muted)]"
        >
          Try demo
        </Link>
      </div>
    </header>
  );
}
