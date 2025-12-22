'use client';

import { useEffect, useState } from 'react';
import { productsApi } from '@/lib/api';
import { Product } from '@/types';
import ProductCard from '../components/products/ProductCard';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsApi.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900">All Products</h1>
            <p className="mt-4 text-gray-600">Browse our complete collection</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="h-48 bg-gray-300 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">All Products</h1>
          <p className="mt-4 text-gray-600">Browse our complete collection</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;