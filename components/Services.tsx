import React, { useMemo, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Services: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isContactOpen, setIsContactOpen] = useState(false);
  
  const services = useMemo(() => {
    const basePath = location.pathname.startsWith('/en') ? '/en' : '';
    return [
      { 
        id: '01', 
        title: t('services.service1.title'), 
        desc: t('services.service1.desc'),
        path: basePath + (language === 'en' ? '/engineering-solutions' : '/mühendislik-çözümleri')
      },
      { 
        id: '02', 
        title: t('services.service2.title'), 
        desc: t('services.service2.desc'),
        path: basePath + (language === 'en' ? '/turnkey-projects' : '/anahtar-teslim-projeler')
      },
      { 
        id: '03', 
        title: t('services.service3.title'), 
        desc: t('services.service3.desc'),
        path: basePath + (language === 'en' ? '/defense-industry-projects' : '/savunma-sanayi-projeleri')
      },
      { 
        id: '04', 
        title: t('services.service4.title'), 
        desc: t('services.service4.desc'),
        path: basePath + (language === 'en' ? '/consulting-and-project-management' : '/danışmanlık-ve-proje-yönetimi')
      },
    ];
  }, [t, language, location.pathname]);

  return (
    <section id="services" className="min-h-screen flex items-center py-16 relative bg-nexus-dark/50 backdrop-blur-sm">
      {/* Gradient transition from black (Kritik Altyapı) into Hizmetler background */}
      <div className="pointer-events-none absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black to-nexus-dark/50" />
      <div className="w-full px-6 md:px-12 relative z-10 flex flex-col justify-center min-h-full">
        
        <h2 className="font-tesla font-bold text-3xl md:text-5xl text-white uppercase mb-10 tracking-tight" style={{ fontFamily: 'Barlow', height: '44px' }}>
          {t('services.title')}
        </h2>

        <div className="w-full">
          {services.map((service) => (
            <div 
              key={service.id} 
              onClick={() => navigate(service.path)}
              className="group flex flex-col md:flex-row md:items-center justify-between border-t border-white/10 py-7 md:py-8 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="flex items-baseline gap-4 md:gap-8">
                <span className="font-mono text-emerald-500 text-[11px] md:text-xs">{service.id}</span>
                <h3 className="font-tesla font-bold text-lg md:text-2xl text-white tracking-wide" style={{ fontFamily: 'Barlow' }}>{service.title}</h3>
               </div>
              <div className="flex items-center gap-5 mt-3 md:mt-0">
                 <p className="font-tech text-white/40 text-[11px] md:text-sm">{service.desc}</p>
                 <ArrowUpRight className="text-white/20 group-hover:text-white transition-colors w-4 h-4 md:w-5 md:h-5" />
               </div>
            </div>
          ))}
          <div className="border-t border-white/10"></div>
        </div>

        <div className="mt-12 flex justify-center">
           <button
             onClick={() => setIsContactOpen(true)}
             className="px-10 md:px-12 py-3 md:py-3.5 bg-transparent text-white border border-white/60 hover:bg-white hover:text-black transition-all duration-300 rounded-lg font-display font-bold uppercase tracking-widest text-xs md:text-sm"
           >
             {t('services.button')}
           </button>
        </div>

      </div>

      {/* Contact Modal */}
      {isContactOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setIsContactOpen(false)}
        >
          <div
            className="relative w-full max-w-sm mx-4 rounded-lg bg-black/90 border border-white/10 px-6 py-6 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-white/40 hover:text-white text-sm"
              onClick={() => setIsContactOpen(false)}
              aria-label="Close contact details"
            >
              ✕
            </button>
            <h3 className="font-tesla font-bold text-xl md:text-2xl mb-4 tracking-wide" style={{ fontFamily: 'Barlow' }}>
              {t('services.button')}
            </h3>
            <div className="space-y-3 text-sm md:text-base font-mono">
              <div>
                <span className="text-white/40 mr-2">E-mail:</span>
                <a href="mailto:info@nexusbiotech.org" className="text-white hover:underline">
                  info@nexusbiotech.org
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Services;