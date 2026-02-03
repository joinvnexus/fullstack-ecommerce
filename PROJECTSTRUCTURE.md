# Project Structure

This document outlines the directory structure of the Fullstack E-Commerce project.

## Root Directory

```
fullstack-ecommerce/
├── README.md                       # Project documentation
├── PROJECTSTRUCTURE.md             # This file - project structure documentation
├── backend/                        # Backend application (Node.js/Express/TypeScript)
└── frontend/                       # Frontend application (Next.js/React/TypeScript)
```

## Backend Structure

```
backend/
├── package.json                   # Node.js dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── jest.config.js                 # Jest test configuration
├── logs/                          # Application logs
└── src/
    ├── app.ts                     # Main application entry point
    ├── index.ts                   # Server startup
    ├── config/                    # Configuration files
    │   ├── cors.ts               # CORS configuration
    │   └── database.ts           # MongoDB connection
    ├── controllers/              # Route controllers
    │   ├── authControllers.ts    # Authentication controllers
    │   └── admin/                # Admin controllers
    │       ├── categoryController.ts
    │       ├── dashboardController.ts
    │       ├── ordersController.ts
    │       ├── productController.ts
    │       └── usersController.ts
    ├── middleware/               # Express middleware
    │   ├── authMiddleware.ts     # JWT authentication
    │   ├── errorHandler.ts       # Global error handling
    │   ├── permissions.ts        # Role-based permissions
    │   └── rateLimiter.ts        # Rate limiting
    ├── models/                   # Mongoose data models
    │   ├── AuditLog.ts           # Audit logging
    │   ├── Cart.ts               # Shopping cart
    │   ├── Category.ts           # Product categories
    │   ├── Order.ts              # Orders
    │   ├── PasswordReset.ts      # Password reset tokens
    │   ├── Permission.ts         # Permission definitions
    │   ├── Product.ts            # Products
    │   ├── RefreshToken.ts       # JWT refresh tokens
    │   ├── User.ts               # Users
    │   └── Wishlist.ts           # Wishlists
    ├── routes/                   # API route handlers
    │   ├── admin.ts              # Admin dashboard endpoints
    │   ├── auth.ts               # Authentication endpoints
    │   ├── cart.ts               # Shopping cart endpoints
    │   ├── categories.ts         # Category endpoints
    │   ├── orders.ts             # Order endpoints
    │   ├── payments.ts           # Payment processing
    │   ├── products.ts           # Product endpoints
    │   ├── search.ts             # Search endpoints
    │   └── wishlist.ts           # Wishlist endpoints
    ├── services/                 # Business logic services
    │   ├── admin/                # Admin services
    │   │   ├── auditService.ts
    │   │   ├── categoryService.ts
    │   │   ├── dashboardService.ts
    │   │   ├── orderService.ts
    │   │   ├── productService.ts
    │   │   └── userService.ts
    │   ├── bkash.service.ts      # Bkash payment gateway
    │   ├── cache.service.ts      # Caching service
    │   ├── email.service.ts      # Email notifications
    │   ├── nagad.service.ts      # Nagad payment gateway
    │   ├── payment.service.ts    # Payment processing
    │   ├── paymentDemo.ts        # Demo payment service
    │   ├── rateLimiter.ts        # Rate limiting service
    │   └── search.service.ts     # Search functionality
    ├── scripts/                  # Utility scripts
    │   ├── seed.config.ts        # Seed configuration
    │   ├── seed.ts               # Database seeding
    │   └── data/                 # Seed data
    │       ├── admin.seed.ts
    │       ├── categories.seed.ts
    │       └── products.seed.ts
    └── utils/                    # Utility functions
        ├── auth.ts               # Auth utilities
        ├── authUtils.ts          # Auth helpers
        ├── logger.ts             # Logging
        ├── rolePermissions.ts    # Role definitions
        └── validation.ts         # Validation schemas
```

## Frontend Structure

