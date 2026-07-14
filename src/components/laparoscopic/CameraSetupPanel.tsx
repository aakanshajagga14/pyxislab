"use client";

import type { CameraSetupStatus } from "@/lib/hand-tracking/camera-setup";

interface CameraSetupPanelProps {
  status: CameraSetupStatus;
  onSkip?: () => void;
}

function StatusRow({
  label,
  state,
}: {
  label: string;
  state: "good" | "poor" | "waiting";
}) {
  const color =
    state === "good"
      ? "text-success"
      : state === "poor"
        ? "text-warning"
        : "text-muted";
  const text =
    state === "good" ? "GOOD" : state === "poor" ? "ADJUST" : "WAITING";

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-foreground/90">{label}</span>
      <span className={`font-mono text-xs font-medium ${color}`}>{text}</span>
    </div>
  );
}

export function CameraSetupPanel({
  status,
  onSkip,
}: CameraSetupPanelProps) {
  return (
    <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-10 flex flex-col border-t border-border/60 bg-[#0A0C0E]/94 p-3 backdrop-blur-sm">
      <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-accent/80">
        Hand Positioning
      </h2>
      <p className="mt-1 text-xs text-muted">
        Live tracking status while you position your hands. Guided steps begin
        once both hands are detected with stable tracking.
      </p>

      <div className="mt-4 space-y-2 rounded-lg border border-border/50 bg-[#0D1117]/80 p-3">
        <StatusRow label="Hand Detection" state={status.handDetection} />
        <StatusRow label="Lighting" state={status.lighting} />
        <StatusRow label="Both Hands Visible" state={status.bothHandsVisible} />
      </div>

      {status.holdProgress > 0 && status.holdProgress < 1 && (
        <div className="mt-3">
          <div className="h-1 overflow-hidden rounded-full bg-border/60">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${status.holdProgress * 100}%` }}
            />
          </div>
          <p className="mt-1 text-center text-[10px] text-muted">
            Hold steady…
          </p>
        </div>
      )}

      <p className="mt-2 text-[10px] text-muted">
        Plain background · front lighting · hands 40–70 cm from camera
      </p>

      {onSkip ? (
        <button
          type="button"
          onClick={onSkip}
          className="pointer-events-auto mt-2 w-full rounded-lg border border-border/60 px-3 py-2 text-xs text-muted hover:text-foreground"
        >
          Continue with current tracking
        </button>
      ) : null}
    </div>
  );
}
