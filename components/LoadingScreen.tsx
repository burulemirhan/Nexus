import React, { useEffect, useState } from 'react';

const LoadingScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let minLoadingTime = 800; // Minimum loading time for smooth animation
    const startTime = Date.now();

    // Progress animation
    progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          return 95; // Keep at 95% until assets load
        }
        return prev + 1.5;
      });
    }, 30);

    // Check if page is fully loaded
    const checkComplete = () => {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsed);

      setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setLoading(false);
        }, 400);
      }, remainingTime);
    };

    // Wait for window load event
    if (document.readyState === 'complete') {
      checkComplete();
    } else {
      window.addEventListener('load', checkComplete);
    }

    // Fallback: maximum loading time
    const maxLoadingTimeout = setTimeout(() => {
      checkComplete();
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(maxLoadingTimeout);
      window.removeEventListener('load', checkComplete);
    };
  }, []);

  if (!loading) return null;

  // Calculate animation stage based on progress
  const stage = Math.min(Math.floor(progress / 25), 4);
  const stemHeight = Math.min((progress / 100) * 80, 80);
  const leafGrowth = Math.min((progress - 25) / 75, 1);

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-nexus-dark flex items-center justify-center transition-opacity duration-500"
      style={{ 
        opacity: loading ? 1 : 0,
        pointerEvents: loading ? 'auto' : 'none'
      }}
    >
      <div className="flex flex-col items-center justify-center">
        {/* Seed to Plant Animation */}
        <div className="relative w-40 h-56 mb-8">
          <svg
            viewBox="0 0 120 160"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Soil */}
            <ellipse
              cx="60"
              cy="150"
              rx="55"
              ry="10"
              fill="#3d2817"
              opacity={0.9}
            />

            {/* Seed */}
            {stage === 0 && (
              <ellipse
                cx="60"
                cy="145"
                rx="10"
                ry="7"
                fill="#8b5a3c"
                opacity={1 - progress / 25}
              >
                <animate
                  attributeName="cy"
                  values="145;143;145"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="1;0.7;1"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </ellipse>
            )}

            {/* Sprouting Seed */}
            {stage >= 1 && (
              <>
                {/* Small sprout */}
                <line
                  x1="60"
                  y1={145 - stemHeight * 0.3}
                  x2="60"
                  y2="145"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity={Math.min(stage / 2, 1)}
                  className="transition-all duration-700"
                />
                
                {/* First tiny leaves */}
                {stage >= 2 && (
                  <>
                    <path
                      d={`M 60 ${145 - stemHeight * 0.3} Q 55 ${135 - stemHeight * 0.35} 52 ${130 - stemHeight * 0.4}`}
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity={leafGrowth}
                      className="transition-all duration-700"
                    />
                    <ellipse
                      cx={52}
                      cy={130 - stemHeight * 0.4}
                      rx={2 + leafGrowth * 3}
                      ry={3 + leafGrowth * 4}
                      fill="#22c55e"
                      opacity={0.7 + leafGrowth * 0.2}
                      className="transition-all duration-700"
                    />
                    <path
                      d={`M 60 ${145 - stemHeight * 0.3} Q 65 ${135 - stemHeight * 0.35} 68 ${130 - stemHeight * 0.4}`}
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity={leafGrowth}
                      className="transition-all duration-700"
                    />
                    <ellipse
                      cx={68}
                      cy={130 - stemHeight * 0.4}
                      rx={2 + leafGrowth * 3}
                      ry={3 + leafGrowth * 4}
                      fill="#22c55e"
                      opacity={0.7 + leafGrowth * 0.2}
                      className="transition-all duration-700"
                    />
                  </>
                )}

                {/* Main stem */}
                <line
                  x1="60"
                  y1={145 - stemHeight}
                  x2="60"
                  y2="145"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity={Math.min((stage - 1) / 3, 1)}
                  className="transition-all duration-700"
                />

                {/* Mid-level leaves */}
                {stage >= 3 && (
                  <>
                    <path
                      d={`M 60 ${145 - stemHeight * 0.6} Q 52 ${130 - stemHeight * 0.65} 46 ${120 - stemHeight * 0.7}`}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      opacity={Math.max(0, (progress - 50) / 25)}
                      className="transition-all duration-700"
                    />
                    <ellipse
                      cx={46}
                      cy={120 - stemHeight * 0.7}
                      rx={3 + Math.max(0, (progress - 50) / 25) * 4}
                      ry={4 + Math.max(0, (progress - 50) / 25) * 5}
                      fill="#10b981"
                      opacity={0.75 + Math.max(0, (progress - 50) / 25) * 0.15}
                      className="transition-all duration-700"
                    />
                    <path
                      d={`M 60 ${145 - stemHeight * 0.6} Q 68 ${130 - stemHeight * 0.65} 74 ${120 - stemHeight * 0.7}`}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      opacity={Math.max(0, (progress - 50) / 25)}
                      className="transition-all duration-700"
                    />
                    <ellipse
                      cx={74}
                      cy={120 - stemHeight * 0.7}
                      rx={3 + Math.max(0, (progress - 50) / 25) * 4}
                      ry={4 + Math.max(0, (progress - 50) / 25) * 5}
                      fill="#10b981"
                      opacity={0.75 + Math.max(0, (progress - 50) / 25) * 0.15}
                      className="transition-all duration-700"
                    />
                  </>
                )}

                {/* Top leaves - fully grown */}
                {stage >= 4 && (
                  <>
                    {/* Left top leaf */}
                    <path
                      d="M 60 65 Q 54 52 48 45"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity={Math.max(0, (progress - 75) / 25)}
                      className="transition-all duration-500"
                    />
                    <ellipse
                      cx="48"
                      cy="45"
                      rx={4 + Math.max(0, (progress - 75) / 25) * 4}
                      ry={5 + Math.max(0, (progress - 75) / 25) * 5}
                      fill="#10b981"
                      opacity={0.85 + Math.max(0, (progress - 75) / 25) * 0.1}
                      className="transition-all duration-500"
                    >
                      <animate
                        attributeName="opacity"
                        values="0.85;0.95;0.85"
                        dur="2.5s"
                        repeatCount="indefinite"
                      />
                    </ellipse>
                    
                    {/* Right top leaf */}
                    <path
                      d="M 60 65 Q 66 52 72 45"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity={Math.max(0, (progress - 75) / 25)}
                      className="transition-all duration-500"
                    />
                    <ellipse
                      cx="72"
                      cy="45"
                      rx={4 + Math.max(0, (progress - 75) / 25) * 4}
                      ry={5 + Math.max(0, (progress - 75) / 25) * 5}
                      fill="#10b981"
                      opacity={0.85 + Math.max(0, (progress - 75) / 25) * 0.1}
                      className="transition-all duration-500"
                    >
                      <animate
                        attributeName="opacity"
                        values="0.85;0.95;0.85"
                        dur="2.5s"
                        repeatCount="indefinite"
                        begin="0.7s"
                      />
                    </ellipse>
                    
                    {/* Center top leaf */}
                    <path
                      d="M 60 70 Q 60 50 60 40"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      opacity={Math.max(0, (progress - 85) / 15)}
                      className="transition-all duration-500"
                    />
                    <ellipse
                      cx="60"
                      cy="40"
                      rx={3 + Math.max(0, (progress - 85) / 15) * 4}
                      ry={4 + Math.max(0, (progress - 85) / 15) * 5}
                      fill="#22c55e"
                      opacity={0.9 + Math.max(0, (progress - 85) / 15) * 0.1}
                      className="transition-all duration-500"
                    >
                      <animate
                        attributeName="opacity"
                        values="0.9;1;0.9"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="ry"
                        values="9;10;9"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </ellipse>
                  </>
                )}
              </>
            )}
          </svg>
        </div>

        {/* NEXUS Text */}
        <div 
          className="font-tesla font-bold text-2xl md:text-3xl text-white tracking-wider mb-6 transition-opacity duration-500"
          style={{ 
            fontFamily: 'Barlow',
            opacity: Math.min(progress / 30, 1)
          }}
        >
          NEXUS
        </div>

        {/* Loading Progress Bar */}
        <div className="w-56 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-400 transition-all duration-300 ease-out shadow-lg"
            style={{ 
              width: `${progress}%`,
              boxShadow: `0 0 10px rgba(16, 185, 129, ${progress / 100})`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
