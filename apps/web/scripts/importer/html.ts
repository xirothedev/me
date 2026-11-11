import { load, type CheerioAPI } from 'cheerio';
import type { AnyNode, Element } from 'domhandler';
import type { MediaLookup } from './media';
import { escapeText, fenceFor } from './text';

export interface ConverterOptions {
  media: MediaLookup;
  warn: (message: string) => void;
}

interface ImageData {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export function convertArticle(html: string, options: ConverterOptions): string {
  const $ = load(html);
  const article = $('article.content-frame');
  const nodes = article.children().toArray();
  const blocks: string[] = [];
  for (const node of nodes) {
    if ($(node).is('h1.content-title, a.article-meta, footer, script, style')) continue;
    const block = convertBlock($, node, options);
    if (block) blocks.push(block);
  }
  return blocks.join('\n\n');
}

export function convertFragment(html: string, options: ConverterOptions): string {
  const $ = load(`<div id="fragment">${html}</div>`);
  const nodes = $('#fragment').children().toArray();
  const blocks: string[] = [];
  for (const node of nodes) {
    const block = convertBlock($, node, options);
    if (block) blocks.push(block);
  }
  return blocks.join('\n\n');
}

function convertBlock($: CheerioAPI, node: AnyNode, options: ConverterOptions): string | null {
  if (node.type === 'text') {
    const text = node.data.replace(/\s+/g, ' ').trim();
    return text ? escapeText(text) : null;
  }
  if (node.type !== 'tag' && node.type !== 'script' && node.type !== 'style') return null;
  const element = node as Element;
  const tag = element.tagName.toLowerCase();
  const className = $(element).attr('class') ?? '';

  if (tag === 'p') {
    const child = onlyElementChild($, element);
    if (child && ['img', 'video', 'figure'].includes(child.tagName.toLowerCase())) {
      return convertBlock($, child, options);
    }
    const inline = inlineChildren($, element, options).trim();
    return inline ? inline : null;
  }

  if (tag === 'h1' || tag === 'h2' || tag === 'h3') {
    const level = Number(tag.slice(1));
    const id = $(element).attr('id');
    const text = $(element).text().replace(/\s+/g, ' ').trim();
    if (id) {
      return `<Heading id=${JSON.stringify(id)} level={${level}}>{${JSON.stringify(text)}}</Heading>`;
    }
    return `${'#'.repeat(level)} ${text}`;
  }

  if (tag === 'ul' || tag === 'ol') {
    const items = $(element)
      .children('li')
      .toArray()
      .map((item, index) => {
        const prefix = tag === 'ol' ? `${index + 1}.` : '-';
        return `${prefix} ${inlineChildren($, item, options).trim()}`;
      })
      .filter((item) => !item.endsWith(' '));
    return items.length > 0 ? items.join('\n') : null;
  }

  if (tag === 'blockquote') {
    const lines = $(element)
      .children()
      .toArray()
      .map((child) => convertBlock($, child, options))
      .filter((line): line is string => Boolean(line))
      .join('\n\n')
      .split('\n')
      .map((line) => `> ${line}`)
      .join('\n');
    return lines || null;
  }

  if (tag === 'details') {
    const summary = $(element).children('summary').first();
    const summaryText = summary.length > 0 ? summary.text().replace(/\s+/g, ' ').trim() : 'Details';
    const children = $(element)
      .children()
      .toArray()
      .filter((child) => child.type === 'tag' && child.tagName.toLowerCase() !== 'summary')
      .map((child) => convertBlock($, child, options))
      .filter((block): block is string => Boolean(block))
      .join('\n\n');
    return `<Details summary={${JSON.stringify(summaryText)}}>\n\n${children}\n\n</Details>`;
  }

  if (tag === 'pre') {
    const code = $(element).find('code').first();
    const codeClass = code.attr('class') ?? '';
    const language = /language-([\w-]+)/.exec(codeClass)?.[1] ?? 'text';
    const text = code.length > 0 ? code.text() : $(element).text();
    return `${fenceFor(text)}${language}\n${text.replace(/\n$/, '')}\n${fenceFor(text)}`;
  }

  if (tag === 'figure') {
    const viz = $(element).attr('data-viz');
    if (viz) return `<Figure name=${JSON.stringify(viz)} />`;
    const image = $(element).find('img').first();
    return image.length > 0 ? imageComponent($, image.get(0) as Element, options) : null;
  }

  if (tag === 'video') return videoComponent($, element, options);
  if (tag === 'img') return imageComponent($, element, options);
  if (tag === 'hr') return '---';
  if (tag === 'small') {
    return className.includes('margin-note-desktop')
      ? marginNoteComponent($, element, options)
      : null;
  }
  if (tag === 'template') return null;
  if (tag === 'br') return null;

  if (tag === 'div') {
    const toc = tocComponent($, element);
    if (toc) return toc;
    if (className.includes('bio-gallery') && $(element).find('img').length > 0) {
      return galleryComponent($, element, options, 'Gallery');
    }
    if (className.includes('bio-media-pair') && $(element).find('img').length > 0) {
      return galleryComponent($, element, options, 'PhotoGrid');
    }
    if (className.includes('overflow-x-auto') && $(element).find('img').length > 1) {
      return galleryComponent($, element, options, 'PhotoStrip');
    }
    if (className.includes('grid-cols-1') && $(element).find('img').length > 1) {
      return galleryComponent($, element, options, 'PhotoGrid');
    }
    if (className.includes('h-4')) return null;
    const children = $(element)
      .children()
      .toArray()
      .map((child) => convertBlock($, child, options))
      .filter((block): block is string => Boolean(block));
    return children.length > 0 ? children.join('\n\n') : null;
  }

  if (tag === 'span' || tag === 'strong' || tag === 'em' || tag === 'b' || tag === 'i') {
    const inline = inlineChildren($, element, options).trim();
    return inline || null;
  }

  options.warn(`Unsupported block <${tag}>`);
  return null;
}

function inlineChildren($: CheerioAPI, element: Element, options: ConverterOptions): string {
  return element.children.map((child) => inlineNode($, child, options)).join('');
}

function inlineNode($: CheerioAPI, node: AnyNode, options: ConverterOptions): string {
  if (node.type === 'text') return escapeText(node.data.replace(/\s+/g, ' '));
  if (node.type !== 'tag' && node.type !== 'script' && node.type !== 'style') return '';
  const element = node as Element;
  const tag = element.tagName.toLowerCase();
  const className = $(element).attr('class') ?? '';

  if (tag === 'a') {
    if (className.includes('margin-note-reference-link')) return '';
    const href = $(element).attr('href');
    const text = inlineChildren($, element, options);
    return href ? `[${text}](${href})` : text;
  }
  if (tag === 'code') {
    const text = $(element).text();
    return text.includes('`') ? `\`\` ${text} \`\`` : `\`${text}\``;
  }
  if (tag === 'strong' || tag === 'b') return `**${inlineChildren($, element, options)}**`;
  if (tag === 'em' || tag === 'i') return `*${inlineChildren($, element, options)}*`;
  if (tag === 'sup') return '';
  if (tag === 'small') {
    return className.includes('margin-note-desktop')
      ? marginNoteComponent($, element, options)
      : '';
  }
  if (tag === 'br') return '\n';
  if (tag === 'img') return imageComponent($, element, options);
  if (tag === 'svg') return '';
  return inlineChildren($, element, options);
}

function onlyElementChild($: CheerioAPI, element: Element): Element | null {
  const children = $(element)
    .children()
    .toArray()
    .filter((child) => child.type === 'tag');
  return children.length === 1 ? (children[0] as Element) : null;
}

function imageComponent($: CheerioAPI, element: Element, options: ConverterOptions): string {
  const data = imageData($, element, options.media);
  if (!data) {
    options.warn(`Missing local media for ${$(element).attr('src') ?? 'unknown image'}`);
    return '';
  }
  const className = $(element).attr('class') ?? '';
  const fullBleed = className.includes('w-screen');
  return `<ContentImage src=${JSON.stringify(data.src)} alt=${JSON.stringify(data.alt)} width={${data.width}} height={${data.height}}${fullBleed ? ' fullBleed' : ''} />`;
}

function videoComponent($: CheerioAPI, element: Element, options: ConverterOptions): string {
  const src = $(element).attr('src') ?? $(element).find('source').first().attr('src') ?? '';
  if (!src) return '';
  const width = Number($(element).attr('width') ?? 0);
  const height = Number($(element).attr('height') ?? 0);
  const className = $(element).attr('class') ?? '';
  const fullBleed = className.includes('w-screen');
  options.warn(`Video kept remote: ${src}`);
  return `<DemoVideo src=${JSON.stringify(src)} width={${width}} height={${height}}${fullBleed ? ' fullBleed' : ''} />`;
}

function galleryComponent(
  $: CheerioAPI,
  element: Element,
  options: ConverterOptions,
  component: 'Gallery' | 'PhotoStrip' | 'PhotoGrid',
): string {
  const images = $(element)
    .find('img')
    .toArray()
    .map((image) => imageData($, image as Element, options.media))
    .filter((image): image is ImageData => image !== null);
  if (images.length === 0) return '';
  return `<${component} images={${JSON.stringify(images)}} />`;
}

function tocComponent($: CheerioAPI, element: Element): string | null {
  const links = $(element)
    .find('a[href^="#"]')
    .toArray()
    .map((link) => ({
      href: $(link).attr('href') ?? '',
      label: $(link).text().replace(/\s+/g, ' ').trim(),
    }))
    .filter((link) => link.href.length > 1);
  if (links.length < 3) return null;
  return `<Toc items={${JSON.stringify(links)}} />`;
}

function imageData($: CheerioAPI, element: Element, media: MediaLookup): ImageData | null {
  const src = $(element).attr('src') ?? '';
  if (!src) return null;
  const local = media(src);
  if (!local) return null;
  return {
    src: local.localPath,
    alt: $(element).attr('alt') ?? '',
    width: Number($(element).attr('width') ?? 0) || local.width,
    height: Number($(element).attr('height') ?? 0) || local.height,
  };
}

function marginNoteComponent($: CheerioAPI, element: Element, options: ConverterOptions): string {
  const text = $(element).text().replace(/\s+/g, ' ').trim();
  const match = /^(\d+):\s*(.*)$/.exec(text);
  const body = match ? match[2] : text;
  const number = match ? Number(match[1]) : null;
  const inner = inlineChildren($, element, options)
    .replace(/^\d+:\s*/, '')
    .trim();
  return number
    ? `<MarginNote number={${number}}>${inner}</MarginNote>`
    : `<MarginNote>${inner || escapeText(body)}</MarginNote>`;
}
