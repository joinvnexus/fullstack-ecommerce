"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSearch } from "@/hooks/useSearch";
import { categoriesApi } from "@/lib/api";
import ProductCard from "@/app/components/products/ProductCard"; // তোমার স্ট্রাকচার অনুসারে path
import Pagination from "@/app/components/products/Pagination";
 import { Checkbox } from "@/app/components/search/Checkbox"; // shadcn/ui বা custom
 import { Slider } from "@/app/components/search/Slider";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/app/components/search/Select";
import { Loader2, SlidersHorizontal, X,  } from "lucide-react";
import SearchBar from "@/app/components/search/SearchBar";

function SearchPage() {
  const searchParams = useSearchParams();
  const {
    query,
    results,
    totalResults,
    currentPage,
    totalPages,
    isLoading,
    error,
    filters,
     setFilters,
    performSearch,
    resetFilters,
  } = useSearch();

  const [categories, setCategories] = useState<{ _id: string; name: string; slug: string }[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<number[]>([0, 50000]); // adjust max price
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await categoriesApi.getAll();
        // Flatten hierarchical categories for filter display
        const flattenedCategories: { _id: string; name: string; slug: string }[] = [];

        const flatten = (cats: any[]) => {
          cats.forEach(cat => {
            flattenedCategories.push({
              _id: cat._id,
              name: cat.name,
              slug: cat.slug
            });
            if (cat.children && cat.children.length > 0) {
              flatten(cat.children);
            }
          });
        };

        flatten(response.data);
        setCategories(flattenedCategories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        // Fallback to empty array
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);



  const toggleMobileFilters = () => setShowMobileFilters(!showMobileFilters);

  const handleCategoryToggle = (catSlug: string, checked: boolean) => {
    // For simplicity single category; multi হলে array use করো
    setFilters({ category: checked ? catSlug : undefined });
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
    setFilters({
      minPrice: values[0],
      maxPrice: values[1],
    });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-");
    setFilters({
      sortBy,
      sortOrder: sortOrder as "asc" | "desc",
    });
  };

  const clearFilters = () => {
    resetFilters();
    setPriceRange([0, 50000]);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-6 md:py-10">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Error UI */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {query ? `"${query}"` : "All Products"}
            </h1>
            <p className="text-gray-600 mt-1">
              {isLoading ? "Searching..." : `${totalResults} results found`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleMobileFilters}
              className="md:hidden flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>

            <Select
              value={`${filters.sortBy || "relevance"}-${filters.sortOrder || "desc"}`}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance-desc">Relevance</SelectItem>
                <SelectItem value="price-asc">Price: Low → High</SelectItem>
                <SelectItem value="price-desc">Price: High → Low</SelectItem>
                <SelectItem value="createdAt-desc">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`${
              showMobileFilters
                ? "fixed inset-0 bg-white z-50 p-6 overflow-y-auto"
                : "hidden"
            } lg:block lg:w-72 lg:sticky lg:top-20 lg:h-fit lg:bg-white lg:shadow-sm lg:rounded-xl lg:p-6`}
          >
            {showMobileFilters && (
              <div className="flex justify-between items-center mb-6 lg:hidden">
                <h2 className="text-xl font-bold">Filters</h2>
                <button onClick={toggleMobileFilters}>
                  <X size={24} />
                </button>
              </div>
            )}

            {/* Clear Filters */}
            {(filters.category || filters.minPrice || filters.maxPrice || filters.inStock) && (
              <button
                onClick={clearFilters}
                className="mb-6 text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                <X size={14} /> Clear all
              </button>
            )}

            {/* Categories */}
            <div className="mb-8">
              <h3 className="font-semibold mb-3">Categories</h3>
              <div className="space-y-2.5">
                {categoriesLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="ml-2 text-sm text-gray-500">Loading categories...</span>
                  </div>
                ) : categories.length === 0 ? (
                  <p className="text-sm text-gray-500">No categories available</p>
                ) : (
                  <>
                    {categories.map((cat) => (
                      <div key={cat.slug} className="flex items-center">
                        <Checkbox
                          id={cat.slug}
                          checked={filters.category === cat.slug}
                          onCheckedChange={(checked) =>
                            handleCategoryToggle(cat.slug, !!checked)
                          }
                        />
                        <label htmlFor={cat.slug} className="ml-2 text-sm cursor-pointer">
                          {cat.name}
                        </label>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4">Price Range</h3>
              <Slider
                min={0}
                max={50000}
                step={500}
                value={priceRange}
                onValueChange={handlePriceChange}
              />
              <div className="flex justify-between mt-4 text-sm text-gray-600">
                <span>৳{priceRange[0].toLocaleString()}</span>
                <span>৳{priceRange[1].toLocaleString()}</span>
              </div>
            </div>

            {/* Stock Filter */}
            <div className="mb-8">
              <div className="flex items-center">
                <Checkbox
                  id="instock"
                  checked={filters.inStock ?? false}
                  onCheckedChange={(checked) =>
                    setFilters({ inStock: checked ? true : undefined })
                  }
                />
                <label htmlFor="instock" className="ml-2 text-sm cursor-pointer">
                  Show In Stock Only
                </label>
              </div>
            </div>

            {/* Mobile Apply Button */}
            {showMobileFilters && (
              <button
                onClick={toggleMobileFilters}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium lg:hidden"
              >
                Apply Filters
              </button>
            )}
          </aside>

          {/* Results Grid */}
          <main className="flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                <h2 className="text-2xl font-bold mb-3">No products found</h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Try changing your search term or adjusting the filters
                </p>
                <div className="max-w-sm mx-auto">
                  <SearchBar variant="compact" />
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {results.map((product: any) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={totalResults}
                      itemsPerPage={12}
                      onPageChange={(page) => performSearch(page)}
                      showInfo={true}
                      className="justify-center"
                    />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function SearchPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-blue-600" /></div>}>
      <SearchPage />
    </Suspense>
  );
}

export default SearchPageWrapper;