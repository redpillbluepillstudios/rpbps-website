import { getCollection, type CollectionEntry } from 'astro:content';
import carousel from '../data/carousel.json';
import { PLATFORMS } from './platforms';

/**
 * Resolve the link an app's thumbnail should point to, if any. `thumbnailLink`
 * names a platform whose URL lives in `availableOn` (the schema guarantees it
 * resolves). Returns undefined when the app opts out. DRY: used by the showcase
 * card and the hero carousel so the linking rule lives in one place.
 */
export function getThumbnailLink(
  app: CollectionEntry<'apps'>,
): { url: string; label: string } | undefined {
  const key = app.data.thumbnailLink;
  if (!key) return undefined;
  const entry = app.data.availableOn.find((a) => a.platform === key);
  if (!entry) return undefined;
  return { url: entry.url, label: `${app.data.title} ${PLATFORMS[key].ariaSuffix}` };
}

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
