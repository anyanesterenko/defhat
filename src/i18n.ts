import uk from './content/uk.json';
import en from './content/en.json';

export const languages = { uk: 'UA', en: 'EN' } as const;
export type Lang = keyof typeof languages;
export const langs = Object.keys(languages) as Lang[];

const dict = { uk, en };
export type Dict = typeof uk;

export function t(lang: Lang): Dict {
  return dict[lang] as Dict;
}

/** Префікс сайту (base з astro.config), напр. '/defhat/' на GitHub Pages або '/' на власному домені */
export const BASE = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');

/** Шлях усередині сайту з урахуванням base: url('uk/') → '/defhat/uk/' */
export function url(path = ''): string {
  return BASE + path.replace(/^\//, '');
}

/** Same page in the other language: /uk/privacy → /en/privacy */
export function switchPath(pathname: string, to: Lang): string {
  const rel = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  const parts = rel.split('/').filter(Boolean);
  if (parts.length && parts[0] in languages) parts[0] = to;
  else parts.unshift(to);
  return url(parts.join('/') + '/');
}
