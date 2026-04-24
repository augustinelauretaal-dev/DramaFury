import { Metadata } from 'next';
import Link from 'next/link';
import {
  getTrendingKDramas,
  getLatestKDramas,
  getTopKDramas,
  getTopCDramas,
  getHollywood,
  getAnime,
  getUpcomingKDramas,
} from '@/lib/tmdb';
import HeroBanner from '@/components/HeroBanner';
import DramaRow from '@/components/DramaRow';

export const metadata: Metadata = {
  title: 'DramaFury — Watch K-Dramas Free',
  description:
    'Watch the latest Korean dramas, C-dramas, anime and Hollywood shows for free. No subscription required. Stream K-dramas online in HD.',
};

export default async function HomePage() {
  const [herodramas, latest, kdrama, cdrama, hollywood, anime, upcoming] =
    await Promise.all([
      getTrendingKDramas().catch(() => []),
      getLatestKDramas().catch(() => []),
      getTopKDramas().catch(() => []),
      getTopCDramas().catch(() => []),
      getHollywood().catch(() => []),
      getAnime().catch(() => []),
      getUpcomingKDramas().catch(() => []),
    ]);

  return (
    <>
      {/* Hero Banner Carousel */}
      <HeroBanner dramas={herodramas} />

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-2">
        {/* Continue Watching Section */}
        <section className="mb-6">
          <h2 className="text-xl font-bold text-white">Continue Watching</h2>
          <p className="text-sm text-gray-500 mt-1 text-center py-4">
            <Link href="/signin" className="text-primary hover:underline">
              Sign in
            </Link>{' '}
            now to save your watch history.
          </p>
        </section>

        {/* Drama Rows */}
        <DramaRow
          title="Latest Update"
          dramas={latest}
          viewMoreHref="/explore?sort=latest"
        />

        <DramaRow
          title="Top K-Drama"
          dramas={kdrama}
          viewMoreHref="/explore?country=KR"
        />

        <DramaRow
          title="Top C-Drama"
          dramas={cdrama}
          viewMoreHref="/explore?country=CN"
        />

        <DramaRow
          title="Hollywood"
          dramas={hollywood}
          viewMoreHref="/explore?country=US"
        />

        <DramaRow
          title="Anime"
          dramas={anime}
          viewMoreHref="/explore?country=JP&genre=16"
        />

        <DramaRow
          title="Upcoming"
          dramas={upcoming}
          viewMoreHref="/explore?sort=upcoming"
        />
      </div>
    </>
  );
}
