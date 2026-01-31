'use client';

import { useState } from 'react';
import { X, Plus, ShoppingCart, Star, Check, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductComparisonProps {
  products: Product[];
  onRemoveProduct: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  maxProducts?: number;
  className?: string;
}

const ProductComparison = ({
  products,
  onRemoveProduct,
  onAddToCart,
  maxProducts = 4,
  className
}: ProductComparisonProps) => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'price', 'rating', 'stock', 'brand', 'category'
  ]);

  const features = [
    { key: 'price', label: 'Price', render: (product: Product) => `$${product.price.amount.toFixed(2)}` },
    { key: 'rating', label: 'Rating', render: (product: Product) => (
      <div className="flex items-center gap-1">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600">(4.0)</span>
      </div>
    )},
    { key: 'stock', label: 'Availability', render: (product: Product) =>
      product.stock > 0 ? (
        <span className="text-green-600 font-medium">In Stock ({product.stock})</span>
      ) : (
        <span className="text-red-600 font-medium">Out of Stock</span>
      )
    },
    { key: 'brand', label: 'Brand', render: (product: Product) => 'Brand Name' }, // Would come from product data
    { key: 'category', label: 'Category', render: (product: Product) =>
      typeof product.category === 'string' ? product.category : product.category?.name || 'N/A'
    },
    { key: 'description', label: 'Description', render: (product: Product) =>
      <p className="text-sm text-gray-600 line-clamp-3">{product.description}</p>
    },
    { key: 'variants', label: 'Variants', render: (product: Product) =>
      product.variants.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {product.variants.map(variant => (
            <span key={variant.name} className="text-xs bg-gray-100 px-2 py-1 rounded">
              {variant.name}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-gray-500">No variants</span>
      )
    },
  ];

  if (products.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <AlertCircle size={48} className="text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products to compare</h3>
        <p className="text-gray-600">Add products to start comparing</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Comparison Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Product Comparison ({products.length})
        </h2>
        <Button variant="outline" size="sm">
          <Plus size={16} className="mr-2" />
          Add More Products
        </Button>
      </div>

      {/* Products Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product._id} className="bg-white border border-gray-200 rounded-lg p-4 relative">
            {/* Remove Button */}
            <button
              onClick={() => onRemoveProduct(product._id)}
              className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
            >
              <X size={14} />
            </button>

            {/* Product Image */}
            <div className="relative h-32 mb-3">
              <Image
                src={product.images[0]?.url || '/placeholder.jpg'}
                alt={product.images[0]?.alt || product.title}
                fill
                className="object-cover rounded"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            </div>

            {/* Product Info */}
            <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 text-sm">
              {product.title}
            </h3>

            <div className="text-lg font-bold text-gray-900 mb-2">
              ${product.price.amount.toFixed(2)}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">(4.0)</span>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={() => onAddToCart(product)}
              disabled={product.stock === 0}
              className="w-full text-sm"
              size="sm"
            >
              <ShoppingCart size={14} className="mr-2" />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        ))}

        {/* Empty Slots */}
        {Array.from({ length: maxProducts - products.length }).map((_, index) => (
          <div key={`empty-${index}`} className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center">
            <div className="text-center">
              <Plus size={24} className="text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Add product to compare</p>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Comparison Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Feature Comparison</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feature
                </th>
                {products.map((product) => (
                  <th key={product._id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <Image
                        src={product.images[0]?.url || '/placeholder.jpg'}
                        alt={product.title}
                        width={32}
                        height={32}
                        className="object-cover rounded"
                      />
                      <span className="line-clamp-2">{product.title}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {features
                .filter(feature => selectedFeatures.includes(feature.key))
                .map((feature, index) => (
                <tr key={feature.key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {feature.label}
                  </td>
                  {products.map((product) => (
                    <td key={`${feature.key}-${product._id}`} className="px-6 py-4 text-sm text-gray-900">
                      {feature.render(product)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Toggle */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Show Features:</h4>
        <div className="flex flex-wrap gap-2">
          {features.map((feature) => (
            <label key={feature.key} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFeatures.includes(feature.key)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedFeatures(prev => [...prev, feature.key]);
                  } else {
                    setSelectedFeatures(prev => prev.filter(f => f !== feature.key));
                  }
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{feature.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductComparison;