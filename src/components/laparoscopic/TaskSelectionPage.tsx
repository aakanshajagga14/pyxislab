"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Lock } from "lucide-react";
import { FLS_BENCHMARKS } from "@/lib/laparoscopic/flsBenchmarks";
import { useFlsProgress } from "@/hooks/use-client-storage";
import {
  setFlsSessionMode,
  type FlsSessionMode,
} from "@/lib/laparoscopic/trainingMode";
import { ModeToggle } from "@/components/laparoscopic/ModeToggle";
import { BackLink } from "@/components/layout/BackLink";
import type { FlsTaskId } from "@/lib/laparoscopic/types";
import {
  LAPAROSCOPIC_TASK_ORDER,
  LAPAROSCOPIC_TASKS,
} from "@/lib/laparoscopic/tasks";

interface TaskSelectionPageProps {
  defaultMode: FlsSessionMode;
}

export function TaskSelectionPage({ defaultMode }: TaskSelectionPageProps) {
  const progress = useFlsProgress();
  const [mode, setMode] = useState<FlsSessionMode>(() => defaultMode);

  useEffect(() => {
    setFlsSessionMode(defaultMode);
  }, [defaultMode]);

  const handleModeChange = (m: FlsSessionMode) => {
    setMode(m);
    setFlsSessionMode(m);
  };

  const unlocked = (id: FlsTaskId): boolean => {
    if (id === "peg-transfer") return true;
    if (id === "pattern-cutting") return progress.patternCuttingUnlocked;
    return progress.knotTyingUnlocked;
  };

  const routeBase = mode === "assessment" ? "/assessment" : "/training";

  return (
    <div className="page-enter mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <BackLink href="/" label="Back to home" />

      <header className="mb-12 mt-6 border-b border-[var(--brand-line)] pb-10">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--brand-muted)]">
          Laparoscopic simulation
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--brand-ink)]">
          {mode === "assessment" ? "Assessment Workflow" : "Training Session"}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--brand-muted)]">
          Select a laparoscopic task for webcam-based instrument tracking. The
          simulator emphasizes instrument stability, path efficiency, tremor,
          smoothness, economy of motion, dual-hand coordination, completion
          time, and procedural accuracy.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-end gap-4">
          <ModeToggle mode={mode} onChange={handleModeChange} />
        </div>
      </header>

      <div className="grid gap-4">
        {LAPAROSCOPIC_TASK_ORDER.map((id, index) => {
          const task = LAPAROSCOPIC_TASKS[id];
          const open = unlocked(id);
          const best = progress.personalBests[id];
          const bench =
            id === "peg-transfer"
              ? `FLS pass: <${FLS_BENCHMARKS["peg-transfer"].maxTimeSeconds}s, 0 drops`
              : id === "pattern-cutting"
                ? `Deviation <${FLS_BENCHMARKS["pattern-cutting"].maxMeanDeviationMm}mm`
                : `Precision >${FLS_BENCHMARKS["knot-tying"].minPrecision}`;

          return (
            <div
              key={id}
              className={`rounded-xl border bg-[var(--brand-surface)] p-6 transition-colors ${
                open
                  ? "border-[var(--brand-line)] hover:border-[var(--brand-muted)]"
                  : "border-[var(--brand-line)]/50 opacity-60"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[var(--brand-muted)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {!open && (
                      <Lock className="h-3.5 w-3.5 text-[var(--brand-muted)]" />
                    )}
                    {open && index === 0 && (
                      <span className="rounded-md bg-[var(--brand-accent)]/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--brand-accent)]">
                        Available
                      </span>
                    )}
                    {!open && (
                      <span className="text-[10px] uppercase tracking-wider text-[var(--brand-muted)]">
                        Locked
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 text-lg font-semibold text-[var(--brand-ink)]">
                    {task.name}
                  </h2>
                  <p className="mt-2 max-w-xl text-sm text-[var(--brand-muted)]">
                    {task.description}
                  </p>
                  <p className="mt-2 text-xs text-[var(--brand-muted)]">
                    {task.clinicalPurpose}
                  </p>
                  <p className="mt-2 text-xs text-[var(--brand-muted)]">{bench}</p>
                  {best?.timeSeconds !== undefined && (
                    <p className="mt-2 font-mono text-xs text-[var(--brand-ink)]/80">
                      Personal best: {best.timeSeconds}s
                    </p>
                  )}
                </div>
                {open ? (
                  <Link
                    href={`${routeBase}/${id}`}
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-ink)] px-5 py-2.5 text-sm font-medium text-[var(--brand-navy)] transition-opacity hover:opacity-90"
                  >
                    {mode === "assessment"
                      ? "Begin Assessment"
                      : "Begin Training"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <span className="text-xs text-[var(--brand-muted)]">
                    Complete prior task to unlock
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 rounded-xl border border-[var(--brand-line)] bg-[var(--brand-surface)] p-5">
        <p className="text-xs leading-relaxed text-[var(--brand-muted)]">
          Webcam tracking maps pinch gestures to grasp state and fingertip
          motion to instrument-tip movement. Position both hands in frame with
          stable lighting before starting a session.
        </p>
      </div>
    </div>
  );
}
