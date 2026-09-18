import { useCatalogFilters } from '@/features/catalog-filters/useCatalogFilters';
import SEO from '@/shared/ui/SEO';
import HeroSection from '@/widgets/home/HeroSection';
import BannerCarousel from '@/widgets/home/BannerCarousel';
import CategoriesGrid from '@/widgets/home/CategoriesGrid';
import PromoBanner from '@/widgets/home/PromoBanner';
import BottomBannerCTA from '@/widgets/home/BottomBannerCTA';

export default function HomePage() {
  const { searchQuery, setSearchQuery } = useCatalogFilters();

  return (
    <>
      <SEO />
      <HeroSection searchTerm={searchQuery} onSearchChange={setSearchQuery} />
      {!searchQuery && <BannerCarousel />}
      <CategoriesGrid searchTerm={searchQuery} />
      <PromoBanner />
      <BottomBannerCTA />
    </>
  );
}
