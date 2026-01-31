'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Eye, ShoppingBag, Clock, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import ProductCard from './ProductCard';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { productsApi } from '@/lib/api';

interface ProductRecommendationsProps {
  productId: string;
  currentProduct?: Product;
  onProductClick?: (product: Product) => void;
  className?: string;
}

interface RecommendationSection {
  title: string;
  icon: React.ReactNode;
  products: Product[];
  type: 'viewed' | 'bought' | 'similar' | 'recent';
}

const ProductRecommendations = ({
  productId,
  currentProduct,
  onProductClick,
  className
}: ProductRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<RecommendationSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, [productId]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await productsApi.getRecommendations(productId);
      const data = response.data;

      const recommendations: RecommendationSection[] = [
        {
          title: 'Customers Also Viewed',
          icon: <Eye size={20} />,
          type: 'viewed',
          products: data.viewed || []
        },
        {
          title: 'Frequently Bought Together',
          icon: <ShoppingBag size={20} />,
          type: 'bought',
          products: data.bought || []
        },
        {
          title: 'Similar Products',
          icon: <TrendingUp size={20} />,
          type: 'similar',
          products: data.similar || []
        },
        {
          title: 'Recently Viewed',
          icon: <Clock size={20} />,
          type: 'recent',
          products: data.recent || []
        }
      ];

      setRecommendations(recommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Fallback to empty recommendations if API fails
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };





  if (loading) {
    return (
      <div className={cn("space-y-8", className)}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
                  <div className="h-32 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-12", className)}>
      {recommendations.map((section) => (
        <div key={section.type} className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                {section.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {section.title}
              </h3>
            </div>

            {section.products.length > 4 && (
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                View All
                <ArrowRight size={16} className="ml-2" />
              </Button>
            )}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {section.products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                viewMode="grid"
              />
            ))}
          </div>

          {/* AI-Powered Badge for Similar Products */}
          {section.type === 'similar' && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                  <TrendingUp size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    AI-Powered Recommendations
                  </p>
                  <p className="text-xs text-blue-700">
                    Based on your browsing history and similar customer preferences
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bundle Suggestion for Bought Together */}
          {section.type === 'bought' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 text-green-600 rounded-full">
                    <ShoppingBag size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      Bundle Deal Available
                    </p>
                    <p className="text-xs text-green-700">
                      Save 15% when you buy these items together
                    </p>
                  </div>
                </div>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Add Bundle to Cart
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Personalized Note */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Personalized Recommendations
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Our AI analyzes your browsing behavior, purchase history, and preferences to suggest
              products you'll love. The more you interact with our platform, the better our
              recommendations become!
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                Machine Learning
              </span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Collaborative Filtering
              </span>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                Behavioral Analysis
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductRecommendations;