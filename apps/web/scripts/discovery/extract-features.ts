import type { Page } from 'playwright-core';
import type {
  AnimationRecord,
  ControlRecord,
  CursorRecord,
  DetailsRecord,
  HeadingRecord,
  HiddenRecord,
  LinkRecord,
  MediaRecord,
} from './types';

export interface FeatureBundle {
  headings: HeadingRecord[];
  controls: ControlRecord[];
  details: DetailsRecord[];
  media: MediaRecord[];
  links: LinkRecord[];
  hidden: HiddenRecord[];
  animations: AnimationRecord[];
  cursors: CursorRecord[];
  textLength: number;
  htmlBytes: number;
}

export async function extractFeatures(page: Page): Promise<FeatureBundle> {
  return page.evaluate(() => {
    const selectorOf = (element: Element): string => {
      const parts: string[] = [];
      let node: Element | null = element;
      while (node && parts.length < 5) {
        const tag = node.tagName.toLowerCase();
        const id = node.id ? `#${node.id}` : '';
        const raw = node.getAttribute('class') ?? '';
        const classes = raw
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((value) => `.${value.slice(0, 24)}`)
          .join('');
        parts.unshift(`${tag}${id}${classes}`);
        node = node.parentElement;
      }
      return parts.join(' > ');
    };

    const textOf = (element: Element): string =>
      (element as HTMLElement).innerText?.replace(/\s+/g, ' ').trim().slice(0, 160) ?? '';

    const headings: HeadingRecord[] = [...document.querySelectorAll('h1, h2, h3')]
      .slice(0, 80)
      .map((heading) => ({
        level: Number(heading.tagName.slice(1)),
        text: textOf(heading),
        id: heading.id || null,
      }));

    const controls: ControlRecord[] = [
      ...document.querySelectorAll<HTMLElement>(
        'button, input, select, textarea, [role="button"], [role="tab"], [role="switch"]',
      ),
    ]
      .slice(0, 120)
      .map((element) => ({
        tag: element.tagName.toLowerCase(),
        text: textOf(element),
        ariaLabel: element.getAttribute('aria-label'),
        ariaPressed: element.getAttribute('aria-pressed'),
        ariaExpanded: element.getAttribute('aria-expanded'),
        ariaControls: element.getAttribute('aria-controls'),
        role: element.getAttribute('role'),
        inputType:
          element instanceof HTMLInputElement || element instanceof HTMLButtonElement
            ? element.type
            : null,
        disabled:
          element instanceof HTMLButtonElement ||
          element instanceof HTMLInputElement ||
          element instanceof HTMLSelectElement ||
          element instanceof HTMLTextAreaElement
            ? element.disabled
            : false,
      }));

    const details: DetailsRecord[] = [...document.querySelectorAll('details')]
      .slice(0, 40)
      .map((element) => ({
        summary: textOf(element.querySelector('summary') ?? element),
        open: element.open,
        text: textOf(element),
      }));

    const media: MediaRecord[] = [
      ...document.querySelectorAll<HTMLImageElement | HTMLVideoElement | HTMLIFrameElement>(
        'img, video, iframe',
      ),
    ]
      .slice(0, 140)
      .map((element) => {
        const rect = element.getBoundingClientRect();
        if (element instanceof HTMLImageElement) {
          return {
            kind: 'image' as const,
            src: element.currentSrc || element.src,
            alt: element.alt,
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            naturalWidth: element.naturalWidth,
            naturalHeight: element.naturalHeight,
            loading: element.loading || null,
            autoplay: false,
            loop: false,
            muted: false,
            controls: false,
          };
        }
        if (element instanceof HTMLVideoElement) {
          return {
            kind: 'video' as const,
            src: element.currentSrc || element.src || element.querySelector('source')?.src || '',
            alt: element.getAttribute('aria-label') ?? '',
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            naturalWidth: element.videoWidth,
            naturalHeight: element.videoHeight,
            loading: element.preload || null,
            autoplay: element.autoplay,
            loop: element.loop,
            muted: element.muted,
            controls: element.controls,
          };
        }
        return {
          kind: 'iframe' as const,
          src: element.src,
          alt: element.title,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          naturalWidth: 0,
          naturalHeight: 0,
          loading: element.loading || null,
          autoplay: false,
          loop: false,
          muted: false,
          controls: false,
        };
      });

    const links: LinkRecord[] = [...document.querySelectorAll<HTMLAnchorElement>('a[href]')]
      .slice(0, 250)
      .map((element) => ({
        href: element.getAttribute('href') ?? '',
        text: textOf(element),
        external: element.origin !== window.location.origin,
        target: element.getAttribute('target'),
        rel: element.getAttribute('rel'),
      }));

    const hidden: HiddenRecord[] = [];
    const hiddenSeen = new Set<Element>();
    const addHidden = (element: Element, reason: string): void => {
      if (hiddenSeen.has(element) || hidden.length >= 100) return;
      if (element.closest('svg, head, script, style, noscript, template')) return;
      const text = textOf(element);
      const isMedia = element.tagName === 'IMG' || element.tagName === 'VIDEO';
      if (!text && !element.id && !isMedia) return;
      if (text.length <= 2 && element.getAttribute('aria-hidden') === 'true') return;
      hiddenSeen.add(element);
      hidden.push({
        tag: element.tagName.toLowerCase(),
        id: element.id,
        className: (element.getAttribute('class') ?? '').slice(0, 120),
        text: text.slice(0, 120),
        reason,
      });
    };

    document
      .querySelectorAll('[hidden], [aria-hidden="true"], [style*="display: none"]')
      .forEach((element) => addHidden(element, 'explicit-hidden'));
    document
      .querySelectorAll('details:not([open]) > :not(summary), dialog:not([open])')
      .forEach((element) => addHidden(element, 'collapsed'));
    document.querySelectorAll<HTMLElement>('[class], [id]').forEach((element) => {
      if (hidden.length >= 100) return;
      const style = getComputedStyle(element);
      if (style.display === 'none') addHidden(element, 'display-none');
      else if (style.visibility === 'hidden') addHidden(element, 'visibility-hidden');
    });

    const animations: AnimationRecord[] = [];
    const animationSeen = new Set<string>();
    document.querySelectorAll<HTMLElement>('[class]').forEach((element) => {
      if (animations.length >= 80) return;
      const style = getComputedStyle(element);
      const hasAnimation = style.animationName !== 'none';
      const hasTransition = style.transitionDuration !== '0s';
      if (!hasAnimation && !hasTransition) return;
      const key = `${style.animationName}|${style.animationDuration}|${style.transitionProperty}|${style.transitionDuration}`;
      if (animationSeen.has('yes:' + key) && hasAnimation) return;
      if (animationSeen.has('no:' + key) && !hasAnimation) return;
      animationSeen.add(hasAnimation ? 'yes:' + key : 'no:' + key);
      animations.push({
        selector: selectorOf(element),
        name: style.animationName,
        duration: hasAnimation ? style.animationDuration : style.transitionDuration,
        transition: hasTransition ? `${style.transitionProperty} ${style.transitionDuration}` : '',
      });
    });

    const cursors: CursorRecord[] = [];
    const cursorSeen = new Set<string>();
    document.querySelectorAll<HTMLElement>('a, button, [class]').forEach((element) => {
      if (cursors.length >= 30) return;
      const cursor = getComputedStyle(element).cursor;
      if (!cursor.startsWith('url(') || cursorSeen.has(cursor)) return;
      cursorSeen.add(cursor);
      cursors.push({ selector: selectorOf(element), cursor });
    });

    return {
      headings,
      controls,
      details,
      media,
      links,
      hidden,
      animations,
      cursors,
      textLength: document.body.innerText.length,
      htmlBytes: new TextEncoder().encode(document.documentElement.outerHTML).length,
    };
  });
}
