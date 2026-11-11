import type { Page } from 'playwright-core';
import type { FontRecord } from './types';

export interface TokenSnapshot {
  values: Record<string, string>;
  fonts: FontRecord[];
  keyframes: string[];
}

export async function extractTokens(page: Page): Promise<TokenSnapshot> {
  return page.evaluate(() => {
    const names = new Set<string>();
    const fonts: FontRecord[] = [];
    const keyframes: string[] = [];

    const visit = (rules: CSSRuleList): void => {
      for (const rule of rules) {
        if (rule instanceof CSSStyleRule) {
          for (const property of rule.style) {
            if (property.startsWith('--')) names.add(property);
          }
        }
        if (rule instanceof CSSFontFaceRule) {
          fonts.push({
            family: rule.style.getPropertyValue('font-family'),
            src: rule.style.getPropertyValue('src'),
            style: rule.style.getPropertyValue('font-style'),
            weight: rule.style.getPropertyValue('font-weight'),
          });
        }
        if (rule instanceof CSSKeyframesRule) {
          keyframes.push(rule.name);
        }
        if ('cssRules' in rule) {
          visit((rule as CSSGroupingRule).cssRules);
        }
      }
    };

    for (const sheet of document.styleSheets) {
      try {
        visit(sheet.cssRules);
      } catch {
        // Cross-origin sheets are not readable.
      }
    }

    const root = getComputedStyle(document.documentElement);
    const values = Object.fromEntries(
      [...names].map((name) => [name, root.getPropertyValue(name).trim()]),
    );

    return {
      values,
      fonts: fonts.filter((font) => font.family.length > 0),
      keyframes: [...new Set(keyframes)],
    };
  });
}
