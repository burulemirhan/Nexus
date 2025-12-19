import React, { useEffect, useState } from 'react';

const LoadingScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    const minLoadingTime = 1200;
    const startTime = Date.now();

    // Smooth progress animation
    progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          return 98;
        }
        return prev + 0.8;
      });
    }, 30);

    const checkComplete = () => {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsed);

      setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setLoading(false);
        }, 600);
      }, remainingTime);
    };

    // Wait for window load event
    if (document.readyState === 'complete') {
      checkComplete();
    } else {
      window.addEventListener('load', checkComplete);
    }

    // Fallback timeout
    const maxLoadingTimeout = setTimeout(() => {
      checkComplete();
    }, 4000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(maxLoadingTimeout);
      window.removeEventListener('load', checkComplete);
    };
  }, []);

  if (!loading) return null;

  // Simple growth progress (0 to 1)
  const growth = Math.min(progress / 100, 1);
  const stemHeight = 50 * growth;
  const showSeed = growth < 0.15;
  const showLeaves = growth > 0.4;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-nexus-dark flex items-center justify-center transition-opacity duration-700"
      style={{ 
        opacity: loading ? 1 : 0,
        pointerEvents: loading ? 'auto' : 'none'
      }}
    >
      <div className="flex flex-col items-center justify-center">
        {/* Simple Seed to Plant Animation */}
        <div className="relative w-24 h-32 mb-8">
          <svg
            viewBox="0 0 80 100"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Simple soil base */}
            <ellipse
              cx="40"
              cy="95"
              rx="35"
              ry="5"
              fill="#0a0a0a"
              opacity={0.5}
            />

            {/* Seed - dark green dot */}
            {showSeed && (
              <circle
                cx="40"
                cy={90 - growth * 30}
                r={6 - growth * 3}
                fill="#064e3b"
                opacity={1 - growth * 5}
                className="transition-all duration-500"
              />
            )}

            {/* Stem - grows upward from seed */}
            {growth >= 0.15 && (
              <line
                x1="40"
                y1={90 - stemHeight}
                x2="40"
                y2="90"
                stroke="#064e3b"
                strokeWidth="3"
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            )}

            {/* Simple leaves - appear as plant grows */}
            {showLeaves && (
              <>
                {/* Left leaf */}
                <path
                  d={`M 40 ${90 - stemHeight * 0.6} Q ${30 - (growth - 0.4) * 15} ${70 - stemHeight * 0.65} ${25 - (growth - 0.4) * 12} ${60 - stemHeight * 0.7}`}
                  fill="none"
                  stroke="#065f46"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity={Math.min((growth - 0.4) / 0.3, 1)}
                  className="transition-all duration-800"
                />
                <ellipse
                  cx={25 - (growth - 0.4) * 12}
                  cy={60 - stemHeight * 0.7}
                  rx={4 + (growth - 0.4) * 6}
                  ry={5 + (growth - 0.4) * 7}
                  fill="#065f46"
                  opacity={0.6 * Math.min((growth - 0.4) / 0.3, 1)}
                  className="transition-all duration-800"
                />
                
                {/* Right leaf */}
                <path
                  d={`M 40 ${90 - stemHeight * 0.6} Q ${50 + (growth - 0.4) * 15} ${70 - stemHeight * 0.65} ${55 + (growth - 0.4) * 12} ${60 - stemHeight * 0.7}`}
                  fill="none"
                  stroke="#065f46"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity={Math.min((growth - 0.4) / 0.3, 1)}
                  className="transition-all duration-800"
                />
                <ellipse
                  cx={55 + (growth - 0.4) * 12}
                  cy={60 - stemHeight * 0.7}
                  rx={4 + (growth - 0.4) * 6}
                  ry={5 + (growth - 0.4) * 7}
                  fill="#065f46"
                  opacity={0.6 * Math.min((growth - 0.4) / 0.3, 1)}
                  className="transition-all duration-800"
                />
                
                {/* Top leaf */}
                {growth > 0.7 && (
                  <>
                    <line
                      x1="40"
                      y1={90 - stemHeight}
                      x2="40"
                      y2={40 - stemHeight * 0.2}
                      stroke="#064e3b"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity={Math.min((growth - 0.7) / 0.3, 1)}
                      className="transition-all duration-600"
                    />
                    <ellipse
                      cx="40"
                      cy={40 - stemHeight * 0.2}
                      rx={5 + (growth - 0.7) * 5}
                      ry={6 + (growth - 0.7) * 6}
                      fill="#064e3b"
                      opacity={0.7 * Math.min((growth - 0.7) / 0.3, 1)}
                      className="transition-all duration-600"
                    />
                  </>
                )}
              </>
            )}
          </svg>
        </div>

        {/* NEXUS Text */}
        <div 
          className="font-tesla font-bold text-xl text-white/80 tracking-widest mb-4 transition-opacity duration-700"
          style={{ 
            fontFamily: 'Barlow',
            opacity: Math.min(progress / 50, 1)
          }}
        >
          NEXUS
        </div>

        {/* Minimal progress bar */}
        <div className="w-32 h-0.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-900 to-emerald-800 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
