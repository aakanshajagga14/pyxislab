import { useCallback, useRef } from "react";
import type { Point2D } from "@/lib/types";
import type { TrackingLostEvent } from "@/lib/laparoscopic/types";
import {
  CONFIDENCE_GOOD,
  DebouncedThreshold,
} from "@/lib/hand-tracking/confidence-hold";

export const TRACKING_LOST_THRESHOLD = CONFIDENCE_GOOD;
/** Slightly longer hold reduces flicker at the confidence boundary. */
export const TRACKING_HOLD_MS = 400;

export interface TrackingRecoveryState {
  leftLost: boolean;
  rightLost: boolean;
  bothLost: boolean;
  leftLastPos: Point2D | null;
  rightLastPos: Point2D | null;
}

const EMPTY_STATE: TrackingRecoveryState = {
  leftLost: false,
  rightLost: false,
  bothLost: false,
  leftLastPos: null,
  rightLastPos: null,
};

class TrackingRecoveryTracker {
  private leftGate = new DebouncedThreshold(TRACKING_HOLD_MS);
  private rightGate = new DebouncedThreshold(TRACKING_HOLD_MS);
  private leftLast: Point2D | null = null;
  private rightLast: Point2D | null = null;
  private prevLeftLost = false;
  private prevRightLost = false;
  private prevBothLost = false;
  private leftLostStartT: number | null = null;
  private rightLostStartT: number | null = null;
  private bothLostStartT: number | null = null;
  private events: TrackingLostEvent[] = [];

  update(
    leftConfidence: number,
    rightConfidence: number,
    leftPos: Point2D | null,
    rightPos: Point2D | null,
    now: number,
    elapsedSeconds: number,
    threshold = TRACKING_LOST_THRESHOLD
  ): TrackingRecoveryState {
    if (leftPos && leftConfidence >= threshold) {
      this.leftLast = leftPos;
    }
    if (rightPos && rightConfidence >= threshold) {
      this.rightLast = rightPos;
    }

    const leftLost = this.leftGate.tick(leftConfidence, threshold, now);
    const rightLost = this.rightGate.tick(rightConfidence, threshold, now);
    const bothLost = leftLost && rightLost;

    this.recordTransitions(leftLost, rightLost, bothLost, elapsedSeconds);

    return {
      leftLost,
      rightLost,
      bothLost,
      leftLastPos: this.leftLast,
      rightLastPos: this.rightLast,
    };
  }

  private recordTransitions(
    leftLost: boolean,
    rightLost: boolean,
    bothLost: boolean,
    elapsedSeconds: number
  ): void {
    if (leftLost && !this.prevLeftLost) {
      this.leftLostStartT = elapsedSeconds;
    } else if (!leftLost && this.prevLeftLost && this.leftLostStartT !== null) {
      this.events.push({
        hand: "left",
        startT: this.leftLostStartT,
        durationSeconds: Math.max(0, elapsedSeconds - this.leftLostStartT),
      });
      this.leftLostStartT = null;
    }

    if (rightLost && !this.prevRightLost) {
      this.rightLostStartT = elapsedSeconds;
    } else if (!rightLost && this.prevRightLost && this.rightLostStartT !== null) {
      this.events.push({
        hand: "right",
        startT: this.rightLostStartT,
        durationSeconds: Math.max(0, elapsedSeconds - this.rightLostStartT),
      });
      this.rightLostStartT = null;
    }

    if (bothLost && !this.prevBothLost) {
      this.bothLostStartT = elapsedSeconds;
    } else if (!bothLost && this.prevBothLost && this.bothLostStartT !== null) {
      this.events.push({
        hand: "both",
        startT: this.bothLostStartT,
        durationSeconds: Math.max(0, elapsedSeconds - this.bothLostStartT),
      });
      this.bothLostStartT = null;
    }

    this.prevLeftLost = leftLost;
    this.prevRightLost = rightLost;
    this.prevBothLost = bothLost;
  }

  /** Close any in-progress lost episodes (call before building session report). */
  finalize(elapsedSeconds: number): void {
    if (this.leftLostStartT !== null) {
      this.events.push({
        hand: "left",
        startT: this.leftLostStartT,
        durationSeconds: Math.max(0, elapsedSeconds - this.leftLostStartT),
      });
      this.leftLostStartT = null;
    }
    if (this.rightLostStartT !== null) {
      this.events.push({
        hand: "right",
        startT: this.rightLostStartT,
        durationSeconds: Math.max(0, elapsedSeconds - this.rightLostStartT),
      });
      this.rightLostStartT = null;
    }
    if (this.bothLostStartT !== null) {
      this.events.push({
        hand: "both",
        startT: this.bothLostStartT,
        durationSeconds: Math.max(0, elapsedSeconds - this.bothLostStartT),
      });
      this.bothLostStartT = null;
    }
    this.prevLeftLost = false;
    this.prevRightLost = false;
    this.prevBothLost = false;
  }

  getEvents(): TrackingLostEvent[] {
    return this.events;
  }

  reset(): void {
    this.leftGate.reset();
    this.rightGate.reset();
    this.leftLast = null;
    this.rightLast = null;
    this.prevLeftLost = false;
    this.prevRightLost = false;
    this.prevBothLost = false;
    this.leftLostStartT = null;
    this.rightLostStartT = null;
    this.bothLostStartT = null;
    this.events = [];
  }
}

/**
 * Per-hand tracking recovery with debounced lost/recover transitions.
 * Call `update()` from the render loop; read `stateRef.current` for draw logic.
 */
export function useTrackingRecovery() {
  const trackerRef = useRef(new TrackingRecoveryTracker());
  const stateRef = useRef<TrackingRecoveryState>(EMPTY_STATE);

  const update = useCallback(
    (
      leftConfidence: number,
      rightConfidence: number,
      leftPos: Point2D | null,
      rightPos: Point2D | null,
      now: number,
      elapsedSeconds: number,
      threshold = TRACKING_LOST_THRESHOLD
    ): TrackingRecoveryState => {
      const next = trackerRef.current.update(
        leftConfidence,
        rightConfidence,
        leftPos,
        rightPos,
        now,
        elapsedSeconds,
        threshold
      );
      stateRef.current = next;
      return next;
    },
    []
  );

  const finalize = useCallback((elapsedSeconds: number) => {
    trackerRef.current.finalize(elapsedSeconds);
  }, []);

  const getEvents = useCallback(() => trackerRef.current.getEvents(), []);

  const reset = useCallback(() => {
    trackerRef.current.reset();
    stateRef.current = EMPTY_STATE;
  }, []);

  return { update, finalize, getEvents, reset, stateRef };
}
