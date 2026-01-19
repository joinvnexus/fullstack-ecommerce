# Project Structure

This document outlines the directory structure of the Fullstack E-Commerce project.

**Note**: The project includes a complete admin dashboard with analytics and audit logging, multiple payment gateways (Bkash, Nagad, Stripe), role-based permissions, and an advanced search system with autocomplete functionality.

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
    ├── controllers/               # Route controllers
    │   └── admin/                 # Admin controllers
    │       ├── categoryController.ts
    │       ├── dashboardController.ts
    │       ├── ordersController.ts
    │       ├── productController.ts
    │       └── usersController.ts
    ├── middleware/
    │   ├── errorHandler.ts        # Global error handling middleware
    │   └── permissions.ts         # Permission middleware
    ├── models/                    # Mongoose data models
    │   ├── AuditLog.ts            # Audit logging model
    │   ├── Cart.ts                # Shopping cart model with business logic
    │   ├── Category.ts            # Product category model
    │   ├── Order.ts               # Order model
    │   ├── Permission.ts          # Permission model
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
    │   ├── admin/                 # Admin services
    │   │   ├── auditService.ts
    │   │   ├── categoryService.ts
    │   │   ├── dashboardService.ts
    │   │   ├── orderService.ts
    │   │   ├── productService.ts
    │   │   └── userService.ts
    │   ├── bkash.service.ts       # Bkash payment gateway integration
    │   ├── nagad.service.ts       # Nagad payment gateway integration
    │   ├── payment.service.ts     # Payment processing service
    │   ├── paymentDemo.ts         # Payment demo service
    │   └── search.service.ts      # Search functionality service
    └── utils/                     # Utility functions
        ├── auth.ts                # Authentication utilities
        ├── rolePermissions.ts     # Role and permission utilities
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
    │   │   ├── account/          # Account management components
    │   │   │   ├── AccountLayout.tsx
    │   │   │   ├── AddressCard.tsx
    │   │   │   ├── AddressesSection.tsx
    │   │   │   ├── AddressForm.tsx
    │   │   │   ├── OrdersSection.tsx
    │   │   │   ├── PaymentSection.tsx
    │   │   │   ├── ProfileSection.tsx
    │   │   │   └── SettingsSection.tsx
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
    │   ├── account/              # Account management pages
    │   │   └── page.tsx
    │   ├── admin/                # Admin dashboard pages
    │   │   ├── analytics/        # Analytics page
    │   │   │   └── page.tsx
    │   │   ├── categories/       # Category management pages
    │   │   │   └── page.tsx
    │   │   ├── components/       # Admin UI components
    │   │   │   ├── AdminButton.tsx
    │   │   │   ├── AdminForm.tsx
    │   │   │   ├── AdminInput.tsx
    │   │   │   ├── AdminModal.tsx
    │   │   │   ├── AdminStatsCard.tsx
    │   │   │   ├── AdminTable.tsx
    │   │   │   ├── ChartCard.tsx
    │   │   │   ├── StatusBadge.tsx
    │   │   │   └── index.ts
    │   │   ├── customers/        # Customer management pages
    │   │   │   └── page.tsx
    │   │   ├── layout.tsx        # Admin layout
    │   │   ├── orders/           # Order management pages
    │   │   │   └── page.tsx
    │   │   ├── page.tsx          # Admin dashboard
    │   │   ├── products/         # Product management pages
    │   │   │   ├── page.tsx
    │   │   │   ├── [id]/         # Dynamic product detail pages
    │   │   │   │   └── page.tsx
    │   │   │   └── new/          # New product page
    │   │   │       └── page.tsx
    │   │   └── settings/         # Settings page
    │   │       └── page.tsx
    │   ├── cart/                 # Shopping cart pages
    │   │   └── page.tsx
    │   ├── checkout/             # Checkout pages
    │   │   ├── page.tsx
    │   │   └── success/          # Payment success page
    │   │       └── page.tsx
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
    │   ├── search/               # Search pages
    │   │   └── page.tsx
    │   └── wishlist/             # Wishlist pages
    │       └── page.tsx
    ├── components/               # Shared components
    │   ├── mode-toggle.tsx
    │   └── theme-provider.tsx
    │   └── ui/                   # UI library components
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
    │   ├── useDebounce.ts        # Debounce utility hook
    │   ├── usePermissions.ts     # Permissions hook
    │   ├── useSearch.ts          # Search functionality hook
    │   └── useWishlist.ts        # Wishlist management hook
    ├── lib/                      # Utility libraries
    │   ├── api.ts                # Main API client
    │   ├── api/adminApi.ts       # Admin API client
    │   └── utils.ts              # Utility functions
    ├── store/                    # State management
    │   ├── cartStore.ts          # Shopping cart state management
    │   ├── searchStore.ts        # Search state management
    │   └── wishlistStore.ts      # Wishlist state management
    ├── types/                    # TypeScript type definitions
    │   └── index.ts              # Global type definitions
    └── utils/                    # Utility functions
        └── rolePermissions.ts    # Role and permission utilities
