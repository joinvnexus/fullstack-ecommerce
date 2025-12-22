'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const slides = [
  {
    id: 1,
    title: 'Summer Sale',
    description: 'Up to 50% off on all summer collections',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
    ctaText: 'Shop Now',
    ctaLink: '/products?category=clothing',
  },
  {
    id: 2,
    title: 'New Arrivals',
    description: 'Discover the latest trends in electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    ctaText: 'Explore',
    ctaLink: '/products?category=electronics',
  },
  {
    id: 3,
    title: 'Free Shipping',
    description: 'Free shipping on orders over $50',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d',
    ctaText: 'Learn More',
    ctaLink: '/shipping',
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(nextSlide, 6000);

    return () => {
      resetTimeout();
    };
  }, [currentSlide]);

  return (
    <section
      className="relative h-[85vh] min-h-[500px] max-h-[800px] overflow-hidden"
      onMouseEnter={() => resetTimeout()}
      onMouseLeave={() => {
        timeoutRef.current = setTimeout(nextSlide, 6000);
      }}
    >
      <div className="relative w-full h-full">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          const isPrev = index === (currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
          const isNext = index === (currentSlide === slides.length - 1 ? 0 : currentSlide + 1);

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                isActive
                  ? 'opacity-100 translate-x-0'
                  : isPrev
                  ? 'opacity-0 -translate-x-full'
                  : isNext
                  ? 'opacity-0 translate-x-full'
                  : 'opacity-0'
              }`}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
                  <div className={`max-w-2xl transition-all duration-1000 delay-300 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-xl sm:text-2xl text-white/90 mb-10 max-w-lg leading-relaxed">
                      {slide.description}
                    </p>
                    <Link
                      href={slide.ctaLink}
                      className="inline-flex items-center bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl"
                    >
                      {slide.ctaText}
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative w-10 h-2 rounded-full overflow-hidden transition-all duration-500 ${
              index === currentSlide ? 'bg-white' : 'bg-white/40'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === currentSlide && (
              <div className="absolute inset-0 bg-white animate-pulse" />
            )}
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;