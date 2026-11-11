export function HospitalDiagram() {
  return (
    <figure className="border-line bg-surface rounded-media my-8 border p-4 sm:p-6">
      <div className="border-line/80 rounded-sm border border-dashed p-3 sm:p-5">
        <p className="font-ui text-meta text-ink-soft mb-4 tracking-[0.08em] uppercase">
          Hospital network
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="border-line bg-canvas rounded-sm border p-4">
            <p className="font-ui text-meta text-ink-soft">01 · NVIDIA DGX Spark</p>
            <p className="font-reading text-ink-strong mt-1 font-semibold">Local model</p>
            <p className="text-ink-muted mt-1 text-[0.9rem] leading-[1.45]">
              Inference stays inside the building.
            </p>
          </div>

          <div className="border-line bg-canvas rounded-sm border p-4">
            <p className="font-ui text-meta text-ink-soft">02 · Self-hosted</p>
            <p className="font-reading text-ink-strong mt-1 font-semibold">RAGFlow v0.27.x</p>
            <p className="text-ink-muted mt-1 text-[0.9rem] leading-[1.45]">
              Documents, parsing, and retrieval live beside the model.
            </p>
          </div>

          <div className="border-line bg-canvas rounded-sm border p-4">
            <p className="font-ui text-meta text-ink-soft">03 · Thin bridge</p>
            <p className="font-reading text-ink-strong mt-1 font-semibold">Retrieval proxy</p>
            <p className="text-ink-muted mt-1 text-[0.9rem] leading-[1.45]">
              Exposes the knowledge base as a tool, not another chat app.
            </p>
          </div>

          <div className="border-line bg-canvas rounded-sm border p-4">
            <p className="font-ui text-meta text-ink-soft">04 · Existing workflow</p>
            <p className="font-reading text-ink-strong mt-1 font-semibold">Agent harness</p>
            <p className="text-ink-muted mt-1 text-[0.9rem] leading-[1.45]">
              Staff ask a question where they already work.
            </p>
          </div>
        </div>
      </div>
      <figcaption className="font-ui text-note text-ink-soft mt-3 leading-[1.4]">
        The flow runs left to right, then down. No clinical document leaves the hospital network.
        The proxy is the only path between the agent and retrieval.
      </figcaption>
    </figure>
  );
}
