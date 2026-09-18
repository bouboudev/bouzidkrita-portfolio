import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.bouzidkrita.com',
  trailingSlash: 'always',
  integrations: [sitemap({
    serialize(item) {
      if (item.url.endsWith('/merci/') || item.url.endsWith('/404/')) return undefined;
      return item;
    },
  })],
  vite: {
    plugins: [tailwindcss()],
  },
});
