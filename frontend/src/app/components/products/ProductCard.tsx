import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { ShoppingCart, Star, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

const ProductCard = ({ product, viewMode = 'grid' }: ProductCardProps) => {
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="flex flex-col md:flex-row">
          <Link href={`/products/${product.slug}`} className="md:w-48 lg:w-64">
            <div className="relative h-48 md:h-full w-full">
              {primaryImage ? (
                <Image
                  src={primaryImage.url}
                  alt={primaryImage.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                />
              ) : (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
              {product.stock === 0 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  Out of Stock
                </div>
              )}
            </div>
          </Link>

          <div className="flex-1 p-6">
            <div className="flex justify-between">
              <div className="flex-1">
                <Link href={`/products/${product.slug}`}>
                  <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                    {product.title}
                  </h3>
                </Link>
                
                <div className="mt-2 flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-2">(0 reviews)</span>
                </div>

                <p className="mt-4 text-gray-600 line-clamp-2">
                  {product.description}
                </p>

                <div className="mt-4 flex items-center gap-4">
                  <span className="text-2xl font-bold text-gray-900">
                    ${product.price.amount.toFixed(2)}
                  </span>
                  {product.stock > 0 && (
                    <span className="text-sm text-green-600">
                      In Stock ({product.stock} available)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-4">
                <button
                  className="flex items-center justify-center bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={product.stock === 0}
                  title={product.stock === 0 ? 'Out of stock' : 'Add to cart'}
                >
                  <ShoppingCart size={20} />
                </button>
                <button
                  className="flex items-center justify-center border border-gray-300 text-gray-700 p-3 rounded-full hover:bg-gray-50 transition-colors"
                  title="Add to wishlist"
                >
                  <Heart size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/products/${product.slug}`}>
        <div className="relative h-48 w-full">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Out of Stock
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-1">
            {product.title}
          </h3>
        </Link>
        
        <div className="mt-2 flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
            />
          ))}
          <span className="text-sm text-gray-500 ml-2">(0)</span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ${product.price.amount.toFixed(2)}
            </span>
          </div>

          <button
            className="flex items-center justify-center bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={product.stock === 0}
            title={product.stock === 0 ? 'Out of stock' : 'Add to cart'}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;