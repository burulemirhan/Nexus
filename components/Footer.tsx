import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <footer
      id="contact"
      className="relative z-10 text-white bg-gradient-to-b from-nexus-dark/50 to-black py-6"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="w-full px-4 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 py-4">
        <nav className="flex gap-6 text-sm md:text-sm text-white/60 font-display uppercase tracking-widest" aria-label="Footer navigation links" style={{ fontSize: '16px' }}>
          <a 
            href={location.pathname.startsWith('/en') ? '/en/team' : '/ekip'} 
            onClick={(e) => {
              e.preventDefault();
              navigate(location.pathname.startsWith('/en') ? '/en/team' : '/ekip');
            }}
            className="hover:text-white active:text-white transition-colors touch-manipulation"
            style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}
          >
            {t('nav.team')}
          </a>
          <a 
            href="#" 
            className="hover:text-white active:text-white transition-colors touch-manipulation"
            aria-label="Follow us on X (Twitter)"
            rel="noopener noreferrer"
            style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}
          >
            X
          </a>
          <a 
            href="#" 
            className="hover:text-white active:text-white transition-colors touch-manipulation"
            aria-label="Follow us on Instagram"
            rel="noopener noreferrer"
            style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}
          >
            INSTAGRAM
          </a>
        </nav>
        <div className="text-sm md:text-sm text-white/60 font-display uppercase tracking-widest text-center md:text-right" style={{ fontSize: '16px' }}>
          <span itemScope itemType="https://schema.org/Organization">
            <span itemProp="name">NEXUS BIOTECHNOLOGIES</span>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
