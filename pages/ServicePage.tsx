import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import Preloader from '../components/Preloader';
import { useLanguage } from '../contexts/LanguageContext';

const BASE_URL = import.meta.env.BASE_URL || '/';

interface ServicePageProps {
  titleKey: string;
  subtitleKey: string;
  descriptionKey: string;
  featuresKey: string[];
  processKey: string[];
  customBackground?: 'white' | 'default';
  heroBackgroundImage?: string;
  featureImages?: string[]; // Array of image paths for features section
  featureImagesMap?: Record<string, string>; // Map of feature key to image path for individual feature sections
  centerFeatures?: boolean; // Center align features section
  hideCTATitle?: boolean; // Hide CTA section title and subtitle
}

const ServicePage: React.FC<ServicePageProps> = ({ 
  titleKey, 
  subtitleKey, 
  descriptionKey, 
  featuresKey,
  processKey,
  customBackground = 'default',
  heroBackgroundImage,
  featureImages,
  featureImagesMap,
  centerFeatures = false,
  hideCTATitle = false
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  // Lenis is now managed globally - no need for local ref

  // Helper function to prepend BASE_URL to paths starting with /
  const getAssetPath = (path: string | undefined): string | undefined => {
    if (!path) return path;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    // If BASE_URL is '/', just return the path as-is if it starts with /
    if (BASE_URL === '/') {
      return path.startsWith('/') ? path : `/${path}`;
    }
    // Otherwise, prepend BASE_URL
    if (path.startsWith('/')) return `${BASE_URL}${path.substring(1)}`;
    return `${BASE_URL}${path}`;
  };

  // Reset preloader when route changes
  useEffect(() => {
    setShowPreloader(true);
  }, [location.pathname]);

  // Update HTML lang attribute based on route
  useEffect(() => {
    const htmlLang = location.pathname.startsWith('/en') ? 'en' : 'tr';
    document.documentElement.lang = htmlLang;
  }, [location.pathname]);

  // Scroll management is now handled globally by ScrollToTop component
  // No need for duplicate scroll logic here

  const isWhiteBackground = customBackground === 'white';
  const textColorClass = isWhiteBackground ? 'text-black' : 'text-white';
  const selectionClass = isWhiteBackground ? 'selection:bg-nexus-copper selection:text-black' : 'selection:bg-nexus-copper selection:text-white';

  return (
    <div className={`min-h-screen flex flex-col relative overflow-x-hidden ${selectionClass} font-tech ${textColorClass}`}>
      <SEOHead 
        titleKey={titleKey} 
        descriptionKey={subtitleKey}
        image={heroBackgroundImage}
      />
      
      {/* Global Background */}
      {isWhiteBackground ? (
        <div className="fixed inset-0 z-0 select-none overflow-hidden bg-white" />
      ) : (
        <div className="fixed inset-0 z-0 select-none overflow-hidden bg-nexus-dark" style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
          <div className="absolute inset-0 w-full h-full">
            <video 
              ref={(video) => {
                if (video) {
                  video.muted = true;
                  video.loop = true;
                  video.playsInline = true;
                  video.controls = false;
                  video.setAttribute('webkit-playsinline', 'true');
                  video.setAttribute('playsinline', 'true');
                  video.removeAttribute('controls');
                  video.style.pointerEvents = 'none';
                  video.style.outline = 'none';
                  // Performance optimizations
                  video.style.transform = 'translateZ(0)';
                  video.style.willChange = 'auto';
                  video.style.contain = 'strict';
                  
                  // Ensure video plays and stays playing
                  const ensurePlaying = () => {
                    if (video.paused) {
                      video.play().catch(() => {});
                    }
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
                  
                  // Continuously ensure video is playing
                  video.addEventListener('pause', ensurePlaying);
                  video.addEventListener('ended', () => video.play());
                }
              }}
              controls={false}
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover -z-50"
              poster={getAssetPath(`${BASE_URL}assets/images/bg.avif`)}
              style={{ pointerEvents: 'none', outline: 'none' }}
            >
              <source src={getAssetPath(`${BASE_URL}assets/videos/bg.mp4`)} type="video/mp4" />
              <source src="https://videos.pexels.com/video-files/5427845/5427845-uhd_2560_1440_24fps.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="absolute inset-0 bg-nexus-dark/45 mix-blend-multiply" />
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }} 
          />
        </div>
      )}
      
      {showPreloader && (
        <Preloader 
          onDone={() => setShowPreloader(false)}
          minDuration={2000}
        />
      )}
      
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} darkMode={isWhiteBackground} />
      
      <main className="flex-grow z-10 flex flex-col">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-start justify-center overflow-hidden pt-20">
          {heroBackgroundImage && (
            <div className="absolute inset-0 z-0">
              <img 
                src={getAssetPath(heroBackgroundImage)}
                alt=""
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </div>
          )}
          <div className="w-full px-4 md:px-12 relative z-10 flex flex-col items-center justify-start min-h-full pt-12 md:pt-16">
            <div className="max-w-[90rem] mx-auto w-full text-center px-2 md:px-0">
              <h1 className={`font-tesla font-bold text-2xl md:text-6xl ${isWhiteBackground ? 'text-black' : 'text-white'} uppercase tracking-wide md:tracking-wider ${isWhiteBackground ? '' : 'drop-shadow-2xl'} leading-[1.1] md:leading-[0.9] break-words hyphens-auto`} style={{ fontFamily: 'Barlow', fontSize: 'clamp(1.5rem, 4vw, 3.75rem)', maxWidth: '100%', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                {t(titleKey)}
              </h1>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={`relative ${featureImagesMap ? 'py-20 md:py-52' : 'py-16 md:py-40'} ${isWhiteBackground ? 'bg-white' : 'bg-nexus-dark/50 backdrop-blur-sm'}`}>
          <div className="w-full px-4 md:px-12 relative z-10">
            <div className="max-w-[90rem] mx-auto w-full">
              <h2 className={`font-tesla font-bold text-2xl md:text-5xl ${isWhiteBackground ? 'text-black' : 'text-white'} uppercase mb-8 md:mb-12 tracking-tight ${centerFeatures ? 'text-center' : ''} break-words`} style={{ fontFamily: 'Barlow', fontSize: 'clamp(1.5rem, 4vw, 3rem)', maxWidth: '100%', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                {t('servicePage.features')}
              </h2>
              
              {featureImagesMap ? (
                // Individual feature sections with images
                <div className="space-y-20 md:space-y-28">
                  {featuresKey.map((key, index) => {
                    const featureImage = featureImagesMap[key];
                    return (
                      <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-12 ${centerFeatures ? 'text-center' : ''}`}>
                        {/* Image */}
                        {featureImage && (
                          <div className="w-full md:w-1/2">
                            <div className="relative w-full aspect-video md:aspect-square overflow-hidden rounded-lg">
                              <img 
                                src={getAssetPath(featureImage)} 
                                alt={t(`${key}.title`)}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                        {/* Content */}
                        <div className={`w-full md:w-1/2 ${centerFeatures ? 'text-center' : ''}`}>
                          <h3 className={`font-tesla font-bold text-xl md:text-3xl ${isWhiteBackground ? 'text-black' : 'text-white'} mb-3 md:mb-6 tracking-wide`} style={{ fontFamily: 'Barlow', fontSize: 'clamp(1.25rem, 4vw, 1.875rem)' }}>
                            {t(`${key}.title`)}
                          </h3>
                          <p className={`${isWhiteBackground ? 'text-black/70' : 'text-white/70'} text-base md:text-lg font-light leading-relaxed ${centerFeatures ? 'max-w-2xl mx-auto' : ''}`} style={{ fontSize: '16px' }}>
                            {t(`${key}.desc`)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : featureImages && featureImages.length > 0 ? (
                <div className="space-y-12">
                  {/* First Feature with Images */}
                  <div className="text-center">
                      <h3 className={`font-tesla font-bold text-xl md:text-2xl ${isWhiteBackground ? 'text-black' : 'text-white'} mb-4 md:mb-6 tracking-wide`} style={{ fontFamily: 'Barlow', fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>
                      {t(`${featuresKey[0]}.title`)}
                    </h3>
                    <p className={`${isWhiteBackground ? 'text-black/70' : 'text-white/70'} text-base md:text-base font-light leading-relaxed mb-6 md:mb-8 max-w-3xl mx-auto`} style={{ fontSize: '16px' }}>
                      {t(`${featuresKey[0]}.desc`)}
                    </p>
                    {/* Images Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                      {featureImages.map((img, index) => (
                        <div key={index} className="relative w-full aspect-video overflow-hidden rounded-lg">
                          <img 
                            src={getAssetPath(img)} 
                            alt={`Feature ${index + 1}`}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Other Features in a Row */}
                  <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 ${centerFeatures ? 'text-center' : ''}`}>
                    {featuresKey.slice(1).map((key, index) => (
                      <div key={index} className={`border ${isWhiteBackground ? 'border-black/10 bg-white' : 'border-white/10 bg-black/40'} p-6 md:p-8 ${isWhiteBackground ? 'hover:bg-gray-100' : 'hover:bg-white/5'} transition-colors ${centerFeatures ? 'text-center' : ''}`}>
                        <h3 className={`font-tesla font-bold text-xl md:text-2xl ${isWhiteBackground ? 'text-black' : 'text-white'} mb-3 tracking-wide`} style={{ fontFamily: 'Barlow' }}>
                          {t(`${key}.title`)}
                        </h3>
                        <p className={`${isWhiteBackground ? 'text-black/70' : 'text-white/70'} text-sm md:text-base font-light leading-relaxed ${centerFeatures ? 'mx-auto max-w-md' : ''}`}>
                          {t(`${key}.desc`)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${centerFeatures ? 'text-center' : ''}`}>
                  {featuresKey.map((key, index) => (
                    <div key={index} className={`border ${isWhiteBackground ? 'border-black/10 bg-white' : 'border-white/10 bg-black/40'} p-6 md:p-8 ${isWhiteBackground ? 'hover:bg-gray-100' : 'hover:bg-white/5'} transition-colors ${centerFeatures ? 'text-center' : ''}`}>
                      <h3 className={`font-tesla font-bold text-xl md:text-2xl ${isWhiteBackground ? 'text-black' : 'text-white'} mb-3 tracking-wide`} style={{ fontFamily: 'Barlow' }}>
                        {t(`${key}.title`)}
                      </h3>
                      <p className={`${isWhiteBackground ? 'text-black/70' : 'text-white/70'} text-sm md:text-base font-light leading-relaxed ${centerFeatures ? 'mx-auto max-w-md' : ''}`}>
                        {t(`${key}.desc`)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className={`relative py-24 ${isWhiteBackground ? 'bg-gray-100' : 'bg-black/30'}`}>
          <div className="w-full px-6 md:px-12 relative z-10">
            <div className="max-w-[90rem] mx-auto w-full">
              <h2 className={`font-tesla font-bold text-3xl md:text-5xl ${isWhiteBackground ? 'text-black' : 'text-white'} uppercase mb-12 tracking-tight`} style={{ fontFamily: 'Barlow' }}>
                {t('servicePage.process')}
              </h2>
              
              <div className="space-y-6">
                {processKey.map((key, index) => (
                  <div key={index} className={`flex gap-6 border-b ${isWhiteBackground ? 'border-black/10' : 'border-white/10'} pb-6`}>
                    <span className={`font-mono ${isWhiteBackground ? 'text-emerald-600' : 'text-emerald-500'} text-sm md:text-base flex-shrink-0 w-12`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <h3 className={`font-tesla font-bold text-lg md:text-xl ${isWhiteBackground ? 'text-black' : 'text-white'} mb-2 tracking-wide`} style={{ fontFamily: 'Barlow' }}>
                        {t(`${key}.title`)}
                      </h3>
                      <p className={`${isWhiteBackground ? 'text-black/70' : 'text-white/70'} text-sm md:text-base font-light leading-relaxed`}>
                        {t(`${key}.desc`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={`relative ${hideCTATitle ? 'py-12 md:py-16' : 'py-16 md:py-24'} ${isWhiteBackground ? 'bg-gray-50' : 'bg-nexus-dark/50 backdrop-blur-sm'}`}>
          <div className="w-full px-4 md:px-12 relative z-10">
            <div className="max-w-[90rem] mx-auto w-full text-center">
              {!hideCTATitle && (
                <>
                  <h2 className={`font-tesla font-bold text-2xl md:text-5xl ${isWhiteBackground ? 'text-black' : 'text-white'} uppercase mb-4 md:mb-6 tracking-tight break-words px-2 md:px-0`} style={{ fontFamily: 'Barlow', fontSize: 'clamp(1.5rem, 4vw, 3rem)', maxWidth: '100%', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                    {t('servicePage.ctaTitle')}
                  </h2>
                  <p className={`${isWhiteBackground ? 'text-black/70' : 'text-white/70'} text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto`} style={{ fontSize: '16px' }}>
                    {t('servicePage.ctaDesc')}
                  </p>
                </>
              )}
              <button
                onClick={() => setIsContactOpen(true)}
                className={`px-8 md:px-12 py-3.5 md:py-3.5 bg-transparent ${isWhiteBackground ? 'text-black border border-black/60 hover:bg-black hover:text-white active:bg-black/90' : 'text-white border border-white/60 hover:bg-white hover:text-black active:bg-white/90'} transition-all duration-300 rounded-lg font-display font-bold uppercase tracking-widest touch-manipulation`}
                style={{ minHeight: '44px', fontSize: '16px' }}
              >
                {t('services.button')}
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Contact Modal */}
      {isContactOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setIsContactOpen(false)}
        >
          <div
            className="relative w-full max-w-sm mx-4 rounded-lg bg-black/90 border border-white/10 px-6 py-6 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-white/40 hover:text-white active:text-white text-lg touch-manipulation"
              onClick={() => setIsContactOpen(false)}
              aria-label="Close contact details"
              style={{ minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ✕
            </button>
            <h3 className="font-tesla font-bold text-xl md:text-2xl mb-4 tracking-wide" style={{ fontFamily: 'Barlow' }}>
              {t('services.button')}
            </h3>
            <div className="space-y-3 text-sm md:text-base font-mono">
              <div>
                <span className="text-white/40 mr-2">E-mail:</span>
                <a href="mailto:info@nexusbiotech.org" className="text-white hover:underline">
                  info@nexusbiotech.org
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePage;
