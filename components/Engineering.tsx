import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Engineering: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="engineering" className="min-h-screen flex items-center py-24 bg-nexus-dark relative border-t border-white/5 overflow-hidden">
       {/* Background noise/gradient matches other sections */}
       <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/80 pointer-events-none" />
       
       <div className="w-full px-4 md:px-12 relative z-10 flex flex-col justify-center items-center h-full max-w-[90rem] mx-auto">
          
          <div className="flex flex-col gap-6 items-center text-center px-2 md:px-0">
                <h2 className="font-tesla font-bold text-2xl md:text-6xl text-white uppercase tracking-tight md:tracking-tighter leading-tight md:leading-none break-words" style={{ fontFamily: 'Barlow', fontSize: 'clamp(1.5rem, 4vw, 3.75rem)', maxWidth: '100%', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                   {t('engineering.title')}
                </h2>
             <p className="font-tech text-white/50 text-base md:text-lg max-w-sm leading-relaxed">
                   {t('engineering.description')}
                </p>
             <p className="font-tesla text-xl md:text-3xl text-white/70 uppercase tracking-wide mt-8 break-words" style={{ fontFamily: 'Barlow', fontSize: 'clamp(1.25rem, 3vw, 1.875rem)', maxWidth: '100%', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                {t('engineering.comingSoon')}
             </p>
          </div>

       </div>
    </section>
  );
};

export default Engineering;