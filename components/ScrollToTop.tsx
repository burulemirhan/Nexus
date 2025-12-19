import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  // Use useLayoutEffect to run synchronously before paint
  useLayoutEffect(() => {
    // Immediately reset scroll position on route change
    // Do this synchronously to prevent any visual scroll
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Also try to reset scroll on the main scrolling element
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTop = 0;
    }
    
    // Disable smooth scrolling temporarily to ensure instant scroll
    const originalScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Force scroll again
    window.scrollTo(0, 0);
    
    // Restore scroll behavior
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = originalScrollBehavior;
    }, 0);
  }, [pathname]);

  // Also use useEffect as a backup
  useEffect(() => {
    // Multiple attempts to ensure scroll resets
    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    
    resetScroll();
    requestAnimationFrame(resetScroll);
    setTimeout(resetScroll, 0);
    setTimeout(resetScroll, 10);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
