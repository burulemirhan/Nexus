import React, { useEffect, useState, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  darkMode?: boolean; // When true, uses black text for white backgrounds
}

const Navbar: React.FC<NavbarProps> = ({ isMenuOpen, setIsMenuOpen, darkMode = false }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const desktopLangRef = useRef<HTMLDivElement>(null);
  const mobileLangRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language, setLanguage } = useLanguage();

  useEffect(() => {
    let rafId: number | null = null;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      
      if (isMenuOpen || currentScrollY < 10) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
            ticking = false;
        return;
      }

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
          ticking = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isMenuOpen]);

  // Close lang dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedInsideDesktop = desktopLangRef.current?.contains(target);
      const clickedInsideMobile = mobileLangRef.current?.contains(target);
      if (!clickedInsideDesktop && !clickedInsideMobile) {
        setIsLangOpen(false);
      }
    };
    if (isLangOpen) {
      document.addEventListener('mousedown', handler);
    }
    return () => document.removeEventListener('mousedown', handler);
  }, [isLangOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleLanguageChange = (lang: 'tr' | 'en') => {
    setLanguage(lang);
    setIsLangOpen(false);
    
    // Service page route mapping (using decoded paths for TR routes)
    const serviceRoutes: Record<string, { tr: string; en: string }> = {
      '/mühendislik-çözümleri': { tr: '/mühendislik-çözümleri', en: '/en/engineering-solutions' },
      '/en/engineering-solutions': { tr: '/mühendislik-çözümleri', en: '/en/engineering-solutions' },
      '/anahtar-teslim-projeler': { tr: '/anahtar-teslim-projeler', en: '/en/turnkey-projects' },
      '/en/turnkey-projects': { tr: '/anahtar-teslim-projeler', en: '/en/turnkey-projects' },
      '/savunma-sanayi-projeleri': { tr: '/savunma-sanayi-projeleri', en: '/en/defense-industry-projects' },
      '/en/defense-industry-projects': { tr: '/savunma-sanayi-projeleri', en: '/en/defense-industry-projects' },
      '/danışmanlık-ve-proje-yönetimi': { tr: '/danışmanlık-ve-proje-yönetimi', en: '/en/consulting-and-project-management' },
      '/en/consulting-and-project-management': { tr: '/danışmanlık-ve-proje-yönetimi', en: '/en/consulting-and-project-management' },
    };
    
    // Use decoded pathname so TR routes with special chars match correctly
    const rawPath = location.pathname;
    const decodedPath = decodeURIComponent(rawPath);
    const serviceRoute = serviceRoutes[decodedPath] || serviceRoutes[rawPath];
    
    if (serviceRoute) {
      // Navigate to the same service page in the other language
      navigate(lang === 'en' ? serviceRoute.en : serviceRoute.tr);
    } else {
      // Navigate to main page
      if (lang === 'en') {
        navigate('/en');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <>
    <nav 
      className={`fixed top-2 md:top-3 left-0 w-full z-50 transition-opacity duration-300 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } ${isMenuOpen ? 'md:opacity-100' : ''}`}
      style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
    >
      <div className="w-full px-4 md:px-8 h-16 md:h-18 flex items-center justify-between">
        <div className="flex items-center gap-2 pt-1">
           {/* Logo - Using Tesla Font */}
           <button
             onClick={() => {
               const basePath = location.pathname.startsWith('/en') ? '/en' : '/';
               navigate(basePath);
               window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
             }}
             className={`font-tesla font-bold tracking-wider ${darkMode ? 'text-black' : 'text-white drop-shadow-md'} hover:opacity-80 transition-opacity cursor-pointer`}
             style={{ fontSize: '2.65625rem', lineHeight: '1' }}
           >
             E
           </button>
        </div>

        {/* Desktop Menu */}
        <div className={`hidden md:flex items-center gap-7 px-7 py-2 ${darkMode ? 'bg-white/80 backdrop-blur-sm border border-black/15' : 'bg-black/18 backdrop-blur-sm border border-white/15'} rounded-lg text-[11px] md:text-xs font-display font-bold tracking-widest uppercase ${darkMode ? 'text-black' : 'text-white'} shadow-lg`}>
          <a href="#vizyon" className={darkMode ? "text-black/70 hover:text-black transition-colors" : "text-white/70 hover:text-white transition-colors"}>{t('nav.vision')}</a>
          <a href="#technology" className={darkMode ? "text-black/70 hover:text-black transition-colors" : "text-white/70 hover:text-white transition-colors"}>{t('nav.technology')}</a>
          <a href="#engineering" className={darkMode ? "text-black/70 hover:text-black transition-colors" : "text-white/70 hover:text-white transition-colors"}>{t('nav.articles')}</a>
          <a href="#defense" className={darkMode ? "text-black/70 hover:text-black transition-colors" : "text-white/70 hover:text-white transition-colors"}>{t('nav.defense')}</a>
          <a href="#services" className={darkMode ? "text-black/70 hover:text-black transition-colors" : "text-white/70 hover:text-white transition-colors"}>{t('nav.services')}</a>
          <a href="#contact" className={darkMode ? "text-black/70 hover:text-black transition-colors" : "text-white/70 hover:text-white transition-colors"}>{t('nav.contact')}</a>
          
          {/* Language Switcher */}
          <div className={`relative ml-3 pl-3 border-l ${darkMode ? 'border-black/10' : 'border-white/10'}`} ref={desktopLangRef}>
            <button
              onClick={() => setIsLangOpen((o) => !o)}
              className={`flex items-center gap-1 px-2 py-1 text-[11px] md:text-xs ${darkMode ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white'} transition-colors`}
            >
              {language.toUpperCase()}
              <ChevronDown className={`w-3 h-3 transition-transform ${isLangOpen ? 'rotate-180' : ''} ${darkMode ? 'text-black/70' : 'text-white/70'}`} />
            </button>
            {isLangOpen && (
              <div className={`absolute top-full right-0 mt-1 ${darkMode ? 'bg-white/95 backdrop-blur-md border border-black/20' : 'bg-black/85 backdrop-blur-md border border-white/10'} rounded-md shadow-lg overflow-hidden min-w-[66px]`}>
                <button
                  onClick={() => handleLanguageChange('tr')}
                  className={`w-full px-3 py-[7px] text-[10px] text-left transition-colors ${
                    language === 'tr'
                      ? darkMode ? 'text-black bg-black/10' : 'text-white bg-white/10'
                      : darkMode ? 'text-black/70 hover:text-black hover:bg-black/5' : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  TR
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`w-full px-3 py-[7px] text-[10px] text-left transition-colors ${
                    language === 'en'
                      ? darkMode ? 'text-black bg-black/10' : 'text-white bg-white/10'
                      : darkMode ? 'text-black/70 hover:text-black hover:bg-black/5' : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  EN
                </button>
              </div>
            )}
          </div>
        </div>

        <button 
          className={`md:hidden p-3 ${darkMode ? 'text-black' : 'text-white'} touch-manipulation`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          style={{ minHeight: '44px', minWidth: '44px' }}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
    </nav>

    {/* Mobile Menu - Full Screen Popup - Outside nav to cover entire screen */}
      {isMenuOpen && (
      <div 
        className={`md:hidden fixed ${darkMode ? 'bg-white' : 'bg-nexus-dark'} z-[9999] flex flex-col`}
        style={{ 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          width: '100vw', 
          height: '100vh',
          margin: 0,
          padding: 0,
          position: 'fixed',
          zIndex: 9999
        }}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4 md:p-6">
          <button 
            className={`p-3 ${darkMode ? 'text-black' : 'text-white'} touch-manipulation`}
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
             <X className="w-7 h-7" />
           </button>
        </div>

        {/* Menu Items - Centered */}
        <div className="flex-1 flex flex-col justify-center items-center gap-6 px-6">
          <a 
            href="#vizyon" 
            onClick={() => setIsMenuOpen(false)} 
            className={`text-xs font-display font-bold tracking-widest uppercase ${darkMode ? "text-black/70 hover:text-black active:text-black" : "text-white/70 hover:text-white active:text-white"} transition-colors touch-manipulation`}
            style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}
          >
            {t('nav.vision')}
          </a>
          <a 
            href="#technology" 
            onClick={() => setIsMenuOpen(false)} 
            className={`text-xs font-display font-bold tracking-widest uppercase ${darkMode ? "text-black/70 hover:text-black active:text-black" : "text-white/70 hover:text-white active:text-white"} transition-colors touch-manipulation`}
            style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}
          >
            {t('nav.technology')}
          </a>
          <a 
            href="#engineering" 
            onClick={() => setIsMenuOpen(false)} 
            className={`text-xs font-display font-bold tracking-widest uppercase ${darkMode ? "text-black/70 hover:text-black active:text-black" : "text-white/70 hover:text-white active:text-white"} transition-colors touch-manipulation`}
            style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}
          >
            {t('nav.articles')}
          </a>
          <a 
            href="#defense" 
            onClick={() => setIsMenuOpen(false)} 
            className={`text-xs font-display font-bold tracking-widest uppercase ${darkMode ? "text-black/70 hover:text-black active:text-black" : "text-white/70 hover:text-white active:text-white"} transition-colors touch-manipulation`}
            style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}
          >
            {t('nav.defense')}
          </a>
          <a 
            href="#services" 
            onClick={() => setIsMenuOpen(false)} 
            className={`text-xs font-display font-bold tracking-widest uppercase ${darkMode ? "text-black/70 hover:text-black active:text-black" : "text-white/70 hover:text-white active:text-white"} transition-colors touch-manipulation`}
            style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}
          >
            {t('nav.services')}
          </a>
          <a 
            href="#contact" 
            onClick={() => setIsMenuOpen(false)} 
            className={`text-xs font-display font-bold tracking-widest uppercase ${darkMode ? "text-black/70 hover:text-black active:text-black" : "text-white/70 hover:text-white active:text-white"} transition-colors touch-manipulation`}
            style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}
          >
            {t('nav.contact')}
          </a>
           
          {/* Mobile Language Switcher */}
          <div className={`mt-8 pt-8 border-t ${darkMode ? 'border-black/10' : 'border-white/10'} w-full flex flex-col items-center`} ref={mobileLangRef}>
             <button
               onClick={() => setIsLangOpen((o) => !o)}
              className={`flex items-center justify-center gap-2 px-4 py-3 text-xs font-display font-bold tracking-widest uppercase ${darkMode ? 'text-black/70 hover:text-black active:text-black' : 'text-white/70 hover:text-white active:text-white'} transition-colors touch-manipulation`}
              style={{ minHeight: '44px' }}
             >
               {language.toUpperCase()}
               <ChevronDown className={`w-4 h-4 transition-transform ${isLangOpen ? 'rotate-180' : ''} ${darkMode ? 'text-black/70' : 'text-white/70'}`} />
             </button>
             {isLangOpen && (
              <div className={`mt-3 ${darkMode ? 'bg-white/95 backdrop-blur-md border border-black/20' : 'bg-black/85 backdrop-blur-md border border-white/10'} rounded-md overflow-hidden`}>
                 <button
                   onClick={() => {
                     handleLanguageChange('tr');
                     setIsMenuOpen(false);
                   }}
                  className={`w-full px-4 py-3 text-left text-xs font-display font-bold tracking-widest uppercase transition-colors touch-manipulation ${
                     language === 'tr'
                      ? darkMode ? 'text-black bg-black/10' : 'text-white bg-white/10'
                       : darkMode ? 'text-black/70 hover:text-black hover:bg-black/5' : 'text-white/70 hover:text-white hover:bg-white/5'
                   }`}
                 >
                   TR
                 </button>
                 <button
                   onClick={() => {
                     handleLanguageChange('en');
                     setIsMenuOpen(false);
                   }}
                  className={`w-full px-4 py-3 text-left text-xs font-display font-bold tracking-widest uppercase transition-colors touch-manipulation ${
                     language === 'en'
                      ? darkMode ? 'text-black bg-black/10' : 'text-white bg-white/10'
                       : darkMode ? 'text-black/70 hover:text-black hover:bg-black/5' : 'text-white/70 hover:text-white hover:bg-white/5'
                   }`}
                 >
                   EN
                 </button>
               </div>
             )}
          </div>
           </div>
        </div>
      )}
    </>
  );
};

export default Navbar;