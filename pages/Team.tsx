import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import Preloader from '../components/Preloader';
import { useLanguage } from '../contexts/LanguageContext';
import Lenis from 'lenis';

const BASE_URL = import.meta.env.BASE_URL || '/';

const Team: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const lenisRef = useRef<Lenis | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Helper function to prepend BASE_URL to paths starting with /
  const getAssetPath = (path: string | undefined): string | undefined => {
    if (!path) return path;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (BASE_URL === '/') {
      return path.startsWith('/') ? path : `/${path}`;
    }
    if (path.startsWith('/')) return `${BASE_URL}${path.substring(1)}`;
    return `${BASE_URL}${path}`;
  };

  // Prevent browser scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  // Reset preloader when route changes
  useEffect(() => {
    setShowPreloader(true);
  }, [location.pathname]);

  useLayoutEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  useEffect(() => {
    const htmlLang = location.pathname.startsWith('/en') ? 'en' : 'tr';
    document.documentElement.lang = htmlLang;
  }, [location.pathname]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.95,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.7,
      touchMultiplier: 1.5,
      infinite: false,
      syncTouch: true,
      syncTouchLerp: 0.085,
    });

    lenisRef.current = lenis;
    lenis.scrollTo(0, { immediate: true });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

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
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      lenis.destroy();
      lenisRef.current = null;
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  // Setup video background
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

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

    const removeWillChange = () => {
      video.style.willChange = 'auto';
    };
    video.addEventListener('loadeddata', removeWillChange, { once: true });

    const ensurePlaying = () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
    };

    const handleEnded = () => {
      video.play().catch(() => {});
    };

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

    video.addEventListener('pause', ensurePlaying);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('pause', ensurePlaying);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadeddata', removeWillChange);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden selection:bg-nexus-copper selection:text-white font-tech text-white">
      <SEOHead 
        titleKey="team.title" 
        descriptionKey="team.subtitle"
      />
      
      {/* Global Background */}
      <div className="fixed inset-0 z-0 select-none overflow-hidden bg-nexus-dark">
        <div className="absolute inset-0 w-full h-full">
          <video 
            ref={videoRef}
            controls={false}
            autoPlay 
            loop 
            muted 
            playsInline
            className="object-cover -z-50"
            poster={getAssetPath(`${BASE_URL}assets/images/bg.avif`)}
            style={{ 
              pointerEvents: 'none', 
              outline: 'none',
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100%',
              height: '100%',
              minWidth: '100%',
              minHeight: '100%',
              transform: 'translate(-50%, -50%) translateZ(0)',
              objectFit: 'cover'
            }}
          >
            <source src={getAssetPath(`${BASE_URL}assets/videos/bg.mp4`)} type="video/mp4" />
            <source src="https://videos.pexels.com/video-files/5427845/5427845-uhd_2560_1440_24fps.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 bg-nexus-dark/50" />
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }} 
        />
      </div>
      
      {showPreloader && (
        <Preloader 
          onDone={() => setShowPreloader(false)}
          minDuration={2000}
        />
      )}
      
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      <main className="flex-grow z-10 flex flex-col">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
          <div className="w-full px-4 md:px-12 relative z-10 flex flex-col items-center justify-center min-h-full py-12 md:py-16">
            <div className="max-w-4xl mx-auto w-full px-2 md:px-0 relative">
              {/* Blurry background box */}
              <div className="absolute inset-0 bg-black/50 backdrop-blur-md rounded-lg -z-10" />
              
              {/* Content */}
              <div className="relative z-10 p-8 md:p-12">
                <h1 className="font-tesla font-bold text-3xl md:text-5xl text-white uppercase tracking-wide md:tracking-wider leading-[1.1] md:leading-[0.9] break-words mb-6 md:mb-8 text-center" style={{ fontFamily: 'Barlow', fontSize: 'clamp(1.875rem, 4vw, 3rem)', maxWidth: '100%', wordWrap: 'break-word', overflowWrap: 'break-word', fontWeight: '700' }}>
                  {t('team.title')}
                </h1>
                <div className="space-y-5 text-white text-lg md:text-xl font-medium leading-relaxed text-center max-w-3xl mx-auto" style={{ fontWeight: '500' }}>
                  <p className="drop-shadow-lg">{t('team.intro')}</p>
                  <p className="drop-shadow-lg">{t('team.intro2')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Team;

