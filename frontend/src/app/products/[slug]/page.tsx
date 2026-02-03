'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { ShoppingCart, Heart, Star, Truck, Shield, RefreshCw } from 'lucide-react';
import { productsApi } from '@/lib/api';
import { Product } from '@/types';
import WishlistButton from '@/app/components/wishlist/WishlistButton';
import ProductGallery from '@/app/components/products/ProductGallery';
import ProductVariants from '@/app/components/products/ProductVariants';
import ProductReviews from '@/app/components/products/ProductReviews';
import ProductRecommendations from '@/app/components/products/ProductRecommendations';
import RelatedProducts from '@/app/components/products/RelatedProducts';
import BreadcrumbNavigation from '@/app/components/layout/BreadcrumbNavigation';
import ProductDetailsSkeleton from '@/app/components/products/ProductDetailsSkeleton';
import ErrorState from '@/components/ui/ErrorState';

const ProductDetailPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await productsApi.getBySlug(slug);
      setProduct(response.data.product);
      setRelatedProducts(response.data.relatedProducts);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load product';
      setError(message);
      console.error('Error fetching product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    if (product && value > product.stock) return;
    setQuantity(value);
  };

  const handleAddToCart = () => {
    console.log('Add to cart:', {
      productId: product?._id,
      quantity,
      selectedVariant,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
  };

  // Loading state - show ProductDetailsSkeleton
  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  // Error state - show ErrorState
  if (error && !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <ErrorState
            title="Product not found"
            message={error}
            onRetry={fetchProduct}
            retryLabel="Try Again"
          />
        </div>
      </div>
    );
  }

  // Product not found (API returned success but no product)
  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <BreadcrumbNavigation
            items={[
              { label: 'Home', href: '/' },
              { label: 'Products', href: '/products' },
              { label: product.title, isActive: true }
            ]}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product images */}
          <div>
            <ProductGallery images={product.images} title={product.title} />
          </div>

          {/* Product info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {product.title}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-gray-600">(0 reviews)</span>
              <span className="text-green-600 font-medium">
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="text-4xl font-bold text-gray-900">
                ${product.price.amount.toFixed(2)}
              </div>
              <div className="text-gray-600">+ Free Shipping</div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>

            {/* Variants */}
            <ProductVariants
              variants={product.variants}
              selectedVariants={selectedVariant}
              onVariantChange={(variantName, optionName) =>
                setSelectedVariant(prev => ({
                  ...prev,
                  [variantName]: optionName
                }))
              }
            />

            {/* Quantity and actions */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-4 py-2 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
                    min="1"
                    max={product.stock}
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                <div className="text-gray-600">
                  {product.stock} items available
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
                <WishlistButton 
                  productId={product._id}
                  productName={product.title}
                  size="lg"
                  variant="button"
                  showLabel
                  className="flex-1"
                />
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Truck className="text-blue-600" size={24} />
                <div>
                  <div className="font-medium">Free Shipping</div>
                  <div className="text-sm text-gray-600">On orders over $50</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Shield className="text-blue-600" size={24} />
                <div>
                  <div className="font-medium">2 Year Warranty</div>
                  <div className="text-sm text-gray-600">Quality guaranteed</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <RefreshCw className="text-blue-600" size={24} />
                <div>
                  <div className="font-medium">30-Day Returns</div>
                  <div className="text-sm text-gray-600">No questions asked</div>
                </div>
              </div>
            </div>

            {/* SKU and Category */}
            <div className="text-sm text-gray-600">
              <div>SKU: {product.sku}</div>
              <div>Category: Electronics</div>
              <div>Tags: {product.tags.join(', ')}</div>
            </div>
          </div>
        </div>

        {/* Product Reviews */}
        <div className="mt-16">
          <ProductReviews
            productId={product._id}
            reviews={[]}
            averageRating={4.0}
            totalReviews={0}
            onReviewSubmit={(review) => console.log('New review:', review)}
          />
        </div>

        {/* Product Recommendations */}
        <div className="mt-16">
          <ProductRecommendations
            productId={product._id}
            currentProduct={product}
            onProductClick={(product) => console.log('Product clicked:', product)}
          />
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <RelatedProducts
            products={relatedProducts}
            title="Related Products"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
