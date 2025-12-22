import HeroSection from './components/home/HeroSection';
import FeaturedProducts from './components/home/FeaturedProducts';
// import CategoriesSection from '@/components/home/CategoriesSection';
// import PromoBanner from '@/components/home/PromoBanner';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedProducts />
      {/* <CategoriesSection /> */}
      {/* <PromoBanner /> */}
    </div>
  );
}