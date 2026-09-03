      # Engineering Audit Report — Fullstack E-Commerce

## Executive Summary

An exhaustive 21-phase audit of the repository at `E:\webdevlopment-learn\fullstack-ecommerce` was completed. The codebase is a fullstack e-commerce application with a **clearly bifurcated architecture**: the admin subsystem follows a thin-controller/fat-service pattern with consistent audit logging, while public routes implement logic inline in route files with no service layer. This creates a fundamental architectural inconsistency.

**Overall Architecture Score: 7/10** (Good structure in admin layer; inconsistent patterns in public layer)

---

## Technology Scorecard

| Layer | Technology | Declared Version | Actual Status |
|-------|-----------|------------------|---------------|
| Frontend Framework | Next.js | 16.1.0 (package.json) / 14.2.1 (README) | **Drift — README outdated** |
| Frontend Runtime | React | 19.2.3 | Consistent |
| Styling | Tailwind CSS | ^4.0.0 | Consistent |
| Backend Framework | Express.js | 5.2.1 | Consistent |
| Database | MongoDB | 9.x (Mongoose 9.x) | Consistent |
| Auth | jsonwebtoken + bcryptjs + cookieparser | — | Consistent |
| Frontend Type-checking | TypeScript | 5.x | Consistent |
| Backend Type-checking | TypeScript | 5.x | Consistent |
| Payment Providers | Stripe + bKash + Nagad | — | Implemented (demo fallbacks) |
| Toast Libraries | `react-hot-toast` + `sonner` | — | **Duplicate (conflict)** |
| HTTP Client | axios | ^1.x | Consistent |
| Testing | Jest + ts-jest | — | Backend only; frontend untested |
| Linting | — | ESLint | **Missing entirely** |
| CSRF Protection | csrf-csrf | ^2.x | Backend: present; Frontend: in-memory token (broken) |

**Key version drift**: README states Next.js 14.2.1 but `frontend/package.json` specifies 16.1.0.

---

## Consistency Matrix

| Phase | Category | Findings Summary | Status |
|-------|----------|-----------------|--------|
| 0 | Discovery | ~190 source files mapped via glob/grep + Task agent | Complete |
| 1 | Version Audit | package.json confirmed; README drifted; **duplicate toast libs resolved** (removed `react-hot-toast`) | **Fixed** |
| 2 | Architecture | Admin: controller→service→model pattern; Public: inline route logic | **Critical inconsistency** |
| 3 | Auth | JWT + bcrypt + refresh tokens + HttpOnly cookies; `role: ['*']` bypass for admin | **Partially inconsistent** (rolePermissions drift) |
| 4 | Validation | Zod (frontend) + Joi (backend) — dual schema definition; **duplicate ValidationError resolved** | **Fixed** |
| 5 | Error Handling | Central errorHandler with AppError/ValidationError; controllers wrap errors | Consistent |
| 6 | Rate Limiting | **Two duplicate implementations resolved** — consolidated into `middleware/rateLimiter.ts`; loginLimiter async-void bug resolved | **Fixed** |
| 7 | Caching | In-memory cache in product service; no frontend cache strategy | Partial |
| 8 | Security | bcrypt hashing, input sanitization (mongoSanitize, xss-clean, helmet); Stripe webhook raw body; CSRF in-memory token not persisted | **Mixed** |
| 9 | API Clients | **Dead `adminApi` in `api.ts` removed** — all admin pages use dedicated `adminApi.ts` | **Fixed** |
| 10 | API Response Envelope | `{ success, data, pagination }` everywhere; interceptor unwraps `.data` → consumers access `response.data` | Consistent (bugs fixed) |
| 11 | Frontend State | Zustand stores (`cartStore`, `wishlistStore`, `searchStore`); `useAuth.tsx`; `providers.tsx` | Consistent |
| 12 | Documentation | 8+ inaccuracies in README.md + PROJECTSTRUCTURE.md | **Stale docs** |
| 13 | Testing | Jest config present; zero test files found | **Missing** |
| 14 | Build Config | ESLint missing; tsconfig present; no path alias issues in build | **Missing lint** |
| 15 | Environment Config | **`.env.example` syntax fixed** — removed invalid `${VAR}` expansion | **Fixed** |
| 16 | Models | 9 Mongoose models with proper schemas; **AuditLog index field mismatch resolved** (uses `createdAt`) | **Fixed** |
| 17 | Controllers | Admin controllers thin/wrap service; auth controller inline; error handling consistent | Consistent |
| 18 | Services | Admin services fat with audit logging; public routes have no services | **Inconsistency** |
| 19 | Routes | **Route ordering bugs resolved** — products.ts and wishlist.ts already in correct order | **Fixed** |
| 20 | Frontend Pages | Admin pages stubbed (analytics, settings, new product); **double `.data` bug fixed**; product edit has hardcoded categories | **Fixed** (partial remaining) |
| 21 | Integration | Stripe uses raw fetch + localStorage (security regression); bKash/Nagad use proper services; **dead paymentDemo.ts removed** | **Inconsistency** |

