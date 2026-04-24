import Link from 'next/link';
import Image from 'next/image';
import { Film, Star } from 'lucide-react';
import { Drama } from '@/lib/types';

interface DramaCardProps {
  drama: Drama;
  showBadge?: boolean;
}

export default function DramaCard({ drama, showBadge = true }: DramaCardProps) {
  const posterUrl = drama.poster_path
    ? `https://image.tmdb.org/t/p/w342${drama.poster_path}`
    : null;

  const title = drama.name || drama.title || 'Untitled';
  const year =
    drama.first_air_date?.slice(0, 4) || drama.release_date?.slice(0, 4);
  const country = drama.origin_country?.[0];

  return (
    <Link href={`/drama/${drama.id}`} className="drama-card block">
      <div className="relative bg-[#1a1a1a] rounded-md overflow-hidden">
        {/* ── Poster image ── */}
        <div className="relative aspect-poster">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 130px, (max-width: 768px) 150px, 170px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#222222]">
              <Film className="w-8 h-8 text-gray-600" />
            </div>
          )}

          {/* Hover gradient overlay */}
          <div className="card-gradient card-overlay absolute inset-0 pointer-events-none" />

          {/* ── Top-right: country badge ── */}
          {country && (
            <div className="absolute top-1.5 right-1.5 z-10">
              <span className="bg-primary/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded leading-none">
                {country}
              </span>
            </div>
          )}

          {/* ── Bottom-right: star rating badge ── */}
          {showBadge && drama.vote_average > 0 && (
            <div className="absolute bottom-1.5 right-1.5 z-10">
              <span className="flex items-center gap-0.5 text-xs text-gray-200 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                {drama.vote_average.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* ── Card info below poster ── */}
        <div className="px-1 pb-1.5">
          <p className="text-sm font-medium text-gray-200 line-clamp-1 mt-1.5">
            {title}
          </p>
          {year && <p className="text-xs text-gray-500 mt-0.5">{year}</p>}
        </div>
      </div>
    </Link>
  );
}
