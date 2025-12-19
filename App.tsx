import React, { useState, useEffect, useRef } from 'react';
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
import LoadingScreen from './components/LoadingScreen';
import Lenis from 'lenis';

const BASE_URL = import.meta.env.BASE_URL || '/';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const videoLoadedRef = useRef(false);

  // Update HTML lang attribute based on route
  useEffect(() => {
    const htmlLang = location.pathname.startsWith('/en') ? 'en' : 'tr';
    document.documentElement.lang = htmlLang;
  }, [location.pathname]);

  // Track video loading
  const handleVideoReady = () => {
    videoLoadedRef.current = true;
    setVideoLoaded(true);
  };

  // Load critical assets and track loading state
  useEffect(() => {
    setIsLoading(true);
    videoLoadedRef.current = false;
    setVideoLoaded(false);
    
    const assetsToLoad: Promise<void>[] = [];
    
    // Preload critical images from Technology section
    const criticalImages = [
      `${BASE_URL}assets/images/oasis.png`,
      `${BASE_URL}assets/images/aether.png`,
      `${BASE_URL}assets/images/terra.png`,
    ];
    
    criticalImages.forEach(src => {
      const imgLoadPromise = new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Continue even if image fails
        img.src = src;
      });
      assetsToLoad.push(imgLoadPromise);
    });
    
    // Wait for video to load (polling check)
    const videoLoadPromise = new Promise<void>((resolve) => {
      const maxWait = 10000; // Max 10 seconds
      const startTime = Date.now();
      const checkVideo = setInterval(() => {
        if (videoLoadedRef.current || Date.now() - startTime > maxWait) {
          clearInterval(checkVideo);
          resolve();
        }
      }, 100);
    });
    assetsToLoad.push(videoLoadPromise);
    
    // Wait for all critical assets to load, with minimum display time for animation
    const minDisplayTime = new Promise(resolve => setTimeout(resolve, 1500)); // Minimum 1.5s for animation
    
    Promise.all([
      Promise.all(assetsToLoad),
      minDisplayTime
    ]).then(() => {
      setIsLoading(false);
    });
  }, [location.pathname]);

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
      {isLoading && <LoadingScreen />}
      <div className={isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100 transition-opacity duration-500'}>
        <SEOHead />
        
        {/* Global Background Video (Vertical Farming Theme) */}
        <div className="fixed inset-0 z-0 select-none overflow-hidden bg-nexus-dark" aria-hidden="true">
        <div className="absolute inset-0 w-full h-full">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            preload="auto"
            className={`w-full h-full object-cover -z-50 transition-opacity duration-500 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
            aria-hidden="true"
            onLoadedData={handleVideoReady}
            onCanPlay={handleVideoReady}
            onCanPlayThrough={handleVideoReady}
          >
            <source src={`${BASE_URL}assets/videos/bg.mp4`} type="video/mp4" />
             {/* Fallback stock video of vertical farming/technology */}
             <source src="https://videos.pexels.com/video-files/5427845/5427845-uhd_2560_1440_24fps.mp4" type="video/mp4" />
          </video>
          {/* Fallback background while video loads */}
          {!videoLoaded && (
            <div className="absolute inset-0 bg-nexus-dark -z-40" />
          )}
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
    </div>
  );
};

export default App;
