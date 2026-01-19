'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Save,
  X,
  Plus,
  Trash2,
  Upload,
  Eye,
  Image as ImageIcon,
  ArrowLeft
} from 'lucide-react';
import { adminApi, Product } from '@/lib/api/adminApi';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

const productSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  sku: z.string().min(1, 'SKU is required'),
  price: z.object({
    amount: z.number().min(0, 'Price must be positive'),
    currency: z.string(),
  }),
  stock: z.number().min(0, 'Stock cannot be negative'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.object({ name: z.string().min(1, 'Tag name is required') })).optional(),
  status: z.enum(['draft', 'active', 'archived']),
  images: z.array(z.object({
    url: z.string().url('Invalid URL'),
    alt: z.string().min(1, 'Alt text is required'),
    isPrimary: z.boolean(),
  })).min(1, 'At least one image is required'),
  variants: z.array(z.object({
    name: z.string().min(1, 'Variant name is required'),
    options: z.array(z.object({
      name: z.string().min(1, 'Option name is required'),
      priceAdjustment: z.number(),
      skuSuffix: z.string().min(1, 'SKU suffix is required'),
    })).min(1, 'At least one option is required'),
  })).optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.string().optional(),
  }).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

const ProductEditPage = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [categories, setCategories] = useState([
    { id: '1', name: 'Electronics' },
    { id: '2', name: 'Clothing' },
    { id: '3', name: 'Home & Kitchen' },
    { id: '4', name: 'Books' },
    { id: '5', name: 'Sports' },
  ]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      price: { amount: 0, currency: 'USD' },
      stock: 0,
      status: 'draft',
      images: [],
      variants: [],
      tags: [],
    },
  });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control,
    name: 'images',
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: 'variants',
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control,
    name: 'tags',
  });

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    if (!productId) return;

    try {
      setIsLoading(true);
      const response = await adminApi.products.getById(productId);
      const product = response.data;

      // Transform product data to form format
      const formData: Partial<ProductFormData> = {
        title: product.title,
        slug: product.slug,
        description: product.description,
        sku: product.sku,
        price: {
          amount: product.price?.amount || 0,
          currency: product.price?.currency || 'USD',
        },
        stock: product.stock || 0,
        category: product.category?._id || '',
        status: product.status || 'draft',
        images: product.images?.map((img: Product['images'][0]) => ({
          url: img.url,
          alt: img.alt,
          isPrimary: img.isPrimary,
        })) || [],
        variants: product.variants || [],
        tags: product.tags?.map((tag: string) => ({ name: tag })) || [],
        seo: product.seo || {},
      };

      reset(formData);
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Failed to load product data');
      router.push('/admin/products');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      // Transform form data to API format
      const apiData = {
        ...data,
        tags: data.tags?.map(tag => tag.name) || [],
      };

      await adminApi.products.update(productId, apiData);
      alert('Product updated successfully!');
      router.push('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // In real implementation, upload to cloud storage
    // For now, create object URLs
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      appendImage({
        url,
        alt: file.name,
        isPrimary: imageFields.length === 0,
      });
    });
  };

  const setPrimaryImage = (index: number) => {
    imageFields.forEach((_, i) => {
      setValue(`images.${i}.isPrimary`, i === index);
    });
  };

  const addVariant = () => {
    appendVariant({
      name: '',
      options: [{ name: '', priceAdjustment: 0, skuSuffix: '' }],
    });
  };

  const addVariantOption = (variantIndex: number) => {
    const currentOptions = watch(`variants.${variantIndex}.options`) || [];
    setValue(`variants.${variantIndex}.options`, [
      ...currentOptions,
      { name: '', priceAdjustment: 0, skuSuffix: '' },
    ]);
  };

  const removeVariantOption = (variantIndex: number, optionIndex: number) => {
    const currentOptions = watch(`variants.${variantIndex}.options`) || [];
    if (currentOptions.length > 1) {
      setValue(
        `variants.${variantIndex}.options`,
        currentOptions.filter((_, i) => i !== optionIndex)
      );
    }
  };

  const addTag = () => {
    const newTag = prompt('Enter a tag:');
    if (newTag) {
      appendTag({ name: newTag });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.push('/admin/products')}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
            Back to Products
          </button>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
        <p className="text-gray-600">Update product details</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-6">Basic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Title *
              </label>
              <input
                {...register('title')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU *
              </label>
              <input
                {...register('sku')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., PROD-001"
              />
              {errors.sku && (
                <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  /products/
                </span>
                <input
                  {...register('slug')}
                  type="text"
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-r-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="product-slug"
                />
              </div>
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                {...register('category')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter product description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-6">Pricing & Inventory</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($) *
              </label>
              <input
                {...register('price.amount', { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
              {errors.price?.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.price.amount.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                {...register('stock', { valueAsNumber: true })}
                type="number"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Product Images *</h3>
            <div>
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
              >
                <Upload size={18} />
                Upload Images
              </label>
            </div>
          </div>

          {errors.images && (
            <p className="mb-4 text-sm text-red-600">{errors.images.message}</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {imageFields.map((field, index) => (
              <div key={field.id} className="relative group">
                <div
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    field.isPrimary ? 'border-blue-600' : 'border-gray-300'
                  }`}
                >
                  <img
                    src={field.url}
                    alt={field.alt}
                    className="h-full w-full object-cover"
                    onMouseEnter={() => setPreviewImage(field.url)}
                    onMouseLeave={() => setPreviewImage('')}
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPrimaryImage(index)}
                      className={`p-2 rounded-full ${
                        field.isPrimary
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                      title={field.isPrimary ? 'Primary' : 'Set as primary'}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                {field.isPrimary && (
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    Primary
                  </div>
                )}
              </div>
            ))}

            {imageFields.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">No images uploaded</p>
                <p className="text-sm text-gray-500 text-center">
                  Upload product images. First image will be set as primary.
                </p>
              </div>
            )}
          </div>

          {previewImage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
              <div className="relative max-w-4xl max-h-[90vh]">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="max-w-full max-h-[90vh] object-contain"
                />
                <button
                  type="button"
                  onClick={() => setPreviewImage('')}
                  className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Product Variants */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Product Variants</h3>
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Plus size={18} />
              Add Variant
            </button>
          </div>

          {variantFields.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-600">No variants added</p>
              <p className="text-sm text-gray-500 mt-1">
                Add variants like size, color, etc.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {variantFields.map((variant, variantIndex) => (
                <div key={variant.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Variant Name
                      </label>
                      <input
                        {...register(`variants.${variantIndex}.name`)}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="e.g., Size, Color"
                      />
                    </div>
                    {variantFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(variantIndex)}
                        className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Options</h4>
                      <button
                        type="button"
                        onClick={() => addVariantOption(variantIndex)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        + Add Option
                      </button>
                    </div>

                    {watch(`variants.${variantIndex}.options`)?.map((_, optionIndex) => (
                      <div key={optionIndex} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">
                            Option Name
                          </label>
                          <input
                            {...register(`variants.${variantIndex}.options.${optionIndex}.name`)}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="e.g., Small, Red"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">
                            Price Adjustment
                          </label>
                          <input
                            {...register(`variants.${variantIndex}.options.${optionIndex}.priceAdjustment`, {
                              valueAsNumber: true,
                            })}
                            type="number"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="0.00"
                          />
                        </div>
                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <label className="block text-sm text-gray-700 mb-1">
                              SKU Suffix
                            </label>
                            <input
                              {...register(`variants.${variantIndex}.options.${optionIndex}.skuSuffix`)}
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              placeholder="e.g., -S, -RED"
                            />
                          </div>
                          {watch(`variants.${variantIndex}.options`)!.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeVariantOption(variantIndex, optionIndex)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tags & SEO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tags */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Product Tags</h3>
              <button
                type="button"
                onClick={addTag}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Plus size={18} />
                Add Tag
              </button>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[48px] p-2 border border-gray-300 rounded-md">
              {tagFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                >
                  <span>{field.name}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {tagFields.length === 0 && (
                <span className="text-gray-500">No tags added</span>
              )}
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-6">SEO Settings</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Title
                </label>
                <input
                  {...register('seo.title')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Optional custom title for SEO"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Description
                </label>
                <textarea
                  {...register('seo.description')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Optional custom description for SEO"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Keywords
                </label>
                <input
                  {...register('seo.keywords')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Optional keywords separated by commas"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Save size={18} />
              {isSubmitting ? 'Saving...' : 'Update Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductEditPage;