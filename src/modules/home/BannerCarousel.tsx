import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_BANNERS } from '@/adapters/mockCatalog';
import { t } from '@/config/locales';

export default function BannerCarousel() {
  const banners = MOCK_BANNERS.filter((b) => b.active);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <div className="container mx-auto px-4 mb-16 md:mb-20">
      <div className="relative overflow-hidden rounded-3xl aspect-4/3 sm:aspect-video md:aspect-3/1 shadow-2xl group border border-white/10">
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner, idx) => (
            <div key={banner.id} className="min-w-full h-full relative">
              <Link to={banner.link || '#'} className="block h-full">
                <div className="flex flex-col md:flex-row h-full w-full bg-[#111317] dark:bg-[#0a0b0e]">
                  <div className="w-full md:w-[60%] h-[45%] md:h-full relative overflow-hidden order-1">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                      loading={idx === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                  </div>
                  <div className="w-full md:w-[40%] h-[55%] md:h-full p-6 sm:p-8 md:p-12 flex flex-col justify-center order-2 bg-gradient-to-t md:bg-gradient-to-r from-black/90 via-black/80 to-transparent z-10">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3 uppercase tracking-tight">
                      {banner.title}
                    </h3>
                    <p className="text-gray-300 text-sm sm:text-base line-clamp-2 sm:line-clamp-3 mb-6 leading-relaxed font-medium">
                      {banner.description}
                    </p>
                    <div>
                      <span className="inline-flex items-center px-6 py-3 rounded-xl bg-brand-red text-white text-xs sm:text-sm font-bold uppercase tracking-wider group-hover:opacity-90 transition-opacity">
                        {t.home.exploreMenu}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {banners.length > 1 && (
          <nav aria-label="Featured Banners" className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
            {banners.map((banner, i) => (
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
      </div>
    </div>
  );
}
