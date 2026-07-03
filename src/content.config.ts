import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Platforms a game can be available on. Add new ones here + in the PlatformButton lookup. */
const platform = z.enum(['web', 'apple-app-store', 'google-play', 'steam']);

// Use the game's folder name as the entry id (slug), so a folder = a game.
const slugFromDir = ({ entry }: { entry: string }) => entry.split('/')[0];

const games = defineCollection({
  loader: glob({ pattern: '**/game.md', base: './src/content/games', generateId: slugFromDir }),
  schema: z.object({
    /** Display name. */
    title: z.string(),
    /** Small uppercase category label, e.g. "Game · Board". */
    tag: z.string(),
    /** Short hero blurb. The longer games-section copy is the markdown body. */
    blurb: z.string(),
    /** Image filename inside src/assets/images/games/<slug>/ (1000×1000). */
    thumbnail: z.string().default('thumbnail.png'),
    /** Where the game can be played/bought — one button per entry. */
    availableOn: z
      .array(z.object({ platform, url: z.url() }))
      .min(1),
    /** Optional SEO overrides (fall back to seo.json defaults, never to display copy). */
    seo: z
      .object({
        title: z.string().optional(),
        description: z.string().optional(),
        image: z.string().optional(),
      })
      .optional(),
  }),
});

// Per-game privacy policy. A game's privacy.md is what generates its /games/<slug>/privacy route.
const gamePrivacy = defineCollection({
  loader: glob({ pattern: '**/privacy.md', base: './src/content/games', generateId: slugFromDir }),
  schema: z.object({
    title: z.string(),
    updated: z.coerce.date().optional(),
  }),
});

// Standalone content pages (e.g. the studio privacy policy).
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { games, gamePrivacy, pages };
