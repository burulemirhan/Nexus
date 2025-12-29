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
import Preloader from './components/Preloader';
import Lenis from 'lenis';

// @ts-ignore - Vite provides BASE_URL via import.meta.env
const BASE_URL = import.meta.env.BASE_URL || '/';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const [backgroundFadeOpacity, setBackgroundFadeOpacity] = useState(0.45);
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const manifestoRef = useRef<HTMLElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // Update HTML lang attribute based on route
  useEffect(() => {
    const htmlLang = location.pathname.startsWith('/en') ? 'en' : 'tr';
    document.documentElement.lang = htmlLang;
  }, [location.pathname]);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling with performance optimizations
    const lenis = new Lenis({
      duration: 0.95, // Balanced speed
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.7, // Optimized for smoother scrolling
      touchMultiplier: 1.5, // Balanced touch scrolling for mobile
      infinite: false,
      syncTouch: true, // Better touch sync
      syncTouchLerp: 0.085, // Balanced touch lerp
    });

    lenisRef.current = lenis;

    // Function to update background fade opacity based on scroll position
    const updateFadeOpacity = () => {
      const hero = heroRef.current;
      const manifesto = manifestoRef.current;
      
      if (!hero || !manifesto) {
        return;
      }

      // Use window.scrollY for real-time scroll position (Lenis updates this)
      // Reading in RAF loop ensures smooth, synchronized updates
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const heroTop = hero.offsetTop;
      const manifestoTop = manifesto.offsetTop;
      const manifestoHeight = manifesto.offsetHeight;
      const manifestoMiddle = manifestoTop + manifestoHeight / 2;

      // Calculate fade start (beginning of Hero) and fade end (middle of Manifesto)
      const fadeStart = heroTop;
      const fadeEnd = manifestoMiddle;

      // Calculate progress (0 at fadeStart, 1 at fadeEnd)
      let progress = 0;
      if (scrollY >= fadeStart && scrollY <= fadeEnd) {
        progress = (scrollY - fadeStart) / (fadeEnd - fadeStart);
      } else if (scrollY > fadeEnd) {
        progress = 1;
      }

      // Clamp progress between 0 and 1
      progress = Math.max(0, Math.min(1, progress));

      // Set opacity (0 = start fade at 45%, 1 = completely dark at 100%)
      // We want to fade from 45% opacity to 100% opacity
      // At progress 0: 45% opacity
      // At progress 1: 100% opacity
      // Formula: startOpacity + (endOpacity - startOpacity) * progress
      const startOpacity = 0.45;
      const endOpacity = 1.0;
      const totalOpacity = startOpacity + (endOpacity - startOpacity) * progress;
      setBackgroundFadeOpacity(totalOpacity);
    };

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      // Update fade opacity immediately after Lenis updates scroll
      // This ensures perfect synchronization with smooth scrolling
      updateFadeOpacity();
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Initial calculation after a short delay to ensure elements are rendered
    const timeoutId = setTimeout(() => {
      updateFadeOpacity();
    }, 100);

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href?.startsWith('#')) {
          e.preventDefault();
          const element = document.querySelector(href) as HTMLElement;
          if (element) {
            lenis.scrollTo(element, { offset: 0 });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    // Also listen to window resize to recalculate positions
    window.addEventListener('resize', updateFadeOpacity, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      lenis.destroy();
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('resize', updateFadeOpacity);
    };
  }, []);



  // Performance: Setup and cleanup video event listeners properly
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Setup video properties
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.controls = false;
    video.preload = 'metadata';
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('playsinline', 'true');
    video.removeAttribute('controls');
    video.style.pointerEvents = 'none';
    video.style.outline = 'none';
    video.style.position = 'absolute';
    video.style.top = '50%';
    video.style.left = '50%';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.minWidth = '100%';
    video.style.minHeight = '100%';
    video.style.objectFit = 'cover';
    video.style.transform = 'translate(-50%, -50%) translateZ(0)';
    video.style.willChange = 'transform';

    // Performance: Remove willChange after video loads
    const removeWillChange = () => {
      video.style.willChange = 'auto';
    };
    video.addEventListener('loadeddata', removeWillChange, { once: true });

    // Ensure video plays and stays playing
    const ensurePlaying = () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
    };

    const handleEnded = () => {
      video.play().catch(() => {});
    };

    // Try to play immediately
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const tryPlay = () => {
          video.play().catch(() => {});
          document.removeEventListener('touchstart', tryPlay);
          document.removeEventListener('click', tryPlay);
        };
        document.addEventListener('touchstart', tryPlay, { once: true });
        document.addEventListener('click', tryPlay, { once: true });
      });
    }

    // Add event listeners
    video.addEventListener('pause', ensurePlaying);
    video.addEventListener('ended', handleEnded);

    // Cleanup function
    return () => {
      video.removeEventListener('pause', ensurePlaying);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadeddata', removeWillChange);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden selection:bg-nexus-copper selection:text-white font-tech text-white">
      {showPreloader && (
        <Preloader 
          onDone={() => setShowPreloader(false)}
          minDuration={2000}
        />
      )}
      <SEOHead />
      
      {/* Global Background Video (Vertical Farming Theme) */}
      <div className="fixed inset-0 z-0 select-none overflow-hidden bg-nexus-dark" aria-hidden="true">
        <div className="absolute inset-0 w-full h-full">
          <video 
            ref={(video) => {
              if (video) {
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
                video.controls = false;
                // Performance: Use metadata preload to avoid decoding full video on page load
                video.preload = 'metadata';
                video.setAttribute('webkit-playsinline', 'true');
                video.setAttribute('playsinline', 'true');
                video.removeAttribute('controls');
                video.style.pointerEvents = 'none';
                video.style.outline = 'none';
                // Safari fix for object-cover
                video.style.position = 'absolute';
                video.style.top = '50%';
                video.style.left = '50%';
                video.style.width = '100%';
                video.style.height = '100%';
                video.style.minWidth = '100%';
                video.style.minHeight = '100%';
                video.style.objectFit = 'cover';
                // Performance: GPU acceleration for video (already composited, this is fine)
                video.style.transform = 'translate(-50%, -50%) translateZ(0)';
                
                // Performance: Remove willChange after video loads to reduce compositing layer overhead
                const removeWillChange = () => {
                  video.style.willChange = 'auto';
                  video.removeEventListener('loadeddata', removeWillChange);
                };
                video.style.willChange = 'transform';
                video.addEventListener('loadeddata', removeWillChange);
                
                // Ensure video plays and stays playing
                const ensurePlaying = () => {
                  if (video.paused) {
                    video.play().catch(() => {});
                  }
                };
                
                const handleEnded = () => {
                  video.play().catch(() => {});
                };
                
                // Try to play immediately
                const playPromise = video.play();
                if (playPromise !== undefined) {
                  playPromise.catch(() => {
                    // Auto-play was prevented, try again on user interaction
                    const tryPlay = () => {
                      video.play().catch(() => {});
                      document.removeEventListener('touchstart', tryPlay);
                      document.removeEventListener('click', tryPlay);
                    };
                    document.addEventListener('touchstart', tryPlay, { once: true });
                    document.addEventListener('click', tryPlay, { once: true });
                  });
                }
                
                // Performance: Store listeners for cleanup
                video.addEventListener('pause', ensurePlaying);
                video.addEventListener('ended', handleEnded);
                
                // Store video ref for cleanup
                videoRef.current = video;
              }
            }}
            controls={false}
            autoPlay 
            loop 
            muted 
            playsInline
            className="object-cover -z-50"
            aria-hidden="true"
          >
            <source src={`${BASE_URL}assets/videos/bg.mp4`} type="video/mp4" />
             {/* Fallback stock video of vertical farming/technology */}
             <source src="https://videos.pexels.com/video-files/5427845/5427845-uhd_2560_1440_24fps.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Dynamic Scroll-based Fade Overlay */}
        {/* Fades from 45% opacity (at Hero start) to 100% opacity (at middle of Manifesto) */}
        {/* No CSS transition - updates directly in RAF loop for real-time sync */}
        <div 
          className="absolute inset-0 bg-nexus-dark"
          style={{ 
            opacity: backgroundFadeOpacity,
            pointerEvents: 'none',
            willChange: 'opacity'
          }} 
        />
        
        {/* Performance: Removed mix-blend-overlay - expensive GPU compositing operation */}
        {/* Static Noise Overlay (Optimized - blend mode removed) */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }} 
        />
      </div>
      
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      <main className="flex-grow z-10 flex flex-col" role="main">
        <Hero ref={heroRef} />
        <Manifesto ref={manifestoRef} />
        <Technology />
        <Engineering />
        <DefenseSpace />
        <Services />
      </main>

      <Footer />
    </div>
  );
};

export default App;
