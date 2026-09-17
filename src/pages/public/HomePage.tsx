import { useState } from 'react';
import SEO from '@/shared/ui/SEO';
import HeroSection from '@/modules/home/HeroSection';
import BannerCarousel from '@/modules/home/BannerCarousel';
import CategoriesGrid from '@/modules/home/CategoriesGrid';
import PromoBanner from '@/modules/home/PromoBanner';
import BottomBannerCTA from '@/modules/home/BottomBannerCTA';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <SEO />
      <HeroSection searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      {!searchTerm && <BannerCarousel />}
      <CategoriesGrid searchTerm={searchTerm} />
      <PromoBanner />
      <BottomBannerCTA />
    </>
  );
}
