"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSearch } from "@/hooks/useSearch";
import ProductCard from "@/app/components/ui/ProductCard"; // তোমার স্ট্রাকচার অনুসারে path
import Pagination from "@/app/components/ui/Pagination"; // যদি না থাকে, নিচে দিবো
 import { Checkbox } from "@/app/components/ui/Checkbox"; // shadcn/ui বা custom
 import { Slider } from "@/app/components/ui/Slider";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/app/components/ui/Select";
import { Loader2, SlidersHorizontal, X,  } from "lucide-react";
import SearchBar from "@/app/components/search/SearchBar";

export default function SearchPage() {
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

  // Dynamic categories (real app-এ API থেকে load করো)
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 50000]); // adjust max price
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch categories (dummy data for now — real-এ API call করো)
  useEffect(() => {
    // async function fetchCategories() { ... }
    setCategories([
      { _id: "electronics", name: "Electronics" },
      { _id: "fashion", name: "Fashion" },
      { _id: "home", name: "Home & Kitchen" },
      { _id: "beauty", name: "Beauty" },
      // ...
    ]);
  }, []);



  const toggleMobileFilters = () => setShowMobileFilters(!showMobileFilters);

  const handleCategoryToggle = (catId: string, checked: boolean) => {
    // For simplicity single category; multi হলে array use করো
    setFilters({ category: checked ? catId : undefined });
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
                {categories.map((cat) => (
                  <div key={cat._id} className="flex items-center">
                    <Checkbox
                      id={cat._id}
                      checked={filters.category === cat._id}
                      onCheckedChange={(checked) =>
                        handleCategoryToggle(cat._id, !!checked)
                      }
                    />
                    <label htmlFor={cat._id} className="ml-2 text-sm cursor-pointer">
                      {cat.name}
                    </label>
                  </div>
                ))}
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
                  <div className="mt-12 flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={(page) => performSearch(page)}
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