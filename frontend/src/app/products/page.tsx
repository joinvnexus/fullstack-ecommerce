'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, Grid, List, ChevronDown, X } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import ProductListSkeleton from '../components/ui/ProductListSkeleton';
import ProductFilters from '../components/products/ProductFilters';
import { productsApi, categoriesApi } from '@/lib/api';
import { Product, Category } from '@/types';

const ProductsContent = () => {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categorySlug) {
      setSelectedCategory(categorySlug);
    }
    fetchProducts();
  }, [categorySlug, selectedCategory, pagination.page, sortBy, sortOrder, minPrice, maxPrice, selectedBrands, selectedRating, inStockOnly]);

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
      setIsLoading(true);
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
        sort: sortBy,
        order: sortOrder,
      };

      if (selectedCategory) params.category = selectedCategory;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (selectedBrands.length > 0) params.brands = selectedBrands.join(',');
      if (selectedRating > 0) params.minRating = selectedRating;
      if (inStockOnly) params.inStock = true;

      const response = await productsApi.getAll(params);
      setProducts(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleFilterReset = () => {
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedBrands([]);
    setSelectedRating(0);
    setInStockOnly(false);
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  const handlePriceFilter = () => {
    if ((minPrice && parseFloat(minPrice) < 0) || (maxPrice && parseFloat(maxPrice) < 0)) {
      alert('Price cannot be negative');
      return;
    }
    if (minPrice && maxPrice && parseFloat(minPrice) > parseFloat(maxPrice)) {
      alert('Minimum price cannot be greater than maximum price');
      return;
    }
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-2 text-gray-600">
            Discover our amazing collection of products
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <ProductFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={(slug) => {
                setSelectedCategory(slug);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={(min, max) => {
                setMinPrice(min);
                setMaxPrice(max);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              selectedBrands={selectedBrands}
              onBrandsChange={(brands) => {
                setSelectedBrands(brands);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              selectedRating={selectedRating}
              onRatingChange={(rating) => {
                setSelectedRating(rating);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              inStockOnly={inStockOnly}
              onInStockChange={(inStock) => {
                setInStockOnly(inStock);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              onReset={handleFilterReset}
              onClose={() => setShowFilters(false)}
              isMobile={showFilters}
            />
          </aside>

          {/* Products section */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <Filter size={18} />
                    Filters
                  </button>
                  <div className="text-sm text-gray-600">
                    Showing {products.length} of {pagination.total} products
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* View mode toggle */}
                  <div className="flex border border-gray-300 rounded-md overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                    >
                      <Grid size={20} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                    >
                      <List size={20} />
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
                      className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="createdAt-desc">Newest First</option>
                      <option value="createdAt-asc">Oldest First</option>
                      <option value="price.amount-asc">Price: Low to High</option>
                      <option value="price.amount-desc">Price: High to Low</option>
                      <option value="title-asc">Name: A to Z</option>
                      <option value="title-desc">Name: Z to A</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                  </div>
                </div>
              </div>
            </div>

            {/* Products grid/list */}
            {isLoading ? (
              <ProductListSkeleton count={pagination.limit} />
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-gray-400 mb-4">No products found</div>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
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
                      
                      {[...Array(pagination.totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => handlePageChange(i + 1)}
                          className={`px-4 py-2 border rounded-md ${
                            pagination.page === i + 1
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      
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

const ProductsPage = () => (
  <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div><p className="mt-4 text-gray-600">Loading products...</p></div></div>}>
    <ProductsContent />
  </Suspense>
);

export default ProductsPage;