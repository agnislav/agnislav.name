import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

const isKeystatic = !!process.env.KEYSTATIC;

export default defineConfig({
  site: 'https://agnislav.name',
  output: isKeystatic ? 'hybrid' : 'static',
  integrations: [
    react(),
    markdoc(),
    ...(isKeystatic ? [keystatic()] : []),
    sitemap(),
    tailwind(),
  ],
});
