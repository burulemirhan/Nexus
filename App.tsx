import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Manifesto from './components/Manifesto';
import Technology from './components/Technology';
import Engineering from './components/Engineering';
import DefenseSpace from './components/DefenseSpace';
import Services from './components/Services';
import Footer from './components/Footer';
import SEOHead from './components/SEOHead';
import { preloadImage } from './utils/preloadAssets';
import Lenis from 'lenis';

const BASE_URL = import.meta.env.BASE_URL || '/';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Preload poster image only (much faster than video)
  useEffect(() => {
    // Load poster image in background, don't block render
    preloadImage(`${BASE_URL}assets/images/bg.png`).catch(() => {
      // Silently fail - poster is just a fallback
    });
  }, []);

  // Update HTML lang attribute based on route (memoized)
  const htmlLang = useMemo(() => 
    location.pathname.startsWith('/en') ? 'en' : 'tr',
    [location.pathname]
  );

  useEffect(() => {
    document.documentElement.lang = htmlLang;
  }, [htmlLang]);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href?.startsWith('#')) {
          e.preventDefault();
          const element = document.querySelector(href);
          if (element) {
            lenis.scrollTo(element, { offset: 0 });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      lenis.destroy();
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden selection:bg-nexus-copper selection:text-white font-tech text-white">
      <SEOHead />
      
      {/* Global Background Video (Vertical Farming Theme) */}
      <div className="fixed inset-0 z-0 select-none overflow-hidden bg-nexus-dark" aria-hidden="true">
        <div className="absolute inset-0 w-full h-full">
          {/* Poster image shown immediately */}
          <img 
            src={`${BASE_URL}assets/images/bg.png`}
            alt=""
            className="absolute inset-0 w-full h-full object-cover -z-50"
            aria-hidden="true"
            loading="eager"
            fetchPriority="high"
          />
          {/* Video loads asynchronously in background */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover -z-50 opacity-0 transition-opacity duration-1000"
            poster={`${BASE_URL}assets/images/bg.png`}
            aria-hidden="true"
            onLoadedData={(e) => {
              // Fade in video once loaded
              e.currentTarget.classList.remove('opacity-0');
              e.currentTarget.classList.add('opacity-100');
            }}
          >
            <source src={`${BASE_URL}assets/videos/bg.mp4`} type="video/mp4" />
          </video>
        </div>

        {/* Heavy Overlay for Dark Theme */}
        <div className="absolute inset-0 bg-nexus-dark/45 mix-blend-multiply" />
        
        {/* Static Noise Overlay (Optimized) */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }} 
        />
      </div>
      
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      <main className="flex-grow z-10 flex flex-col" role="main">
        <Hero />
        <Manifesto />
        <Technology />
        <Engineering />
        <DefenseSpace />
        <Services />
      </main>

      <Footer />
    </div>
  );
};

export default React.memo(App);
