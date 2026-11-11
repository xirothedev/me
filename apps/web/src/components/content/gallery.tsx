'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ICON, Icon } from '@repo/ui';

export interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface ViewerProps {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

function Viewer({ images, index, onClose, onNavigate }: ViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const startX = useRef<number | null>(null);
  const image = images[index];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const go = useCallback(
    (direction: 1 | -1) => {
      onNavigate((index + direction + images.length) % images.length);
    },
    [images.length, index, onNavigate],
  );

  if (!image) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="viewer-title"
      aria-describedby="viewer-description"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') go(1);
        if (event.key === 'ArrowLeft') go(-1);
      }}
      onPointerDown={(event) => {
        startX.current = event.clientX;
      }}
      onPointerUp={(event) => {
        if (startX.current === null) return;
        const delta = event.clientX - startX.current;
        startX.current = null;
        if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1);
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-dvw max-w-none bg-[radial-gradient(rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.95)_100%)] p-4 text-white backdrop:bg-black/80"
    >
      <h2 id="viewer-title" className="sr-only">
        Image gallery
      </h2>
      <p id="viewer-description" className="sr-only">
        Press Escape to close, use the arrow keys to move, or swipe to dismiss.
      </p>
      <button
        type="button"
        aria-label="Close image viewer"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full p-2 text-white/80 transition-colors hover:text-white"
      >
        <Icon icon={ICON.close} size="xl" />
      </button>
      <button
        type="button"
        aria-label="Previous image"
        onClick={() => go(-1)}
        className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full p-2 text-white/80 transition-colors hover:text-white"
      >
        <Icon icon={ICON.previous} size="xl" />
      </button>
      <button
        type="button"
        aria-label="Next image"
        onClick={() => go(1)}
        className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full p-2 text-white/80 transition-colors hover:text-white"
      >
        <Icon icon={ICON.next} size="xl" />
      </button>
      <div className="relative h-[85dvh] w-full">
        <Image src={image.src} alt={image.alt} fill sizes="100vw" className="object-contain" />
      </div>
    </dialog>
  );
}

function useGallery(images: GalleryImage[]) {
  const [index, setIndex] = useState<number | null>(null);
  const viewer =
    index === null ? null : (
      <Viewer images={images} index={index} onClose={() => setIndex(null)} onNavigate={setIndex} />
    );
  return { open: setIndex, viewer };
}

interface GalleryProps {
  images: GalleryImage[];
}

export function PhotoStrip({ images }: GalleryProps) {
  const gallery = useGallery(images);
  return (
    <>
      <div className="relative left-1/2 w-screen max-w-[1100px] -translate-x-1/2 overflow-x-auto overflow-y-hidden">
        <div className="mx-auto my-4 flex h-[280px] items-center gap-4 px-4 md:max-w-[75%] md:justify-center md:gap-6 md:px-0">
          {images.map((image, index) => (
            <button
              key={image.alt ? `${image.src}#${image.alt}` : image.src}
              type="button"
              aria-label={`Open ${image.alt || 'image'}`}
              onClick={() => gallery.open(index)}
              className={`min-w-[186px] shrink-0 snap-start rounded-sm transition-transform ${
                index % 2 === 0 ? '-rotate-2' : 'rotate-2'
              }`}
            >
              <div className="aged-polaroid rounded-sm border border-neutral-200 p-3 pb-12 transition-shadow hover:shadow-lg dark:border-neutral-600">
                <div className="vintage-tile relative h-[180px] w-[180px] overflow-hidden">
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    sizes="180px"
                    className="vintage-image object-cover"
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {gallery.viewer}
    </>
  );
}

export function PhotoGrid({ images }: GalleryProps) {
  const gallery = useGallery(images);
  return (
    <>
      <div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {images.map((image, index) => (
          <button
            key={image.alt ? `${image.src}#${image.alt}` : image.src}
            type="button"
            aria-label={`Open ${image.alt || 'image'}`}
            onClick={() => gallery.open(index)}
            className="border-line relative aspect-[4/3] overflow-hidden rounded-sm border"
          >
            <Image
              src={image.src}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
      {gallery.viewer}
    </>
  );
}

export function Gallery({ images }: GalleryProps) {
  const gallery = useGallery(images);
  return (
    <>
      <div className="my-6 grid grid-cols-2 gap-4">
        {images.map((image, index) => (
          <button
            key={image.alt ? `${image.src}#${image.alt}` : image.src}
            type="button"
            aria-label={`Open ${image.alt || 'image'}`}
            onClick={() => gallery.open(index)}
            className="border-line relative aspect-[4/3] overflow-hidden rounded-sm border transition-opacity even:mt-6 hover:opacity-90"
          >
            <Image
              src={image.src}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, 280px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
      {gallery.viewer}
    </>
  );
}
