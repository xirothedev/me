export function TaxEasyAnomalyDiagram() {
  return (
    <figure className="border-line bg-surface rounded-media my-8 border p-4 sm:p-6">
      <div className="border-line/80 rounded-sm border border-dashed p-3 sm:p-5">
        <p className="font-ui text-meta text-ink-soft mb-4 tracking-[0.08em] uppercase">
          Anomaly detection lifecycle
        </p>

        <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] sm:items-center">
          <div className="border-line bg-canvas rounded-sm border p-3">
            <p className="font-ui text-meta text-ink-soft">Detect</p>
            <p className="font-reading text-ink-strong mt-1 font-semibold">8 detectors</p>
          </div>
          <span className="text-ink-soft hidden text-center sm:block" aria-hidden="true">
            →
          </span>
          <div className="border-line bg-canvas rounded-sm border p-3">
            <p className="font-ui text-meta text-ink-soft">Flag</p>
            <p className="font-reading text-ink-strong mt-1 font-semibold">State + owner</p>
          </div>
          <span className="text-ink-soft hidden text-center sm:block" aria-hidden="true">
            →
          </span>
          <div className="border-line bg-canvas rounded-sm border p-3">
            <p className="font-ui text-meta text-ink-soft">Act</p>
            <p className="font-reading text-ink-strong mt-1 font-semibold">Auto-close / ZNS</p>
          </div>
          <span className="text-ink-soft hidden text-center sm:block" aria-hidden="true">
            →
          </span>
          <div className="border-line bg-canvas rounded-sm border p-3">
            <p className="font-ui text-meta text-ink-soft">Outcome</p>
            <p className="font-reading text-ink-strong mt-1 font-semibold">Resolved signal</p>
          </div>
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <div className="border-line bg-canvas rounded-sm border p-4">
            <p className="font-ui text-meta text-ink-soft">Verified detector names</p>
            <ul className="text-ink-muted mt-2 space-y-1 text-[0.9rem] leading-[1.45]">
              <li>late filing</li>
              <li>missing declaration</li>
              <li>partner KPI breach</li>
              <li>high refund rate</li>
              <li>revenue mismatch</li>
              <li className="text-ink-soft">+ 3 more detectors</li>
            </ul>
          </div>
          <div className="border-line bg-canvas rounded-sm border p-4">
            <p className="font-ui text-meta text-ink-soft">Lifecycle states</p>
            <div className="font-code mt-2 space-y-1.5 text-[12px] text-neutral-800">
              <p>
                <span className="rounded border border-neutral-200 bg-white px-1.5 py-0.5">
                  open · visible
                </span>
                {' → '}
                <span className="rounded border border-neutral-200 bg-white px-1.5 py-0.5">
                  owned
                </span>
              </p>
              <p>
                <span className="rounded border border-neutral-200 bg-white px-1.5 py-0.5">
                  auto-close
                </span>
                {' + '}
                <span className="rounded border border-neutral-200 bg-white px-1.5 py-0.5">
                  ZNS notify
                </span>
              </p>
              <p>
                <span className="rounded border border-neutral-200 bg-white px-1.5 py-0.5">
                  resolved
                </span>
                <span className="font-ui text-neutral-500"> · measured, not just detected</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="font-ui text-note text-ink-soft mt-3 leading-[1.4]">
        A flag with no owner is noise. The useful metric is how many anomalies were resolved.
      </figcaption>
    </figure>
  );
}
