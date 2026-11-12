export function XaDaoXaPlatformDiagram() {
  return (
    <figure className="border-line bg-surface rounded-media my-8 border p-4 sm:p-6">
      <div className="border-line/80 rounded-sm border border-dashed p-3 sm:p-5">
        <p className="font-ui text-meta text-ink-soft mb-4 tracking-[0.08em] uppercase">
          Service architecture (high level)
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="border-line bg-canvas rounded-sm border p-4">
            <p className="font-ui text-meta text-ink-soft">Citizen app</p>
            <p className="font-reading text-ink-strong mt-1 font-semibold">Zalo MiniApp</p>
            <p className="text-ink-muted mt-1 text-[0.9rem] leading-[1.45]">
              Built with ZaUI and the ZMP SDK for commune e-services.
            </p>
          </div>
          <div className="border-line bg-canvas rounded-sm border p-4">
            <p className="font-ui text-meta text-ink-soft">Platform API</p>
            <p className="font-reading text-ink-strong mt-1 font-semibold">Authenticated service</p>
            <p className="text-ink-muted mt-1 text-[0.9rem] leading-[1.45]">
              JWT access/refresh tokens and role-based access control across workflows.
            </p>
          </div>
          <div className="border-line bg-canvas rounded-sm border p-4">
            <p className="font-ui text-meta text-ink-soft">Staff CMS</p>
            <p className="font-reading text-ink-strong mt-1 font-semibold">Next.js 16</p>
            <p className="text-ink-muted mt-1 text-[0.9rem] leading-[1.45]">
              Commune officials review and handle submissions in a dedicated CMS.
            </p>
          </div>
        </div>
        <div className="border-line bg-canvas mt-3 rounded-sm border p-4">
          <p className="font-ui text-meta text-ink-soft">Deployment</p>
          <p className="text-ink-muted mt-1 text-[0.9rem] leading-[1.45]">
            Separate clusters support independent deployment, helping protect service continuity for
            a platform that is live for citizens.
          </p>
        </div>
      </div>
      <figcaption className="font-ui text-note text-ink-soft mt-3 leading-[1.4]">
        High-level view of the citizen, API, and staff surfaces. Only verified platform facts are
        shown.
      </figcaption>
    </figure>
  );
}
