import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { ShoppingCart, Star, Heart, Tag, Truck, Shield } from "lucide-react";
import useCartStore from "@/store/cartStore";
import { useState } from "react";
import WishlistButton from "@/app/components/wishlist/WishlistButton";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
  showQuickView?: boolean;
}

const ProductCard = ({ product, viewMode = "grid" }: ProductCardProps) => {
  const { addItem } = useCartStore();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const primaryImage =
    product.images.find((img) => img.isPrimary) || product.images[0];

  const handleAddToCart = async () => {
    if (product.stock === 0) return;

    try {
      setIsAddingToCart(true);
      await addItem(product._id, 1);
      // Could add a toast notification here
      console.log("Item added to cart");
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      // Could show error toast
    } finally {
      setIsAddingToCart(false);
    }
  };

  const discountPercentage = product.originalPrice && product.originalPrice.amount > product.price.amount
    ? Math.round(((product.originalPrice.amount - product.price.amount) / product.originalPrice.amount) * 100)
    : 0;

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
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

              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {discountPercentage > 0 && (
                  <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    -{discountPercentage}%
                  </div>
                )}
                {product.isNew && (
                  <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    New
                  </div>
                )}
              </div>

              {product.stock === 0 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  Out of Stock
                </div>
              )}

              {/* Wishlist button */}
              <div className="absolute top-2 right-2">
                <div onClick={(e) => e.preventDefault()}>
                  <WishlistButton
                    productId={product._id}
                    productName={product.title}
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </Link>

          <div className="flex-1 p-6">
            <div className="flex justify-between">
              <div className="flex-1">
                <Link href={`/products/${product.slug}`}>
                  <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 mb-2 line-clamp-2">
                    {product.title}
                  </h3>
                </Link>

                {product.brand && (
                  <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
                )}

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.floor(product.rating || 4)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-2">
                    ({product.reviewCount || 0} reviews)
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-gray-900">
                    ${product.price.amount.toLocaleString()}
                  </span>
                  {product.originalPrice && discountPercentage > 0 && (
                    <span className="text-lg text-gray-500 line-through">
                      ${product.originalPrice.amount.toLocaleString()}
                    </span>
                  )}
                  {product.stock > 0 && (
                    <span className="text-sm text-green-600">
                      In Stock ({product.stock} available)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-4">
                <button
                  className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || isAddingToCart}
                  title={product.stock === 0 ? "Out of stock" : "Add to cart"}
                >
                  <ShoppingCart size={20} />
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/products/${product.slug}`} className="block">
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

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discountPercentage > 0 && (
              <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                -{discountPercentage}%
              </div>
            )}
            {product.isNew && (
              <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                New
              </div>
            )}
          </div>

          {product.stock === 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Out of Stock
            </div>
          )}

          {/* Wishlist button */}
          <div className="absolute top-2 right-2">
            <div onClick={(e) => e.preventDefault()}>
              <WishlistButton
                productId={product._id}
                productName={product.title}
                size="sm"
              />
            </div>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 hover:text-blue-600 mb-2 line-clamp-2">
            {product.title}
          </h3>
        </Link>

        {product.brand && (
          <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
        )}

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center space-x-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={
                i < Math.floor(product.rating || 4)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }
            />
          ))}
          <span className="text-sm text-gray-500 ml-2">
            ({product.reviewCount || 0})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-gray-900">
              ${product.price.amount.toLocaleString()}
            </span>
            {product.originalPrice && discountPercentage > 0 && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ${product.originalPrice.amount.toLocaleString()}
              </span>
            )}
          </div>

          <button
            className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAddingToCart}
            title={product.stock === 0 ? "Out of stock" : "Add to cart"}
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
