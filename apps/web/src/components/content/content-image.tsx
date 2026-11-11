import Image from 'next/image';

interface ContentImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  fullBleed?: boolean;
}

export function ContentImage({ src, alt, width, height, fullBleed = false }: ContentImageProps) {
  const image = (
    <Image
      src={src}
      alt={alt}
      width={width || 1600}
      height={height || 900}
      sizes={fullBleed ? '(max-width: 640px) 100vw, 1100px' : '(max-width: 640px) 100vw, 600px'}
      className="rounded-media border-line h-auto max-w-full border"
    />
  );

  if (!fullBleed) return <span className="my-4 block">{image}</span>;

  return (
    <span className="relative left-1/2 my-4 block w-screen max-w-[1100px] -translate-x-1/2">
      {image}
    </span>
  );
}
