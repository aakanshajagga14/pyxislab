"use client";

import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import { useLapSessions } from "@/hooks/use-client-storage";
import { BackLink } from "@/components/layout/BackLink";

function formatCompletedAt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ReportIndex() {
  const sessions = useLapSessions();

  return (
    <div className="page-enter mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <BackLink href="/" label="Back to home" />

      <header className="mb-10 mt-6 border-b border-[var(--brand-line)] pb-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--brand-muted)]">
          Performance summaries
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--brand-ink)]">
          Session Reports
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--brand-muted)]">
          Review completed training and assessment sessions, benchmark status,
          instrument path density, stability trends, and improvement guidance.
        </p>
      </header>

      {sessions.length === 0 ? (
        <div className="rounded-xl border border-[var(--brand-line)] bg-[var(--brand-surface)] p-8 text-center">
          <FileText className="mx-auto h-8 w-8 text-[var(--brand-muted)]" />
          <p className="mt-4 text-sm text-[var(--brand-muted)]">
            No session reports are available yet.
          </p>
          <Link
            href="/training"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--brand-ink)] px-5 py-2.5 text-sm font-medium text-[var(--brand-navy)]"
          >
            Start training
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <Link
              key={session.id}
              href={`/report/${session.id}`}
              className="block rounded-xl border border-[var(--brand-line)] bg-[var(--brand-surface)] p-5 transition-colors hover:border-[var(--brand-muted)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-[var(--brand-ink)]">
                    {session.taskName}
                  </h2>
                  <p className="mt-1 text-xs text-[var(--brand-muted)]">
                    {formatCompletedAt(session.completedAt)} ·{" "}
                    {session.sessionMode === "assessment"
                      ? "Assessment"
                      : "Training"}
                  </p>
                </div>
                <span className="rounded-md border border-[var(--brand-line)] px-3 py-1 font-mono text-xs text-[var(--brand-ink)]/80">
                  {session.benchmarkResult.replace("_", " ")}
                </span>
              </div>
              <p className="mt-3 text-xs text-[var(--brand-muted)]">
                Duration {session.durationSeconds}s · {session.errorCount} error
                events
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
