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
  Eye,
  X
} from 'lucide-react';

interface CategoryItemProps {
  category: Category;
  level?: number;
}

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
const getCategoryColors = (index: number) => {
  const colors = [
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

function CategoryItem({ category, level = 0 }: CategoryItemProps) {
  const hasChildren = category.children && category.children.length > 0;
  const IconComponent = getCategoryIcon(category.name);
  const gradientColors = getCategoryColors(level);

  return (
    <div className={`${level > 0 ? 'ml-6 border-l-2 border-gray-200 pl-6' : ''}`}>
      <Link
        href={`/categories/${category.slug}`}
        className="group block"
      >
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
          <div className="h-48 relative overflow-hidden">
            {/* Category Image */}
            {category.image ? (
              <div className="relative h-full">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback to gradient if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="h-full bg-gradient-to-r ${gradientColors} flex items-center justify-center">
                          <div class="text-center">
                            <div class="bg-white bg-opacity-30 backdrop-blur-sm p-4 rounded-full inline-flex items-center justify-center mb-2">
                              <${IconComponent.name} class="h-8 w-8 text-white" />
                            </div>
                            <h3 class="font-bold text-xl text-white">${category.name}</h3>
                          </div>
                        </div>
                      `;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
            ) : (
              // Fallback gradient background
              <div className={`h-full bg-gradient-to-r ${gradientColors} flex items-center justify-center`}>
                <div className="text-center">
                  <div className="bg-white bg-opacity-30 backdrop-blur-sm p-4 rounded-full inline-flex items-center justify-center mb-2">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-white">{category.name}</h3>
                </div>
              </div>
            )}

            {/* Overlay Content */}
            <div className="absolute inset-0 flex items-end">
              <div className="w-full bg-gradient-to-t from-black via-black/50 to-transparent p-4">
                <h3 className="font-bold text-xl text-white mb-2 group-hover:scale-105 transition-transform duration-300 drop-shadow-lg">
                  {category.name}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  {category.productCount !== undefined && (
                    <Badge variant="secondary" className="bg-white bg-opacity-25 text-gray-800 border-0 text-xs font-medium px-2 py-1">
                      {category.productCount} products
                    </Badge>
                  )}
                  {level === 0 && hasChildren && (
                    <Badge variant="secondary" className="bg-white bg-opacity-25 text-gray-800 border-0 text-xs font-medium px-2 py-1">
                      {category.children.length} sub-categories
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Hover Arrow */}
            <div className="absolute top-4 right-4">
              <ArrowRight className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
            </div>
          </div>
          {hasChildren && (
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-2">
                {category.children.slice(0, 4).map((child) => (
                  <Link
                    key={child._id}
                    href={`/categories/${child.slug}`}
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors p-2 rounded hover:bg-gray-50"
                  >
                    {child.name}
                  </Link>
                ))}
                {category.children.length > 4 && (
                  <div className="text-sm text-gray-500 p-2">
                    +{category.children.length - 4} more
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      </Link>

      {hasChildren && level === 0 && (
        <div className="mt-4 space-y-3">
          {category.children.map((child, index) => (
            <CategoryItem key={child._id} category={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter and search categories - must be called before any early returns
  const filteredCategories = useMemo(() => {
    return categories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.children && category.children.some(child =>
        child.name.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    );
  }, [categories, searchQuery]);

  const totalProducts = categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0);
  const filteredProducts = filteredCategories.reduce((sum, cat) => sum + (cat.productCount || 0), 0);

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Categories</h3>
            <p className="text-gray-600">Please wait while we fetch the latest categories...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Product Categories
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
              Discover our wide range of product categories. Find exactly what you're looking for with our carefully organized collection.
            </p>
            <div className="flex justify-center gap-6 text-blue-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                <span className="font-semibold">{categories.length} Categories</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                <span className="font-semibold">{totalProducts}+ Products</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-12 fill-white">
            <path d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Search and Controls */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {searchQuery ? (
                  <span>Found {filteredCategories.length} categories ({filteredProducts} products)</span>
                ) : (
                  <span>Showing all {categories.length} categories</span>
                )}
              </div>

              <div className="flex items-center gap-2 bg-white p-1 rounded-lg shadow-sm border">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Grid View"
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="List View"
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {categories.slice(0, 8).map((category) => (
              <button
                key={category._id}
                onClick={() => setSelectedCategory(selectedCategory === category._id ? null : category._id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category._id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

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
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className={`grid gap-8 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredCategories.map((category, index) => (
              <CategoryItem key={category._id} category={category} />
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Browse all our products or contact us for personalized assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
                >
                  Browse All Products
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Contact Support
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
