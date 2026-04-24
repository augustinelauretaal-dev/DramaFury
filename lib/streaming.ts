// lib/streaming.ts
// ─────────────────────────────────────────────────────────────────────────────
// Streaming provider registry for DramaFury.
// All providers use publicly accessible embed URLs that accept TMDB IDs.
// For personal / educational use only.
// ─────────────────────────────────────────────────────────────────────────────

export type MediaType = 'tv' | 'movie';
export type SourceType = 'embed';

export interface StreamSource {
  /** Unique provider identifier */
  id: string;
  /** Display name shown in the server tabs */
  name: string;
  /** The resolved iframe embed URL */
  url: string;
  /** Always 'embed' — future-proofed for HLS sources */
  type: SourceType;
  /** Optional quality/feature badge, e.g. "HD", "SUB", "4K" */
  badge?: string;
  /** Colour class used for the badge chip */
  badgeColor?: string;
  /** Whether this provider supports subtitles out-of-the-box */
  hasSubs?: boolean;
}

// ─── Internal provider blueprint ─────────────────────────────────────────────

interface ProviderConfig {
  id: string;
  name: string;
  badge?: string;
  badgeColor?: string;
  hasSubs?: boolean;
  /** Build an embed URL for a TV episode */
  tv: (tmdbId: number, season: number, episode: number) => string;
  /** Build an embed URL for a movie */
  movie: (tmdbId: number) => string;
  /** Provider is temporarily disabled */
  disabled?: boolean;
}

// ─── Provider Registry ────────────────────────────────────────────────────────

const PROVIDERS: ProviderConfig[] = [
  // ── 1. VidSrc.to (vidsrc.icu) ───────────────────────────────────────────────
  {
    id: 'vidsrc-to',
    name: 'VidSrc',
    badge: 'HD',
    badgeColor: 'blue',
    hasSubs: true,
    tv: (id, s, ep) => `https://vidsrc.icu/embed/tv/${id}/${s}/${ep}?sub_lang=en`,
    movie: (id) => `https://vidsrc.icu/embed/movie/${id}?sub_lang=en`,
  },

  // ── 2. VidSrc.me ────────────────────────────────────────────────────────────
  {
    id: 'vidsrc-me',
    name: 'VidSrc.me',
    badge: 'HD',
    badgeColor: 'blue',
    hasSubs: true,
    tv: (id, s, ep) =>
      `https://vidsrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${ep}&sub_lang=en`,
    movie: (id) => `https://vidsrc.me/embed/movie?tmdb=${id}&sub_lang=en`,
    disabled: true,
  },

  // ── 3. VidSrc.cc ────────────────────────────────────────────────────────────
  {
    id: 'vidsrc-cc',
    name: 'VidSrc.cc',
    badge: 'HD',
    badgeColor: 'blue',
    hasSubs: true,
    tv: (id, s, ep) => `https://vidsrc.cc/embed/tv/${id}/${s}/${ep}?sub_lang=en`,
    movie: (id) => `https://vidsrc.cc/embed/movie/${id}?sub_lang=en`,
  },

  // ── 4. 2Embed ───────────────────────────────────────────────────────────────
  {
    id: '2embed',
    name: '2Embed',
    badge: 'SUB',
    badgeColor: 'green',
    hasSubs: true,
    tv: (id, s, ep) => `https://www.2embed.ru/embed/tv/${id}&s=${s}&e=${ep}&lang=en`,
    movie: (id) => `https://www.2embed.ru/embed/${id}?lang=en`,
  },

  // ── 5. EmbedSu ──────────────────────────────────────────────────────────────
  {
    id: 'embedsu',
    name: 'EmbedSu',
    badge: 'SUB',
    badgeColor: 'green',
    hasSubs: true,
    tv: (id, s, ep) => `https://embed.su/embed/tv/${id}/${s}/${ep}`,
    movie: (id) => `https://embed.su/embed/movie/${id}`,
    disabled: true,
  },

  // ── 6. MultiEmbed ───────────────────────────────────────────────────────────
  {
    id: 'multiembed',
    name: 'MultiEmbed',
    tv: (id, s, ep) => `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${s}&e=${ep}`,
    movie: (id) => `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`,
    disabled: true,
  },

  // ── 7. SmashyStream ─────────────────────────────────────────────────────────
  {
    id: 'smashy',
    name: 'SmashyStream',
    badge: 'HD',
    badgeColor: 'blue',
    hasSubs: false,
    tv: (id, s, ep) => `https://player.smashy.stream/tv/${id}?s=${s}&e=${ep}`,
    movie: (id) => `https://player.smashy.stream/movie/${id}`,
    disabled: true,
  },

  // ── 8. AutoEmbed ────────────────────────────────────────────────────────────
  {
    id: 'autoembed',
    name: 'AutoEmbed',
    hasSubs: true,
    tv: (id, s, ep) => `https://autoembed.cc/embed/tv/${id}-${s}-${ep}`,
    movie: (id) => `https://autoembed.cc/embed/movie/${id}`,
    disabled: true,
  },

  // ── 9. FilmKu ───────────────────────────────────────────────────────────────
  {
    id: 'filmku',
    name: 'FilmKu',
    badge: 'SUB',
    badgeColor: 'green',
    hasSubs: true,
    tv: (id, s, ep) => `https://filmku.site/embed/series?tmdb=${id}&sea=${s}&epi=${ep}`,
    movie: (id) => `https://filmku.site/embed/movie?tmdb=${id}`,
  },

  // ── 10. Rive Player ─────────────────────────────────────────────────────────
  {
    id: 'rive',
    name: 'Rive',
    badge: '4K',
    badgeColor: 'purple',
    hasSubs: true,
    tv: (id, s, ep) => `https://rivestream.net/embed?type=tv&id=${id}&season=${s}&episode=${ep}&subLang=en`,
    movie: (id) => `https://rivestream.net/embed?type=movie&id=${id}&subLang=en`,
  },
];

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Return all active streaming sources for a TV episode.
 *
 * @param tmdbId  - TMDB show ID
 * @param season  - Season number (1-based)
 * @param episode - Episode number (1-based)
 */
