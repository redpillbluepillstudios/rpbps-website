import { getCollection, type CollectionEntry } from 'astro:content';
import carousel from '../data/carousel.json';

/**
 * Resolve the ordered list of featured apps from carousel.json.
 * Order in the file = carousel order. An app is featured iff its slug is listed here
 * (there is no `featured` field on apps). Throws at build time if a slug does not
 * resolve to a real app, so a typo can't ship a broken carousel.
 */
export async function getCarouselApps(): Promise<CollectionEntry<'apps'>[]> {
  const apps = await getCollection('apps');
  const bySlug = new Map(apps.map((a) => [a.id, a]));

  return (carousel as string[]).map((slug) => {
    const app = bySlug.get(slug);
    if (!app) {
      throw new Error(
        `carousel.json references unknown app "${slug}". ` +
          `Add src/content/apps/${slug}/app.md or fix the slug.`,
      );
    }
    return app;
  });
}
