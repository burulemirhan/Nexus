import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import IntelligenceAnimation from './IntelligenceAnimation';

const Technology: React.FC = () => {
  const { t } = useLanguage();

  const hardwarePlatforms = [
    {
      name: t('tech.terra.name'),
      description: t('tech.terra.description'),
    },
    {
      name: t('tech.aether.name'),
      description: t('tech.aether.description'),
    },
    {
      name: t('tech.oasis.name'),
      description: t('tech.oasis.description'),
    },
  ];

  const intelligenceModules = [
    t('tech.intelligence.module1'),
    t('tech.intelligence.module2'),
    t('tech.intelligence.module3'),
    t('tech.intelligence.module4'),
  ];

  return (
    <section id="technology" className="min-h-screen flex flex-col justify-center py-16 md:py-24 relative bg-nexus-dark overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-nexus-dark to-black" />
      
      <div className="w-full px-4 md:px-12 relative z-10 flex flex-col h-full max-w-[90rem] mx-auto justify-center space-y-20 md:space-y-32">
        
        {/* Title */}
        <h2 className="font-tesla font-bold text-2xl md:text-5xl text-white uppercase tracking-tight break-words text-center" style={{ fontFamily: 'Barlow', fontSize: 'clamp(1.5rem, 4vw, 3rem)', maxWidth: '100%', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
          {t('tech.title')}
        </h2>

        {/* Hardware Platforms Section */}
        <div className="space-y-8 md:space-y-12">
          <h3 className="font-mono font-bold text-xs md:text-base text-white/60 uppercase tracking-widest" style={{ fontSize: '16px' }}>
            {t('tech.hardware.title')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {hardwarePlatforms.map((platform, index) => (
              <div key={index} className="border-t border-white/10 pt-6 md:pt-8">
                <h4 className="font-tesla font-bold text-2xl md:text-4xl text-white mb-3 md:mb-4 tracking-wide" style={{ fontFamily: 'Barlow', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}>
                  {platform.name}
                </h4>
                <p className="text-white/70 text-base md:text-lg font-light leading-relaxed" style={{ fontSize: '16px' }}>
                  {platform.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Nexus Intelligence Section */}
        <div className="space-y-8 md:space-y-12">
          <div className="space-y-4 md:space-y-6">
            <h3 className="font-mono font-bold text-xs md:text-base text-white/60 uppercase tracking-widest" style={{ fontSize: '16px' }}>
              {t('tech.intelligence.title')}
            </h3>
            
            <p className="text-white/70 text-base md:text-lg font-light leading-relaxed max-w-3xl" style={{ fontSize: '16px' }}>
              {t('tech.intelligence.subtitle')}
            </p>
          </div>

          {/* Animation Area */}
          <div className="w-full h-[400px] md:h-[500px] relative bg-black/20 rounded-sm border border-white/10 overflow-hidden">
            <IntelligenceAnimation />
          </div>

          {/* Modules List */}
          <div className="space-y-3 md:space-y-4">
            <h4 className="font-mono font-bold text-xs md:text-sm text-white/60 uppercase tracking-widest" style={{ fontSize: '14px' }}>
              {t('tech.intelligence.modules')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {intelligenceModules.map((module, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-white/80 text-sm md:text-base font-light" style={{ fontSize: '16px' }}>
                    {module}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Technology;
