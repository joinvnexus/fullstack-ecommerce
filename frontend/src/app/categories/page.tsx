'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { categoriesApi } from '@/lib/api';
import { Category } from '@/types';
import { ChevronRight, Loader2 } from 'lucide-react';

interface CategoryItemProps {
  category: Category;
  level?: number;
}

function CategoryItem({ category, level = 0 }: CategoryItemProps) {
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div className={`${level > 0 ? 'ml-6 border-l border-muted pl-4' : ''}`}>
      <Link
        href={`/categories/${category.slug}`}
        className="block p-4 rounded-lg border hover:shadow-md transition-shadow bg-card"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
            {category.productCount !== undefined && (
              <Badge variant="secondary" className="text-xs">
                {category.productCount} পণ্য
              </Badge>
            )}
            {level === 0 && hasChildren && (
              <p className="text-sm text-muted-foreground mt-2">
                {category.children.length} সাব-ক্যাটেগরি
              </p>
            )}
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </Link>

      {hasChildren && (
        <div className="mt-3 space-y-2">
          {category.children.map((child) => (
            <CategoryItem key={child._id} category={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesApi.getAll();
        setCategories(response.data);
      } catch (err) {
        setError('ক্যাটেগরি লোড করতে সমস্যা হয়েছে');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">ক্যাটেগরি লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              আবার চেষ্টা করুন
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-4">পণ্য ক্যাটেগরি</h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto">
            আমাদের বিভিন্ন পণ্য ক্যাটেগরি ব্রাউজ করুন এবং আপনার পছন্দের পণ্য খুঁজে নিন।
          </p>
        </div>

        {categories.length === 0 ? (
          <Card>
            <CardContent className="text-center p-12">
              <p className="text-muted-foreground text-lg">
                কোনো ক্যাটেগরি পাওয়া যায়নি।
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {categories.map((category) => (
              <CategoryItem key={category._id} category={category} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}