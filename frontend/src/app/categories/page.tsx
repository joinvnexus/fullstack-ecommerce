'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { categoriesApi } from '@/lib/api';
import { Category } from '@/types';
import {
  ChevronRight,
  Loader2,
  ShoppingBag,
  Smartphone,
  Shirt,
  Home,
  Car,
  Gamepad2,
  Heart,
  Zap,
  Star,
  ArrowRight,
  Grid3X3,
  List,
  Search,
  Filter,
  X,
  TrendingUp,
  Crown,
  Sparkles
} from 'lucide-react';

// Category icons mapping
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('electronics') || name.includes('phone')) return Smartphone;
  if (name.includes('fashion') || name.includes('clothing')) return Shirt;
  if (name.includes('home') || name.includes('furniture')) return Home;
  if (name.includes('automotive') || name.includes('car')) return Car;
  if (name.includes('gaming') || name.includes('games')) return Gamepad2;
  if (name.includes('health') || name.includes('beauty')) return Heart;
  if (name.includes('sports') || name.includes('fitness')) return Zap;
  return ShoppingBag;
};

// Category colors for gradient backgrounds
const getCategoryColors = (index: number, isFeatured: boolean = false) => {
  const colors = isFeatured 
    ? [
        'from-amber-400 via-orange-500 to-red-500',
        'from-purple-400 via-pink-500 to-rose-500',
        'from-emerald-400 via-teal-500 to-cyan-500',
        'from-blue-400 via-indigo-500 to-violet-500',
      ]
    : [
        'from-blue-500 to-blue-600',
        'from-purple-500 to-purple-600',
        'from-green-500 to-green-600',
        'from-orange-500 to-orange-600',
        'from-pink-500 to-pink-600',
        'from-indigo-500 to-indigo-600',
        'from-red-500 to-red-600',
        'from-teal-500 to-teal-600',
        'from-cyan-500 to-cyan-600',
        'from-emerald-500 to-emerald-600',
      ];
  return colors[index % colors.length];
};

