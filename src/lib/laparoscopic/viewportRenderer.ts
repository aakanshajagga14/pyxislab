import type { InstrumentState, PegTransferRing } from "./types";
import type { Point2D } from "@/lib/types";

export type HandSide = "left" | "right";

export interface ViewportGeometry {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

/** Single source of truth: hand → accent color (instruments + pinch rings). */
export const HAND_ACCENT: Record<HandSide, { main: string; glow: string; dim: string }> = {
  left: {
    main: "#E879F9",
    glow: "rgba(232, 121, 249, 0.55)",
    dim: "rgba(232, 121, 249, 0.32)",
  },
  right: {
    main: "#F59E0B",
    glow: "rgba(245, 158, 11, 0.55)",
    dim: "rgba(245, 158, 11, 0.32)",
  },
};

export const LAP_COLORS = {
  bg: "#0A0C0E",
  orFloor: "#12161A",
  tile: "#1A1F24",
  tileLine: "rgba(90, 100, 110, 0.12)",
  rimCyan: "rgba(45, 212, 191, 0.22)",
  rimCyanBright: "rgba(45, 212, 191, 0.45)",
  metal: "#8A9299",
  metalHighlight: "#B8C0C8",
  metalShadow: "#4A5058",
  accent: "#2DD4BF",
  warning: "#E84545",
  caution: "#F0A500",
  success: "#2ECC71",
};

export function getViewportGeometry(
  width: number,
  height: number
): ViewportGeometry {
  return {
    cx: width / 2,
    cy: height * 0.48,
    rx: width * 0.38,
    ry: height * 0.36,
  };
}

/** Cached gradients keyed by canvas dimensions — avoids per-frame allocation. */
let frameGradCache: {
  w: number;
  h: number;
  floorGrad: CanvasGradient;
  vignette: CanvasGradient;
  rimTop: CanvasGradient;
  rimBottom: CanvasGradient;
  rimLeft: CanvasGradient;
  rimRight: CanvasGradient;
} | null = null;

function getFrameGradients(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  geo: ViewportGeometry
) {
  if (frameGradCache && frameGradCache.w === width && frameGradCache.h === height) {
    return frameGradCache;
  }

  const floorGrad = ctx.createLinearGradient(0, geo.cy, 0, height);
  floorGrad.addColorStop(0, "#14181C");
  floorGrad.addColorStop(1, LAP_COLORS.orFloor);

  const vignette = ctx.createRadialGradient(
    geo.cx,
    geo.cy,
    geo.rx * 0.35,
    geo.cx,
    geo.cy,
    geo.rx * 1.05
  );
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.65)");

  const rimTop = ctx.createLinearGradient(0, 0, 0, height * 0.12);
  rimTop.addColorStop(0, LAP_COLORS.rimCyanBright);
  rimTop.addColorStop(1, "rgba(45, 212, 191, 0)");

  const rimBottom = ctx.createLinearGradient(0, height * 0.88, 0, height);
  rimBottom.addColorStop(0, "rgba(45, 212, 191, 0)");
  rimBottom.addColorStop(1, LAP_COLORS.rimCyan);

  const rimLeft = ctx.createLinearGradient(0, 0, width * 0.1, 0);
  rimLeft.addColorStop(0, LAP_COLORS.rimCyan);
  rimLeft.addColorStop(1, "rgba(45, 212, 191, 0)");

  const rimRight = ctx.createLinearGradient(width * 0.9, 0, width, 0);
  rimRight.addColorStop(0, "rgba(45, 212, 191, 0)");
  rimRight.addColorStop(1, LAP_COLORS.rimCyan);

  frameGradCache = {
    w: width,
    h: height,
    floorGrad,
    vignette,
    rimTop,
    rimBottom,
    rimLeft,
    rimRight,
  };
  return frameGradCache;
}

