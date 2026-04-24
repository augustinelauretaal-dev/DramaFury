import { Metadata } from "next";
import Link from "next/link";
import { searchDramas, getTopKDramas } from "@/lib/tmdb";
import DramaCard from "@/components/DramaCard";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  if (query) {
    return {
      title: `Search: "${query}"`,
      description: `Search results for "${query}" on DramaFury — find K-dramas, C-dramas, anime and more.`,
    };
  }
  return {
    title: "Search",
    description:
      "Search for K-dramas, C-dramas, anime, Hollywood shows and more on DramaFury.",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  /* ── With a query: fetch search results ── */
  if (query) {
    const results = await searchDramas(query).catch(() => []);

    return (
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">
            Search Results for{" "}
            <span className="gradient-text">&ldquo;{query}&rdquo;</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {results.length} result{results.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Results Grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((drama) => (
              <DramaCard key={drama.id} drama={drama} showBadge />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-center py-20 px-4">
            <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center mb-6">
              <svg
                className="w-9 h-9 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
            <p className="text-gray-400 text-lg font-semibold mb-2">
              No results found for &ldquo;{query}&rdquo;
            </p>
            <p className="text-gray-600 text-sm mb-8 max-w-xs">
              Try a different search term, or check your spelling.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/search"
                className="bg-surface hover:bg-surface-2 border border-border text-gray-300 hover:text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Clear Search
              </Link>
              <Link
                href="/explore"
                className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors"
              >
                Browse All Titles
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ── No query: show search prompt + popular fallback ── */
  const popular = await getTopKDramas().catch(() => []);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      {/* Search Prompt Hero */}
      <div className="flex flex-col items-center text-center py-12 mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
          Find Your Next <span className="gradient-text">Drama</span>
        </h1>
        <p className="text-gray-500 text-sm sm:text-base mb-8 max-w-sm">
          Search thousands of K-dramas, C-dramas, anime and more.
        </p>

        {/* Search Form */}
        <form action="/search" method="GET" className="w-full max-w-xl">
          <div className="relative flex items-center">
            <div className="absolute left-4 text-gray-500 pointer-events-none">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
            <input
              type="text"
              name="q"
              placeholder="Search dramas, actors, genres..."
              autoFocus
              className="w-full bg-surface border border-border hover:border-gray-600 focus:border-primary text-white placeholder-gray-600 pl-12 pr-32 py-4 rounded-xl text-sm outline-none transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Quick suggestion chips */}
        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {[
            "Crash Landing on You",
            "Goblin",
            "Squid Game",
            "My Love from the Star",
            "Vincenzo",
            "Itaewon Class",
          ].map((term) => (
            <Link
              key={term}
              href={`/search?q=${encodeURIComponent(term)}`}
              className="bg-surface hover:bg-surface-2 border border-border hover:border-primary/40 text-gray-400 hover:text-primary text-xs px-3 py-1.5 rounded-full transition-colors"
            >
              {term}
            </Link>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 border-t border-border" />
        <span className="text-gray-600 text-xs font-medium uppercase tracking-widest flex-shrink-0">
          Popular K-Dramas
        </span>
        <div className="flex-1 border-t border-border" />
      </div>

      {/* Popular Dramas Grid */}
      {popular.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {popular.slice(0, 12).map((drama) => (
            <DramaCard key={drama.id} drama={drama} showBadge />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-600 text-sm">
            Could not load popular dramas.
          </p>
        </div>
      )}

      {/* Explore more link */}
      {popular.length > 0 && (
        <div className="text-center mt-8">
          <Link
            href="/explore?country=KR"
            className="inline-flex items-center gap-2 bg-surface hover:bg-surface-2 border border-border text-gray-400 hover:text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
          >
            Browse All K-Dramas →
          </Link>
        </div>
      )}
    </div>
  );
}
