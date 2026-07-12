import { getCollection, type CollectionEntry } from 'astro:content';
import carousel from '../data/carousel.json';

/**
 * All apps ordered for the showcase: carousel-listed apps first (in carousel
 * order), then any remaining apps alphabetically. Keeps the showcase order stable
 * and intuitive as apps are added.
 */
export async function getOrderedApps(): Promise<CollectionEntry<'apps'>[]> {
  const apps = await getCollection('apps');
  const order = carousel as string[];
  const rank = (id: string) => {
    const idx = order.indexOf(id);
    return idx === -1 ? Number.POSITIVE_INFINITY : idx;
  };

  return [...apps].sort((a, b) => {
    const ra = rank(a.id);
    const rb = rank(b.id);
    return ra !== rb ? ra - rb : a.id.localeCompare(b.id);
  });
}