function drawTileFloor(
  ctx: CanvasRenderingContext2D,
  geo: ViewportGeometry,
  width: number,
  height: number
): void {
  const vanishY = geo.cy - geo.ry * 0.15;
  const floorTop = geo.cy + geo.ry * 0.05;
  const cols = 10;
  const rows = 6;

  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.strokeStyle = LAP_COLORS.tileLine;
  ctx.lineWidth = 1;

  for (let r = 0; r <= rows; r++) {
    const t = r / rows;
    const y = floorTop + (height - floorTop) * t * t;
    const spread = 0.25 + t * 0.75;
    const left = geo.cx - geo.rx * spread;
    const right = geo.cx + geo.rx * spread;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(right, y);
    ctx.stroke();
  }

  for (let c = 0; c <= cols; c++) {
    const t = c / cols - 0.5;
    const xBase = geo.cx + t * geo.rx * 1.6;
    ctx.beginPath();
    ctx.moveTo(geo.cx + t * geo.rx * 0.3, vanishY);
    ctx.lineTo(xBase, height);
    ctx.stroke();
  }

  ctx.restore();
}

export function drawLaparoscopicFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): ViewportGeometry {
  const geo = getViewportGeometry(width, height);
  const grads = getFrameGradients(ctx, width, height, geo);

  ctx.fillStyle = LAP_COLORS.bg;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.beginPath();
  ctx.ellipse(geo.cx, geo.cy, geo.rx, geo.ry, 0, 0, Math.PI * 2);
  ctx.clip();

  ctx.fillStyle = grads.floorGrad;
  ctx.fillRect(0, 0, width, height);
  drawTileFloor(ctx, geo, width, height);

  ctx.fillStyle = grads.vignette;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.ellipse(geo.cx, geo.cy, geo.rx, geo.ry, 0, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = grads.rimTop;
  ctx.fillRect(0, 0, width, height * 0.12);
  ctx.fillStyle = grads.rimBottom;
  ctx.fillRect(0, height * 0.88, width, height * 0.12);
  ctx.fillStyle = grads.rimLeft;
  ctx.fillRect(0, 0, width * 0.1, height);
  ctx.fillStyle = grads.rimRight;
  ctx.fillRect(width * 0.9, 0, width * 0.1, height);
  ctx.restore();

  return geo;
}

export function drawPeg(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
): void {
  const pegH = 28;
  const baseY = y;
  const topY = y - pegH;

  const ao = ctx.createRadialGradient(x, baseY, 0, x, baseY, 14);
  ao.addColorStop(0, "rgba(0,0,0,0.35)");
  ao.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = ao;
  ctx.beginPath();
  ctx.ellipse(x, baseY + 2, 10, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  const shaftGrad = ctx.createLinearGradient(x - 3, topY, x + 3, baseY);
  shaftGrad.addColorStop(0, LAP_COLORS.metalHighlight);
  shaftGrad.addColorStop(0.5, LAP_COLORS.metal);
  shaftGrad.addColorStop(1, LAP_COLORS.metalShadow);
  ctx.strokeStyle = shaftGrad;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x, baseY);
  ctx.lineTo(x, topY);
  ctx.stroke();

  ctx.fillStyle = LAP_COLORS.metalHighlight;
  ctx.beginPath();
  ctx.arc(x, topY, 3.5, 0, Math.PI * 2);
  ctx.fill();
}

export function drawRing(
  ctx: CanvasRenderingContext2D,
  ring: PegTransferRing
): void {
  const scale = 0.85 + ring.z * 0.15;
  const r = 14 * scale;

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 3;

  ctx.strokeStyle = LAP_COLORS.metalShadow;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(ring.x, ring.y, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.strokeStyle = LAP_COLORS.metal;
  ctx.lineWidth = 3.5;
  ctx.stroke();

  ctx.strokeStyle = LAP_COLORS.metalHighlight;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.7;
  ctx.stroke();
  ctx.restore();

  const innerAo = ctx.createRadialGradient(
    ring.x,
    ring.y + r * 0.3,
    0,
    ring.x,
    ring.y,
    r
  );
  innerAo.addColorStop(0, "rgba(0,0,0,0.2)");
  innerAo.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = innerAo;
  ctx.beginPath();
  ctx.arc(ring.x, ring.y, r, 0, Math.PI * 2);
  ctx.fill();
}

export function drawInstrument(
  ctx: CanvasRenderingContext2D,
  inst: InstrumentState,
  entryX: number,
  entryY: number,
  type: "grasper" | "scissors" | "driver",
  hand: HandSide,
  ghost = false
): void {
  const accent = HAND_ACCENT[hand];
  const tip = inst.tip;
  const alpha = ghost ? 0.28 : 1;

  ctx.save();
  ctx.globalAlpha = alpha;

  const shaftGrad = ctx.createLinearGradient(entryX, entryY, tip.x, tip.y);
  shaftGrad.addColorStop(0, "#1A1E22");
  shaftGrad.addColorStop(0.65, "#2A3038");
  shaftGrad.addColorStop(1, accent.main);
  ctx.strokeStyle = ghost ? accent.dim : shaftGrad;
  ctx.lineWidth = ghost ? 2 : 3.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(entryX, entryY);
  ctx.lineTo(tip.x, tip.y);
  ctx.stroke();

  if (!ghost && inst.graspClosed) {
    ctx.shadowColor = accent.glow;
    ctx.shadowBlur = 10;
  }

  const jawOpen = inst.graspClosed ? 0.15 : 0.5;
  ctx.fillStyle = ghost ? "transparent" : accent.main;
  ctx.strokeStyle = ghost ? accent.dim : accent.main;

  if (type === "scissors") {
    ctx.lineWidth = ghost ? 1.5 : 2.5;
    ctx.beginPath();
    ctx.moveTo(tip.x - 6, tip.y - 4 * jawOpen);
    ctx.lineTo(tip.x, tip.y);
    ctx.lineTo(tip.x + 8, tip.y - 6);
    ctx.stroke();
  } else {
    if (!ghost) {
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, 5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, 5, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (!inst.graspClosed) {
      ctx.beginPath();
      ctx.moveTo(tip.x - 4 * jawOpen, tip.y);
      ctx.lineTo(tip.x + 4 * jawOpen, tip.y);
      ctx.stroke();
    }
  }

  ctx.shadowBlur = 0;
  ctx.restore();
}

/** Recovery affordance: neutral dot cursor at last known position. */
export function drawRecoveryCursor(
  ctx: CanvasRenderingContext2D,
  pos: Point2D
): void {
  ctx.save();
  ctx.fillStyle = "rgba(232, 237, 242, 0.75)";
  ctx.strokeStyle = "rgba(0,0,0,0.4)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

/** Calm per-hand recovery prompt near frame entry. */
export function drawRecoveryPrompt(
  ctx: CanvasRenderingContext2D,
  hand: HandSide,
  width: number,
  height: number
): void {
  const accent = HAND_ACCENT[hand];
  const label =
    hand === "left"
      ? "Reposition left hand in frame"
      : "Reposition right hand in frame";
  const x = hand === "left" ? width * 0.06 : width * 0.94;
  const y = height * 0.88;

  ctx.save();
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = hand === "left" ? "left" : "right";
  ctx.fillStyle = accent.dim;
  ctx.fillText(label, x, y);
  ctx.restore();
}

/** Centered message when both hands are lost. */
export function drawBothHandsLostOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  ctx.save();
  ctx.fillStyle = "rgba(10, 12, 14, 0.72)";
  ctx.fillRect(0, 0, width, height);

  ctx.font = "600 13px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(45, 212, 191, 0.85)";
  ctx.fillText(
    "Tracking lost — reposition both hands to resume",
    width / 2,
    height / 2
  );
  ctx.restore();
}

export function mapHandToViewportTip(
  nx: number,
  ny: number,
  geo: ViewportGeometry,
  mirror: boolean
): Point2D {
  const x = geo.cx + (mirror ? 1 - nx - 0.5 : nx - 0.5) * geo.rx * 1.6;
  const y = geo.cy + (ny - 0.45) * geo.ry * 1.8;
  return { x, y };
}

export function drawCutCircle(
  ctx: CanvasRenderingContext2D,
  geo: ViewportGeometry,
  progress: number,
  cutPath: Point2D[]
): void {
  const cx = geo.cx;
  const cy = geo.cy;
  const r = Math.min(geo.rx, geo.ry) * 0.45;

  ctx.fillStyle = "rgba(26, 31, 36, 0.6)";
  ctx.fillRect(cx - r - 20, cy - r - 20, (r + 20) * 2, (r + 20) * 2);

  ctx.strokeStyle = LAP_COLORS.caution;
  ctx.setLineDash([6, 4]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  if (cutPath.length > 1) {
    ctx.strokeStyle = LAP_COLORS.warning;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cutPath[0].x, cutPath[0].y);
    for (let i = 1; i < cutPath.length; i++) {
      ctx.lineTo(cutPath[i].x, cutPath[i].y);
    }
    ctx.stroke();
  }
}
