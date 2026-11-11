export function Painting() {
  return (
    <div
      className="home-painting"
      role="img"
      aria-label="An illustrated Nha Trang coastline at sunrise, with layered mountains, a calm sea, and a small boat."
    >
      <svg viewBox="0 0 760 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f6d9b8" />
            <stop offset="46%" stopColor="#efb48d" />
            <stop offset="72%" stopColor="#d98c78" />
            <stop offset="100%" stopColor="#8b6f6a" />
          </linearGradient>
          <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7fa99a" />
            <stop offset="38%" stopColor="#3f7662" />
            <stop offset="100%" stopColor="#1f4a3b" />
          </linearGradient>
          <linearGradient id="sand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d9b98a" />
            <stop offset="100%" stopColor="#b98d62" />
          </linearGradient>
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe7a3" stopOpacity="0.95" />
            <stop offset="48%" stopColor="#ffd27f" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffd27f" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="mountainFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6f8f7c" />
            <stop offset="100%" stopColor="#3f6252" />
          </linearGradient>
          <linearGradient id="mountainNear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3f6252" />
            <stop offset="100%" stopColor="#243f33" />
          </linearGradient>
          <filter id="soften">
            <feGaussianBlur stdDeviation="2.4" />
          </filter>
        </defs>

        <rect width="760" height="1000" fill="url(#sky)" />
        <circle cx="548" cy="248" r="150" fill="url(#sunGlow)" />
        <circle cx="548" cy="248" r="54" fill="#ffe1a0" opacity="0.9" />

        <g className="home-painting-clouds" fill="#f8e4cd" opacity="0.5">
          <ellipse cx="160" cy="210" rx="96" ry="18" />
          <ellipse cx="220" cy="196" rx="58" ry="13" />
          <ellipse cx="620" cy="150" rx="80" ry="13" />
        </g>

        <path
          d="M0 470 L110 360 L190 430 L280 330 L380 450 L470 380 L560 460 L650 400 L760 470 L760 560 L0 560 Z"
          fill="url(#mountainFar)"
          opacity="0.9"
        />
        <path
          d="M0 520 L120 440 L220 505 L330 420 L440 515 L560 455 L680 525 L760 490 L760 590 L0 590 Z"
          fill="url(#mountainNear)"
        />
        <path
          d="M0 566 L760 566 L760 600 L0 600 Z"
          fill="#f5c98c"
          opacity="0.28"
          filter="url(#soften)"
        />

        <rect y="590" width="760" height="250" fill="url(#sea)" />
        <g stroke="#b8d8c8" strokeLinecap="round" opacity="0.42">
          <path d="M54 646 H210" strokeWidth="7" />
          <path d="M300 672 H520" strokeWidth="5" />
          <path d="M120 704 H330" strokeWidth="6" />
          <path d="M470 728 H690" strokeWidth="4" />
          <path d="M40 758 H170" strokeWidth="5" />
          <path d="M580 790 H740" strokeWidth="6" />
        </g>
        <g stroke="#f7dca8" strokeLinecap="round" opacity="0.55">
          <path d="M540 610 H640" strokeWidth="4" />
          <path d="M500 626 H590" strokeWidth="3" />
          <path d="M560 642 H670" strokeWidth="3" />
        </g>

        <g transform="translate(610 700)">
          <g className="home-painting-sway">
            <path d="M-6 0 L6 0 L3 34 L-3 34 Z" fill="#4a3024" />
            <path d="M0 4 C-40 -18 -58 -42 -52 -64 C-32 -52 -18 -30 0 4 Z" fill="#2f5c46" />
            <path d="M0 4 C40 -20 60 -46 54 -70 C34 -56 18 -32 0 4 Z" fill="#3f7358" />
            <path d="M0 4 C-28 -26 -34 -56 -24 -80 C-6 -58 0 -30 0 4 Z" fill="#274d3b" />
            <path d="M0 4 C26 -24 34 -52 26 -76 C10 -54 2 -28 0 4 Z" fill="#37664d" />
          </g>
        </g>

        <g>
          <path d="M296 684 L382 684 L364 700 L314 700 Z" fill="#5a3d2b" />
          <path d="M338 682 L338 620 L370 668 Z" fill="#f4efe4" opacity="0.9" />
          <path d="M334 682 L334 632 L310 668 Z" fill="#f4efe4" opacity="0.65" />
          <path d="M338 618 L338 684" stroke="#5a3d2b" strokeWidth="4" />
        </g>

        <path
          d="M0 812 C140 780 240 820 380 806 C520 792 620 836 760 810 L760 1000 L0 1000 Z"
          fill="url(#sand)"
        />
        <path
          d="M0 860 C150 830 260 872 400 858 C540 844 650 884 760 862 L760 1000 L0 1000 Z"
          fill="#a97c55"
          opacity="0.55"
        />

        <g className="home-painting-grass" fill="#2f5c46">
          <path d="M40 1000 C48 930 70 892 92 862 C84 920 78 962 72 1000 Z" />
          <path d="M78 1000 C92 944 118 912 142 890 C122 940 106 972 100 1000 Z" />
          <path d="M660 1000 C650 934 632 896 610 870 C620 930 630 968 636 1000 Z" />
          <path d="M700 1000 C690 950 676 920 656 896 C668 944 678 974 682 1000 Z" />
        </g>

        <g fill="#f4efe4" opacity="0.88">
          <text x="180" y="944" fontSize="44" transform="rotate(-4 180 944)">
            Nha Trang
          </text>
          <text x="184" y="980" fontSize="28" opacity="0.7">
            05:47
          </text>
        </g>
      </svg>
    </div>
  );
}
