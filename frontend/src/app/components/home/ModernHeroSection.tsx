'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Zap, Star, ShoppingBag, Users } from 'lucide-react';

const heroSlides = [
  {
    id: 1,
    badge: 'New Arrivals',
    title: 'Discover the Latest',
    subtitle: 'Tech Innovations',
    description: 'Explore cutting-edge electronics and gadgets that redefine modern living',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    ctaText: 'Shop Electronics',
    ctaLink: '/categories/electronics',
    stats: { products: '10,000+', customers: '50,000+' }
  },
  {
    id: 2,
    badge: 'Trending Now',
    title: 'Fashion Forward',
    subtitle: 'Style & Elegance',
    description: 'Elevate your wardrobe with our curated collection of premium fashion',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
    ctaText: 'Explore Fashion',
    ctaLink: '/categories/fashion',
    stats: { products: '8,000+', customers: '45,000+' }
  },
  {
    id: 3,
    badge: 'Limited Time',
    title: 'Home & Living',
    subtitle: 'Comfort Redefined',
    description: 'Transform your space with our premium home and lifestyle products',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d',
    ctaText: 'Shop Home',
    ctaLink: '/categories/home',
    stats: { products: '6,000+', customers: '40,000+' }
  }
];

const ModernHeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const currentHero = heroSlides[currentSlide];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-bounce" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className={`space-y-8 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-semibold shadow-lg">
                <Zap className="w-4 h-4" />
                {currentHero.badge}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                  {currentHero.title.split(' ').map((word, index) => (
                    <span
                      key={index}
                      className={`inline-block transition-all duration-700 hover:scale-110 hover:text-blue-400 ${
                        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                      }`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      {word}{' '}
                    </span>
                  ))}
                </h1>
                <h2 className="text-2xl lg:text-3xl text-blue-400 font-semibold">
                  {currentHero.subtitle}
                </h2>
              </div>

              {/* Description */}
              <p className={`text-xl text-gray-300 max-w-lg leading-relaxed transition-all duration-1000 delay-500 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                {currentHero.description}
              </p>

              {/* CTA Button */}
              <div className={`transition-all duration-1000 delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <Link
                  href={currentHero.ctaLink}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 hover:scale-105"
                >
                  {currentHero.ctaText}
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Stats */}
              <div className={`flex flex-wrap gap-8 transition-all duration-1000 delay-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <ShoppingBag className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{currentHero.stats.products}</div>
                    <div className="text-sm text-gray-400">Products</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <Users className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{currentHero.stats.customers}</div>
                    <div className="text-sm text-gray-400">Customers</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Image */}
            <div className={`relative transition-all duration-1000 delay-300 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
              <div className="relative">
                {/* Main Image */}
                <div className="relative w-full h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={currentHero.image}
                    alt={currentHero.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -top-6 -left-6 bg-white/10 backdrop-blur-xl rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-semibold">4.8/5</span>
                  </div>
                  <div className="text-sm text-gray-300">Customer Rating</div>
                </div>

                <div className="absolute -bottom-6 -right-6 bg-white/10 backdrop-blur-xl rounded-2xl p-4 shadow-xl">
                  <div className="text-2xl font-bold text-white">50%</div>
                  <div className="text-sm text-gray-300">Off Today</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 z-20">
        <div className="flex flex-col items-center gap-2 text-white/60">
          <div className="w-px h-16 bg-white/30"></div>
          <div className="text-xs">Scroll</div>
        </div>
      </div>
    </section>
  );
};

export default ModernHeroSection;
