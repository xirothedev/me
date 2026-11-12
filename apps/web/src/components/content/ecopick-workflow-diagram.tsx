export function EcopickWorkflowDiagram() {
  return (
    <figure className="border-line bg-surface rounded-media my-8 border p-4 sm:p-6">
      <div className="border-line/80 rounded-sm border border-dashed p-3 sm:p-5">
        <p className="font-ui text-meta text-ink-soft mb-4 tracking-[0.08em] uppercase">
          Workflow and state overview
        </p>
        <div className="grid gap-3 lg:grid-cols-3">
          <div className="border-line bg-canvas rounded-sm border p-4 lg:col-span-2">
            <p className="font-ui text-meta text-ink-soft">Stateful domains</p>
            <p className="font-reading text-ink-strong mt-1 font-semibold">
              Rental · Listing · Inspection · Refund
            </p>
            <p className="text-ink-muted mt-2 text-[0.9rem] leading-[1.45]">
              Each domain has a lifecycle with explicit transitions. Actions must match the current
              state, timing, and evidence.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="border-line rounded-sm border p-3">
                <p className="font-ui text-meta text-ink-soft">Concurrency</p>
                <p className="text-ink-muted mt-1 text-[0.88rem] leading-[1.4]">
                  CAS concurrency guards protect transitions from conflicting updates.
                </p>
              </div>
              <div className="border-line rounded-sm border p-3">
                <p className="font-ui text-meta text-ink-soft">Policy edge</p>
                <p className="text-ink-muted mt-1 text-[0.88rem] leading-[1.4]">
                  AI features assist flows (support, matching, refund gate) without owning policy.
                </p>
              </div>
            </div>
          </div>
          <div className="border-line bg-canvas rounded-sm border p-4">
            <p className="font-ui text-meta text-ink-soft">Scoped roles</p>
            <p className="font-reading text-ink-strong mt-1 font-semibold">Tournament actors</p>
            <ul className="text-ink-muted mt-2 space-y-1 text-[0.9rem] leading-[1.45]">
              <li>Host</li>
              <li>Admin</li>
              <li>Referee</li>
              <li>Player</li>
              <li>Spectator</li>
            </ul>
            <p className="text-ink-muted mt-2 text-[0.88rem] leading-[1.4]">
              One player can hold different roles across tournaments.
            </p>
          </div>
        </div>
      </div>
      <figcaption className="font-ui text-note text-ink-soft mt-3 leading-[1.4]">
        Conceptual overview of marketplace workflows, guarded transitions, and scoped roles. Details
        are limited to verified platform facts.
      </figcaption>
    </figure>
  );
}
