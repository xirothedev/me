import type { Metadata } from 'next';
import { ContrastChecker } from '@/components/lab/contrast-checker';
import { TokenEstimator } from '@/components/lab/token-estimator';
import { Tuner } from '@/components/lab/tuner';

export const metadata: Metadata = {
  title: 'Lab',
  description: 'Small tools I keep close: a tuner, a token estimate, and a contrast checker.',
  robots: { index: false, follow: false },
};

export default function LabPage() {
  return (
    <article className="content-frame">
      <h1 className="content-title font-reading text-title-sm text-ink-strong sm:text-title mb-[0.6em] leading-[1.4] font-semibold tracking-[-0.02em] text-balance">
        Lab
      </h1>
      <p className="text-ink-muted mb-10">
        Three tools I use often enough to keep close. The microphone stays off until you press the
        button. The token count is an estimate. The contrast checker uses WCAG 2.2.
      </p>

      <section aria-labelledby="tuner-heading" className="mb-12">
        <h2
          id="tuner-heading"
          className="font-reading text-section text-ink-strong mb-3 font-semibold tracking-[-0.02em]"
        >
          Tuner
        </h2>
        <p className="text-ink-muted mb-4">
          Play a note. The tuner shows the nearest note, the octave, the distance in cents, and the
          frequency. It asks for the microphone only after you press the button.
        </p>
        <Tuner />
      </section>

      <section aria-labelledby="tokens-heading" className="mb-12">
        <h2
          id="tokens-heading"
          className="font-reading text-section text-ink-strong mb-3 font-semibold tracking-[-0.02em]"
        >
          Tokens
        </h2>
        <p className="text-ink-muted mb-4">
          Paste text, set a price, and get a rough input-token count and cost. The estimate counts
          words and punctuation; a real tokenizer will split them differently.
        </p>
        <TokenEstimator />
      </section>

      <section aria-labelledby="contrast-heading">
        <h2
          id="contrast-heading"
          className="font-reading text-section text-ink-strong mb-3 font-semibold tracking-[-0.02em]"
        >
          Contrast
        </h2>
        <p className="text-ink-muted mb-4">
          Pick a text color and a background color. The checker shows the WCAG ratio and the AA and
          AAA thresholds for normal and large text.
        </p>
        <ContrastChecker />
      </section>
    </article>
  );
}
