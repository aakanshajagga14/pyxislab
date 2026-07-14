import Link from "next/link";

/**
 * Product visual — only element that lifts with soft glow + square edges.
 */
function HeroViewportVisual() {
  return (
    <div className="relative">
      <div
        className="absolute -inset-4 opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at 55% 40%, rgba(200, 241, 105, 0.14), transparent 55%)",
        }}
        aria-hidden
      />

      <div className="relative border border-[var(--brand-line)] bg-[#0A0C0E] shadow-[0_32px_80px_rgba(0,0,0,0.55)]">
        <div className="relative aspect-[5/4] w-full">
          <svg
            viewBox="0 0 640 480"
            className="h-full w-full"
            role="img"
            aria-label="Peg transfer viewport with left magenta and right amber instruments"
          >
            <defs>
              <radialGradient id="orVig" cx="50%" cy="48%" r="55%">
                <stop offset="0%" stopColor="#14181C" />
                <stop offset="70%" stopColor="#0A0C0E" />
                <stop offset="100%" stopColor="#060810" />
              </radialGradient>
              <linearGradient id="shaftL" x1="0%" y1="100%" x2="70%" y2="20%">
                <stop offset="0%" stopColor="#1A1E22" />
                <stop offset="100%" stopColor="#E879F9" />
              </linearGradient>
              <linearGradient id="shaftR" x1="100%" y1="100%" x2="30%" y2="25%">
                <stop offset="0%" stopColor="#1A1E22" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>

            <rect width="640" height="480" fill="url(#orVig)" />

            <g opacity="0.18" stroke="#5A646E" strokeWidth="1">
              <line x1="80" y1="280" x2="560" y2="280" />
              <line x1="60" y1="320" x2="580" y2="320" />
              <line x1="40" y1="370" x2="600" y2="370" />
              <line x1="20" y1="430" x2="620" y2="430" />
              <line x1="200" y1="250" x2="80" y2="480" />
              <line x1="320" y1="250" x2="320" y2="480" />
              <line x1="440" y1="250" x2="560" y2="480" />
            </g>

            <g stroke="#8A9299" strokeWidth="3" strokeLinecap="round">
              <line x1="220" y1="300" x2="220" y2="272" />
              <line x1="280" y1="290" x2="280" y2="262" />
              <line x1="360" y1="290" x2="360" y2="262" />
              <line x1="420" y1="300" x2="420" y2="272" />
            </g>
            <g fill="#B8C0C8">
              <circle cx="220" cy="272" r="3.5" />
              <circle cx="280" cy="262" r="3.5" />
              <circle cx="360" cy="262" r="3.5" />
              <circle cx="420" cy="272" r="3.5" />
            </g>

            <circle
              cx="280"
              cy="250"
              r="14"
              fill="none"
              stroke="#8A9299"
              strokeWidth="4"
            />

            <line
              x1="40"
              y1="460"
              x2="250"
              y2="240"
              stroke="url(#shaftL)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="250" cy="240" r="6" fill="#E879F9" />

            <line
              x1="600"
              y1="460"
              x2="380"
              y2="255"
              stroke="url(#shaftR)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="380" cy="255" r="6" fill="#F59E0B" />

            <text
              x="24"
              y="36"
              fill="rgba(244,246,250,0.35)"
              fontSize="10"
              fontFamily="ui-monospace, monospace"
              letterSpacing="2"
            >
              PEG TRANSFER
            </text>
            <text
              x="24"
              y="56"
              fill="rgba(244,246,250,0.8)"
              fontSize="18"
              fontFamily="ui-monospace, monospace"
            >
              00:34
            </text>
          </svg>
        </div>
      </div>

      <p
        className="pointer-events-none absolute -right-2 top-1/4 hidden origin-center select-none text-[10px] uppercase tracking-[0.28em] text-[var(--brand-muted)] lg:block"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        aria-hidden
      >
        MediaPipe · dual hand
      </p>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[var(--brand-navy)] text-[var(--brand-ink)]">
      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 sm:pb-32 sm:pt-16 lg:px-8">
        <div className="grid items-end gap-14 lg:grid-cols-12 lg:gap-8">
          {/* Copy — spans 7, left-heavy */}
          <div className="lg:col-span-7 lg:pb-6">
            <p className="mb-8 border-l border-[var(--brand-accent)] pl-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--brand-muted)]">
              Peg transfer · Pattern cutting · Knot tying
            </p>

            <h1
              className="text-[var(--brand-ink)]"
              style={{
                fontFamily: "var(--font-display), sans-serif",
                lineHeight: 0.92,
              }}
            >
              <span className="block text-[clamp(3.25rem,8vw,5.75rem)] font-semibold tracking-[-0.03em]">
                Pyxis Lab
              </span>
              <span className="mt-4 block max-w-lg text-[1.35rem] font-light tracking-tight text-[var(--brand-muted)] sm:text-[1.65rem]">
                Train FLS drills in the browser. A webcam and MediaPipe hand
                landmarks drive the instruments — no headset, no trainer box.
              </span>
            </h1>

            <div className="mt-12 flex flex-wrap items-stretch gap-0">
              <Link
                href="/training"
                className="inline-flex items-center bg-[var(--brand-ink)] px-7 py-3.5 text-sm font-semibold tracking-wide text-[var(--brand-navy)] transition-opacity hover:opacity-90"
              >
                Start training
              </Link>
              <Link
                href="/assessment"
                className="inline-flex items-center border border-l-0 border-[var(--brand-line)] px-7 py-3.5 text-sm font-light tracking-wide text-[var(--brand-ink)] transition-colors hover:border-[var(--brand-muted)]"
              >
                Timed assessment
              </Link>
            </div>
          </div>

          {/* Visual — spans 5, sits lower */}
          <div className="lg:col-span-5 lg:translate-y-4">
            <HeroViewportVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
