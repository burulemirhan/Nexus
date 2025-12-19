import React, { useState, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const BASE_URL = import.meta.env.BASE_URL || '/';

const Technology: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);

  const technologies = useMemo(() => [
  {
    id: 'oasis',
    name: 'OASIS',
      subtitle: t('tech.oasis.subtitle'),
      description: t('tech.oasis.description'),
    accent: '#06b6d4', // Cyan
      details: t('tech.oasis.details')
  },
  {
    id: 'aether',
    name: 'AETHER',
      subtitle: t('tech.aether.subtitle'),
      description: t('tech.aether.description'),
    accent: '#f59e0b', // Amber
      details: t('tech.aether.details')
  },
  {
    id: 'terra',
    name: 'TERRA',
      subtitle: t('tech.terra.subtitle'),
      description: t('tech.terra.description'),
    accent: '#10b981', // Emerald
      details: t('tech.terra.details')
  }
  ], [t]);

  const activeTech = technologies[activeTab];

  return (
    <section id="technology" className="min-h-screen flex flex-col justify-center py-24 relative bg-nexus-dark overflow-hidden">
       {/* Background Subtle Gradient */}
       <div className="absolute inset-0 bg-gradient-to-br from-black via-nexus-dark to-black" />
       
       <div className="w-full px-6 md:px-12 relative z-10 flex flex-col h-full max-w-[90rem] mx-auto justify-center">
          
          {/* Header Row: Title Left, Tabs Right */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-4 mb-12">
             <h2 className="font-mono font-bold text-sm md:text-base text-white/60 uppercase tracking-widest mb-6 md:mb-0">
                {t('tech.systemArchitecture')}
             </h2>

             <div className="flex items-center gap-8 md:gap-16 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                {technologies.map((tech, index) => (
                  <button 
                    key={tech.id}
                    onClick={() => setActiveTab(index)}
                    className={`relative font-tesla text-lg md:text-xl uppercase tracking-wider transition-all duration-300 pb-2 md:pb-4 whitespace-nowrap outline-none ${
                      activeTab === index ? 'text-white' : 'text-white/30 hover:text-white/60'
                    }`}
                    style={{ fontFamily: 'Barlow' }}
                  >
                    {tech.name}
                    {activeTab === index && (
                      <span 
                        className="absolute bottom-0 left-0 w-full h-[2px] transition-all duration-300"
                        style={{ backgroundColor: tech.accent, boxShadow: `0 0 15px ${tech.accent}` }} 
                      />
                    )}
                  </button>
                ))}
             </div>
          </div>

          {/* Content Area */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center h-full">
             
             {/* Left Column: Text Info - Width Reduced to 4/12 (33%) */}
             <div className="w-full md:w-4/12 flex flex-col items-start space-y-6 animate-in slide-in-from-left-8 fade-in duration-700" key={`text-${activeTech.id}`}>
                <div className="space-y-2">
                   <h3 className="font-mono font-bold text-[10px] md:text-xs text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{backgroundColor: activeTech.accent}}></span>
                      {t('tech.prototype')}: {activeTech.id.toUpperCase()}
                   </h3>
                   {/* Title size reduced */}
                   <h1 className="font-tesla font-bold text-5xl md:text-6xl text-white leading-none tracking-normal" style={{ fontFamily: 'Barlow' }}>
                      {activeTech.name}
                   </h1>
                </div>

                <div className="h-[1px] w-16 bg-white/10" />

                {/* Paragraph size reduced */}
                <p className="font-tech text-white/70 text-sm md:text-base font-light leading-relaxed max-w-lg">
                   {activeTech.description}
                </p>

                <div className="pt-2">
                   <span className="inline-block py-2 px-3 border border-white/10 rounded font-mono text-[10px] md:text-xs text-white/80 uppercase tracking-widest" 
                         style={{ color: activeTech.accent, borderColor: `${activeTech.accent}40` }}>
                      {activeTech.details}
                   </span>
                </div>
                
                <button className="group mt-6 flex items-center gap-4 text-white hover:text-emerald-400 transition-colors">
                  <span className="font-display uppercase tracking-widest text-xs md:text-sm font-bold border-b border-transparent group-hover:border-emerald-400 pb-1">
                    {t('tech.comingSoon')}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </button>
             </div>

             {/* Right Column: Image - Width Increased to 8/12 (66%) */}
             <div className="w-full md:w-8/12 relative aspect-video md:h-[600px] flex items-center justify-center bg-transparent rounded-sm overflow-hidden group">
                {/* Decoration corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/20 z-20" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/20 z-20" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/20 z-20" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/20 z-20" />

                 {/* Image Content */}
                 <div className="relative w-full h-full animate-in zoom-in-95 fade-in duration-1000" key={`img-${activeTech.id}`}>
                    <img 
                        src={`${BASE_URL}assets/images/${activeTech.id}.png`} 
                        alt={`${activeTech.name} - ${activeTech.subtitle}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500 scale-105 group-hover:scale-100 transition-transform duration-700"
                    />
                    
                    {/* Noise Overlay for Consistency */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
                 </div>
             </div>

          </div>

       </div>
    </section>
  );
};

export default Technology;