import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  useLanguage(); // keep hook usage consistent even if we don't show text now
  
  return (
    <footer
      id="contact"
      className="relative z-10 text-white bg-gradient-to-b from-nexus-dark/50 to-black py-6"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="w-full px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <nav className="flex gap-6 text-xs md:text-sm text-white/60 font-display uppercase tracking-widest" aria-label="Social media links">
          <a 
            href="#" 
            className="hover:text-white transition-colors"
            aria-label="Follow us on X (Twitter)"
            rel="noopener noreferrer"
          >
            X
          </a>
          <a 
            href="#" 
            className="hover:text-white transition-colors"
            aria-label="Follow us on Instagram"
            rel="noopener noreferrer"
          >
            INSTAGRAM
          </a>
        </nav>
        <div className="text-xs md:text-sm text-white/60 font-display uppercase tracking-widest text-center md:text-right">
          <span itemScope itemType="https://schema.org/Organization">
            <span itemProp="name">NEXUS BIOTECHNOLOGIES</span>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