export function getTVSources(
  tmdbId: number,
  season: number,
  episode: number
): StreamSource[] {
  return PROVIDERS.filter((p) => !p.disabled).map((p) => ({
    id: p.id,
    name: p.name,
    url: p.tv(tmdbId, season, episode),
    type: 'embed' as const,
    badge: p.badge,
    badgeColor: p.badgeColor,
    hasSubs: p.hasSubs,
  }));
}

/**
 * Return all active streaming sources for a movie.
 *
 * @param tmdbId - TMDB movie ID
 */
export function getMovieSources(tmdbId: number): StreamSource[] {
  return PROVIDERS.filter((p) => !p.disabled).map((p) => ({
    id: p.id,
    name: p.name,
    url: p.movie(tmdbId),
    type: 'embed' as const,
    badge: p.badge,
    badgeColor: p.badgeColor,
    hasSubs: p.hasSubs,
  }));
}

/**
 * Return a single source by provider ID.
 */
export function getSourceById(
  providerId: string,
  tmdbId: number,
  mediaType: MediaType,
  season = 1,
  episode = 1
): StreamSource | null {
  const provider = PROVIDERS.find((p) => p.id === providerId && !p.disabled);
  if (!provider) return null;

  const url =
    mediaType === 'movie'
      ? provider.movie(tmdbId)
      : provider.tv(tmdbId, season, episode);

  return {
    id: provider.id,
    name: provider.name,
    url,
    type: 'embed',
    badge: provider.badge,
    badgeColor: provider.badgeColor,
    hasSubs: provider.hasSubs,
  };
}

/**
 * Returns the total number of registered (non-disabled) providers.
 */
export function getProviderCount(): number {
  return PROVIDERS.filter((p) => !p.disabled).length;
}

/**
 * Returns provider metadata (without resolved URLs) — useful for the API response.
 */
export function getProviderList() {
  return PROVIDERS.filter((p) => !p.disabled).map(({ id, name, badge, hasSubs }) => ({
    id,
    name,
    badge,
    hasSubs: hasSubs ?? false,
  }));
}
