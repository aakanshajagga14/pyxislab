"use client";

import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { setFlsSessionMode } from "@/lib/laparoscopic/trainingMode";
import { useLapSession } from "@/hooks/use-client-storage";
import type { FlsBenchmarkResult } from "@/lib/laparoscopic/types";
import { StabilityChart } from "@/components/analytics/StabilityChart";
import { renderHeatmapFromData } from "@/lib/engines/heatmapRenderer";
import { useEffect, useRef } from "react";
import { BackLink } from "@/components/layout/BackLink";
import { PageTrail } from "@/components/layout/PageTrail";

const resultStyles: Record<FlsBenchmarkResult, string> = {
  PASS: "text-[#2ECC71] border-[#2ECC71]/30",
  BORDERLINE: "text-[#F0A500] border-[#F0A500]/30",
  NEEDS_PRACTICE: "text-[#E84545] border-[#E84545]/30",
};

const resultLabel: Record<FlsBenchmarkResult, string> = {
  PASS: "PASS",
  BORDERLINE: "BORDERLINE",
  NEEDS_PRACTICE: "NEEDS PRACTICE",
};

function formatDuration(seconds: number): string {
  if (seconds < 1) return "<1s";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

interface LapSessionReportViewProps {
  sessionId: string;
}

export function LapSessionReportView({ sessionId }: LapSessionReportViewProps) {
  const report = useLapSession(sessionId);
  const heatmapRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!report || !heatmapRef.current) return;
    const canvas = heatmapRef.current;
    canvas.width = 480;
    canvas.height = 270;
    renderHeatmapFromData(canvas, report.pathHeatmap);
  }, [report]);

  if (!report) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <FileText className="mx-auto h-10 w-10 text-[var(--brand-muted)]" />
        <p className="mt-4 text-[var(--brand-muted)]">Session record not found.</p>
        <BackLink href="/report" label="Back to reports" className="mt-6" />
      </div>
    );
  }

  const date = new Date(report.completedAt).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="page-enter mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <BackLink href="/report" label="Back to reports" />
      <PageTrail
        className="mt-3"
        items={[
          { label: "Reports", href: "/report" },
          {
            label: `${report.taskName} · ${date}`,
          },
        ]}
      />

      <header className="mb-10 mt-6 border-b border-[var(--brand-line)] pb-8">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--brand-muted)]">
          Clinical Performance Report
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--brand-ink)]">
          {report.taskName}
        </h1>
        <p className="mt-1 text-sm text-[var(--brand-muted)]">
          Attempt {report.attemptNumber} · {date} ·{" "}
          {report.sessionMode === "assessment" ? "Assessment" : "Training"}
        </p>
        <div
          className={`mt-4 inline-flex rounded-lg border px-4 py-2 font-mono text-sm font-semibold ${resultStyles[report.benchmarkResult]}`}
        >
          FLS Benchmark: {resultLabel[report.benchmarkResult]}
        </div>
      </header>

      <section className="mb-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--brand-muted)]">
          Metric Breakdown
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(report.metrics).map(([key, m]) => (
            <div
              key={key}
              className="rounded-lg border border-[var(--brand-line)] bg-[var(--brand-surface)] p-4"
            >
              <p className="text-[10px] uppercase tracking-widest text-[var(--brand-muted)]">
                {key.replace(/([A-Z])/g, " $1")}
              </p>
              <p className="mt-1 font-mono text-xl text-[var(--brand-ink)]">
                {m.value}
                {m.unit}
              </p>
              <p className="mt-1 text-xs text-[var(--brand-muted)]">
                Benchmark: {m.benchmarkLabel} · Delta{" "}
                {m.delta > 0 ? "+" : ""}
                {m.delta.toFixed(1)}
              </p>
              <p
                className={`mt-1 text-xs ${m.passing ? "text-[#2ECC71]" : "text-[#F0A500]"}`}
              >
                {m.passing ? "Within threshold" : "Outside threshold"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {report.stabilityTrend.length > 1 && (
        <section className="mb-8 rounded-lg border border-[var(--brand-line)] bg-[var(--brand-surface)] p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--brand-muted)]">
            Stability Trend
          </h2>
          <StabilityChart data={report.stabilityTrend} />
        </section>
      )}

      <section className="mb-8 rounded-lg border border-[var(--brand-line)] bg-[var(--brand-surface)] p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--brand-muted)]">
          Instrument Path Density
        </h2>
        <canvas ref={heatmapRef} className="w-full rounded-lg" />
      </section>

      {report.errorEvents.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--brand-muted)]">
            Error Events ({report.errorCount})
          </h2>
          <ul className="space-y-2">
            {report.errorEvents.map((e, i) => (
              <li
                key={i}
                className="rounded border border-[var(--brand-line)] bg-[var(--brand-surface)] px-3 py-2 text-sm"
              >
                <span className="font-mono text-xs text-[var(--brand-muted)]">
                  T+{e.t}s
                </span>{" "}
                {e.description}
              </li>
            ))}
          </ul>
        </section>
      )}

      {(report.trackingLostEvents?.length ?? 0) > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--brand-muted)]">
            Tracking Interruptions ({report.trackingLostEvents!.length})
          </h2>
          <p className="mb-3 text-xs text-[var(--brand-muted)]">
            Total untracked time:{" "}
            <span className="font-mono text-[var(--brand-ink)]">
              {formatDuration(
                report.trackingLostEvents!.reduce(
                  (sum, e) => sum + e.durationSeconds,
                  0
                )
              )}
            </span>
            {report.trackingLostEvents!.some((e) => e.hand === "both") &&
              " · timer paused during dual-hand dropouts"}
          </p>
          <ul className="space-y-2">
            {report.trackingLostEvents!.map((e, i) => (
              <li
                key={i}
                className="rounded border border-[var(--brand-line)] bg-[var(--brand-surface)] px-3 py-2 text-sm"
              >
                <span className="font-mono text-xs text-[var(--brand-muted)]">
                  T+{e.startT}s
                </span>{" "}
                <span
                  className={
                    e.hand === "left"
                      ? "text-[#E879F9]"
                      : e.hand === "right"
                        ? "text-[#F59E0B]"
                        : "text-[#2DD4BF]"
                  }
                >
                  {e.hand === "both"
                    ? "Both hands"
                    : `${e.hand.charAt(0).toUpperCase()}${e.hand.slice(1)} hand`}
                </span>{" "}
                lost for {formatDuration(e.durationSeconds)}
              </li>
            ))}
          </ul>
        </section>
      )}

      {report.benchmarkResult === "NEEDS_PRACTICE" && (
        <section className="mb-6 rounded-lg border border-[var(--brand-accent)]/30 bg-[var(--brand-accent)]/5 p-4">
          <p className="text-sm text-[var(--brand-ink)]">
            Return to Training Mode to review guided steps
            {report.weakestPhase ? ` — focus area: ${report.weakestPhase}` : ""}.
          </p>
          <Link
            href={`/training/${report.taskId}`}
            className="mt-3 inline-block text-sm font-medium text-[var(--brand-accent)]"
            onClick={() => setFlsSessionMode("training")}
          >
            Open task in Training Mode
          </Link>
        </section>
      )}

      <section className="mb-8 rounded-lg border border-[var(--brand-line)] bg-[var(--brand-surface)] p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--brand-muted)]">
          Improvement Guidance
        </h2>
        <ul className="space-y-3">
          {report.recommendations.map((r, i) => (
            <li
              key={i}
              className="flex gap-3 text-sm leading-relaxed text-[var(--brand-ink)]"
            >
              <span className="font-mono text-xs text-[var(--brand-muted)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              {r}
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3 border-t border-[var(--brand-line)] pt-8">
        <Link
          href={`/training/${report.taskId}`}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-ink)] px-5 py-2.5 text-sm font-medium text-[var(--brand-navy)]"
          onClick={() => setFlsSessionMode("training")}
        >
          Start new session
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/report"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-line)] px-5 py-2.5 text-sm text-[var(--brand-ink)] hover:border-[var(--brand-muted)]"
        >
          Back to reports
        </Link>
        <Link
          href="/training"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-line)] px-5 py-2.5 text-sm text-[var(--brand-muted)] hover:text-[var(--brand-ink)]"
        >
          Task selection
        </Link>
      </div>
    </div>
  );
}
