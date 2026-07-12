import type { ImageMetadata } from 'astro';

/**
 * App images live in the CENTRAL asset tree (src/assets/images/apps/<slug>/…),
 * not co-located with the markdown, so the content-collection image() helper does
 * not resolve them. Resolve them here by convention (slug + filename) via a
 * build-time glob so they still go through Astro's image optimization.
 */
const images = import.meta.glob<ImageMetadata>(
  '/src/assets/images/apps/**/*.{png,jpg,jpeg,webp,avif}',
  { eager: true, import: 'default' },
);

export function getAppImage(slug: string, filename = 'thumbnail.png'): ImageMetadata {
  const key = `/src/assets/images/apps/${slug}/${filename}`;
  const img = images[key];
  if (!img) {
    throw new Error(
      `Missing app image "${key}". Expected it under src/assets/images/apps/${slug}/.`,
    );
  }
  return img;
}
