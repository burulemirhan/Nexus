import React from 'react';
import { ArrowDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Hero: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section 
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-labelledby="hero-title"
    >
      
      <div className="absolute bottom-16 md:bottom-24 left-4 md:left-12 z-20 flex flex-col items-start gap-4 md:gap-6 pr-4 md:pr-0 max-w-[calc(100vw-2rem)] md:max-w-none">
        
        <h1 
          id="hero-title"
          className="font-tesla font-bold text-2xl md:text-6xl text-white uppercase tracking-wide md:tracking-wider drop-shadow-2xl leading-[1.1] md:leading-[0.9] break-words hyphens-auto" 
          style={{ 
            fontFamily: 'Barlow', 
            fontSize: 'clamp(1.5rem, 4vw, 3.75rem)',
            maxWidth: '100%',
            wordWrap: 'break-word',
            overflowWrap: 'break-word'
          }}
        >
          {t('hero.title')}
        </h1>

        <p className="font-tech text-white/80 text-base md:text-xl leading-relaxed drop-shadow-md md:whitespace-nowrap" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>
          {t('hero.subtitle')}
        </p>

        <div className="flex items-center gap-4 md:gap-6 pt-2 md:pt-4">
          <a 
            href="#technology" 
            className="group relative px-6 md:px-8 py-3 md:py-3 border border-white/30 hover:border-white active:border-white transition-all duration-300 rounded-lg touch-manipulation"
            aria-label={t('hero.button')}
            style={{ minHeight: '44px', display: 'inline-flex', alignItems: 'center' }}
          >
            <span className="relative z-10 font-display text-sm md:text-sm uppercase tracking-widest font-bold text-white transition-colors" style={{ boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.15)', fontSize: '16px' }}>
              {t('hero.button')}
            </span>
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 right-10 animate-pulse z-20 hidden md:block" aria-hidden="true">
        <ArrowDown className="text-white/40 w-8 h-8" />
      </div>

    </section>
  );
};

export default Hero;
