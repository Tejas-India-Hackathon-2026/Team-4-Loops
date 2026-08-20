# Walkthrough - Role-Aware SETU Logo Navigation & Local Vendor Dashboard

We have implemented role-aware SETU logo navigation across the platform and introduced a dedicated, high-accessibility dashboard for local product/handicraft vendors.

## 1. Summary of Changes

### Central Routing Logic (`getHomeRouteForRole`)
Centralized in [`apps/web/src/utils/navigation.ts`](file:///c:/Users/ayank/Downloads/download/SETU-1/apps/web/src/utils/navigation.ts):
- **Admin** (`role === 'ADMIN'`) $\rightarrow$ `/admin` (Platform Management Console)
- **Hotel / Restaurant Vendor** (`role === 'VENDOR'` with `businessType` matching Hotel/Stay/Restaurant) $\rightarrow$ `/vendor/dashboard` (Detailed vendor dashboard)
- **Local / Handicraft Vendor** (`role === 'VENDOR'` with `businessType` for crafts/products/transport) $\rightarrow$ `/vendor/local-dashboard` (Simplified, high-touch accessibility dashboard)
- **Tourist / Guest** (`role === 'TOURIST'` or unauthenticated) $\rightarrow$ `/` (Public Homepage)

---

## 2. Modified & Created Files

### New Files Created:
1. [`apps/web/src/utils/navigation.ts`](file:///c:/Users/ayank/Downloads/download/SETU-1/apps/web/src/utils/navigation.ts)
   - Contains `getHomeRouteForRole(user)` and `isHotelOrRestaurantVendor(businessType)`.
2. [`apps/web/src/pages/vendor/LocalVendorDashboardPage.tsx`](file:///c:/Users/ayank/Downloads/download/SETU-1/apps/web/src/pages/vendor/LocalVendorDashboardPage.tsx)
   - High-accessibility, clean local vendor dashboard tailored for low digital literacy with large touch targets, clear status indicators, helpline shortcuts, catalog management, and profile editing.

### Existing Files Modified:
1. [`apps/api/src/controllers/authController.ts`](file:///c:/Users/ayank/Downloads/download/SETU-1/apps/api/src/controllers/authController.ts)
   - Included `businessType` in `user.vendor` response object for `/auth/login` and `/auth/me`.
2. [`apps/web/src/types/index.ts`](file:///c:/Users/ayank/Downloads/download/SETU-1/apps/web/src/types/index.ts)
   - Updated `User` interface to include `businessType?: string` on `user.vendor`.
3. [`apps/web/src/components/layout/Header.tsx`](file:///c:/Users/ayank/Downloads/download/SETU-1/apps/web/src/components/layout/Header.tsx)
   - Replaced static logo link `<Link to="/">` with `<Link to={getHomeRouteForRole(user)}>`.
4. [`apps/web/src/components/layout/MobileDrawer.tsx`](file:///c:/Users/ayank/Downloads/download/SETU-1/apps/web/src/components/layout/MobileDrawer.tsx)
   - Replaced static logo and vendor drawer links with `getHomeRouteForRole(user)`.
5. [`apps/web/src/routes/AppRoutes.tsx`](file:///c:/Users/ayank/Downloads/download/SETU-1/apps/web/src/routes/AppRoutes.tsx)
   - Registered `/vendor/local-dashboard` route.

---

## 3. Code Diff Highlights

### Central Helper ([`navigation.ts`](file:///c:/Users/ayank/Downloads/download/SETU-1/apps/web/src/utils/navigation.ts))
```typescript
export function getHomeRouteForRole(user: User | null): string {
  if (!user) return '/';

  switch (user.role) {
    case 'ADMIN':
      return '/admin';
    case 'VENDOR': {
      const bType = user.vendor?.businessType;
      if (isHotelOrRestaurantVendor(bType)) {
        return '/vendor/dashboard';
      }
      return '/vendor/local-dashboard';
    }
    case 'TOURIST':
    default:
      return '/';
  }
}
```

### Header Integration ([`Header.tsx`](file:///c:/Users/ayank/Downloads/download/SETU-1/apps/web/src/components/layout/Header.tsx))
```tsx
const homeRoute = getHomeRouteForRole(user);

// Logo Link
<Link to={homeRoute} className="...">
  <span>SETU</span>
</Link>
```

---

## 4. Verification

Executed both frontend and backend builds cleanly:
- `npm run build` in `apps/web` $\rightarrow$ `✓ built in 5.43s`
- `npm run build` in `apps/api` $\rightarrow$ `tsc` exited with code 0
