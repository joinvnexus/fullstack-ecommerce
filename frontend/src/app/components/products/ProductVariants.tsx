'use client';

import { ProductVariant } from '@/types';
import { cn } from '@/lib/utils';

interface ProductVariantsProps {
  variants: ProductVariant[];
  selectedVariants: Record<string, string>;
  onVariantChange: (variantName: string, optionName: string) => void;
  className?: string;
}

const ProductVariants = ({
  variants,
  selectedVariants,
  onVariantChange,
  className
}: ProductVariantsProps) => {
  if (!variants?.length) return null;

  return (
    <div className={cn("space-y-6", className)}>
      {variants.map((variant) => (
        <div key={variant.name} className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">
            {variant.name}
          </h4>

          <div className="flex flex-wrap gap-2">
            {variant.options.map((option) => {
              const isSelected = selectedVariants[variant.name] === option.name;
              const hasPriceAdjustment = option.priceAdjustment !== 0;

              return (
                <button
                  key={option.name}
                  onClick={() => onVariantChange(variant.name, option.name)}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-md border transition-all duration-200",
                    "hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                    isSelected
                      ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400",
                    // For color variants, add visual indicator
                    variant.name.toLowerCase().includes('color') && "min-w-[40px]"
                  )}
                  style={
                    variant.name.toLowerCase().includes('color') && option.name.toLowerCase() !== 'white'
                      ? { backgroundColor: option.name.toLowerCase() }
                      : undefined
                  }
                >
                  {/* Color swatch for color variants */}
                  {variant.name.toLowerCase().includes('color') && (
                    <div
                      className="w-4 h-4 rounded border border-gray-300 mr-2 inline-block"
                      style={{ backgroundColor: option.name.toLowerCase() }}
                    />
                  )}

                  <span>{option.name}</span>

                  {/* Price adjustment indicator */}
                  {hasPriceAdjustment && (
                    <span className={cn(
                      "ml-1 text-xs",
                      option.priceAdjustment > 0 ? "text-green-600" : "text-red-600"
                    )}>
                      ({option.priceAdjustment > 0 ? '+' : ''}${option.priceAdjustment})
                    </span>
                  )}

                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected variant display */}
          {selectedVariants[variant.name] && (
            <p className="text-xs text-gray-600">
              Selected: <span className="font-medium">{selectedVariants[variant.name]}</span>
            </p>
          )}
        </div>
      ))}

      {/* Variant combinations warning */}
      {variants.length > 1 && (
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
          <p>💡 Some variant combinations may not be available. Prices shown are adjustments to the base price.</p>
        </div>
      )}
    </div>
  );
};

export default ProductVariants;