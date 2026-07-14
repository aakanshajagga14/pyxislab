"use client";

import { usePathname } from "next/navigation";
import { SiteNav } from "@/components/layout/SiteNav";
import { Footer } from "@/components/layout/Footer";

interface AppChromeProps {
  children: React.ReactNode;
  /** When true, omit footer (e.g. dense list pages still get it by default). */
  showFooter?: boolean;
}

/**
 * Shared marketing/app chrome for selection + report routes.
 * Skips SiteNav/Footer on live task workspaces so the simulator keeps its own bar.
 */
export function AppChrome({ children, showFooter = true }: AppChromeProps) {
  const pathname = usePathname();
  const isWorkspace = /^\/(training|assessment)\/[^/]+\/?$/.test(pathname ?? "");

  if (isWorkspace) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--brand-navy)] text-[var(--brand-ink)]">
      <SiteNav />
      <main className="flex-1">{children}</main>
      {showFooter ? <Footer /> : null}
    </div>
  );
}
