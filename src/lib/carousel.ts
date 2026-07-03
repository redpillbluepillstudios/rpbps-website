import { getCollection, type CollectionEntry } from 'astro:content';
import carousel from '../data/carousel.json';

/**
 * Resolve the ordered list of featured games from carousel.json.
 * Order in the file = carousel order. A game is featured iff its slug is listed here
 * (there is no `featured` field on games). Throws at build time if a slug does not
 * resolve to a real game, so a typo can't ship a broken carousel.
 */
export async function getCarouselGames(): Promise<CollectionEntry<'games'>[]> {
  const games = await getCollection('games');
  const bySlug = new Map(games.map((g) => [g.id, g]));

  return (carousel as string[]).map((slug) => {
    const game = bySlug.get(slug);
    if (!game) {
      throw new Error(
        `carousel.json references unknown game "${slug}". ` +
          `Add src/content/games/${slug}/game.md or fix the slug.`,
      );
    }
    return game;
  });
}
