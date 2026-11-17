// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages 用:
//   SITE_URL  例) https://example.github.io
//   BASE_PATH 例) /fureq-site   （ユーザーページ <user>.github.io の場合は未指定 = "/"）
export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL || undefined,
  base: process.env.BASE_PATH || '/',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
