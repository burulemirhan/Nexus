import React, { useState, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import DataFlowAnimation from './DataFlowAnimation';

const BASE_URL = import.meta.env.BASE_URL || '/';

const Technology: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'ai' | 'hardware'>('hardware');

  const technologies = useMemo(() => [
    {
      id: 'oasis',
      name: t('tech.oasis.name'),
      subtitle: t('tech.oasis.subtitle'),
      description: t('tech.oasis.description'),
      accent: '#06b6d4', // Cyan
      details: t('tech.oasis.details')
    },
    {
      id: 'aether',
      name: t('tech.aether.name'),
      subtitle: t('tech.aether.subtitle'),
      description: t('tech.aether.description'),
      accent: '#f59e0b', // Amber
      details: t('tech.aether.details')
    },
    {
      id: 'terra',
      name: t('tech.terra.name'),
      subtitle: t('tech.terra.subtitle'),
      description: t('tech.terra.description'),
      accent: '#10b981', // Emerald
      details: t('tech.terra.details')
    },
    {
      id: 'ecodome',
      name: t('tech.ecodome.name'),
      subtitle: t('tech.ecodome.subtitle'),
      description: t('tech.ecodome.description'),
      accent: '#8b5cf6', // Purple
      details: t('tech.ecodome.details')
    }
  ], [t]);

  const aiLayers = useMemo(() => [
    {
      title: t('tech.ai.layer1.title'),
      description: t('tech.ai.layer1.desc'),
    },
    {
      title: t('tech.ai.layer2.title'),
      description: t('tech.ai.layer2.desc'),
    },
    {
      title: t('tech.ai.layer3.title'),
      description: t('tech.ai.layer3.desc'),
    },
    {
      title: t('tech.ai.layer4.title'),
      description: t('tech.ai.layer4.desc'),
    },
  ], [t]);

  return (
    <section id="technology" className="flex flex-col justify-center py-12 md:py-16 pb-20 md:pb-24 relative bg-nexus-dark overflow-visible">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-nexus-dark to-black" />
      
      <div className="w-full px-6 md:px-12 relative z-10 flex flex-col h-full max-w-[90rem] mx-auto justify-center">
         
         {/* Header Row: Title Left, Tabs Right */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-4 mb-4 md:mb-8">
            <h2 className="font-tesla font-bold text-xl md:text-5xl text-white uppercase tracking-tight break-words mb-3 md:mb-0" style={{ fontFamily: 'Barlow', fontSize: 'clamp(1.25rem, 4vw, 3rem)', maxWidth: '100%', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
               {t('tech.title')}
            </h2>

            <div className="flex items-center gap-4 md:gap-16 w-full md:w-auto">
               <button 
                 onClick={() => setActiveTab('hardware')}
                 className={`relative font-tesla font-bold text-base md:text-xl uppercase tracking-normal transition-[color,opacity] duration-300 pb-2 md:pb-4 whitespace-nowrap outline-none touch-manipulation flex-1 md:flex-none ${
                   activeTab === 'hardware' ? 'text-white' : 'text-white/30 active:text-white/60'
                 }`}
                 style={{ fontFamily: 'Barlow', minHeight: '44px', fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
               >
                 {t('tech.hardware.tab')}
                 {activeTab === 'hardware' && (
                   <span 
                     className="absolute bottom-0 left-0 w-full h-[2px] transition-all duration-300 bg-emerald-500"
                     style={{ boxShadow: '0 0 15px #10b981' }} 
                   />
                 )}
               </button>
               <button 
                 onClick={() => setActiveTab('ai')}
                 className={`relative font-tesla font-bold text-base md:text-xl uppercase tracking-normal transition-[color,opacity] duration-300 pb-2 md:pb-4 whitespace-nowrap outline-none touch-manipulation flex-1 md:flex-none ${
                   activeTab === 'ai' ? 'text-white' : 'text-white/30 active:text-white/60'
                 }`}
                 style={{ fontFamily: 'Barlow', minHeight: '44px', fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
               >
                 {t('tech.ai.tab')}
                 {activeTab === 'ai' && (
                   <span 
                     className="absolute bottom-0 left-0 w-full h-[2px] transition-all duration-300 bg-emerald-500"
                     style={{ boxShadow: '0 0 15px #10b981' }} 
                   />
                 )}
               </button>
            </div>
         </div>

         {/* Content Area */}
         {activeTab === 'ai' ? (
           <div className="flex flex-col space-y-4 md:space-y-5">
             {/* Title and Introduction */}
             <div className="space-y-2 md:space-y-3">
               <h1 className="font-tesla font-bold text-base md:text-xl lg:text-2xl text-white leading-tight tracking-normal break-words" style={{ fontFamily: 'Barlow', fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', maxWidth: '100%', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                 {t('tech.ai.title')}
               </h1>
               <div className="h-[1px] w-12 bg-white/10" />
               <p className="text-white/70 text-xs md:text-base font-light leading-relaxed" style={{ fontFamily: 'Barlow', fontSize: 'clamp(0.75rem, 2vw, 1rem)' }}>
                 {t('tech.ai.intro')}
               </p>
             </div>

             {/* Mobile: Stacked layout, Desktop: Corner layout */}
             <div className="relative w-full">
               {/* Mobile Layout: Vertical stack */}
               <div className="md:hidden flex flex-col space-y-4">
                 {aiLayers.map((layer, index) => (
                   <div
                     key={index}
                     className="flex flex-col space-y-2 p-4 border border-white/10 bg-black/20"
                   >
                     <div className="flex items-center gap-2">
                       <span className="text-white/40 text-xs font-mono" style={{ fontFamily: 'Barlow', fontSize: '12px' }}>
                         {String(index + 1).padStart(2, '0')}
                       </span>
                       <h3 className="font-tesla font-bold text-sm text-white tracking-normal" style={{ fontFamily: 'Barlow', fontSize: '14px' }}>
                         {layer.title}
                       </h3>
                     </div>
                     {index < 2 && <div className="h-[1px] w-full bg-white/10" />}
                     <p className="text-white/60 text-xs font-light leading-relaxed" style={{ fontFamily: 'Barlow', fontSize: '13px' }}>
                       {layer.description}
                     </p>
                   </div>
                 ))}
                 
                 {/* Animation on mobile */}
                 <div className="relative w-full max-w-[280px] mx-auto aspect-square flex items-center justify-center bg-transparent rounded-sm overflow-hidden mt-4">
                   <div className="absolute inset-0">
                     <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/20 z-20" />
                     <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/20 z-20" />
                     <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/20 z-20" />
                     <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/20 z-20" />
                   </div>
                   <DataFlowAnimation className="w-full h-full" />
                 </div>
               </div>

               {/* Desktop Layout: Corner boxes with centered animation */}
               <div className="hidden md:flex relative w-full items-start justify-center pt-4 min-h-[600px] pb-8">
                 {/* Top Left */}
                 <div className="absolute top-4 left-0 w-[40%] max-w-[480px]">
                   <div className="flex flex-col space-y-3 p-5 md:p-6 border border-white/10 hover:border-white/20 transition-[border-color] duration-300 bg-black/20 overflow-visible">
                     <div className="flex items-center gap-3">
                       <span className="text-white/40 text-base font-mono" style={{ fontFamily: 'Barlow', fontSize: '16px' }}>
                         01
                       </span>
                       <h3 className="font-tesla font-bold text-lg md:text-xl text-white tracking-normal" style={{ fontFamily: 'Barlow', fontSize: 'clamp(1.125rem, 3vw, 1.5rem)' }}>
                         {aiLayers[0].title}
                       </h3>
                     </div>
                     <div className="h-[1px] w-full bg-white/10" />
                     <p className="text-white/60 text-base md:text-lg font-light leading-relaxed" style={{ fontFamily: 'Barlow', fontSize: '17px' }}>
                       {aiLayers[0].description}
                     </p>
                   </div>
                 </div>

                 {/* Top Right */}
                 <div className="absolute top-4 right-0 w-[40%] max-w-[480px]">
                   <div className="flex flex-col space-y-3 p-5 md:p-6 border border-white/10 hover:border-white/20 transition-[border-color] duration-300 bg-black/20 overflow-visible">
                     <div className="flex items-center gap-3">
                       <span className="text-white/40 text-base font-mono" style={{ fontFamily: 'Barlow', fontSize: '16px' }}>
                         02
                       </span>
                       <h3 className="font-tesla font-bold text-lg md:text-xl text-white tracking-normal" style={{ fontFamily: 'Barlow', fontSize: 'clamp(1.125rem, 3vw, 1.5rem)' }}>
                         {aiLayers[1].title}
                       </h3>
                     </div>
                     <div className="h-[1px] w-full bg-white/10" />
                     <p className="text-white/60 text-base md:text-lg font-light leading-relaxed" style={{ fontFamily: 'Barlow', fontSize: '17px' }}>
                       {aiLayers[1].description}
                     </p>
                   </div>
                 </div>

                 {/* Bottom Left */}
                 <div className="absolute top-[240px] left-0 w-[40%] max-w-[480px]">
                   <div className="flex flex-col space-y-3 p-5 md:p-6 border border-white/10 hover:border-white/20 transition-[border-color] duration-300 bg-black/20 overflow-visible">
                     <div className="flex items-center gap-3">
                       <span className="text-white/40 text-base font-mono" style={{ fontFamily: 'Barlow', fontSize: '16px' }}>
                         03
                       </span>
                       <h3 className="font-tesla font-bold text-lg md:text-xl text-white tracking-normal" style={{ fontFamily: 'Barlow', fontSize: 'clamp(1.125rem, 3vw, 1.5rem)' }}>
                         {aiLayers[2].title}
                       </h3>
                     </div>
                     <p className="text-white/60 text-base md:text-lg font-light leading-relaxed" style={{ fontFamily: 'Barlow', fontSize: '17px' }}>
                       {aiLayers[2].description}
                     </p>
                   </div>
                 </div>

                 {/* Bottom Right */}
                 <div className="absolute top-[240px] right-0 w-[40%] max-w-[480px]">
                   <div className="flex flex-col space-y-3 p-5 md:p-6 border border-white/10 hover:border-white/20 transition-[border-color] duration-300 bg-black/20 overflow-visible">
                     <div className="flex items-center gap-3">
                       <span className="text-white/40 text-base font-mono" style={{ fontFamily: 'Barlow', fontSize: '16px' }}>
                         04
                       </span>
                       <h3 className="font-tesla font-bold text-lg md:text-xl text-white tracking-normal" style={{ fontFamily: 'Barlow', fontSize: 'clamp(1.125rem, 3vw, 1.5rem)' }}>
                         {aiLayers[3].title}
                       </h3>
                     </div>
                     <p className="text-white/60 text-base md:text-lg font-light leading-relaxed" style={{ fontFamily: 'Barlow', fontSize: '17px' }}>
                       {aiLayers[3].description}
                     </p>
                   </div>
                 </div>

                 {/* Center: Animation */}
                 <div className="relative w-[300px] h-[300px] flex items-center justify-center bg-transparent rounded-sm overflow-hidden z-10">
                   <div className="absolute inset-0">
                     <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-white/20 z-20" />
                     <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-white/20 z-20" />
                     <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-white/20 z-20" />
                     <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-white/20 z-20" />
                   </div>
                   <DataFlowAnimation className="w-full h-full" />
                 </div>
               </div>
             </div>
           </div>
         ) : (
           /* Hardware Tab: Grid of four components */
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
             {technologies.map((tech) => (
               <div
                 key={tech.id}
                 className="group relative overflow-hidden flex flex-col bg-black/40 border border-white/10 hover:border-white/20 transition-all duration-300 rounded-sm"
               >
                 {/* Image */}
                 <div className="relative w-full aspect-video overflow-hidden bg-black/60">
                   <img 
                     src={`${BASE_URL}assets/images/${tech.id}.avif`} 
                     alt={`${tech.name} - ${tech.subtitle}`}
                     loading="lazy"
                     decoding="async"
                     className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                     style={{
                       width: '100%',
                       height: '100%',
                       minWidth: '100%',
                       minHeight: '100%',
                       objectFit: 'cover',
                       transform: 'scale(1.15)',
                       transformOrigin: 'center center'
                     }}
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                 </div>

                 {/* Content */}
                 <div className="flex-1 flex flex-col p-4 md:p-6 space-y-3 md:space-y-4">
                   <div className="space-y-2">
                     <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full" style={{backgroundColor: tech.accent}}></span>
                       <span className="font-mono font-bold text-[10px] text-white/40 uppercase tracking-[0.2em]" style={{ fontFamily: 'Barlow', fontSize: '11px' }}>
                         {tech.subtitle}
                       </span>
                     </div>
                     <h3 className="font-tesla font-bold text-xl md:text-3xl text-white tracking-normal" style={{ fontFamily: 'Barlow', fontSize: 'clamp(1.25rem, 3vw, 2rem)' }}>
                       {tech.name}
                     </h3>
                   </div>

                   <div className="h-[1px] w-12 bg-white/10" />

                   <p className="font-tech text-white/70 text-xs md:text-base font-light leading-relaxed flex-1" style={{ fontFamily: 'Barlow', fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                     {tech.description}
                   </p>

                   <div className="pt-2">
                     <span 
                       className="inline-block py-1.5 md:py-2 px-2 md:px-3 border rounded font-mono text-[9px] md:text-xs text-white/80 uppercase tracking-widest break-words" 
                       style={{ 
                         color: tech.accent, 
                         borderColor: `${tech.accent}40`,
                         fontFamily: 'Barlow',
                         fontSize: 'clamp(0.625rem, 1.5vw, 0.75rem)'
                       }}
                     >
                       {tech.details}
                     </span>
                   </div>
                 </div>
               </div>
             ))}
           </div>
         )}

      </div>
    </section>
  );
};

export default Technology;