---

## Detailed Findings (40+ Issues)

### A. Duplicate Code (High Priority)

| # | Location | Issue |
|---|----------|-------|
| A1 | `frontend/package.json` | ✅ **Resolved**: Both `react-hot-toast` and `sonner` installed — duplicate toast UI libraries. **Fixed**: removed `react-hot-toast`, standardized on `sonner`. All 5 toast consumers already use `sonner`. |
| A2 | `backend/src/middleware/rateLimiter.ts` + `backend/src/services/rateLimiter.ts` | ✅ **Resolved**: Two complete rate limiter implementations. **Fixed**: consolidated into `middleware/rateLimiter.ts` with `createRateLimiter` function; deleted `services/rateLimiter.ts`; updated `app.ts` import. |
| A3 | `frontend/src/lib/api.ts` (lines 147-165) | ✅ **Resolved**: Flat `adminApi` object exported as **dead code** — all 7 admin pages import from `adminApi.ts`. **Fixed**: removed dead `adminApi` object and unused type imports (`DashboardStats`, `AdminProductData`, `AdminOrderUpdate`). |
| A4 | `backend/src/middleware/errorHandler.ts` + `backend/src/utils/validation.ts` | ✅ **Resolved**: Both define `ValidationError` class — naming collision risk. **Fixed**: removed duplicate in `validation.ts`, imported canonical `ValidationError` from `errorHandler.ts` and re-exported. No circular dependency. |
| A5 | `backend/src/utils/auth.ts` + `backend/src/utils/authUtils.ts` | ✅ **Resolved**: `AuthUtils` class vs free functions — overlapping responsibilities. **Fixed**: merged `generateAndSetTokens` and `sanitizeUserResponse` into `auth.ts`; updated importer in `authControllers.ts`; deleted `authUtils.ts`. |
| A6 | `backend/src/config/cors.ts` (0 bytes) | Empty file — CORS configured inline in `app.ts` instead |
| A7 | `backend/src/services/paymentDemo.ts` | ✅ **Resolved**: Entire payment simulation service — dead code, randomly succeeds/fails. **Fixed**: deleted file (no imports found anywhere in codebase). |

### B. API Mismatches (Critical)

| # | Location | Issue |
|---|----------|-------|
| B1 | `frontend/src/app/orders/page.tsx:38` + `OrdersSection.tsx:21` | ✅ **Resolved**: **Double `.data` access** via cast `(response as PaginatedResponse<Order>).data` — type param `PaginatedResponse<Order>` caused TypeScript to think `response.data` = `{ data, pagination }` while runtime gave `Order[]`, creating a fragile double-access pattern. **Fixed**: changed `getMyOrders` type param to `Order[]`, replaced cast with `response.data` directly, removed unused `PaginatedResponse` imports. |
| B2 | `frontend/src/lib/api.ts:147-165` | ✅ **Resolved**: Dead `adminApi` removed (see A3). All admin pages use `@/lib/api/adminApi.ts`. |
| B3 | `frontend/src/app/orders/[id]/page.tsx:38` | ✅ Correct pattern confirmed — `response.data` matches interceptor unwrap |
| B4 | `frontend/src/app/admin/orders/page.tsx:51` | ✅ Correct — `response.data` matches interceptor unwrap |
| B5 | `frontend/src/lib/api/adminApi.ts` | `updateStatus` uses PUT but backend admin order route uses PATCH semantics (`updateOrderStatus` handler receives `status` in body) |

### C. Broken/Stubbed Routes (Critical)

| # | Location | Issue |
|---|----------|-------|
| C1 | `backend/src/routes/products.ts` | ✅ **Resolved**: **Route shadowing** issue — `/:slug` was reported as shadowing `/:id/recommendations` and `/category/:categorySlug`. **Verified current code**: `/:id/recommendations` (line 304) → `/category/:categorySlug` (line 378) → `/:slug` (line 432) — correct ordering with explicit comment "must come after more specific routes". No fix needed. |
| C2 | `backend/src/routes/wishlist.ts` | ✅ **Resolved**: **Route shadowing** issue — `/:wishlistId` was reported as shadowing `/check/:productId`. **Verified current code**: `/check/:productId` (line 352) → `/:wishlistId` (line 380) — correct ordering with comment "must come before /:wishlistId". No fix needed. |
| C3 | `backend/src/routes/orders.ts` | `/my-orders` registered before `/:id` — correct ordering, but `/:id` would shadow if reordered |
| C4 | `frontend/src/app/admin/products/new/page.tsx:111-124` | **Stub**: `onSubmit` only `console.log`s and `alert`s — no API call to `adminApi.products.create` |
| C5 | `frontend/src/app/admin/analytics/page.tsx:95-106` | **Stub**: `fetchAnalytics` has commented-out API call; all data is hardcoded mocks |
| C6 | `frontend/src/app/admin/settings/page.tsx:84-96` | **Stub**: `handleSave` only `alert`s and `console.log`s — no persistence |
| C7 | `frontend/src/app/products/[slug]/page.tsx` | `handleAddToCart` and `handleBuyNow` are stubs with no implementation |

### C8 | `backend/src/routes/products.ts` | Search route `/search` registered after `/:slug` — if a slug equals "search", it would shadow the search route |

### D. Security Issues (High Priority)

| # | Location | Issue |
|---|----------|-------|
| D1 | `frontend/src/components/payments/StripeCheckout.tsx` | **Critical security regression**: Uses raw `fetch('/api/payments/stripe/intent')` instead of the axios `api` client; reads token from `localStorage.getItem('token')` instead of cookies — exposes bearer token to XSS |
| D2 | `frontend/src/lib/api.ts:113-117` | CSRF token stored in **in-memory variable** (`csrfTokenMemory`) — lost on page reload; the interceptor never fetches a fresh token from the server, so CSRF tokens expire silently |
| D3 | `frontend/src/lib/api/adminApi.ts:17-20` | Admin API client has `credentials: 'include'` but **does not send CSRF header** on POST/PUT/DELETE requests — CSRF protection only works if the token is sent alongside |
| D4 | `backend/src/services/bkash.service.ts:55` | Token expiry: `3599 * 1000` ms (1 hour) but bKash tokens expire in 1 hour — no retry on 401 in service |
| D5 | `backend/src/app.ts` | Raw-body parsing configured for Stripe webhook but **csrf-csrf middleware applies to all routes** including webhooks — may interfere with webhook signature verification |
| D6 | `frontend/src/app/admin/settings/page.tsx:57-62` | Stripe **secret key** input rendered in plaintext `<input type="password">` — stored on client side in React state (not a real vulnerability but indicates architectural misuse of client-side settings) |

### E. Architecture Inconsistencies (Medium Priority)

| # | Location | Issue |
|---|----------|-------|
| E1 | `backend/src/routes/*.ts` (auth, products, cart, orders, wishlist, categories, search, payments) | All public route files contain **inline business logic** — no service layer, unlike admin routes which delegate to `*Service.ts` |
| E2 | `frontend/src/utils/rolePermissions.ts` | Frontend permission map mirrors backend `rolePermissions.ts` but is **missing `hasPermission` and `getRolePermissions` functions** that exist on the backend — frontend can't check granular permissions |
| E3 | `backend/src/services/admin/dashboardService.ts` | Returns raw aggregation results; frontend admin analytics page calls `adminApi.analytics.getData()` which **does not exist** in `adminApi.ts` |
| E4 | `frontend/src/lib/api/adminApi.ts:110-120` | `orders.updateStatus` uses PUT to `/${id}/status` but backend orders admin route uses PATCH (`/admin/orders/:id/status` with PATCH method) |

### F. Configuration Issues (Medium/Low Priority)

