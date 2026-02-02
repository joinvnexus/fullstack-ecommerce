'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { Filter, Grid, List, ChevronDown } from 'lucide-react';
import ProductCard from '@/app/components/products/ProductCard';
import ProductListSkeleton from '@/app/components/products/ProductListSkeleton';
import ProductFilters from '@/app/components/products/ProductFilters';
import BreadcrumbNavigation from '@/app/components/layout/BreadcrumbNavigation';
import ErrorState from '@/components/ui/ErrorState';
import { productsApi, categoriesApi } from '@/lib/api';
import { Product, Category } from '@/types';

const CategoryPageContent = () => {
  const params = useParams();
  const slug = params.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Filter states
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    fetchCategoryAndProducts();
    fetchCategories();
  }, [slug]);

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, sortBy, sortOrder, selectedSubCategory, minPrice, maxPrice, selectedBrands, selectedRating, inStockOnly]);

  const fetchCategoryAndProducts = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const [categoryResponse, productsResponse] = await Promise.all([
        categoriesApi.getBySlug(slug),
        productsApi.getAll({ category: slug, page: 1, limit: pagination.limit })
      ]);

      setCategory(categoryResponse.data);
      setProducts(productsResponse.data);
      setPagination(productsResponse.pagination);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load category';
      setError(message);
      console.error('Error fetching category and products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
        sort: sortBy,
        order: sortOrder,
        category: slug,
      };

      if (selectedSubCategory) params.subcategory = selectedSubCategory;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (selectedBrands.length > 0) params.brands = selectedBrands.join(',');
      if (selectedRating > 0) params.minRating = selectedRating;
      if (inStockOnly) params.inStock = true;

      const response = await productsApi.getAll(params);
      setProducts(response.data);
      setPagination(response.pagination);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load products';
      setError(message);
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleFilterReset = () => {
    setSelectedSubCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedBrands([]);
    setSelectedRating(0);
    setInStockOnly(false);
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  const handlePriceFilter = (min: string, max: string) => {
    setMinPrice(min);
    setMaxPrice(max);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleBrandsChange = (brands: string[]) => {
    setSelectedBrands(brands);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleRatingChange = (rating: number) => {
    setSelectedRating(rating);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleInStockChange = (inStock: boolean) => {
    setInStockOnly(inStock);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Loading state
  if (isLoading && !category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          </div>
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64">
              <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </aside>
            <div className="flex-1">
              <ProductListSkeleton count={pagination.limit} viewMode={viewMode} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <ErrorState
            title="Category not found"
            message={error}
            onRetry={fetchCategoryAndProducts}
            retryLabel="Try Again"
          />
        </div>
      </div>
    );
  }

  // Product fetch error (category loaded but products failed)
  if (error && category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation
            categoryPath={category ? [category] : []}
          />
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {category.name}
            </h1>
          </div>
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <ProductFilters
                categories={categories.filter(cat =>
                  cat.parent === category?._id || cat._id === category?._id
                )}
                selectedCategory={selectedSubCategory}
                onCategoryChange={(slug) => {
                  setSelectedSubCategory(slug);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onPriceChange={handlePriceFilter}
                selectedBrands={selectedBrands}
                onBrandsChange={handleBrandsChange}
                selectedRating={selectedRating}
                onRatingChange={handleRatingChange}
                inStockOnly={inStockOnly}
                onInStockChange={handleInStockChange}
                onReset={handleFilterReset}
                onClose={() => setShowFilters(false)}
                isMobile={showFilters}
              />
            </aside>
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <ErrorState
                  title="Unable to load products"
                  message={error}
                  onRetry={fetchProducts}
                  retryLabel="Try Again"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <BreadcrumbNavigation
            categoryPath={category ? [category] : []}
          />
        </div>

        {/* Category Header */}
        {category && (
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {category.name}
            </h1>
            <div className="mt-4 text-sm text-gray-500">
              {category.productCount ? (
                <span>{category.productCount} products available</span>
              ) : (
                <span>Showing {products.length} products</span>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <ProductFilters
              categories={categories.filter(cat =>
                cat.parent === category?._id || cat._id === category?._id
              )}
              selectedCategory={selectedSubCategory}
              onCategoryChange={(slug) => {
                setSelectedSubCategory(slug);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={handlePriceFilter}
              selectedBrands={selectedBrands}
              onBrandsChange={handleBrandsChange}
              selectedRating={selectedRating}
              onRatingChange={handleRatingChange}
              inStockOnly={inStockOnly}
              onInStockChange={handleInStockChange}
              onReset={handleFilterReset}
              onClose={() => setShowFilters(false)}
              isMobile={showFilters}
            />
          </aside>

          {/* Products section */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Filter size={18} />
                    <span className="font-medium">Filters</span>
                  </button>
                  <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                    <span className="font-medium text-gray-900">{products.length}</span> of <span className="font-medium text-gray-900">{pagination.total}</span> products
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* View mode toggle */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-all duration-200 ${
                        viewMode === 'grid'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      title="Grid view"
                    >
                      <Grid size={18} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-all duration-200 ${
                        viewMode === 'list'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      title="List view"
                    >
                      <List size={18} />
                    </button>
                  </div>

                  {/* Sort dropdown */}
                  <div className="relative">
                    <select
                      value={`${sortBy}-${sortOrder}`}
                      onChange={(e) => {
                        const [newSortBy, newSortOrder] = e.target.value.split('-');
                        setSortBy(newSortBy);
                        setSortOrder(newSortOrder);
                      }}
                      className="appearance-none pl-4 pr-10 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium"
                    >
                      <option value="createdAt-desc">Newest First</option>
                      <option value="createdAt-asc">Oldest First</option>
                      <option value="price.amount-asc">Price: Low to High</option>
                      <option value="price.amount-desc">Price: High to Low</option>
                      <option value="title-asc">Name: A to Z</option>
                      <option value="title-desc">Name: Z to A</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                  </div>
                </div>
              </div>
            </div>

            {/* Products grid/list - Loading state */}
            {isLoading ? (
              <ProductListSkeleton count={pagination.limit} viewMode={viewMode} />
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-gray-400 mb-4">No products found</div>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or browse other categories
                </p>
                <button
                  onClick={handleFilterReset}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-6'
                }>
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} viewMode={viewMode} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <nav className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={!pagination.hasPrevPage}
                        className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>

                      {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-4 py-2 border rounded-md ${
                              pagination.page === pageNum
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={!pagination.hasNextPage}
                        className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryPage = () => (
  <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div><p className="mt-4 text-gray-600">Loading category...</p></div></div>}>
    <CategoryPageContent />
  </Suspense>
);

export default CategoryPage;
