import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Manifesto: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section id="vizyon" className="min-h-screen flex items-center py-24 relative overflow-hidden bg-transparent">
      <div className="w-full px-6 md:px-12 relative z-10 flex flex-col justify-center items-center h-full text-center">
        <h2 className="font-tesla font-bold text-4xl md:text-7xl uppercase text-white leading-none tracking-wider mb-8 max-w-5xl mt-2" style={{ fontFamily: 'Barlow' }}>
          {t('manifesto.title')} <br />
          <span className="text-white">{t('manifesto.title2')}</span>
        </h2>

        <div className="max-w-2xl space-y-4 text-lg md:text-xl font-light leading-relaxed text-white/80">
          <p style={{ fontFamily: 'Barlow' }}>
            {t('manifesto.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24 mt-20 w-full max-w-6xl border-t border-white/10 pt-12">
            <div className="flex flex-col items-center text-center">
                <h3 className="font-tesla font-bold text-2xl text-white mb-3 tracking-wide" style={{ fontFamily: 'Barlow' }}>{t('manifesto.dataDriven')}</h3>
                <p className="text-sm text-white/50 max-w-xs">{t('manifesto.dataDrivenDesc')}</p>
            </div>
            <div className="flex flex-col items-center text-center">
                <h3 className="font-tesla font-bold text-2xl text-white mb-3 tracking-wide" style={{ fontFamily: 'Barlow' }}>{t('manifesto.scalable')}</h3>
                <p className="text-sm text-white/50 max-w-xs">{t('manifesto.scalableDesc')}</p>
            </div>
            <div className="flex flex-col items-center text-center">
                <h3 className="font-tesla font-bold text-2xl text-white mb-3 tracking-wide" style={{ fontFamily: 'Barlow' }}>{t('manifesto.sustainable')}</h3>
                <p className="text-sm text-white/50 max-w-xs">{t('manifesto.sustainableDesc')}</p>
            </div>
        </div>

      </div>
    </section>
  );
};

export default Manifesto;