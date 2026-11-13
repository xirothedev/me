'use client';

import { FigureFrame } from './figure-frame';
import { useFigurePlayer } from './use-figure-player';

const CAPTIONS = [
  'A citizen submits a form in the Zalo MiniApp (ZaUI, ZMP SDK).',
  'The API receives the request with JWT authentication and RBAC checks.',
  'The submission is routed so commune staff can access it in the Next.js 16 CMS.',
  'Officials review and act on the case within their permitted role.',
  'Trust requires the same workflow to be visible and reliable on both surfaces.',
];

function Panel({
  active,
  label,
  title,
  detail,
}: {
  active: boolean;
  label: string;
  title: string;
  detail: string;
}) {
  return (
    <div
      className={`rounded-md border p-3 transition-colors ${
        active ? 'border-blue-500 bg-blue-50' : 'border-neutral-300 bg-white'
      }`}
    >
      <p className="font-ui text-[11px] tracking-[0.08em] text-neutral-500 uppercase">{label}</p>
      <p
        className={`font-reading mt-1 text-[1rem] font-semibold ${active ? 'text-blue-900' : 'text-neutral-900'}`}
      >
        {title}
      </p>
      <p className="mt-1 text-[0.82rem] leading-[1.35] text-neutral-700">{detail}</p>
    </div>
  );
}

export const figureRegistration = { name: 'xadaoxa-submission-flow' } as const;
export function XaDaoXaSubmissionFlowFigure() {
  const player = useFigurePlayer(CAPTIONS.length);

  return (
    <FigureFrame
      viz="xadaoxa-submission-flow"
      label="Citizen to official flow"
      captions={CAPTIONS}
      step={player.step}
      playing={player.playing}
      speed={player.speed}
      onToggle={player.toggle}
      onSpeed={player.setSpeed}
      className="min-h-[340px]"
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <Panel
          active={player.step === 0}
          label="Citizen surface"
          title="Zalo MiniApp"
          detail="Form submission from residents using ZaUI and ZMP SDK."
        />
        <Panel
          active={player.step === 1 || player.step === 2}
          label="Platform"
          title="API and access control"
          detail="JWT access/refresh tokens and role-based access control route the request."
        />
        <Panel
          active={player.step === 3 || player.step === 4}
          label="Staff surface"
          title="Next.js 16 CMS"
          detail="Commune officials review submissions with permissions and service continuity in mind."
        />
      </div>
      <div
        className="font-ui mt-3 flex items-center justify-center gap-2 text-[11px] text-neutral-500"
        aria-hidden="true"
      >
        <span className={player.step >= 1 ? 'text-blue-600' : ''}>Submit</span>
        <span>→</span>
        <span className={player.step >= 2 ? 'text-blue-600' : ''}>Authenticate &amp; route</span>
        <span>→</span>
        <span className={player.step >= 3 ? 'text-blue-600' : ''}>Review &amp; act</span>
      </div>
    </FigureFrame>
  );
}