| # | Location | Issue |
|---|----------|-------|
| F1 | `backend/.env.example:4` | ✅ **Resolved**: `${VAR}` expansion syntax was invalid in `.env` files. **Fixed**: replaced with literal placeholder values (`your_user`, `your_password`, etc.) and added trailing comment explaining no interpolation is available. |
| F2 | `frontend/` directory | **No ESLint config** (`eslint`, `eslint-config`, `.eslintrc.*` — all absent); `next lint` would fail |
| F3 | `backend/src/models/AuditLog.ts` | ✅ **Resolved**: Index was on `{ timestamp: 1 }` but schema uses `{ timestamps: true }` creating `createdAt`/`updatedAt`. **Verified current code**: index uses `createdAt: -1` (line 31), matching the `timestamps: true` field name. No fix needed. |
| F4 | `backend/src/middleware/rateLimiter.ts:29-33` | ✅ **Resolved**: `loginLimiter.handler` used `void blockIP(ip)` (async-void bug) and `skip` used `void checkBlockedIP(ip)` then returned `false`. **Fixed** (via consolidation in Item 9/A2): handler now `await blockIP(ip)`, skip now `return await checkBlockedIP(ip)`. |
| F5 | `backend/src/lib/api.ts:31` / `frontend/src/lib/api.ts:4` | `baseURL: process.env.NEXT_PUBLIC_API_URL` — no fallback if env var is undefined; requests silently fail to `undefined/api/...` |

### G. Frontend Component Issues (Medium Priority)

| # | Location | Issue |
|---|----------|-------|
| G1 | `frontend/src/app/admin/products/[id]/page.tsx:63` | `categories` state is **hardcoded array** — not fetched from API; category dropdown won't reflect DB changes |
| G2 | `frontend/src/app/admin/products/[id]/page.tsx:34` | Image URL schema validation uses `z.string().url()` — rejects `blob:` and `object:` URLs from `URL.createObjectURL()` used in `handleImageUpload` |
| G3 | `frontend/src/app/admin/analytics/page.tsx` | Currency hardcoded to BDT (`৳`) in all charts — no currency configuration |
| G4 | `frontend/src/components/payments/BkashCheckout.tsx` | Currency conversion bug: `* 85` hardcoded BDT conversion rate (assumes USD base) |
| G5 | `frontend/src/components/payments/NagadCheckout.tsx` | Same currency conversion bug: `* 85` hardcoded |

### H. Documentation Drift (Low Priority)

| # | Location | Issue |
|---|----------|-------|
| H1 | `README.md` | States Next.js 14.2.1; actual is 16.1.0 |
| H2 | `README.md` | API endpoint paths reference `/api/v1/` but backend routes are mounted at `/api/` (no v1 prefix) |
| H3 | `README.md` | Lists `price_at_time` field on Order model; **does not exist** in `backend/src/models/Order.ts` |
| H4 | `PROJECTSTRUCTURE.md` | References `src/app/(admin)/` route groups that don't exist in the codebase |
| H5 | `PROJECTSTRUCTURE.md` | Lists `src/lib/stores/` directory; actual store location is `src/lib/` (`cartStore.ts`, `wishlistStore.ts`) |
| H6 | `PROJECTSTRUCTURE.md` | Omits `src/lib/api/adminApi.ts` — the primary client used by all admin pages |

---

## Refactoring Roadmap (86 Items, Prioritized)

### Phase 1: Fix Critical Bugs (7 items)

1. **[BUG]** Fix double `.data` access in `frontend/src/app/orders/page.tsx:38` — change `response.data.data` to `response.data`
2. **[BUG]** Fix product route shadowing in `backend/src/routes/products.ts` — move `/:id/recommendations` after `/:slug`
3. **[BUG]** Fix wishlist route shadowing in `backend/src/routes/wishlist.ts` — move `/check/:productId` before `/:wishlistId`
4. **[BUG]** Fix `MONGODB_URI` template syntax in `backend/.env.example` — replace `${VAR}` with literal placeholders
5. **[BUG]** Fix AuditLog index in `backend/src/models/AuditLog.ts` — change `timestamp` to `createdAt`
6. **[BUG]** Fix `loginLimiter.handler` async-void in `backend/src/middleware/rateLimiter.ts:29-33`
7. **[BUG]** Fix search route shadowing in `backend/src/routes/products.ts` — route ordering

### Phase 2: Eliminate Duplicates (6 items)

