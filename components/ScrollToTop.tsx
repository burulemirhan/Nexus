import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from '../contexts/LenisContext';

/**
 * ScrollToTop Component
 * 
 * Ensures consistent scroll behavior on route changes:
 * - Scrolls to top by default when pathname changes
 * - If a hash anchor exists in the URL, scrolls to that element instead
 * - Uses Lenis smooth scrolling when available, falls back to native scroll
 * 
 * Root cause of previous issues:
 * - Used window.scrollTo which conflicts with Lenis scroll management
 * - Only watched pathname, not hash changes
 * - Browser scroll restoration interfered with SPA navigation
 */
const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();
  const { lenis } = useLenis();

  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is ready and avoid layout thrashing
    const rafId = requestAnimationFrame(() => {
      // Small delay to ensure Lenis instance is available (context might not be ready immediately)
      const scrollTimeout = setTimeout(() => {
        if (hash) {
          // If there's a hash, scroll to that element
          const element = document.querySelector(hash);
          if (element) {
            if (lenis) {
              lenis.scrollTo(element, { offset: 0, immediate: false });
            } else {
              // Fallback to native scroll if Lenis not available
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        } else {
          // No hash - scroll to top
          if (lenis) {
            lenis.scrollTo(0, { immediate: true });
          }
          // Always set native scroll as well for consistency
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }
      }, 50); // Small delay to ensure Lenis context is populated

      return () => clearTimeout(scrollTimeout);
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [pathname, hash, lenis]);

  return null;
};

export default ScrollToTop;
