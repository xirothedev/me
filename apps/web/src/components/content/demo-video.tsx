'use client';

import { useEffect, useRef, useState } from 'react';

interface DemoVideoProps {
  src: string;
  width: number;
  height: number;
  fullBleed?: boolean;
  label?: string;
}

export function DemoVideo({
  src,
  width,
  height,
  fullBleed = false,
  label = 'Demo video',
}: DemoVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element || !visible) return;
    if (reducedMotion) return;
    element.play().catch(() => undefined);
    return () => {
      element.pause();
    };
  }, [visible, reducedMotion]);

  const video = (
    <video
      ref={ref}
      src={visible ? src : undefined}
      width={width || undefined}
      height={height || undefined}
      autoPlay={visible && !reducedMotion}
      loop
      muted
      playsInline
      controls
      preload="none"
      aria-label={label}
      className="rounded-media border-line bg-surface h-auto w-full border"
    />
  );

  if (!fullBleed) return <div className="my-4">{video}</div>;

  return (
    <div className="relative left-1/2 my-4 w-screen max-w-[1100px] -translate-x-1/2">{video}</div>
  );
}