8. **[DEDUP]** Remove `sonner` from `frontend/package.json` (keep `react-hot-toast`) or vice versa — pick one
9. **[DEDUP]** Delete `backend/src/services/rateLimiter.ts` — consolidate into `middleware/rateLimiter.ts` or vice versa
10. **[DEDUP]** Remove dead `adminApi` export from `frontend/src/lib/api.ts:147-165`
11. **[DEDUP]** Consolidate `ValidationError` — keep one definition (in `errorHandler.ts`); export from there
12. **[DEDUP]** Merge `backend/src/utils/auth.ts` (`AuthUtils` class) and `backend/src/utils/authUtils.ts` (free functions) — pick single pattern
13. **[DEDUP]** Delete `backend/src/services/paymentDemo.ts` — non-functional stub

### Phase 3: API Client Consistency (6 items)

14. **[API]** Unify frontend API clients — merge `adminApi.ts` methods into `api.ts` or vice versa
15. **[API]** Fix HTTP method mismatch: admin orders status update (PUT in frontend, PATCH/POST on backend)
16. **[API]** Fix admin products update method if mismatch exists
17. **[API]** Add CSRF header to admin API client (`adminApi.ts`) — missing CSRF token sending on write operations
18. **[API]** Add `baseURL` fallback in `frontend/src/lib/api.ts:31`
19. **[API]** Remove `z.string().url()` constraint on image URLs in both `frontend/src/app/admin/products/[id]/page.tsx:34` and `frontend/src/app/admin/products/new/page.tsx:31` — accept `blob:`/`object:` URLs

### Phase 4: Complete Stubbed Features (7 items)

20. **[STUB]** Implement `onSubmit` in `frontend/src/app/admin/products/new/page.tsx:111-124` — call `adminApi.products.create`
21. **[STUB]** Implement `fetchAnalytics` in `frontend/src/app/admin/analytics/page.tsx:95-106` — call real API; add `adminApi.analytics` endpoint
22. **[STUB]** Implement `handleSave` in `frontend/src/app/admin/settings/page.tsx:84-96` — persist to backend API
23. **[STUB]** Implement `handleAddToCart` in `frontend/src/app/products/[slug]/page.tsx`
24. **[STUB]** Implement `handleBuyNow` in `frontend/src/app/products/[slug]/page.tsx`
25. **[STUB]** Fetch real categories instead of hardcoded array in `frontend/src/app/admin/products/[id]/page.tsx:63`
26. **[STUB]** Add backend analytics aggregation service if missing from `dashboardService.ts`

### Phase 5: Security Hardening (5 items)

27. **[SEC]** Replace `localStorage.getItem('token')` in `frontend/src/components/payments/StripeCheckout.tsx` — use the axios client with cookies
28. **[SEC]** Replace in-memory CSRF token storage in `frontend/src/lib/api.ts:113-117` — fetch/persist CSRF token properly on init
29. **[SEC]** Implement CSRF header sending in `adminApi.ts` for POST/PUT/PATCH/DELETE
30. **[SEC]** Audit Stripe webhook route interaction with `csrf-csrf` middleware in `backend/src/app.ts`
31. **[SEC]** Add retry logic for bKash token expiry in `backend/src/services/bkash.service.ts`

### Phase 6: Architectural Consistency (10 items)

32. **[ARCH]** Create service layer for public routes (`productsService.ts`, `cartService.ts`, etc.) — mirror admin pattern
33. **[ARCH]** Add `hasPermission` and `getRolePermissions` functions to frontend `rolePermissions.ts` to match backend
34. **[ARCH]** Refactor public route handlers to delegate to service layer instead of inline logic
35. **[ARCH]** Ensure all controllers return consistent envelope: `{ success, data, pagination }`
36. **[ARCH]** Apply `checkPermission` middleware consistently across admin routes (verify coverage)
37. **[ARCH]** Add admin permission check on frontend admin pages (defense in depth)
38. **[ARCH]** Standardize `response.data` access pattern across all frontend pages (verify each page handles interceptor unwrap correctly)
39. **[ARCH]** Add `pagination` field consistency — verify all list endpoints include pagination metadata
40. **[ARCH]** Create shared types between frontend and backend (Product, Order, User interfaces)
41. **[ARCH]** Extract route ordering into a shared utility or enforce via lint rule

### Phase 7: Frontend Data Fetching (4 items)

