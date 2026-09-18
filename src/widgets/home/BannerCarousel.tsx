import { useState, useEffect } from 'react';
import { useBanners } from '@/entities/banner/bannerHooks';
import { Link } from 'react-router-dom';
import { Banner } from '@/core/types/banner';
import { t } from '@/config/locales';

export default function BannerCarousel() {
  const { data: banners = [], isLoading } = useBanners();

  const activeBanners = banners.filter((b) => b.active);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeBanners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [activeBanners.length]);

  if (isLoading) return null;

  return (
    <div className="container mx-auto px-4 mb-16 md:mb-20">
      <div className="relative overflow-hidden rounded-3xl aspect-4/3 sm:aspect-video md:aspect-3/1 shadow-2xl group border border-white/10">
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {activeBanners.map((banner, idx) => (
            <div key={banner.id} className="min-w-full h-full relative">
              {banner.link ? (
                <Link to={banner.link} className="block h-full">
                  <BannerContent banner={banner} isFirst={idx === 0} />
                </Link>
              ) : (
                <BannerContent banner={banner} isFirst={idx === 0} />
              )}
            </div>
          ))}
        </div>

        {}
        {activeBanners.length > 1 && (
          <nav aria-label="Featured Banners" className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
            {activeBanners.map((banner, i) => (
              <button
                key={banner.id || i}
                onClick={() => setCurrentIndex(i)}
                aria-label={t.home.bannerIndicatorLabel(i + 1)}
                className="p-3 inline-flex items-center justify-center cursor-pointer min-w-9 min-h-9"
              >
                <span
                  className={`h-2 transition-all duration-300 rounded-full block ${
                    currentIndex === i ? 'w-8 bg-brand-red' : 'w-2 bg-white/60 hover:bg-white'
                  }`}
                />
              </button>
            ))}
          </nav>
        )}

        {}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)
              }
              aria-label={t.home.previousBanner}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/40 z-20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % activeBanners.length)}
              aria-label={t.home.nextBanner}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/40 z-20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function BannerContent({ banner, isFirst = false }: { banner: Banner; isFirst?: boolean }) {
  const onlyImage = banner.onlyImage || false;
  const imageFit = banner.imageFit || 'cover';
  const fitClass = imageFit === 'contain' ? 'object-contain' : 'object-cover';

  if (onlyImage) {
    return (
      <div className="w-full h-full relative overflow-hidden bg-[#111317] dark:bg-[#0a0b0e]">
        <img
          src={banner.imageUrl}
          alt={banner.title}
          width={600}
          height={400}
          className={`w-full h-full ${fitClass} object-center transition-transform duration-700 group-hover:scale-105`}
          loading={isFirst ? 'eager' : 'lazy'}
          fetchPriority={isFirst ? 'high' : 'auto'}
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-[#111317] dark:bg-[#0a0b0e]">
      {}
      <div className="w-full md:w-[60%] h-[45%] md:h-full relative overflow-hidden order-1">
        <img
          src={banner.imageUrl}
          alt={banner.title}
          width={600}
          height={400}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
          loading={isFirst ? 'eager' : 'lazy'}
          fetchPriority={isFirst ? 'high' : 'auto'}
          decoding="async"
        />
        {}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-[#111317]/20 hidden md:block" />
        <div className="absolute inset-0 bg-linear-to-t from-[#111317]/20 via-transparent to-transparent md:hidden" />
      </div>

      {}
      <div className="w-full md:w-[40%] h-[55%] md:h-full flex flex-col justify-center p-6 md:p-10 text-left order-2 relative z-10">
        {}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-red/5 rounded-full blur-3xl pointer-events-none" />

        <h2 className="text-xl md:text-4xl font-black text-white mb-3 uppercase tracking-tight leading-tight drop-shadow-sm">
          {banner.title}
        </h2>

        {banner.description && (
          <p className="text-white/60 text-sm md:text-lg font-medium max-w-md italic border-l-2 border-brand-red/30 pl-4">
            {banner.description}
          </p>
        )}

        {banner.link && (
          <div className="mt-6 hidden md:block">
            <span className="inline-flex items-center text-xs font-black uppercase tracking-widest text-red-300 bg-brand-red/20 px-4 py-2 rounded-full border border-brand-red/30 group-hover:bg-brand-red group-hover:text-white transition-all duration-300">
              {t.home.learnMore}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
