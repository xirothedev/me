export type ColorScheme = 'light' | 'dark';

export interface DiscoveryOptions {
  baseUrl: string;
  outDir: string;
  widths: number[];
  schemes: ColorScheme[];
  lightHome: boolean;
  maxPages: number;
  settleMs: number;
  fullPage: boolean;
  skipScreenshots: boolean;
}

export interface RouteRecord {
  path: string;
  url: string;
  status: number;
  finalUrl: string;
  redirected: boolean;
  title: string;
  sitemap: boolean;
  discoveredFrom: string[];
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MetaRecord {
  title: string;
  description: string | null;
  canonical: string | null;
  ogImage: string | null;
  ogTitle: string | null;
  twitterCard: string | null;
  jsonLd: unknown[];
  h1: string | null;
  articleMeta: string | null;
}

export interface HeadingRecord {
  level: number;
  text: string;
  id: string | null;
}

export interface ControlRecord {
  tag: string;
  text: string;
  ariaLabel: string | null;
  ariaPressed: string | null;
  ariaExpanded: string | null;
  ariaControls: string | null;
  role: string | null;
  inputType: string | null;
  disabled: boolean;
}

export interface DetailsRecord {
  summary: string;
  open: boolean;
  text: string;
}

export interface MediaRecord {
  kind: 'image' | 'video' | 'iframe';
  src: string;
  alt: string;
  width: number;
  height: number;
  naturalWidth: number;
  naturalHeight: number;
  loading: string | null;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  controls: boolean;
}

export interface LinkRecord {
  href: string;
  text: string;
  external: boolean;
  target: string | null;
  rel: string | null;
}

export interface HiddenRecord {
  tag: string;
  id: string;
  className: string;
  text: string;
  reason: string;
}

export interface AnimationRecord {
  selector: string;
  name: string;
  duration: string;
  transition: string;
}

export interface CursorRecord {
  selector: string;
  cursor: string;
}

export interface RegionRecord {
  display: string;
  position: string;
  rect: Rect;
}

export interface LayoutRecord {
  scheme: ColorScheme;
  width: number;
  scrollHeight: number;
  body: {
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    background: string;
    color: string;
  };
  regions: Record<string, RegionRecord | null>;
  marginNotes: Rect[];
  figures: { name: string; rect: Rect }[];
}

export interface ProbeRecord {
  name: string;
  ok: boolean;
  details: string;
  changes: string[];
}

export interface PageRecord {
  route: RouteRecord;
  meta: MetaRecord;
  headings: HeadingRecord[];
  controls: ControlRecord[];
  details: DetailsRecord[];
  media: MediaRecord[];
  links: LinkRecord[];
  hidden: HiddenRecord[];
  animations: AnimationRecord[];
  cursors: CursorRecord[];
  layout: LayoutRecord[];
  probes: ProbeRecord[];
  errors: string[];
  failedRequests: { url: string; status: number | null }[];
  htmlBytes: number;
  textLength: number;
  screenshots: string[];
}

export interface TokenRecord {
  scheme: ColorScheme;
  values: Record<string, string>;
}

export interface FontRecord {
  family: string;
  src: string;
  style: string;
  weight: string;
}

export interface RedirectRecord {
  from: string;
  status: number;
  to: string;
}

export interface DiscoveryReport {
  generatedAt: string;
  baseUrl: string;
  options: DiscoveryOptions;
  routes: RouteRecord[];
  pages: PageRecord[];
  tokens: TokenRecord[];
  fonts: FontRecord[];
  keyframes: string[];
  redirects: RedirectRecord[];
  metaProbes: { path: string; status: number; contentType: string | null }[];
  anomalies: string[];
}
