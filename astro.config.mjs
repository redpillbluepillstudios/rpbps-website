// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Apex custom domain served by GitHub Pages.
  site: 'https://redpillbluepillstudios.com',
  base: '/',
  output: 'static',
  // Optimize raster images at build time with sharp.
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
