"use client";

interface LapFeedbackBarProps {
  message: string;
  severity?: "info" | "caution" | "warning";
  sessionActive?: boolean;
  taskName?: string;
  elapsed?: number;
}

const border = {
  info: "border-border",
  caution: "border-warning/40",
  warning: "border-danger/40",
};

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function LapFeedbackBar({
  message,
  severity = "info",
  sessionActive = false,
  taskName,
  elapsed = 0,
}: LapFeedbackBarProps) {
  if (sessionActive && taskName) {
    return (
      <div className="px-1 py-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted/70">
          {taskName}
        </p>
        <p className="mt-0.5 font-mono text-lg tabular-nums text-foreground/90">
          {formatTime(elapsed)}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border bg-[#0D1117] px-3 py-2.5 ${border[severity]}`}
    >
      <p className="text-[10px] font-medium uppercase tracking-widest text-muted">
        Simulator feedback
      </p>
      <p className="mt-1 font-[family-name:var(--font-dm-sans)] text-sm leading-relaxed text-foreground">
        {message}
      </p>
    </div>
  );
}
