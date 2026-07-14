import Link from "next/link";

const TASKS = [
  {
    id: "01",
    name: "Peg Transfer",
    detail: "Six rings, mid-air handoff, path length and drop count scored.",
    href: "/training",
    status: "open" as const,
  },
  {
    id: "02",
    name: "Pattern Cutting",
    detail: "Cut a marked circle while non-dominant traction holds the field.",
    status: "active" as const,
  },
  {
    id: "03",
    name: "Knot Tying",
    detail: "Two-throw intracorporeal square knot — unlocks after prior drills.",
    status: "locked" as const,
  },
];

const EXAMPLE_METRICS = [
  { label: "Stability", value: 78, unit: "/100" },
  { label: "Path economy", value: 64, unit: "%" },
  { label: "Bimanual sync", value: 71, unit: "/100" },
];

export function DashboardStats() {
  return (
    <section
      id="how-it-works"
      className="border-t border-[var(--brand-line)] bg-[var(--brand-navy)] pb-28 pt-20 text-[var(--brand-ink)] sm:pb-36 sm:pt-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Asymmetric intro: narrow eyebrow left, wide statement right */}
        <div className="grid gap-8 border-b border-[var(--brand-line)] pb-14 lg:grid-cols-12 lg:gap-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--brand-muted)] lg:col-span-3">
            Session loop
          </p>
          <h2
            className="max-w-2xl text-[clamp(1.75rem,4vw,2.75rem)] font-light leading-[1.1] tracking-tight text-[var(--brand-ink)] lg:col-span-8 lg:col-start-5"
            style={{ fontFamily: "var(--font-display), sans-serif" }}
          >
            Pick a drill. Hold both hands in frame until tracking locks.
            <span className="font-semibold"> Session metrics write to a local report.</span>
          </h2>
        </div>

        {/* Uneven: task list dominates; metrics panel offsets right */}
        <div className="mt-16 grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className="mb-6 text-[11px] uppercase tracking-[0.22em] text-[var(--brand-muted)]">
              Curriculum
            </p>
            <ul className="divide-y divide-[var(--brand-line)] border-y border-[var(--brand-line)]">
              {TASKS.map((task) => (
                <li
                  key={task.id}
                  className="flex flex-wrap items-baseline justify-between gap-4 py-6"
                >
                  <div className="flex min-w-0 gap-5">
                    <span className="font-mono text-xs font-light text-[var(--brand-accent)]">
                      {task.id}
                    </span>
                    <div>
                      <p className="text-lg font-semibold tracking-tight text-[var(--brand-ink)]">
                        {task.name}
                      </p>
                      <p className="mt-1 max-w-md text-sm font-light leading-relaxed text-[var(--brand-muted)]">
                        {task.detail}
                      </p>
                    </div>
                  </div>
                  {task.status === "open" && task.href ? (
                    <Link
                      href={task.href}
                      className="shrink-0 border border-[var(--brand-line)] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[var(--brand-ink)] hover:border-[var(--brand-muted)]"
                    >
                      Open
                    </Link>
                  ) : (
                    <span
                      className={`shrink-0 text-[11px] uppercase tracking-[0.16em] ${
                        task.status === "active"
                          ? "text-[var(--brand-accent)]"
                          : "text-[var(--brand-muted)]"
                      }`}
                    >
                      {task.status === "active" ? "In curriculum" : "Gated"}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:col-span-4 lg:col-start-9 lg:pt-10">
            <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-[var(--brand-muted)]">
              Example report slice
            </p>
            <p className="mb-8 text-xs font-light text-[var(--brand-muted)]">
              Not your score — shows the shape of a finished session readout.
            </p>
            <dl className="space-y-6">
              {EXAMPLE_METRICS.map((m) => (
                <div key={m.label}>
                  <div className="mb-2 flex items-baseline justify-between gap-3">
                    <dt className="text-xs font-light text-[var(--brand-muted)]">
                      {m.label}
                    </dt>
                    <dd className="font-mono text-2xl font-semibold tabular-nums text-[var(--brand-ink)]">
                      {m.value}
                      <span className="ml-0.5 text-xs font-light text-[var(--brand-muted)]">
                        {m.unit}
                      </span>
                    </dd>
                  </div>
                  <div className="h-px w-full bg-[var(--brand-line)]">
                    <div
                      className="h-px bg-[var(--brand-ink)]"
                      style={{ width: `${m.value}%` }}
                      aria-hidden
                    />
                  </div>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </div>
    </section>
  );
}
