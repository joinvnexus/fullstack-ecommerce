'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { productsApi } from '@/lib/api';
import { Product } from '@/types';
import ProductCard from '../products/ProductCard';
import ProductListSkeleton from '../products/ProductListSkeleton';
import ErrorState from '@/components/ui/ErrorState';

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setError(null);
      const response = await productsApi.getAll({ limit: 8 });
      setProducts(response.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load featured products';
      setError(message);
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state - use skeleton
  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <p className="mt-4 text-gray-600">Discover our most popular items</p>
          </div>
          <ProductListSkeleton count={4} viewMode="grid" />
        </div>
      </section>
    );
  }

  // Error state - show friendly error with retry
  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <p className="mt-4 text-gray-600">Discover our most popular items</p>
          </div>
          <ErrorState
            title="Unable to load products"
            message={error}
            onRetry={fetchFeaturedProducts}
            retryLabel="Try Again"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
          <p className="mt-4 text-gray-600">Discover our most popular items</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
