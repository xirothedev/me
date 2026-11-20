import type { ReactNode } from 'react';

interface BioModesProps {
  defaultBio: ReactNode;
  longBio: ReactNode;
}

export function BioModes({ defaultBio, longBio }: BioModesProps) {
  return (
    <section aria-label="Biography" className="bio-modes mb-[3.25rem]">
      <input
        className="sr-only"
        type="radio"
        name="bio-mode"
        id="bio-default"
        defaultChecked
        aria-label="Default biography"
      />
      <input
        className="sr-only"
        type="radio"
        name="bio-mode"
        id="bio-long"
        aria-label="Long biography"
      />
      <div className="border-line font-ui text-ink-soft bio-header mb-[1.35rem] flex items-baseline justify-between border-b pb-[0.55rem] text-sm leading-[1.4] tracking-[0.01em]">
        <span>Bio</span>
        <div className="flex gap-4" aria-label="Bio length">
          <label
            htmlFor="bio-default"
            className="hover:text-ink relative cursor-pointer py-[0.2rem] transition-colors"
          >
            Default
          </label>
          <label
            htmlFor="bio-long"
            className="hover:text-ink relative cursor-pointer py-[0.2rem] transition-colors"
          >
            Long
          </label>
        </div>
      </div>
      <div id="bio-content">
        <div className="bio-default">{defaultBio}</div>
        <div className="bio-long">{longBio}</div>
      </div>
    </section>
  );
}
