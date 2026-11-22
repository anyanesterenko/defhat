import { defineConfig } from 'astro/config';

// За замовчуванням збирається під GitHub Pages: https://anyanesterenko.github.io/defhat/
// Для власного домену: SITE_URL=https://www.defencehat.com BASE_PATH=/ npm run build
export default defineConfig({
  site: process.env.SITE_URL || 'https://anyanesterenko.github.io',
  base: process.env.BASE_PATH || '/defhat/',
  trailingSlash: 'ignore',
  i18n: {
    locales: ['uk', 'en'],
    defaultLocale: 'uk',
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
});