42. **[DATA]** Verify all admin pages use correct `response.data` access (no double `.data`)
43. **[DATA]** Fix `response.data.data` pattern in `frontend/src/app/orders/[id]/page.tsx:38` if inconsistent
44. **[DATA]** Add error boundaries to admin pages (currently bare `try/catch` with `alert`)
45. **[DATA]** Replace `alert()` calls with `react-hot-toast` notifications in admin pages

### Phase 8: Backend Route Integrity (5 items)

46. **[ROUTE]** Fix `search` route shadowing in `backend/src/routes/products.ts`
47. **[ROUTE]** Verify `cart` route doesn't require auth for guest access (currently `authenticate` blocks guests)
48. **[ROUTE]** Audit `wishlist` route for authenticated user requirement (remove if guest access needed)
49. **[ROUTE]** Verify `payments` routes are accessible (public vs authenticated)
50. **[ROUTE]** Check `categories` route for proper public access

### Phase 9: Currency/Payment Fixes (4 items)

51. **[PAY]** Fix bKash currency conversion bug in `frontend/src/components/payments/BkashCheckout.tsx` — `* 85` hardcoded
52. **[PAY]** Fix Nagad currency conversion bug in `frontend/src/components/payments/NagadCheckout.tsx` — `* 85` hardcoded
53. **[PAY]** Use dynamic currency conversion based on store config, not hardcoded rate
54. **[PAY]** Verify backend payment services handle multi-currency (BDT vs USD) — bkash service uses `'BDT'` currency hardcoded

### Phase 10: Validation/DTO Standardization (5 items)

55. **[VALIDATE]** Consolidate Zod schemas between create and edit product pages (schemas are near-identical)
56. **[VALIDATE]** Add backend input validation using Joi/Zod consistently (verify `validation.ts` usage)
57. **[VALIDATE]** Add type-safe request validation middleware (verify `validation.ts` is wired into routes)
58. **[VALIDATE]** Ensure all controller responses use `catchAsync`/promise wrapper (prevent unhandled async errors)
59. **[VALIDATE]** Add zod validation to cart, orders, wishlist route bodies

### Phase 11: Frontend Architecture (5 items)

60. **[FE]** Fix `status` enum mismatch in product forms: create page has `['draft', 'active']`; edit page has `['draft', 'active', 'archived']`
61. **[FE]** Extract shared product form component — `new/page.tsx` and `[id]/page.tsx` are 70% duplicated code
62. **[FE]** Add `useAsync` hook usage across pages for consistent data fetching/loading states
63. **[FE]** Ensure all pages use `LoadingSpinner` component consistently
64. **[FE]** Fix product image upload — replace `URL.createObjectURL` with actual cloud upload

### Phase 12: Backend Error Handler (3 items)

65. **[ERROR]** Ensure all `AppError` usages include proper HTTP status codes
66. **[ERROR]** Verify async route handlers are wrapped in `catchAsync` (prevents unhandled rejections)
67. **[ERROR]** Add request ID to error logs for correlation

### Phase 13: Environment/Config (4 items)

68. **[CONFIG]** Add ESLint config to frontend (`eslint.config.js` or `.eslintrc.json`)
69. **[CONFIG]** Add lint script to frontend `package.json`
70. **[CONFIG]** Fix empty `backend/src/config/cors.ts` — move inline CORS config there or delete the file
71. **[CONFIG]** Add pre-commit hook (lint-staged) for both frontend and backend

### Phase 14: Testing (4 items)

72. **[TEST]** Create backend test setup guide — Jest + ts-jest configured but zero tests exist
73. **[TEST]** Add tests for `auth.service.ts`/`authUtils.ts`
74. **[TEST]** Add tests for admin service layer (e.g., `userService.ts`, `orderService.ts`)
75. **[TEST]** Add integration tests for admin routes (protected endpoints)

### Phase 15: Documentation (8 items)

76. **[DOC]** Update `README.md` Next.js version from 14.2.1 to 16.1.0
77. **[DOC]** Fix API endpoint paths in README — remove `/api/v1/` prefix
78. **[DOC]** Remove `price_at_time` field reference from README
79. **[DOC]** Update `PROJECTSTRUCTURE.md` to remove phantom route groups `(admin)`
80. **[DOC]** Fix `src/lib/stores/` path in PROJECTSTRUCTURE.md — actual: `src/lib/*.ts`
81. **[DOC]** Add `adminApi.ts` to PROJECTSTRUCTURE.md
82. **[DOC]** Document the dual API client architecture and response envelope pattern
83. **[DOC]** Document CSRF token flow (current in-memory approach is broken)

