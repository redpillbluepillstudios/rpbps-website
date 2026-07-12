import { getCollection, type CollectionEntry } from 'astro:content';
import carousel from '../data/carousel.json';

/**
 * All games ordered for the showcase: carousel-listed games first (in carousel
 * order), then any remaining games alphabetically. Keeps the showcase order stable
 * and intuitive as games are added.
 */
export async function getOrderedGames(): Promise<CollectionEntry<'games'>[]> {
  const games = await getCollection('games');
  const order = carousel as string[];
  const rank = (id: string) => {
    const idx = order.indexOf(id);
    return idx === -1 ? Number.POSITIVE_INFINITY : idx;
  };

  return [...games].sort((a, b) => {
    const ra = rank(a.id);
    const rb = rank(b.id);
    return ra !== rb ? ra - rb : a.id.localeCompare(b.id);
  });
}
