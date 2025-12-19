import React, { useEffect, useState } from 'react';

const LoadingScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => {
        setIsVisible(false);
      }, 500);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-nexus-dark flex items-center justify-center">
      <div className="relative w-52 h-72 flex items-center justify-center">
        {/* Soil/Ground */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-60 h-5 bg-gradient-to-t from-[#654321] via-[#8B4513] to-[#A0522D] rounded-full opacity-70"></div>
        
        <svg 
          className="w-full h-full absolute" 
          viewBox="0 0 240 280" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: 'visible' }}
        >
          {/* Seed */}
          <ellipse 
            cx="120" 
            cy="260" 
            rx="14" 
            ry="18" 
            fill="#5C4033"
            className="seed-animation"
          >
            <animate 
              attributeName="cy" 
              values="260;250;245;240;235" 
              dur="2s" 
              repeatCount="indefinite"
            />
            <animate 
              attributeName="ry" 
              values="18;16;14;12;10" 
              dur="2s" 
              repeatCount="indefinite"
            />
            <animate 
              attributeName="rx" 
              values="14;13;12;11;10" 
              dur="2s" 
              repeatCount="indefinite"
            />
            <animate 
              attributeName="opacity" 
              values="1;1;1;0.7;0" 
              dur="2s" 
              repeatCount="indefinite"
            />
          </ellipse>
          
          {/* Seed highlight */}
          <ellipse 
            cx="115" 
            cy="258" 
            rx="6" 
            ry="8" 
            fill="#8B4513"
            opacity="0.6"
            className="seed-highlight"
          >
            <animate 
              attributeName="cy" 
              values="258;248;243;238;233" 
              dur="2s" 
              repeatCount="indefinite"
            />
            <animate 
              attributeName="opacity" 
              values="0.6;0.6;0.6;0.4;0" 
              dur="2s" 
              repeatCount="indefinite"
            />
          </ellipse>

          {/* Main Stem */}
          <line 
            x1="120" 
            y1="260" 
            x2="120" 
            y2="140" 
            stroke="#22c55e" 
            strokeWidth="7"
            strokeLinecap="round"
            className="stem-animation"
          >
            <animate 
              attributeName="y2" 
              values="260;255;230;180;140" 
              dur="2s" 
              repeatCount="indefinite"
            />
            <animate 
              attributeName="y1" 
              values="260;255;250;245;240" 
              dur="2s" 
              repeatCount="indefinite"
            />
            <animate 
              attributeName="opacity" 
              values="0;0;0.3;0.7;1" 
              dur="2s" 
              repeatCount="indefinite"
            />
            <animate 
              attributeName="stroke-width" 
              values="0;0;5;6;7" 
              dur="2s" 
              repeatCount="indefinite"
            />
          </line>

          {/* Left Leaf 1 (Bottom, largest) */}
          <path 
            d="M 120 200 Q 85 190 70 170 Q 95 185 105 195 Z" 
            fill="#16a34a"
            stroke="#15803d"
            strokeWidth="2"
            className="leaf1-animation"
          >
            <animate 
              attributeName="opacity" 
              values="0;0;0;0.5;1" 
              dur="2s" 
              repeatCount="indefinite"
            />
            <animate 
              attributeName="d" 
              values="M 120 260 Q 120 260 120 260 Z;
                      M 120 255 Q 120 255 120 255 Z;
                      M 120 235 Q 110 230 100 225 Q 110 230 115 232 Z;
                      M 120 215 Q 95 205 80 185 Q 100 200 110 205 Z;
                      M 120 200 Q 85 190 70 170 Q 95 185 105 195 Z" 
              dur="2s" 
              repeatCount="indefinite"
            />
          </path>

          {/* Right Leaf 1 (Bottom, largest) */}
          <path 
            d="M 120 200 Q 155 190 170 170 Q 145 185 135 195 Z" 
            fill="#16a34a"
            stroke="#15803d"
            strokeWidth="2"
            className="leaf2-animation"
          >
            <animate 
              attributeName="opacity" 
              values="0;0;0;0.5;1" 
              dur="2s" 
              repeatCount="indefinite"
            />
            <animate 
              attributeName="d" 
              values="M 120 260 Q 120 260 120 260 Z;
                      M 120 255 Q 120 255 120 255 Z;
                      M 120 235 Q 130 230 140 225 Q 130 230 125 232 Z;
                      M 120 215 Q 145 205 160 185 Q 140 200 130 205 Z;
                      M 120 200 Q 155 190 170 170 Q 145 185 135 195 Z" 
              dur="2s" 
              repeatCount="indefinite"
            />
          </path>

          {/* Left Leaf 2 (Middle) */}
          <path 
            d="M 120 175 Q 90 165 75 145 Q 100 160 110 170 Z" 
            fill="#22c55e"
            stroke="#16a34a"
            strokeWidth="2"
            className="leaf3-animation"
          >
            <animate 
              attributeName="opacity" 
              values="0;0;0;0;0.7;1" 
              dur="2s" 
              repeatCount="indefinite"
            />
            <animate 
              attributeName="d" 
              values="M 120 260 Q 120 260 120 260 Z;
                      M 120 255 Q 120 255 120 255 Z;
                      M 120 210 Q 120 205 120 205 Z;
                      M 120 190 Q 100 185 85 175 Q 105 185 115 188 Z;
                      M 120 175 Q 90 165 75 145 Q 100 160 110 170 Z" 
              dur="2s" 
              repeatCount="indefinite"
            />
          </path>

          {/* Right Leaf 2 (Middle) */}
          <path 
            d="M 120 175 Q 150 165 165 145 Q 140 160 130 170 Z" 
            fill="#22c55e"
            stroke="#16a34a"
            strokeWidth="2"
            className="leaf4-animation"
          >
            <animate 
              attributeName="opacity" 
              values="0;0;0;0;0.7;1" 
              dur="2s" 
              repeatCount="indefinite"
            />
            <animate 
              attributeName="d" 
              values="M 120 260 Q 120 260 120 260 Z;
                      M 120 255 Q 120 255 120 255 Z;
                      M 120 210 Q 120 205 120 205 Z;
                      M 120 190 Q 140 185 155 175 Q 135 185 125 188 Z;
                      M 120 175 Q 150 165 165 145 Q 140 160 130 170 Z" 
              dur="2s" 
              repeatCount="indefinite"
            />
          </path>

          {/* Top Leaves/Sprout */}
          <path 
            d="M 120 140 Q 110 125 105 115 Q 115 125 118 132 Z" 
            fill="#15803d"
            stroke="#16a34a"
            strokeWidth="2"
            className="sprout1-animation"
          >
            <animate 
              attributeName="opacity" 
              values="0;0;0;0;0;0.8;1" 
              dur="2s" 
              repeatCount="indefinite"
            />
            <animate 
              attributeName="d" 
              values="M 120 260 Q 120 260 120 260 Z;
                      M 120 255 Q 120 255 120 255 Z;
                      M 120 180 Q 120 175 120 175 Z;
                      M 120 160 Q 120 150 120 150 Z;
                      M 120 150 Q 115 140 110 135 Q 115 140 117 145 Z;
                      M 120 140 Q 110 125 105 115 Q 115 125 118 132 Z" 
              dur="2s" 
              repeatCount="indefinite"
            />
          </path>

          <path 
            d="M 120 140 Q 130 125 135 115 Q 125 125 122 132 Z" 
            fill="#15803d"
            stroke="#16a34a"
            strokeWidth="2"
            className="sprout2-animation"
          >
            <animate 
              attributeName="opacity" 
              values="0;0;0;0;0;0.8;1" 
              dur="2s" 
              repeatCount="indefinite"
            />
            <animate 
              attributeName="d" 
              values="M 120 260 Q 120 260 120 260 Z;
                      M 120 255 Q 120 255 120 255 Z;
                      M 120 180 Q 120 175 120 175 Z;
                      M 120 160 Q 120 150 120 150 Z;
                      M 120 150 Q 125 140 130 135 Q 125 140 123 145 Z;
                      M 120 140 Q 130 125 135 115 Q 125 125 122 132 Z" 
              dur="2s" 
              repeatCount="indefinite"
            />
          </path>
        </svg>

        {/* Loading Text */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-3">
            <span className="text-white/80 font-tesla text-sm tracking-wider" style={{ fontFamily: 'Barlow' }}>
              NEXUS
            </span>
            <div className="flex gap-1.5">
              <div 
                className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" 
                style={{ animationDelay: '0s', animationDuration: '1.5s' }}
              ></div>
              <div 
                className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" 
                style={{ animationDelay: '0.3s', animationDuration: '1.5s' }}
              ></div>
              <div 
                className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" 
                style={{ animationDelay: '0.6s', animationDuration: '1.5s' }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .stem-animation {
          filter: drop-shadow(0 0 4px rgba(34, 197, 94, 0.5));
        }
        .leaf1-animation, .leaf2-animation, .leaf3-animation, .leaf4-animation, 
        .sprout1-animation, .sprout2-animation {
          filter: drop-shadow(0 3px 5px rgba(0, 0, 0, 0.4));
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
