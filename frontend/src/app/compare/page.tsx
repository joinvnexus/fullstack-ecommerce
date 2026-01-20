'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Plus, X, AlertCircle } from 'lucide-react';
import ProductComparison from '@/app/components/products/ProductComparison';
import BreadcrumbNavigation from '@/app/components/layout/BreadcrumbNavigation';
import { productsApi } from '@/lib/api';
import { Product } from '@/types';

const ComparePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productIds = searchParams.get('ids')?.split(',') || [];

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productIds.length > 0) {
      fetchProducts();
    } else {
      setIsLoading(false);
    }
  }, [productIds]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch products by IDs - assuming API supports comma-separated IDs
      const response = await productsApi.getAll({ ids: productIds.join(',') });
      const fetchedProducts = response.data;

      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products for comparison:', error);
      setError('Some products could not be loaded for comparison.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    const newProductIds = productIds.filter(id => id !== productId);
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (newProductIds.length === 0) {
      newSearchParams.delete('ids');
      router.push('/products');
    } else {
      newSearchParams.set('ids', newProductIds.join(','));
      router.push(`/compare?${newSearchParams.toString()}`);
    }
  };

  const handleAddToCart = (product: Product) => {
    // This would integrate with the cart store
    console.log('Add to cart:', product._id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="h-32 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (productIds.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Breadcrumb */}
          <div className="mb-8">
            <BreadcrumbNavigation
              items={[
                { label: 'Home', href: '/' },
                { label: 'Compare Products', isActive: true }
              ]}
            />
          </div>

          <div className="text-center">
            <AlertCircle size={64} className="text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Compare Products</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Add products to compare their features, specifications, and prices side by side.
            </p>
            <div className="space-y-4">
              <a
                href="/products"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} className="mr-2" />
                Browse Products
              </a>
              <p className="text-sm text-gray-500">
                Select products from our catalog to start comparing
              </p>
            </div>

            {/* Features */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Select Products</h3>
                <p className="text-gray-600 text-sm">
                  Choose up to 4 products you want to compare
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Compare Features</h3>
                <p className="text-gray-600 text-sm">
                  View specifications, prices, and ratings side by side
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Make Decision</h3>
                <p className="text-gray-600 text-sm">
                  Find the perfect product that meets your needs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <AlertCircle size={64} className="text-red-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Error Loading Products</h1>
            <p className="text-xl text-gray-600 mb-8">{error}</p>
            <div className="space-x-4">
              <button
                onClick={fetchProducts}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <a
                href="/products"
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Browse Products
              </a>
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
            items={[
              { label: 'Home', href: '/' },
              { label: 'Compare Products', isActive: true }
            ]}
          />
        </div>

        <ProductComparison
          products={products}
          onRemoveProduct={handleRemoveProduct}
          onAddToCart={handleAddToCart}
          maxProducts={4}
        />
      </div>
    </div>
  );
};

export default ComparePage;