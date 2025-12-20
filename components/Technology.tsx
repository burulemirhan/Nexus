import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import AIDataFlow from './AIDataFlow';

const BASE_URL = import.meta.env.BASE_URL || '/';

const Technology: React.FC = () => {
  const { t } = useLanguage();

  const hardwarePlatforms = [
    {
      id: 'terra',
      name: t('tech.terra.name'),
      subtitle: t('tech.terra.subtitle'),
      accent: '#10b981', // Emerald
      image: 'terra.avif'
    },
    {
      id: 'aether',
      name: t('tech.aether.name'),
      subtitle: t('tech.aether.subtitle'),
      accent: '#f59e0b', // Amber
      image: 'aether.avif'
    },
    {
      id: 'oasis',
      name: t('tech.oasis.name'),
      subtitle: t('tech.oasis.subtitle'),
      accent: '#06b6d4', // Cyan
      image: 'oasis.avif'
    }
  ];

  const aiModules = [
    t('tech.intelligence.module1'),
    t('tech.intelligence.module2'),
    t('tech.intelligence.module3'),
    t('tech.intelligence.module4'),
  ];

  return (
    <section id="technology" className="relative bg-nexus-dark overflow-hidden py-16 md:py-24">
      <div className="w-full px-4 md:px-12 relative z-10 max-w-[90rem] mx-auto">
        
        {/* Main Title */}
        <h2 className="font-tesla font-bold text-2xl md:text-5xl text-white uppercase mb-12 md:mb-16 tracking-tight break-words text-center" style={{ fontFamily: 'Barlow', fontSize: 'clamp(1.5rem, 4vw, 3rem)', maxWidth: '100%', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
          {t('tech.title')}
        </h2>

        {/* Hardware Platforms Section */}
        <div className="mb-20 md:mb-32">
          <h3 className="font-mono font-bold text-sm md:text-base text-white/60 uppercase tracking-widest mb-8 md:mb-12" style={{ fontSize: '16px' }}>
            {t('tech.hardware.title')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {hardwarePlatforms.map((platform) => (
              <div key={platform.id} className="group relative">
                {/* Image Container */}
                <div className="relative aspect-video md:aspect-square overflow-hidden rounded-sm mb-4 bg-black/20">
                  <img 
                    src={`${BASE_URL}assets/images/${platform.image}`}
                    alt={`${platform.name} - ${platform.subtitle}`}
                    loading="lazy"
                    decoding="async"
                    className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      width: '100%',
                      height: '100%',
                      minWidth: '100%',
                      minHeight: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  {/* Accent border on hover */}
                  <div 
                    className="absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ borderColor: platform.accent }}
                  />
                </div>

                {/* Platform Info */}
                <div>
                  <h4 className="font-tesla font-bold text-xl md:text-2xl text-white mb-2 tracking-wide" style={{ fontFamily: 'Barlow' }}>
                    {platform.name}
                  </h4>
                  <p className="font-tech text-white/70 text-sm md:text-base" style={{ fontSize: '16px' }}>
                    {platform.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nexus Intelligence Section */}
        <div className="mt-20 md:mt-32">
          <h3 className="font-mono font-bold text-sm md:text-base text-white/60 uppercase tracking-widest mb-4 md:mb-6" style={{ fontSize: '16px' }}>
            {t('tech.intelligence.title')}
          </h3>
          
          <p className="font-tech text-white/70 text-base md:text-lg mb-12 md:mb-16 max-w-3xl" style={{ fontSize: '16px' }}>
            {t('tech.intelligence.description')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Left: Modules List */}
            <div className="space-y-6">
              <div className="font-mono text-xs md:text-sm text-white/40 uppercase tracking-widest mb-4" style={{ fontSize: '14px' }}>
                {t('tech.intelligence.modules')}
              </div>
              {aiModules.map((module, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="font-tech text-white/80 text-base md:text-lg" style={{ fontSize: '16px' }}>
                    {module}
                  </span>
                </div>
              ))}
            </div>

            {/* Right: Data Flow Animation */}
            <div className="relative aspect-square bg-black/20 rounded-sm overflow-hidden" style={{ minHeight: '400px' }}>
              <AIDataFlow />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Technology;
