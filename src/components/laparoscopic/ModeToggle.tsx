"use client";

import type { FlsSessionMode } from "@/lib/laparoscopic/trainingMode";

interface ModeToggleProps {
  mode: FlsSessionMode;
  onChange: (mode: FlsSessionMode) => void;
  disabled?: boolean;
}

export function ModeToggle({ mode, onChange, disabled }: ModeToggleProps) {
  return (
    <div
      className="inline-flex rounded-full border border-[var(--brand-line)] bg-[var(--brand-surface)] p-0.5"
      role="group"
      aria-label="Session mode"
    >
      {(["training", "assessment"] as const).map((m) => (
        <button
          key={m}
          type="button"
          disabled={disabled}
          onClick={() => onChange(m)}
          className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors ${
            mode === m
              ? m === "training"
                ? "bg-[var(--brand-ink)] text-[var(--brand-navy)]"
                : "bg-[var(--brand-accent)]/20 text-[var(--brand-accent)]"
              : "text-[var(--brand-muted)] hover:text-[var(--brand-ink)]"
          } disabled:opacity-50`}
        >
          {m === "training" ? "Training Mode" : "Assessment Mode"}
        </button>
      ))}
    </div>
  );
}