// Featured Category Card Component
function FeaturedCategoryCard({ category, index }: { category: Category; index: number }) {
  const [imageError, setImageError] = useState(false);
  const IconComponent = getCategoryIcon(category.name);
  const gradientColors = getCategoryColors(index, true);

  return (
    <Link href={`/categories/${category.slug}`} className="group block">
      <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full">
        <div className="relative h-72 overflow-hidden">
          {category.image && !imageError ? (
            <div className="relative h-full">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            </div>
          ) : (
            <div className={`h-full bg-gradient-to-br ${gradientColors} flex items-center justify-center relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-pulse delay-1000" />
              </div>
              <div className="relative z-10 text-center">
                <div className="bg-white/20 backdrop-blur-md p-5 rounded-2xl inline-flex items-center justify-center mb-3 shadow-lg">
                  <IconComponent className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
          )}
          
          {/* Featured Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-amber-500 text-white border-0 px-3 py-1 flex items-center gap-1 shadow-lg">
              <Crown className="h-3 w-3" />
              Featured
            </Badge>
          </div>

          {/* Hover Arrow */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 -translate-x-2">
            <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
              <ArrowRight className="h-5 w-5 text-gray-900" />
            </div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-end p-6">
            <div className="w-full">
              <h3 className="font-bold text-2xl text-white mb-2 drop-shadow-lg group-hover:scale-105 transition-transform duration-300">
                {category.name}
              </h3>
              <p className="text-white/80 text-sm mb-3 line-clamp-2">
                {category.description || `Explore our ${category.name} collection`}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {category.productCount !== undefined && (
                  <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs font-medium">
                    {category.productCount} products
                  </Badge>
                )}
                {category.children && category.children.length > 0 && (
                  <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs font-medium">
                    {category.children.length} sub-categories
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

// Masonry Category Card Component
function MasonryCategoryCard({ category, index }: { category: Category; index: number }) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hasChildren = category.children && category.children.length > 0;
  const IconComponent = getCategoryIcon(category.name);
  const gradientColors = getCategoryColors(index, false);
  const isLarge = index % 5 === 0 || index % 5 === 3; // Large cards
  const isMedium = index % 5 === 1 || index % 5 === 4; // Medium cards

  return (
    <Link 
      href={`/categories/${category.slug}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card 
        className={`
          overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1
          ${isLarge ? 'md:col-span-2 md:row-span-2' : ''}
          ${isMedium ? 'md:col-span-1 md:row-span-2' : ''}
        `}
      >
        <div className={`relative ${isLarge ? 'h-80' : isMedium ? 'h-64' : 'h-48'} overflow-hidden`}>
          {category.image && !imageError ? (
            <div className="relative h-full">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={() => setImageError(true)}
              />
              <div className={`absolute inset-0 transition-all duration-300 ${isHovered ? 'bg-black/30' : 'bg-black/50'}`} />
            </div>
          ) : (
            <div className={`h-full bg-gradient-to-br ${gradientColors} flex items-center justify-center`}>
              <div className={`${isLarge ? 'p-6' : 'p-4'} bg-white/10 backdrop-blur-sm rounded-full inline-flex items-center justify-center mb-2`}>
                <IconComponent className={`${isLarge ? 'h-10 w-10' : 'h-6 w-6'} text-white`} />
              </div>
            </div>
          )}

          {/* Animated overlay on hover */}
          <div 
            className={`
              absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300
              ${isHovered ? 'opacity-100' : 'opacity-80'}
            `}
          />

          {/* Hover content */}
          <div className="absolute inset-0 flex flex-col justify-between p-4">
            <div className="flex justify-between items-start">
              <div className={`${isLarge ? 'p-3' : 'p-2'} bg-white/20 backdrop-blur-sm rounded-lg`}>
                <IconComponent className={`${isLarge ? 'h-6 w-6' : 'h-4 w-4'} text-white`} />
              </div>
              {isHovered && (
                <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg transform transition-all duration-300 scale-100">
                  <ArrowRight className="h-5 w-5 text-gray-900" />
                </div>
              )}
            </div>

            <div>
              <h3 className={`
                font-bold text-white drop-shadow-lg mb-2 transition-all duration-300
                ${isHovered ? 'scale-105 translate-y-0' : ''}
              `}>
                {isLarge ? 'text-2xl' : isMedium ? 'text-xl' : 'text-lg'}
              </h3>
              <div className={`
                transition-all duration-300 overflow-hidden
                ${isHovered ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}
              `}>
                {hasChildren && (
                  <div className="flex flex-wrap gap-1">
                    {category.children.slice(0, 4).map((child) => (
                      <Badge key={child._id} variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                        {child.name}
                      </Badge>
                    ))}
                    {category.children.length > 4 && (
                      <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                        +{category.children.length - 4}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                {category.productCount !== undefined && (
                  <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs">
                    {category.productCount} items
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

// Quick Category Filter Component
function QuickFilter({ categories, selectedCategory, onSelect }: {
  categories: Category[];
  selectedCategory: string | null;
  onSelect: (id: string | null) => void;
}) {
  const iconComponents = [Smartphone, Shirt, Home, Car, Gamepad2, Heart, Zap, ShoppingBag];
  
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <button
        onClick={() => onSelect(null)}
        className={`
          px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
          ${selectedCategory === null 
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105' 
            : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
          }
        `}
      >
        All
      </button>
      {categories.slice(0, 8).map((category, index) => {
        const Icon = iconComponents[index % iconComponents.length];
        return (
          <button
            key={category._id}
            onClick={() => onSelect(selectedCategory === category._id ? null : category._id)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2
              ${selectedCategory === category._id 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105' 
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }
            `}
          >
            <Icon className="h-4 w-4" />
            {category.name}
          </button>
        );
      })}
    </div>
  );
}

// Loading Skeleton
function CategorySkeleton({ isFeatured = false }: { isFeatured?: boolean }) {
  return (
    <div className={`bg-gray-200 animate-pulse rounded-xl ${isFeatured ? 'h-72' : 'h-48'}`} />
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Separate featured categories (first 4) from rest
  const featuredCategories = useMemo(() => categories.slice(0, 4), [categories]);
  const regularCategories = useMemo(() => categories.slice(4), [categories]);

  // Filter categories
  const filteredCategories = useMemo(() => {
    return categories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.children && category.children.some(child =>
        child.name.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    );
  }, [categories, searchQuery]);

  const filteredFeatured = useMemo(() => filteredCategories.slice(0, 4), [filteredCategories]);
  const filteredRegular = useMemo(() => filteredCategories.slice(4), [filteredCategories]);

  const totalProducts = categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesApi.getAll();
        setCategories(response.data);
      } catch (err) {
        setError('Failed to load categories');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Skeleton */}
          <div className="text-center mb-16">
            <div className="h-12 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-full max-w-2xl mx-auto animate-pulse" />
          </div>
          
          {/* Featured Skeletons */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[...Array(4)].map((_, i) => <CategorySkeleton key={i} isFeatured />)}
          </div>
          
          {/* Masonry Skeletons */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <CategorySkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardContent className="text-center p-8">
            <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <div className="text-red-600 text-2xl">⚠️</div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span className="text-white/90 text-sm font-medium">Discover Amazing Categories</span>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Product Categories
            </h1>
            
            {/* Description */}
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
              Explore our carefully curated collection of {categories.length} categories 
              featuring {totalProducts}+ products. Find exactly what you're looking for!
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-white rounded-full shadow-xl border-0 text-lg focus:ring-2 focus:ring-purple-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Grid3X3 className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-white">{categories.length}</div>
                  <div className="text-white/70 text-sm">Categories</div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <ShoppingBag className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-white">{totalProducts.toLocaleString()}+</div>
                  <div className="text-white/70 text-sm">Products</div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-white/70 text-sm">Brands</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="url(#gradient)" />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f8fafc" />
                <stop offset="1" stopColor="#e0e7ff" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick Filters */}
        <div className="mb-10">
          <QuickFilter 
            categories={categories} 
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md mb-6"
        >
          <Filter className="h-5 w-5" />
          Filters
        </button>

        {filteredCategories.length === 0 ? (
          <Card className="shadow-xl border-0">
            <CardContent className="text-center p-16">
              <div className="bg-gray-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No categories found' : 'No Categories Available'}
              </h3>
              <p className="text-gray-600 text-lg mb-6">
                {searchQuery
                  ? `No categories match your search for "${searchQuery}". Try a different search term.`
                  : "We're working on adding new categories. Check back soon!"
                }
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Featured Categories */}
            {filteredFeatured.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <Star className="h-6 w-6 text-amber-500" />
                  <h2 className="text-2xl font-bold text-gray-900">Featured Categories</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredFeatured.map((category, index) => (
                    <FeaturedCategoryCard key={category._id} category={category} index={index} />
                  ))}
                </div>
              </section>
            )}

            {/* All Categories Masonry Grid */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Grid3X3 className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {searchQuery ? 'Search Results' : 'All Categories'}
                </h2>
                <Badge className="ml-2 bg-blue-100 text-blue-700 border-0">
                  {filteredRegular.length} categories
                </Badge>
              </div>
              
              {filteredRegular.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRegular.map((category, index) => (
                    <MasonryCategoryCard key={category._id} category={category} index={index} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">
                  No additional categories to display
                </p>
              )}
            </section>
          </>
        )}

        {/* Call to Action */}
        <div className="mt-20">
          <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-2xl border-0 overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
            </div>
            
            <CardContent className="p-10 relative z-10">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                  <Crown className="h-4 w-4 text-amber-300" />
                  <span className="text-sm font-medium">Premium Collection</span>
                </div>
                <h3 className="text-3xl font-bold mb-4">Can't find what you're looking for?</h3>
                <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                  Browse all our products or contact us for personalized assistance. 
                  Our team is here to help you find exactly what you need.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/products"
                    className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    Browse All Products
                  </Link>
                  <Link
                    href="/contact"
                    className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Contact Support
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