```

## Key Architecture Notes

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication with role-based permissions
- **Validation**: Server-side input validation using schemas
- **Cart Logic**: Complete server-side cart calculations with professional business rules
- **Payment Integration**: Multiple payment gateways (Bkash, Nagad, Stripe)
- **Search Service**: Advanced search functionality with autocomplete and suggestions
- **Admin Services**: Dedicated services for admin operations with audit logging
- **Permissions**: Middleware-based role and permission system

### Frontend
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS for responsive design
- **State Management**: Custom hooks and Zustand stores for cart, search, and wishlist
- **Search**: Advanced SearchBar component with autocomplete and suggestions
- **API Integration**: Custom API client functions for backend communication
- **Admin Dashboard**: Complete admin interface for managing products, orders, and users
- **UI Components**: Extensive UI library using shadcn/ui components
- **Permissions**: Client-side permission checking with hooks

### Development
- **Build Tools**: TypeScript compilation for both frontend and backend
- **Package Management**: npm with lock files for reproducible builds
- **Environment**: Separate environment configurations for development/production

This structure follows modern fullstack development best practices with clear separation of concerns between frontend and backend applications, comprehensive payment integration, role-based permissions, and advanced search functionality.

---

## 🏗️ Architecture Improvement Plan

### Current Issues & Planned Improvements

#### Backend Architecture Issues:
1. **Routes contain business logic** - Need to separate concerns with controllers
2. **Inconsistent service usage** - Some routes call services, others don't
3. **No repository pattern** - Database operations directly in routes/controllers
4. **Scattered error handling** - No centralized error management
5. **Validation tightly coupled** - Schemas imported directly in routes

#### Frontend Architecture Issues:
1. **Mixed state management** - Zustand + Context API without clear boundaries
2. **No component composition** - Missing atomic design principles
3. **Inconsistent API calls** - Some in components, some in hooks
4. **No error boundaries** - Basic error handling
5. **No theme system** - Dark mode mentioned but not implemented
6. **Form management** - Each form handles its own state

#### General Issues:
1. **No testing strategy** - Missing unit and integration tests
2. **No CI/CD pipeline** - Manual deployment process
3. **Basic logging** - Console.log everywhere
4. **No API documentation** - Undocumented endpoints

---

### 📋 Backend Refactoring Plan

#### Phase 1: Architecture Separation (High Priority)
- [ ] **Create controllers layer**:
  ```
  src/controllers/
  ├── auth.controller.ts
  ├── product.controller.ts
  ├── cart.controller.ts
  ├── order.controller.ts
  ├── admin.controller.ts
  └── user.controller.ts
  ```
- [ ] **Implement repository pattern**:
  ```
  src/repositories/
  ├── base.repository.ts
  ├── user.repository.ts
  ├── product.repository.ts
  ├── cart.repository.ts
  └── order.repository.ts
  ```
- [ ] **Create service abstractions**:
  ```
  src/services/
  ├── interfaces/
  ├── auth.service.ts (refactor existing)
  ├── product.service.ts
  ├── cart.service.ts
  └── validation.service.ts
  ```
- [ ] **Add middleware abstractions**:
  ```
  src/middleware/
  ├── auth.middleware.ts
  ├── validation.middleware.ts
  ├── rate-limit.middleware.ts
  └── cors.middleware.ts
  ```

#### Phase 2: Error Handling & Validation (High Priority)
- [ ] **Centralized error handling**:
  ```
  src/utils/errors/
  ├── custom-errors.ts
  ├── error-handler.ts
  └── error-types.ts
  ```
- [ ] **Validation abstraction**:
  ```
  src/validation/
  ├── schemas/
  ├── validators/
  └── middleware.ts
  ```
- [ ] **Response standardization**:
  ```
  src/utils/response/
  ├── api-response.ts
  ├── pagination.ts
  └── serializer.ts
  ```

#### Phase 3: Security & Performance (Medium Priority)
- [ ] **Rate limiting implementation**
- [ ] **Input sanitization middleware**
- [ ] **Request logging middleware**
- [ ] **Caching layer (Redis)**
- [ ] **Database indexing optimization**

---

### 🎨 Frontend Refactoring Plan

#### Phase 1: Component Architecture (High Priority)
- [ ] **Implement Atomic Design**:
  ```
  src/components/
  ├── atoms/           # Basic UI elements
  │   ├── Button/
  │   ├── Input/
  │   ├── Icon/
  │   └── Badge/
  ├── molecules/       # Complex UI elements
  │   ├── FormField/
  │   ├── ProductCard/
  │   ├── Navigation/
  │   └── Modal/
  ├── organisms/       # UI sections
  │   ├── Header/
  │   ├── Footer/
  │   ├── ProductGrid/
  │   └── Sidebar/
  └── templates/       # Page layouts
      ├── AuthLayout/
      ├── DashboardLayout/
      └── StoreLayout/
  ```
- [ ] **Create design system**:
  ```
  src/design-system/
  ├── theme/
  ├── tokens/
  ├── components/
  └── utils/
  ```

#### Phase 2: State Management Consolidation (High Priority)
- [ ] **Unified state management strategy**:
  - Choose between Zustand or Redux Toolkit
  - Create clear boundaries between global and local state
  - Implement proper state persistence
- [ ] **Custom hooks standardization**:
  ```
  src/hooks/
  ├── useApi.ts        # Generic API hook
  ├── useForm.ts       # Form management hook
  ├── useToast.ts      # Notification hook
  ├── useModal.ts      # Modal management
  └── useLocalStorage.ts
  ```
- [ ] **Context providers consolidation**:
  ```
  src/providers/
  ├── AuthProvider.tsx
  ├── ThemeProvider.tsx
  ├── NotificationProvider.tsx
  └── ApiProvider.tsx
  ```

#### Phase 3: API & Error Handling (High Priority)
- [ ] **API layer improvements**:
  ```
  src/lib/api/
  ├── client.ts         # Axios instance with interceptors
  ├── endpoints.ts      # API endpoint definitions
  ├── hooks/           # React Query hooks
  └── types.ts         # API types
  ```
- [ ] **Error boundary system**:
  ```
  src/components/error/
  ├── ErrorBoundary.tsx
  ├── ErrorFallback.tsx
  └── AsyncErrorBoundary.tsx
  ```
- [ ] **Loading states abstraction**:
  ```
  src/components/loading/
  ├── Spinner.tsx
  ├── Skeleton.tsx
  └── LoadingOverlay.tsx
  ```

#### Phase 4: Forms & UI Enhancement (Medium Priority)
- [ ] **Form management system**:
  - React Hook Form + Zod integration
  - Reusable form components
  - Form validation abstraction
- [ ] **Theme system implementation**:
  ```
  src/theme/
  ├── index.ts
  ├── dark-theme.ts
  ├── light-theme.ts
  └── theme-provider.tsx
  ```
- [ ] **Notification system**:
  ```
  src/components/notifications/
  ├── ToastContainer.tsx
  ├── Toast.tsx
  └── useToast.ts
  ```

---

### 🧪 Testing Strategy

#### Phase 1: Unit Testing (High Priority)
- [ ] **Backend testing setup**:
  ```
  src/__tests__/
  ├── unit/
  │   ├── controllers/
  │   ├── services/
  │   └── utils/
  └── integration/
      ├── routes/
      └── middleware/
  ```
- [ ] **Frontend testing setup**:
  ```
  src/__tests__/
  ├── unit/
  │   ├── components/
  │   ├── hooks/
  │   └── utils/
  └── integration/
      ├── pages/
      └── api/
  ```

#### Phase 2: Integration Testing (Medium Priority)
- [ ] **API integration tests**
- [ ] **Database integration tests**
- [ ] **E2E testing with Playwright/Cypress**

---

### 🚀 DevOps & Deployment

#### Phase 1: CI/CD Pipeline (Medium Priority)
- [ ] **GitHub Actions workflow**:
  ```
  .github/workflows/
  ├── ci.yml          # Build & test
  ├── deploy.yml      # Deployment
  └── security.yml    # Security checks
  ```
- [ ] **Docker containerization**:
  ```
  docker/
  ├── Dockerfile.backend
  ├── Dockerfile.frontend
  └── docker-compose.yml
  ```

#### Phase 2: Monitoring & Logging (Low Priority)
- [ ] **Logging system**:
  - Winston for backend logging
  - Client-side error tracking
- [ ] **Performance monitoring**
- [ ] **Health checks and metrics**

---

### 📚 Documentation & Standards

#### Phase 1: Code Documentation (Medium Priority)
- [ ] **API documentation** (Swagger/OpenAPI)
- [ ] **Component documentation** (Storybook)
- [ ] **Code comments and JSDoc**
- [ ] **README updates**

#### Phase 2: Development Standards (Low Priority)
- [ ] **ESLint + Prettier configuration**
- [ ] **Husky pre-commit hooks**
- [ ] **Conventional commits**
- [ ] **Code review guidelines**

---

### 🎯 Implementation Roadmap

#### Q1 2025: Foundation (High Priority)
- [ ] Backend controller/service separation
- [ ] Frontend atomic design components
- [ ] State management consolidation
- [ ] Error handling standardization
- [ ] Unit testing setup

#### Q2 2025: Enhancement (Medium Priority)
- [ ] API layer improvements
- [ ] Theme system implementation
- [ ] Integration testing
- [ ] CI/CD pipeline
- [ ] Documentation

#### Q3 2025: Optimization (Low Priority)
- [ ] Performance monitoring
- [ ] Advanced caching
- [ ] E2E testing
- [ ] Deployment automation
- [ ] Security hardening

---

### 📊 Success Metrics

- **Maintainability**: Code coverage > 80%, Cyclomatic complexity < 10
- **Performance**: Lighthouse score > 90, API response time < 200ms
- **Reliability**: Uptime > 99.5%, Error rate < 0.1%
- **Developer Experience**: Build time < 2min, Test execution < 5min
- **User Experience**: Page load < 3s, Time to interactive < 2s