/** Shared debounced hold pattern (camera setup + mid-task recovery). */
export const CONFIDENCE_GOOD = 0.45;

/**
 * Bidirectional debounce: value must stay on one side of threshold for holdMs
 * before the boolean state flips.
 */
export class DebouncedThreshold {
  private belowSince: number | null = null;
  private aboveSince: number | null = null;
  private lost = false;

  constructor(private readonly holdMs: number) {}

  /** Returns true when tracking is considered lost for this channel. */
  tick(value: number, threshold: number, now: number): boolean {
    if (this.lost) {
      if (value >= threshold) {
        if (this.aboveSince === null) this.aboveSince = now;
        if (now - this.aboveSince >= this.holdMs) {
          this.lost = false;
          this.aboveSince = null;
          this.belowSince = null;
        }
      } else {
        this.aboveSince = null;
      }
    } else if (value < threshold) {
      if (this.belowSince === null) this.belowSince = now;
      if (now - this.belowSince >= this.holdMs) {
        this.lost = true;
        this.belowSince = null;
        this.aboveSince = null;
      }
    } else {
      this.belowSince = null;
    }
    return this.lost;
  }

  reset(): void {
    this.belowSince = null;
    this.aboveSince = null;
    this.lost = false;
  }
}
