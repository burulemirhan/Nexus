# Scroll Navigation Fix - Root Cause Analysis

## Problem
Service page navigation was inconsistent - sometimes opening at the top, sometimes at the bottom. This caused poor UX and unpredictable behavior.

## Root Causes Identified

1. **ScrollToTop component used `window.scrollTo` which conflicts with Lenis**
   - Lenis manages scroll position via its own internal state
   - Using `window.scrollTo` directly bypasses Lenis, causing conflicts
   - Result: Scroll position was unpredictable

2. **Multiple Lenis instances created**
   - `App.tsx` created one Lenis instance
   - `ServicePage.tsx` created another Lenis instance
   - Result: Two competing scroll managers causing conflicts

3. **Browser scroll restoration not disabled globally**
   - Only disabled in `ServicePage.tsx`, not in the app entry point
   - Browser tried to restore scroll position on navigation
   - Result: Browser restoration competed with Lenis

4. **ScrollToTop only watched `pathname`, not `hash`**
   - Hash anchors weren't handled properly
   - Result: Hash navigation didn't work correctly

5. **Duplicate scroll reset logic**
   - Multiple `useEffect` hooks trying to reset scroll in `ServicePage.tsx`
   - Competing with global `ScrollToTop` component
   - Result: Race conditions and inconsistent behavior

## Solution Implemented

1. **Created centralized Lenis context** (`contexts/LenisContext.tsx`)
   - Single Lenis instance shared across entire app
   - Provides `useLenis()` hook for components to access Lenis
   - Initializes Lenis once at app root level

2. **Updated ScrollToTop to use Lenis**
   - Now uses `lenis.scrollTo()` instead of `window.scrollTo()`
   - Handles both `pathname` and `hash` changes
   - Scrolls to top by default, scrolls to element if hash exists
   - Falls back to native scroll if Lenis not available

3. **Disabled browser scroll restoration globally**
   - Set `history.scrollRestoration = 'manual'` in `index.tsx`
   - Prevents browser from interfering with SPA navigation

4. **Removed duplicate scroll logic**
   - Removed all Lenis initialization from `App.tsx` and `ServicePage.tsx`
   - Removed all duplicate scroll reset `useEffect` hooks
   - All scroll management now centralized in `ScrollToTop` component

5. **Consistent navigation**
   - All service buttons use `navigate()` from React Router
   - No raw `<a href>` tags for internal navigation
   - Scroll handled automatically by `ScrollToTop` on route change

## Files Changed

- `contexts/LenisContext.tsx` (new) - Centralized Lenis management
- `components/ScrollToTop.tsx` - Updated to use Lenis and handle hashes
- `index.tsx` - Added LenisProvider, disabled scroll restoration
- `App.tsx` - Removed Lenis initialization
- `pages/ServicePage.tsx` - Removed all duplicate scroll logic
- `components/Navbar.tsx` - Removed manual scroll call

## Testing

- Navigate between all 4 service pages - should always start at top
- Refresh page on service page - should start at top
- Use hash anchors (if any) - should scroll to element
- Browser back/forward - should maintain correct scroll position
