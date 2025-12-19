import React, { useMemo, useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const BASE_URL = import.meta.env.BASE_URL || '/';

const DefenseSpace: React.FC = () => {
  const { t } = useLanguage();
  const [animatedDefenseTitle, setAnimatedDefenseTitle] = useState(t('defense.defense'));

  // Text scrambling animation for SAVUNMA/DEFENSE title
  useEffect(() => {
    const original = t('defense.defense');
    setAnimatedDefenseTitle(original);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const frameDuration = 40; // ~25 fps
    const animationDuration = 2000; // 2s scramble before resolving
    const totalFrames = Math.round(animationDuration / frameDuration);

    const runAnimationOnce = () => {
      let frame = 0;
      const letters = original.split('');

      const scrambleInterval = setInterval(() => {
        frame += 1;
        const progress = frame / totalFrames;

        const next = letters
          .map((ch, idx) => {
            if (ch === ' ') return ' ';
            const revealThreshold = idx / letters.length;
            if (progress >= revealThreshold) {
              return ch;
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');

        setAnimatedDefenseTitle(next);

        if (frame >= totalFrames) {
          setAnimatedDefenseTitle(original);
          clearInterval(scrambleInterval);
        }
      }, frameDuration);
    };

    // initial run
    runAnimationOnce();
    // repeat every ~5s
    const loop = setInterval(runAnimationOnce, 5000);

    return () => {
      clearInterval(loop);
    };
  }, [t]);
  // Memoize star positions to prevent recalculation on every render
  const starPositions = useMemo(() => 
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
    })), []
  );

  return (
    <section id="defense" className="min-h-screen flex items-center py-22 md:py-24 relative bg-black overflow-hidden">

      <div className="w-full px-6 md:px-12 relative z-10 flex flex-col justify-center min-h-full">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-14 border-b border-white/10 pb-5 max-w-[90rem] mx-auto w-full">
          <h2 className="font-tesla font-bold text-3xl md:text-5xl text-white uppercase tracking-tight leading-tight" style={{ fontFamily: 'Barlow' }}>
            {t('defense.title')}
          </h2>
          <p className="font-mono text-white/50 text-right mt-2 md:mt-0 uppercase tracking-widest text-[11px] md:text-xs">
            {t('defense.subtitle')} <br /> {t('defense.subtitle2')}
          </p>
        </div>

        <div className="flex flex-col gap-8 md:gap-10 w-full max-w-[90rem] mx-auto">
            
            {/* Savunma - Defense Card (Bio-Secure Iris Concept) */}
            <div className="group relative overflow-hidden flex flex-col min-h-[270px] md:min-h-[300px] bg-black/40" style={{ willChange: 'auto' }}>
                
                {/* Optimized Background Grid Pattern - Static to reduce repaints */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:22px_22px] opacity-15 pointer-events-none" style={{ transform: 'translateZ(0)' }} />

                <div className="relative z-10 flex justify-between items-stretch h-full px-6 md:px-10 py-10 md:py-12">
                    <div className="flex flex-col justify-center h-full pr-6 w-full space-y-4 md:space-y-5 text-left max-w-2xl">
                        <h3 className="font-tesla font-bold text-3xl md:text-4xl text-red-500 tracking-wide group-hover:text-red-400 transition-colors drop-shadow-md" style={{ fontFamily: 'Barlow' }}>
                          {animatedDefenseTitle}
                        </h3>
                        <p className="text-white text-base md:text-lg font-light leading-relaxed max-w-xl">
                          {t('defense.defenseDesc')}
                            </p>
                    </div>

                    {/* Static Shield + Plant symbol */}
                    <div className="relative w-28 h-28 md:w-32 md:h-32 flex-shrink-0 self-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Shield outline */}
                        <path
                          d="M50 10 L78 20 L78 47 C78 64 65 78 50 86 C35 78 22 64 22 47 L22 20 Z"
                          fill="#020617"
                          stroke="#ef4444"
                          strokeWidth="2"
                        />
                        {/* Inner shield */}
                        <path
                          d="M50 16 L72 24 L72 46 C72 60 62 71 50 77 C38 71 28 60 28 46 L28 24 Z"
                          fill="url(#shieldGrad)"
                          stroke="#ef4444"
                          strokeWidth="1.2"
                        />
                        <defs>
                          <linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#1f2937" />
                            <stop offset="100%" stopColor="#020617" />
                          </linearGradient>
                        </defs>
                        {/* Plant stem */}
                        <line
                          x1="50"
                          y1="38"
                          x2="50"
                          y2="64"
                          stroke="#22c55e"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        {/* Left leaf */}
                        <path
                          d="M50 44 C44 44 40 40 38 36 C42 36 46 37.5 49 40"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                        {/* Right leaf */}
                        <path
                          d="M50 50 C56 50 60 46 62 42 C58 42 54 43.5 51 46"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                        {/* Top sprout */}
                        <circle cx="50" cy="34" r="2" fill="#22c55e" />
                      </svg>
                    </div>
                </div>
            </div>

            {/* Uzay - Space area with Video Background */}
            <div className="group relative overflow-hidden flex flex-col min-h-[640px] md:min-h-[720px]" style={{ willChange: 'auto' }}>
                 {/* Background video fills box */}
                 <video
                   className="absolute inset-0 w-full h-full object-cover opacity-90"
                   src={`${BASE_URL}assets/videos/moon.mp4`}
                   autoPlay
                   muted
                   loop
                   playsInline
                   preload="none"
                   aria-hidden="true"
                 />
                 <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/20 pointer-events-none" />

                 <div className="relative z-10 flex h-full items-center px-6 md:px-10 py-10 md:py-12">
                   <div className="flex flex-col gap-4 md:gap-5 max-w-2xl text-left">
                     <h3 className="font-tesla font-bold text-3xl md:text-4xl text-white tracking-wide drop-shadow-md" style={{ fontFamily: 'Barlow' }}>
                       {t('defense.space')}
                     </h3>
                     <p className="text-white text-base md:text-lg font-light leading-relaxed">
                       {t('defense.spaceDesc')}
                     </p>
                    </div>
                 </div>
            </div>

        </div>

      </div>
      
      {/* Optimized Styles */}
      <style>{`
        @keyframes star-twinkle {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.6; }
        }
        .star-twinkle {
            animation: star-twinkle ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default DefenseSpace;