# Project Structure

This document outlines the directory structure of the Fullstack E-Commerce project.

**Note**: The project includes a complete admin dashboard, multiple payment gateways (Bkash, Nagad, Stripe), and an advanced search system with autocomplete functionality.

## Root Directory

```
fullstack-ecommerce/
├── README.md                       # Project documentation
├── PROJECTSTRUCTURE.md            # This file - project structure documentation
├── backend/                        # Backend application (Node.js/Express/TypeScript)
└── frontend/                       # Frontend application (Next.js/React/TypeScript)
```

## Backend Structure

```
backend/
├── package.json                   # Node.js dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
└── src/
    ├── index.ts                   # Main application entry point
    ├── middleware/
    │   └── errorHandler.ts        # Global error handling middleware
    ├── models/                    # Mongoose data models
    │   ├── Cart.ts                # Shopping cart model with business logic
    │   ├── Category.ts            # Product category model
    │   ├── Order.ts               # Order model
    │   ├── Product.ts             # Product model
    │   ├── User.ts                # User authentication model
    │   └── Wishlist.ts            # Wishlist model
    ├── routes/                    # API route handlers
    │   ├── admin.ts               # Admin dashboard endpoints
    │   ├── auth.ts                # Authentication endpoints
    │   ├── cart.ts                # Shopping cart endpoints
    │   ├── categories.ts          # Category management endpoints
    │   ├── orders.ts              # Order management endpoints
    │   ├── payments.ts            # Payment processing endpoints
    │   ├── products.ts            # Product management endpoints
    │   ├── search.ts              # Search functionality endpoints
    │   └── wishlist.ts            # Wishlist management endpoints
    ├── scripts/                   # Utility scripts
    │   └── seed.ts                # Database seeding script
    ├── services/                  # Business logic services
    │   ├── bkash.service.ts       # Bkash payment gateway integration
    │   ├── nagad.service.ts       # Nagad payment gateway integration
    │   ├── payment.service.ts     # Payment processing service
    │   ├── paymentDemo.ts         # Payment demo service
    │   └── search.service.ts      # Search functionality service
    └── utils/                     # Utility functions
        ├── auth.ts                # Authentication utilities
        └── validation.ts          # Input validation schemas
```

## Frontend Structure

```
frontend/
├── README.md                     # Frontend documentation
├── next-env.d.ts                # Next.js environment declarations
├── next.config.ts                # Next.js configuration
├── package.json                  # Node.js dependencies and scripts
├── postcss.config.mjs            # PostCSS configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── public/                       # Static assets
│   ├── favicon.ico               # Favicon
│   └── [various SVG files]      # Icon assets
└── src/
    ├── app/                      # Next.js App Router pages and layouts
    │   ├── components/           # App-specific components
    │   │   ├── home/             # Home page components
    │   │   │   ├── FeaturedProducts.tsx
    │   │   │   └── HeroSection.tsx
    │   │   ├── layout/           # Layout components
    │   │   │   ├── Footer.tsx
    │   │   │   └── Navbar.tsx
    │   │   ├── payments/         # Payment component integrations
    │   │   │   ├── BkashCheckout.tsx
    │   │   │   ├── NagadCheckout.tsx
    │   │   │   └── StripeCheckout.tsx
    │   │   ├── products/         # Product-related components
    │   │   │   ├── ProductCard.tsx
    │   │   │   └── ProductListSkeleton.tsx
    │   │   ├── search/           # Search functionality components
    │   │   │   └── SearchBar.tsx
    │   │   └── wishlist/         # Wishlist components
    │   │       ├── QuickAddModal.tsx
    │   │       └── WishlistButton.tsx
   ├── account/              # Account management pages
    │   │   └── page.tsx
    │   ├── admin/                # Admin dashboard pages
    │   │   ├── layout.tsx        # Admin layout
    │   │   └── page.tsx          # Admin dashboard
    │   ├── cart/                 # Shopping cart pages
    │   │   └── page.tsx
    │   ├── checkout/             # Checkout pages
    │   │   ├── page.tsx
    │   │   └── success/          # Payment success page
    │   ├── favicon.ico           # Favicon
    │   ├── globals.css           # Global styles
    │   ├── layout.tsx            # Root layout component
    │   ├── login/                # Authentication pages
    │   │   └── page.tsx
    │   ├── not-found.tsx         # 404 error page
    │   ├── orders/               # Order management pages
    │   │   ├── page.tsx
    │   │   └── [id]/             # Dynamic order detail pages
    │   │       └── page.tsx
    │   ├── page.tsx              # Home page
    │   ├── products/             # Product browsing pages
    │   │   ├── page.tsx
    │   │   └── [slug]/           # Dynamic product detail pages
    │   │       └── page.tsx
    │   ├── providers.tsx         # React context providers
    │   ├── register/             # User registration pages
    │   │   └── page.tsx
    │   └── wishlist/             # Wishlist pages
    │       └── page.tsx
    ├── hooks/                    # Custom React hooks
    │   ├── useAuth.tsx           # Authentication hook
    │   ├── useDebounce.ts        # Debounce utility hook
    │   ├── useSearch.ts          # Search functionality hook
    │   └── useWishlist.ts        # Wishlist management hook
    ├── store/                    # State management
    │   ├── cartStore.ts          # Shopping cart state management
    │   ├── searchStore.ts        # Search state management
    │   └── wishlistStore.ts      # Wishlist state management
    └── types/                    # TypeScript type definitions
        └── index.ts              # Global type definitions
```

## Key Architecture Notes

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication
- **Validation**: Server-side input validation using schemas
- **Cart Logic**: Complete server-side cart calculations with professional business rules
- **Payment Integration**: Multiple payment gateways (Bkash, Nagad, Stripe)
- **Search Service**: Advanced search functionality with autocomplete and suggestions

### Frontend
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS for responsive design
- **State Management**: Custom hooks and Zustand stores for cart, search, and wishlist
- **Search**: Advanced SearchBar component with autocomplete and suggestions
- **API Integration**: Custom API client functions for backend communication
- **Admin Dashboard**: Complete admin interface for managing products, orders, and users

### Development
- **Build Tools**: TypeScript compilation for both frontend and backend
- **Package Management**: npm with lock files for reproducible builds
- **Environment**: Separate environment configurations for development/production

This structure follows modern fullstack development best practices with clear separation of concerns between frontend and backend applications, comprehensive payment integration, and advanced search functionality.