```
frontend/
├── next.config.ts                # Next.js configuration
├── package.json                  # Node.js dependencies
├── postcss.config.mjs            # PostCSS config
├── tailwind.config.js            # Tailwind CSS config
├── tsconfig.json                 # TypeScript config
├── components.json               # UI components config
├── public/                       # Static assets
│   ├── favicon.ico
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
└── src/
    ├── app/                      # Next.js App Router
    │   ├── layout.tsx            # Root layout
    │   ├── globals.css           # Global styles
    │   ├── providers.tsx         # Context providers
    │   ├── not-found.tsx         # 404 page
    │   ├── page.tsx              # Home page
    │   ├── about/                # About page
    │   ├── account/              # Account management
    │   ├── admin/                # Admin dashboard
    │   │   ├── layout.tsx        # Admin layout
    │   │   ├── page.tsx          # Dashboard home
    │   │   ├── analytics/        # Analytics page
    │   │   ├── categories/       # Category management
    │   │   ├── customers/        # Customer management
    │   │   ├── orders/           # Order management
    │   │   ├── products/         # Product management
    │   │   │   ├── page.tsx
    │   │   │   ├── [id]/         # Edit product
    │   │   │   └── new/          # New product
    │   │   └── settings/         # Admin settings
    │   ├── cart/                 # Shopping cart
    │   ├── categories/           # Category browsing
    │   │   ├── page.tsx
    │   │   └── [slug]/           # Category products
    │   ├── checkout/             # Checkout flow
    │   │   ├── page.tsx
    │   │   └── success/          # Payment success
    │   ├── compare/              # Product comparison
    │   ├── login/                # Login page
    │   ├── orders/               # Order history
    │   │   ├── page.tsx
    │   │   └── [id]/             # Order details
    │   ├── products/             # Product browsing
    │   │   ├── page.tsx
    │   │   └── [slug]/           # Product details
    │   ├── register/             # Registration
    │   ├── search/               # Search results
    │   └── wishlist/             # Wishlist
    ├── components/               # Shared components
    │   ├── account/              # Account components
    │   │   ├── AccountLayout.tsx
    │   │   ├── AddressCard.tsx
    │   │   ├── AddressForm.tsx
    │   │   ├── AddressesSection.tsx
    │   │   ├── OrdersSection.tsx
    │   │   ├── PaymentSection.tsx
    │   │   ├── ProfileSection.tsx
    │   │   └── SettingsSection.tsx
    │   ├── cart/                 # Cart components
    │   │   ├── CartItem.tsx
    │   │   ├── CartSummary.tsx
    │   │   └── MiniCart.tsx
    │   ├── home/                 # Home page components
    │   │   ├── CategoriesSection.tsx
    │   │   ├── CategoriesShowcase.tsx
    │   │   ├── FeaturedProducts.tsx
    │   │   ├── FeaturesSection.tsx
    │   │   ├── HeroSection.tsx
    │   │   ├── ModernHeroSection.tsx
    │   │   ├── NewsletterSection.tsx
    │   │   ├── PromoBanner.tsx
    │   │   ├── StatsSection.tsx
    │   │   └── TestimonialsSection.tsx
    │   ├── layout/               # Layout components
    │   │   ├── BreadcrumbNavigation.tsx
    │   │   ├── Footer.tsx
    │   │   └── Navbar.tsx
    │   ├── payments/             # Payment components
    │   │   ├── BkashCheckout.tsx
    │   │   ├── NagadCheckout.tsx
    │   │   └── StripeCheckout.tsx
    │   ├── products/             # Product components
    │   │   ├── Pagination.tsx
    │   │   ├── ProductCard.tsx
    │   │   ├── ProductComparison.tsx
    │   │   ├── ProductDetailsSkeleton.tsx
    │   │   ├── ProductFilters.tsx
    │   │   ├── ProductGallery.tsx
    │   │   ├── ProductListSkeleton.tsx
    │   │   ├── ProductRecommendations.tsx
    │   │   ├── ProductReviews.tsx
    │   │   ├── ProductVariants.tsx
    │   │   └── RelatedProducts.tsx
    │   └── ui/                   # UI components
    │       ├── breadcrumb.tsx
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── checkbox.tsx
    │       ├── dropdown-menu.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       ├── select.tsx
    │       ├── table.tsx
    │       └── textarea.tsx
    ├── hooks/                    # Custom React hooks
    │   ├── useAuth.tsx           # Authentication hook
    │   ├── useDebounce.ts        # Debounce utility
    │   ├── usePermissions.ts     # Permissions hook
    │   ├── useSearch.ts          # Search hook
    │   └── useWishlist.ts        # Wishlist hook
    ├── lib/                      # Utility libraries
    │   ├── api.ts                # Main API client
    │   └── utils.ts              # Utility functions
    ├── store/                    # State management
    │   ├── cartStore.ts          # Cart state
    │   ├── searchStore.ts        # Search state
    │   └── wishlistStore.ts      # Wishlist state
    └── types/                    # TypeScript types
        └── index.ts              # Global types
```

## Key Technologies

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB/Mongoose** - Database
- **JWT** - Authentication
- **Zod** - Validation

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **shadcn/ui** - UI components

## Key Features

- ✅ User authentication & authorization
- ✅ Shopping cart with server-side calculations
- ✅ Product browsing & search with autocomplete
- ✅ Wishlist functionality
- ✅ Order management
- ✅ Product comparison
- ✅ Multiple payment gateways (Bkash, Nagad, Stripe)
- ✅ Admin dashboard with analytics
- ✅ Role-based permissions
- ✅ Audit logging
