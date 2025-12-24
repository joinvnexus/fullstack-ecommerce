# Project Structure

This document outlines the directory structure of the Fullstack E-Commerce project.

## Root Directory

```
fullstack-ecommerce/
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── README.md                       # Project documentation
├── PROJECTSTRUCTURE.md            # This file - project structure documentation
├── backend/                        # Backend application (Node.js/Express/TypeScript)
└── frontend/                       # Frontend application (Next.js/React/TypeScript)
```

## Backend Structure

```
backend/
├── .env                           # Environment variables (not in git)
├── package.json                   # Node.js dependencies and scripts
├── package-lock.json              # Lock file for dependencies
├── tsconfig.json                  # TypeScript configuration
├── dist/                          # Compiled JavaScript files (generated)
└── src/
    ├── index.ts                   # Main application entry point
    ├── middleware/
    │   └── errorHandler.ts        # Global error handling middleware
    ├── models/                    # Mongoose data models
    │   ├── Cart.ts                # Shopping cart model with business logic
    │   ├── Category.ts            # Product category model
    │   ├── Order.ts               # Order model
    │   ├── Product.ts             # Product model
    │   └── User.ts                # User authentication model
    ├── routes/                    # API route handlers
    │   ├── auth.ts                # Authentication endpoints
    │   ├── cart.ts                # Shopping cart endpoints
    │   ├── categories.ts          # Category management endpoints
    │   ├── orders.ts              # Order management endpoints
    │   ├── payments.ts            # Payment processing endpoints
    │   └── products.ts            # Product management endpoints
    ├── scripts/                   # Utility scripts
    │   └── seed.ts                # Database seeding script
    ├── services/                  # Business logic services
    │   └── paymentDemo.ts         # Payment demo service
    └── utils/                     # Utility functions
        ├── auth.ts                # Authentication utilities
        └── validation.ts          # Input validation schemas
```

## Frontend Structure

```
frontend/
├── .gitignore                    # Frontend-specific git ignore rules
├── next.config.ts                # Next.js configuration
├── package.json                  # Node.js dependencies and scripts
├── package-lock.json             # Lock file for dependencies
├── postcss.config.mjs            # PostCSS configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── .next/                        # Next.js build output (generated)
├── public/                       # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   └── vercel.svg
└── src/
    ├── app/                      # Next.js App Router pages and layouts
    │   ├── favicon.ico           # Favicon
    │   ├── globals.css           # Global styles
    │   ├── layout.tsx            # Root layout component
    │   ├── page.tsx              # Home page
    │   ├── providers.tsx         # React context providers
    │   ├── account/              # Account management pages
    │   │   └── page.tsx
    │   ├── cart/                 # Shopping cart pages
    │   │   └── page.tsx
    │   ├── checkout/             # Checkout pages
    │   │   └── page.tsx
    │   ├── login/                # Authentication pages
    │   │   └── page.tsx
    │   ├── orders/               # Order management pages
    │   │   ├── page.tsx
    │   │   └── [id]/             # Dynamic order detail pages
    │   │       └── page.tsx
    │   ├── products/             # Product browsing pages
    │   │   ├── page.tsx
    │   │   └── [slug]/           # Dynamic product detail pages
    │   │       └── page.tsx
    │   └── register/             # User registration pages
    │       └── page.tsx
    ├── components/               # Reusable React components
    │   ├── home/                 # Home page components
    │   │   ├── FeaturedProducts.tsx
    │   │   └── HeroSection.tsx
    │   ├── layout/               # Layout components
    │   │   ├── Footer.tsx
    │   │   └── Navbar.tsx
    │   └── products/             # Product-related components
    │       ├── ProductCard.tsx
    │       └── ProductListSkeleton.tsx
    ├── hooks/                    # Custom React hooks
    │   └── useAuth.tsx           # Authentication hook
    ├── lib/                      # Utility libraries
    │   └── api.ts                # API client functions
    ├── store/                    # State management
    │   └── cartStore.ts          # Shopping cart state management
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

### Frontend
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS for responsive design
- **State Management**: Custom hooks and stores for cart and auth
- **API Integration**: Axios-based API client for backend communication

### Development
- **Build Tools**: TypeScript compilation for both frontend and backend
- **Package Management**: npm with lock files for reproducible builds
- **Environment**: Separate environment configurations for development/production

This structure follows modern fullstack development best practices with clear separation of concerns between frontend and backend applications.