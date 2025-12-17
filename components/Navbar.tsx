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
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (isMenuOpen || currentScrollY < 10) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
    <nav 
      className={`fixed top-2 md:top-3 left-0 w-full z-50 transition-opacity duration-300 ease-out will-change-opacity ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
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
             className={`font-tesla font-bold text-3xl md:text-[34px] tracking-wider ${darkMode ? 'text-black' : 'text-white drop-shadow-md'} hover:opacity-80 transition-opacity cursor-pointer`}
           >
             NEXUS
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
          className={`md:hidden p-2 ${darkMode ? 'text-black' : 'text-white'}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={`md:hidden absolute top-0 left-0 w-full h-screen ${darkMode ? 'bg-white/95 backdrop-blur-md' : 'bg-nexus-dark/92 backdrop-blur-md'} p-6 flex flex-col justify-center gap-6 text-base font-tesla tracking-widest uppercase animate-in slide-in-from-top-5 z-50 ${darkMode ? 'text-black' : 'text-white'}`}>
           <button className={`absolute top-6 right-6 ${darkMode ? 'text-black' : 'text-white'}`} onClick={() => setIsMenuOpen(false)}>
             <X className="w-7 h-7" />
           </button>
           <a href="#vizyon" onClick={() => setIsMenuOpen(false)} className={darkMode ? "text-black/70 hover:text-black transition-colors" : "text-white/70 hover:text-white transition-colors"}>{t('nav.vision.mobile')}</a>
           <a href="#technology" onClick={() => setIsMenuOpen(false)} className={darkMode ? "text-black/70 hover:text-black transition-colors" : "text-white/70 hover:text-white transition-colors"}>{t('nav.technology.mobile')}</a>
           <a href="#engineering" onClick={() => setIsMenuOpen(false)} className={darkMode ? "text-black/70 hover:text-black transition-colors" : "text-white/70 hover:text-white transition-colors"}>{t('nav.articles.mobile')}</a>
           <a href="#defense" onClick={() => setIsMenuOpen(false)} className={darkMode ? "text-black/70 hover:text-black transition-colors" : "text-white/70 hover:text-white transition-colors"}>{t('nav.defense.mobile')}</a>
           <a href="#services" onClick={() => setIsMenuOpen(false)} className={darkMode ? "text-black/70 hover:text-black transition-colors" : "text-white/70 hover:text-white transition-colors"}>{t('nav.services.mobile')}</a>
           <a href="#contact" onClick={() => setIsMenuOpen(false)} className={darkMode ? "text-black/70 hover:text-black transition-colors" : "text-white/70 hover:text-white transition-colors"}>{t('nav.contact.mobile')}</a>
           
           {/* Mobile Language Dropdown */}
           <div className={`relative mt-7 pt-7 border-t ${darkMode ? 'border-black/10' : 'border-white/10'}`} ref={mobileLangRef}>
             <button
               onClick={() => setIsLangOpen((o) => !o)}
               className={`flex items-center justify-center gap-2 w-full px-3 py-2 text-sm ${darkMode ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white'} transition-colors`}
             >
               {language.toUpperCase()}
               <ChevronDown className={`w-4 h-4 transition-transform ${isLangOpen ? 'rotate-180' : ''} ${darkMode ? 'text-black/70' : 'text-white/70'}`} />
             </button>
             {isLangOpen && (
               <div className={`mt-2 ${darkMode ? 'bg-white/95 backdrop-blur-md border border-black/20' : 'bg-black/85 backdrop-blur-md border border-white/10'} rounded-md overflow-hidden`}>
                 <button
                   onClick={() => {
                     handleLanguageChange('tr');
                     setIsMenuOpen(false);
                   }}
                   className={`w-full px-4 py-2 text-left text-sm transition-colors ${
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
                   className={`w-full px-4 py-2 text-left text-sm transition-colors ${
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
      )}
    </nav>
  );
};

export default Navbar;