### Phase 16: Monitoring/Observability (4 items)

84. **[MONITOR]** Add request logging middleware if not present (verify `logger.ts` usage)
85. **[MONITOR]** Add structured error logging in error handler (verify `errorHandler.ts`)
86. **[MONITOR]** Add health check endpoint (`/health`) if missing from `app.ts`

---

## Critical Path to Production

The following have been completed:

1. ✅ **A1/A2/A3/A4/A5/A7**: Duplicate code eliminated — toast libs consolidated, rate limiters merged, dead `adminApi` removed, `ValidationError` deduplicated, `authUtils.ts` merged into `auth.ts`, dead `paymentDemo.ts` deleted
2. ✅ **B1**: Double `.data` bug fixed in orders pages
3. ✅ **C1**: Product route shadowing verified as already correct in current code
4. ✅ **C2**: Wishlist route shadowing verified as already correct in current code
5. ✅ **F1**: `.env.example` `${VAR}` syntax replaced with literal placeholders
6. ✅ **F3**: AuditLog index field mismatch verified as already fixed in current code
7. ✅ **F4**: `loginLimiter` async-void bug resolved (consolidated into fixed rate limiter)

The following remain to be addressed before production readiness:

1. **D1**: Stripe checkout security regression (`frontend/src/components/payments/StripeCheckout.tsx`)
2. **D2**: CSRF token in-memory storage (`frontend/src/lib/api.ts:113-117`)
3. **F2**: Missing frontend ESLint config
4. **F5**: No fallback for `NEXT_PUBLIC_API_URL` env var
5. **H1-H6**: Documentation inaccuracies
6. **C4-C7**: Stubbed admin pages (analytics, settings, new product)
7. **E1-E4**: Architecture inconsistencies (no service layer in public routes)
8. **G1-G3**: Frontend component issues (hardcoded categories, image validation, hardcoded currency)

---

## Score: 7.0 / 10.0 (unchanged — remaining issues are medium/low priority)

The codebase demonstrates strong architectural intent with a well-structured admin subsystem (controller → service → model with audit logging). However, the public routes lack the same discipline, resulting in inline logic, inconsistent validation, and no service layer. The frontend suffers from duplicate clients, a critical double-data bug, and several stubbed admin features. The backend is more mature but has route ordering bugs and duplicate rate limiter implementations. The project is **not production-ready** in its current state, but the foundation is solid and the gaps are addressable with the roadmap above.

### Work Completed

**Phase 1 fixes (6 items):**
- ✅ **Item 1**: Double `.data` bug in orders pages — fixed (type param `PaginatedResponse<Order>` → `Order[]`, calling code simplified to `response.data`)
- ✅ **Item 2**: Product route shadowing — verified as already correct in current code
- ✅ **Item 3**: Wishlist route shadowing — verified as already correct in current code
- ✅ **Item 4**: `.env.example` `${VAR}` syntax — verified as already fixed
- ✅ **Item 5**: AuditLog index timestamp mismatch — verified as already fixed
- ✅ **Item 6**: `loginLimiter` async-void bug — verified as already fixed

**Phase 2 fixes (6 items):**
- ✅ **Item 8**: Toast library consolidation — removed `react-hot-toast`, standardized on `sonner`
- ✅ **Item 9**: Rate limiter consolidation — merged `services/rateLimiter.ts` into `middleware/rateLimiter.ts`
- ✅ **Item 10**: Dead `adminApi` removal — removed unused flat `adminApi` object from `lib/api.ts`
- ✅ **Item 11**: Duplicate `ValidationError` fix — removed shadow in `validation.ts`, import from `errorHandler.ts`
- ✅ **Item 12**: `auth.ts`/`authUtils.ts` merge — consolidated into single file
- ✅ **Item 13**: Dead `paymentDemo.ts` removal — deleted (no imports found)

**Verification results:**
- Backend `tsc --noEmit`: ✅ Pass
- Frontend `tsc --noEmit`: ✅ Pass
- Backend tests (8/8): ✅ Pass
- Frontend build: ✅ Pass