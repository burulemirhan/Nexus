import React, { useEffect, useState } from 'react';

interface LoadingAnimationProps {
  isLoading?: boolean;
  size?: number; // Size in pixels
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  isLoading = true,
  size = 80 
}) => {
  const [key, setKey] = useState(0);
  const [shouldRender, setShouldRender] = useState(isLoading);

  // Force re-render on loop to ensure smooth reset
  useEffect(() => {
    if (!isLoading) {
      // Delay unmount to allow fade-out animation
      const timer = setTimeout(() => setShouldRender(false), 500);
      return () => clearTimeout(timer);
    }
    setShouldRender(true);
    
    const interval = setInterval(() => {
      setKey(prev => prev + 1);
    }, 2000); // Match animation duration
    
    return () => clearInterval(interval);
  }, [isLoading]);

  if (!shouldRender) return null;

  const strokeWidth = size * 0.08;
  const seedSize = size * 0.24;
  const stemHeight = size * 0.5;
  const leafSize = size * 0.18;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-nexus-dark transition-opacity duration-500"
      style={{ 
        backgroundColor: '#020503',
        opacity: isLoading ? 1 : 0,
        pointerEvents: isLoading ? 'auto' : 'none'
      }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          key={key}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible"
          style={{ 
            filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.1))'
          }}
        >
          <defs>
            {/* Subtle gradient for depth */}
            <linearGradient id="seedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5F8F5" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#E0E6E0" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="stemGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* Root hint - subtle downward line */}
          <line
            x1={size / 2}
            y1={size / 2 + seedSize / 2}
            x2={size / 2}
            y2={size / 2 + seedSize / 2 + size * 0.08}
            stroke="#10B981"
            strokeWidth={strokeWidth * 0.6}
            strokeLinecap="round"
            opacity="0"
            style={{
              animation: 'rootHint 2s ease-out infinite',
              animationDelay: '0.15s'
            }}
          />

          {/* Stem - grows upward */}
          <line
            x1={size / 2}
            y1={size / 2}
            x2={size / 2}
            y2={size / 2 - stemHeight}
            stroke="url(#stemGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            opacity="0"
            style={{
              animation: 'stemGrow 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
              animationDelay: '0.3s',
              transformOrigin: `${size / 2}px ${size / 2}px`
            }}
          />

          {/* Left leaf */}
          <ellipse
            cx={size / 2 - size * 0.12}
            cy={size / 2 - stemHeight * 0.6}
            rx={leafSize}
            ry={leafSize * 0.5}
            fill="#10B981"
            fillOpacity="0.85"
            opacity="0"
            style={{
              animation: 'leafUnfurlLeft 2s cubic-bezier(0.34, 1.56, 0.64, 1) infinite',
              animationDelay: '0.85s',
              transformOrigin: `${size / 2}px ${size / 2 - stemHeight * 0.6}px`
            }}
          />

          {/* Right leaf */}
          <ellipse
            cx={size / 2 + size * 0.12}
            cy={size / 2 - stemHeight * 0.6}
            rx={leafSize}
            ry={leafSize * 0.5}
            fill="#10B981"
            fillOpacity="0.85"
            opacity="0"
            style={{
              animation: 'leafUnfurlRight 2s cubic-bezier(0.34, 1.56, 0.64, 1) infinite',
              animationDelay: '0.85s',
              transformOrigin: `${size / 2}px ${size / 2 - stemHeight * 0.6}px`
            }}
          />

          {/* Seed - appears first, then stays */}
          <ellipse
            cx={size / 2}
            cy={size / 2}
            rx={seedSize * 0.6}
            ry={seedSize * 0.8}
            fill="url(#seedGradient)"
            opacity="0"
            style={{
              animation: 'seedAppear 2s ease-out infinite'
            }}
          />
        </svg>
      </div>

      <style>{`
        @keyframes seedAppear {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          5% {
            opacity: 1;
            transform: scale(1);
          }
          92% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.95);
          }
        }

        @keyframes rootHint {
          0%, 14% {
            opacity: 0;
            transform: translateY(0) scaleY(0);
          }
          15% {
            opacity: 0.6;
            transform: translateY(0) scaleY(0.3);
          }
          20% {
            opacity: 0.4;
            transform: translateY(0) scaleY(0.5);
          }
          25% {
            opacity: 0;
            transform: translateY(0) scaleY(0.5);
          }
          100% {
            opacity: 0;
            transform: translateY(0) scaleY(0);
          }
        }

        @keyframes stemGrow {
          0%, 14% {
            opacity: 0;
            transform: scaleY(0);
          }
          15% {
            opacity: 1;
            transform: scaleY(0);
          }
          40% {
            opacity: 1;
            transform: scaleY(1);
          }
          92% {
            opacity: 1;
            transform: scaleY(1);
          }
          100% {
            opacity: 0;
            transform: scaleY(0);
          }
        }

        @keyframes leafUnfurlLeft {
          0%, 42% {
            opacity: 0;
            transform: rotate(-90deg) scale(0.3);
          }
          43% {
            opacity: 1;
            transform: rotate(-90deg) scale(0.3);
          }
          55% {
            opacity: 1;
            transform: rotate(-25deg) scale(1.05);
          }
          60% {
            opacity: 1;
            transform: rotate(-20deg) scale(1);
          }
          92% {
            opacity: 1;
            transform: rotate(-20deg) scale(1);
          }
          100% {
            opacity: 0;
            transform: rotate(-90deg) scale(0.3);
          }
        }

        @keyframes leafUnfurlRight {
          0%, 42% {
            opacity: 0;
            transform: rotate(90deg) scale(0.3);
          }
          43% {
            opacity: 1;
            transform: rotate(90deg) scale(0.3);
          }
          55% {
            opacity: 1;
            transform: rotate(25deg) scale(1.05);
          }
          60% {
            opacity: 1;
            transform: rotate(20deg) scale(1);
          }
          92% {
            opacity: 1;
            transform: rotate(20deg) scale(1);
          }
          100% {
            opacity: 0;
            transform: rotate(90deg) scale(0.3);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingAnimation;
