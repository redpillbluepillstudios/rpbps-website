import seo from '../data/seo.json';

export interface SeoOverrides {
  title?: string;
  description?: string;
  image?: string;
}

export interface ResolvedSeo {
  siteName: string;
  title: string;
  description: string;
  image?: string;
  twitter?: string;
}

/**
 * Resolve SEO for a page, per-field, in this order:
 *   explicit override  →  seo.json pages[route]  →  seo.json defaults
 * Never silently falls back to display copy — callers pass overrides explicitly
 * (e.g. a game's `seo` block).
 */
export function resolveSeo(route?: string, overrides: SeoOverrides = {}): ResolvedSeo {
  const defaults = seo.defaults;
  const page = (route && (seo.pages as Record<string, SeoOverrides>)[route]) || {};

  return {
    siteName: defaults.siteName,
    title: overrides.title ?? page.title ?? defaults.title,
    description: overrides.description ?? page.description ?? defaults.description,
    image: overrides.image ?? page.image ?? defaults.image,
    twitter: defaults.twitter || undefined,
  };
}
