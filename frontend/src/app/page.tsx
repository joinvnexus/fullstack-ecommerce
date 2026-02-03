import ModernHeroSection from './components/home/ModernHeroSection';
import StatsSection from './components/home/StatsSection';
import FeaturedProducts from './components/home/FeaturedProducts';
import CategoriesShowcase from './components/home/CategoriesShowcase';
import FeaturesSection from './components/home/FeaturesSection';
import TestimonialsSection from './components/home/TestimonialsSection';
import NewsletterSection from './components/home/NewsletterSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <ModernHeroSection />
      <StatsSection />
      <FeaturedProducts />
      <CategoriesShowcase />
      <FeaturesSection />
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
}
