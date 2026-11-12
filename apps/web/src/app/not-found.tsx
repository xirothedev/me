import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404',
};

export default function NotFound() {
  return (
    <div className="max-w-content mx-auto flex min-h-[60vh] w-full flex-col justify-center">
      <p className="font-ui text-meta text-ink-soft">404</p>
      <h1 className="font-reading text-title text-ink-strong mt-2 font-semibold tracking-[-0.02em]">
        This page could not be found.
      </h1>
    </div>
  );
}
