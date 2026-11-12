import type { ReactNode } from 'react';

interface MarginNoteProps {
  number?: number;
  showNumber?: boolean;
  children: ReactNode;
}

export function MarginNote({ number, showNumber = true, children }: MarginNoteProps) {
  return (
    <>
      {number && showNumber ? (
        <sup className="text-ink-soft text-[0.72em] leading-0">{number}</sup>
      ) : null}
      <small
        role="note"
        className="margin-note-desktop margin-note-mobile font-ui text-note text-ink-soft wide:absolute wide:left-[calc(100%+2rem)] wide:mt-0 wide:w-60 wide:-translate-y-[1.67rem] mt-4 block leading-[1.4] font-normal tracking-normal not-italic"
      >
        {number ? `${number}: ` : null}
        {children}
      </small>
    </>
  );
}
