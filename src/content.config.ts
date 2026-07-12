import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Platforms an app can be available on. Add new ones here + in the PlatformButton lookup. */
const platform = z.enum(['web', 'apple-app-store', 'google-play', 'steam']);

// Use the app's folder name as the entry id (slug), so a folder = an app.
const slugFromDir = ({ entry }: { entry: string }) => entry.split('/')[0];

const apps = defineCollection({
  loader: glob({ pattern: '**/app.md', base: './src/content/apps', generateId: slugFromDir }),
  schema: z.object({
    /** Display name. */
    title: z.string(),
    /** Product category — drives which home-page section the app appears in. */
    category: z.enum(['game', 'utility']),
    /** Small uppercase display label, e.g. "Game · Board" or "Utility · Tip Calculator". */
    tag: z.string(),
    /** Short hero blurb. The longer showcase copy is the markdown body. */
    blurb: z.string(),
    /** Image filename inside src/assets/images/apps/<slug>/ (1000×1000). */
    thumbnail: z.string().default('thumbnail.png'),
    /** If set, the thumbnail links to this platform's URL (must be one of `availableOn`). */
    thumbnailLink: platform.optional(),
    /** Where the app can be played/bought/used — one button per entry. */
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
  }).refine(
    (data) => !data.thumbnailLink || data.availableOn.some((a) => a.platform === data.thumbnailLink),
    {
      message: 'thumbnailLink must reference a platform listed in availableOn.',
      path: ['thumbnailLink'],
    },
  ),
});

// Per-app privacy policy. An app's privacy.md is what generates its /apps/<slug>/privacy route.
const appPrivacy = defineCollection({
  loader: glob({ pattern: '**/privacy.md', base: './src/content/apps', generateId: slugFromDir }),
  schema: z.object({
    title: z.string(),
    updated: z.coerce.date().optional(),
    /** Display name of the app, used for SEO on privacy-only stubs that have no app.md yet. */
    product: z.string().optional(),
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

export const collections = { apps, appPrivacy, pages };
