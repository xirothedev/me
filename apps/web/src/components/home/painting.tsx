import Image from 'next/image';

const HERO_IMAGE = '/media/hero/nha-trang.webp';

export function Painting() {
  return (
    <div
      className="home-painting"
      role="img"
      aria-label="A top-down illustration of a tropical beach, palm-lined park, and bright city street."
    >
      <div className="hero-art-base">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="(min-width: 1100px) 30vw, 100vw"
          className="hero-art-image"
        />
      </div>
      <div className="hero-art-sway" aria-hidden="true">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="(min-width: 1100px) 30vw, 100vw"
          className="hero-art-image"
        />
      </div>
    </div>
  );
}
