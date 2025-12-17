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
      
      <div className="absolute bottom-24 left-6 md:left-12 z-20 flex flex-col items-start gap-6">
        
        <h1 
          id="hero-title"
          className="font-tesla font-bold text-4xl md:text-6xl text-white uppercase tracking-wider drop-shadow-2xl leading-[0.9]" 
          style={{ fontFamily: 'Barlow' }}
        >
          {t('hero.title')}
        </h1>

        <p className="font-tech text-white/80 text-lg md:text-xl leading-relaxed drop-shadow-md whitespace-nowrap">
          {t('hero.subtitle')}
        </p>

        <div className="flex items-center gap-6 pt-4">
          <a 
            href="#technology" 
            className="group relative px-8 py-3 border border-white/30 hover:border-white transition-all duration-300 rounded-lg"
            aria-label={t('hero.button')}
          >
            <span className="relative z-10 font-display text-sm uppercase tracking-widest font-bold text-white transition-colors" style={{ boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.15)' }}>
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
