import { preload } from 'react-dom';

const HERO_IMAGE = '/media/hero/nha-trang.webp';

const PALMS = [
  { x: 460, y: 310, rx: 72, ry: 64, delay: '-0.8s' },
  { x: 585, y: 585, rx: 66, ry: 60, delay: '-2.1s' },
  { x: 390, y: 1030, rx: 72, ry: 64, delay: '-3.4s' },
  { x: 545, y: 1240, rx: 78, ry: 68, delay: '-1.5s' },
  { x: 430, y: 1420, rx: 68, ry: 60, delay: '-4.2s' },
];

const SPARKLES = [
  { x: 160, y: 300, r: 2.6, delay: '0s' },
  { x: 200, y: 620, r: 2, delay: '-1.4s' },
  { x: 155, y: 900, r: 3, delay: '-2.9s' },
  { x: 185, y: 1180, r: 2.2, delay: '-4.1s' },
  { x: 165, y: 1440, r: 2.8, delay: '-5.3s' },
];

const FOAM_PATHS = [
  'M 209 0 C 210.0 21.3, 216.8 85.3, 215 128 C 213.2 170.7, 201.8 213.3, 198 256 C 194.2 298.7, 193.3 341.3, 192 384 C 190.7 426.7, 191.0 469.3, 190 512 C 189.0 554.7, 186.8 597.3, 186 640 C 185.2 682.7, 186.0 725.3, 185 768 C 184.0 810.7, 181.7 853.3, 180 896 C 178.3 938.7, 178.3 981.3, 175 1024 C 171.7 1066.7, 163.2 1109.3, 160 1152 C 156.8 1194.7, 157.0 1237.3, 156 1280 C 155.0 1322.7, 154.7 1365.3, 154 1408 C 153.3 1450.7, 152.3 1514.7, 152 1536',
  'M 184 0 C 185.0 21.3, 191.8 85.3, 190 128 C 188.2 170.7, 176.8 213.3, 173 256 C 169.2 298.7, 168.3 341.3, 167 384 C 165.7 426.7, 166.0 469.3, 165 512 C 164.0 554.7, 161.8 597.3, 161 640 C 160.2 682.7, 161.0 725.3, 160 768 C 159.0 810.7, 156.7 853.3, 155 896 C 153.3 938.7, 153.3 981.3, 150 1024 C 146.7 1066.7, 138.2 1109.3, 135 1152 C 131.8 1194.7, 132.0 1237.3, 131 1280 C 130.0 1322.7, 129.7 1365.3, 129 1408 C 128.3 1450.7, 127.3 1514.7, 127 1536',
  'M 154 0 C 155.0 21.3, 161.8 85.3, 160 128 C 158.2 170.7, 146.8 213.3, 143 256 C 139.2 298.7, 138.3 341.3, 137 384 C 135.7 426.7, 136.0 469.3, 135 512 C 134.0 554.7, 131.8 597.3, 131 640 C 130.2 682.7, 131.0 725.3, 130 768 C 129.0 810.7, 126.7 853.3, 125 896 C 123.3 938.7, 123.3 981.3, 120 1024 C 116.7 1066.7, 108.2 1109.3, 105 1152 C 101.8 1194.7, 102.0 1237.3, 101 1280 C 100.0 1322.7, 99.7 1365.3, 99 1408 C 98.3 1450.7, 97.3 1514.7, 97 1536',
];

export function HeroScene() {
  preload(HERO_IMAGE, { as: 'image', fetchPriority: 'high' });

  return (
    <div
      className="home-hero"
      role="img"
      aria-label="A top-down illustration of a tropical beach, palm-lined park, and bright city street."
    >
      <svg
        className="hero-scene"
        viewBox="0 0 1024 1536"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter id="hero-soft-30" x="-30%" y="-10%" width="160%" height="120%">
            <feGaussianBlur stdDeviation="30" />
          </filter>
          <filter id="hero-soft-26" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="26" />
          </filter>
          <filter id="hero-soft-18" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
          <filter id="hero-soft-14" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="14" />
          </filter>

          <mask id="hero-ocean" maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536">
            <path
              d="M 241 0 L 247 128 L 230 256 L 224 384 L 222 512 L 218 640 L 217 768 L 212 896 L 207 1024 L 192 1152 L 188 1280 L 186 1408 L 184 1536 L 0 1536 L 0 0 Z"
              fill="#fff"
              filter="url(#hero-soft-30)"
            />
          </mask>

          <mask id="hero-park" maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536">
            <rect
              x="320"
              y="-100"
              width="386"
              height="1736"
              fill="#fff"
              filter="url(#hero-soft-26)"
            />
          </mask>

          <mask id="hero-city" maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536">
            <rect
              x="690"
              y="-100"
              width="334"
              height="1736"
              fill="#fff"
              filter="url(#hero-soft-18)"
            />
          </mask>

          {PALMS.map((palm, index) => (
            <mask
              key={`${palm.x}-${palm.y}`}
              id={`hero-palm-${index}`}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1024"
              height="1536"
            >
              <ellipse
                cx={palm.x}
                cy={palm.y}
                rx={palm.rx}
                ry={palm.ry}
                fill="#fff"
                filter="url(#hero-soft-14)"
              />
            </mask>
          ))}
        </defs>

        <image href={HERO_IMAGE} width="1024" height="1536" />

        <g className="hero-plane hero-ocean" mask="url(#hero-ocean)">
          <image href={HERO_IMAGE} width="1024" height="1536" />
        </g>

        <g className="hero-plane hero-park" mask="url(#hero-park)">
          <image href={HERO_IMAGE} width="1024" height="1536" />
          {PALMS.map((palm, index) => (
            <g
              key={`${palm.x}-${palm.y}`}
              className="hero-palm"
              mask={`url(#hero-palm-${index})`}
              style={{
                transformOrigin: `${palm.x}px ${palm.y}px`,
                animationDelay: palm.delay,
              }}
            >
              <image href={HERO_IMAGE} width="1024" height="1536" />
            </g>
          ))}
        </g>

        <g className="hero-plane hero-city" mask="url(#hero-city)">
          <image href={HERO_IMAGE} width="1024" height="1536" />
        </g>

        <g className="hero-foam" mask="url(#hero-ocean)">
          {FOAM_PATHS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>

        <g className="hero-sparkles" mask="url(#hero-ocean)">
          {SPARKLES.map((sparkle) => (
            <circle
              key={`${sparkle.x}-${sparkle.y}`}
              className="hero-spark"
              cx={sparkle.x}
              cy={sparkle.y}
              r={sparkle.r}
              style={{ animationDelay: sparkle.delay }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
