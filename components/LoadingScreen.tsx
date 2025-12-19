import React, { useEffect, useState } from 'react';

const LoadingScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    const minLoadingTime = 1000;
    const startTime = Date.now();

    // Smooth progress animation
    progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          return 98;
        }
        return prev + 1;
      });
    }, 40);

    const checkComplete = () => {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsed);

      setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }, remainingTime);
    };

    if (document.readyState === 'complete') {
      checkComplete();
    } else {
      window.addEventListener('load', checkComplete);
    }

    const maxLoadingTimeout = setTimeout(() => {
      checkComplete();
    }, 3500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(maxLoadingTimeout);
      window.removeEventListener('load', checkComplete);
    };
  }, []);

  if (!loading) return null;

  // Growth progress (0 to 1)
  const growth = Math.min(progress / 100, 1);
  const stemHeight = 60 * growth;
  const leafSize = Math.max(0, (growth - 0.3) / 0.7);

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-nexus-dark flex items-center justify-center transition-opacity duration-700"
      style={{ 
        opacity: loading ? 1 : 0,
        pointerEvents: loading ? 'auto' : 'none'
      }}
    >
      <div className="flex flex-col items-center justify-center">
        {/* Elegant Seed to Plant Animation */}
        <div className="relative w-32 h-40 mb-8">
          <svg
            viewBox="0 0 100 120"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Soil base - simple and minimal */}
            <ellipse
              cx="50"
              cy="115"
              rx="40"
              ry="5"
              fill="#1a1a1a"
              opacity={0.6}
            />

            {/* Seed - shrinks as it grows */}
            {growth < 0.15 && (
              <ellipse
                cx="50"
                cy={110 - growth * 20}
                rx={8 - growth * 4}
                ry={6 - growth * 3}
                fill="#065f46"
                opacity={1 - growth * 4}
              />
            )}

            {/* Stem - grows upward */}
            {growth >= 0.15 && (
              <line
                x1="50"
                y1={110 - stemHeight}
                x2="50"
                y2="110"
                stroke="#065f46"
                strokeWidth="3"
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            )}

            {/* Bottom leaves */}
            {growth >= 0.4 && (
              <>
                {/* Left bottom leaf */}
                <path
                  d={`M 50 ${110 - stemHeight * 0.4} Q ${45 - leafSize * 8} ${105 - stemHeight * 0.45} ${40 - leafSize * 10} ${100 - stemHeight * 0.5}`}
                  fill="none"
                  stroke="#064e3b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity={leafSize}
                  className="transition-all duration-800 ease-out"
                />
                <ellipse
                  cx={40 - leafSize * 10}
                  cy={100 - stemHeight * 0.5}
                  rx={3 + leafSize * 5}
                  ry={4 + leafSize * 6}
                  fill="#064e3b"
                  opacity={0.7 * leafSize}
                  className="transition-all duration-800 ease-out"
                />
                
                {/* Right bottom leaf */}
                <path
                  d={`M 50 ${110 - stemHeight * 0.4} Q ${55 + leafSize * 8} ${105 - stemHeight * 0.45} ${60 + leafSize * 10} ${100 - stemHeight * 0.5}`}
                  fill="none"
                  stroke="#064e3b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity={leafSize}
                  className="transition-all duration-800 ease-out"
                />
                <ellipse
                  cx={60 + leafSize * 10}
                  cy={100 - stemHeight * 0.5}
                  rx={3 + leafSize * 5}
                  ry={4 + leafSize * 6}
                  fill="#064e3b"
                  opacity={0.7 * leafSize}
                  className="transition-all duration-800 ease-out"
                />
              </>
            )}

            {/* Middle leaves */}
            {growth >= 0.65 && (
              <>
                {/* Left middle leaf */}
                <path
                  d={`M 50 ${110 - stemHeight * 0.7} Q ${44 - leafSize * 6} ${85 - stemHeight * 0.75} ${38 - leafSize * 8} ${75 - stemHeight * 0.8}`}
                  fill="none"
                  stroke="#065f46"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity={Math.max(0, (growth - 0.65) / 0.35)}
                  className="transition-all duration-800 ease-out"
                />
                <ellipse
                  cx={38 - leafSize * 8}
                  cy={75 - stemHeight * 0.8}
                  rx={3 + leafSize * 4}
                  ry={4 + leafSize * 5}
                  fill="#065f46"
                  opacity={0.75 * Math.max(0, (growth - 0.65) / 0.35)}
                  className="transition-all duration-800 ease-out"
                />
                
                {/* Right middle leaf */}
                <path
                  d={`M 50 ${110 - stemHeight * 0.7} Q ${56 + leafSize * 6} ${85 - stemHeight * 0.75} ${62 + leafSize * 8} ${75 - stemHeight * 0.8}`}
                  fill="none"
                  stroke="#065f46"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity={Math.max(0, (growth - 0.65) / 0.35)}
                  className="transition-all duration-800 ease-out"
                />
                <ellipse
                  cx={62 + leafSize * 8}
                  cy={75 - stemHeight * 0.8}
                  rx={3 + leafSize * 4}
                  ry={4 + leafSize * 5}
                  fill="#065f46"
                  opacity={0.75 * Math.max(0, (growth - 0.65) / 0.35)}
                  className="transition-all duration-800 ease-out"
                />
              </>
            )}

            {/* Top leaves - final stage */}
            {growth >= 0.85 && (
              <>
                {/* Left top leaf */}
                <path
                  d="M 50 55 Q 45 42 38 35"
                  fill="none"
                  stroke="#064e3b"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity={Math.max(0, (growth - 0.85) / 0.15)}
                  className="transition-all duration-600 ease-out"
                />
                <ellipse
                  cx="38"
                  cy="35"
                  rx={5 + Math.max(0, (growth - 0.85) / 0.15) * 3}
                  ry={6 + Math.max(0, (growth - 0.85) / 0.15) * 4}
                  fill="#064e3b"
                  opacity={0.8 * Math.max(0, (growth - 0.85) / 0.15)}
                  className="transition-all duration-600 ease-out"
                />
                
                {/* Right top leaf */}
                <path
                  d="M 50 55 Q 55 42 62 35"
                  fill="none"
                  stroke="#064e3b"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity={Math.max(0, (growth - 0.85) / 0.15)}
                  className="transition-all duration-600 ease-out"
                />
                <ellipse
                  cx="62"
                  cy="35"
                  rx={5 + Math.max(0, (growth - 0.85) / 0.15) * 3}
                  ry={6 + Math.max(0, (growth - 0.85) / 0.15) * 4}
                  fill="#064e3b"
                  opacity={0.8 * Math.max(0, (growth - 0.85) / 0.15)}
                  className="transition-all duration-600 ease-out"
                />
                
                {/* Center top leaf */}
                <path
                  d="M 50 58 Q 50 38 50 30"
                  fill="none"
                  stroke="#065f46"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  opacity={Math.max(0, (growth - 0.92) / 0.08)}
                  className="transition-all duration-500 ease-out"
                />
                <ellipse
                  cx="50"
                  cy="30"
                  rx={4 + Math.max(0, (growth - 0.92) / 0.08) * 3}
                  ry={5 + Math.max(0, (growth - 0.92) / 0.08) * 4}
                  fill="#065f46"
                  opacity={0.85 * Math.max(0, (growth - 0.92) / 0.08)}
                  className="transition-all duration-500 ease-out"
                />
              </>
            )}
          </svg>
        </div>

        {/* NEXUS Text - elegant fade in */}
        <div 
          className="font-tesla font-bold text-xl md:text-2xl text-white/90 tracking-[0.2em] mb-6 transition-opacity duration-700"
          style={{ 
            fontFamily: 'Barlow',
            opacity: Math.min(progress / 40, 1),
            letterSpacing: '0.2em'
          }}
        >
          NEXUS
        </div>

        {/* Minimal progress bar */}
        <div className="w-40 h-0.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-700 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
