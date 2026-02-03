'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbNavigationProps {
  items?: BreadcrumbItem[];
  categoryPath?: Category[];
  productTitle?: string;
  className?: string;
  separator?: React.ReactNode;
  showHome?: boolean;
}

const BreadcrumbNavigation = ({
  items,
  categoryPath,
  productTitle,
  className,
  separator = <ChevronRight size={16} className="text-gray-400" />,
  showHome = true
}: BreadcrumbNavigationProps) => {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;

    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    if (showHome) {
      breadcrumbs.push({
        label: 'Home',
        href: '/',
      });
    }

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Format segment label
      let label = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

      // Special handling for dynamic routes
      if (segment.match(/^[a-f0-9]{24}$/)) {
        // MongoDB ObjectId - likely a product or category ID
        if (productTitle) {
          label = productTitle;
        } else {
          label = 'Details';
        }
      } else if (segment.includes('[slug]')) {
        // Next.js dynamic route placeholder - skip adding to breadcrumbs
        return;
      }

      breadcrumbs.push({
        label,
        href: index === pathSegments.length - 1 ? undefined : currentPath,
        isActive: index === pathSegments.length - 1,
      });
    });

    return breadcrumbs;
  };

  // Generate breadcrumbs from category path
  const generateCategoryBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = showHome ? [{
      label: 'Home',
      href: '/',
    }] : [];

    if (categoryPath) {
      categoryPath.forEach((category, index) => {
        breadcrumbs.push({
          label: category.name,
          href: index === categoryPath.length - 1 ? undefined : `/categories/${category.slug}`,
          isActive: index === categoryPath.length - 1,
        });
      });
    }

    if (productTitle) {
      breadcrumbs.push({
        label: productTitle,
        isActive: true,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = categoryPath ? generateCategoryBreadcrumbs() : generateBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-2 text-sm", className)}
    >
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <span className="mx-2 text-gray-400">
              {separator}
            </span>
          )}

          {item.href && !item.isActive ? (
            <Link
              href={item.href}
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              {index === 0 && showHome && <Home size={16} />}
              <span>{item.label}</span>
            </Link>
          ) : (
            <span
              className={cn(
                "flex items-center gap-1",
                item.isActive
                  ? "text-gray-900 font-medium"
                  : "text-gray-600"
              )}
            >
              {index === 0 && showHome && <Home size={16} />}
              <span>{item.label}</span>
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};

// Hook for easier usage in pages
export const useBreadcrumbs = () => {
  const pathname = usePathname();

  const getBreadcrumbs = (customItems?: BreadcrumbItem[]): BreadcrumbItem[] => {
    if (customItems) return customItems;

    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/' }
    ];

    segments.forEach((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join('/')}`;
      const label = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

      breadcrumbs.push({
        label,
        href: index === segments.length - 1 ? undefined : href,
        isActive: index === segments.length - 1,
      });
    });

    return breadcrumbs;
  };

  return { getBreadcrumbs };
};

export default BreadcrumbNavigation;
export type { BreadcrumbItem };