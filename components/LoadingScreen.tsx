import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      <div className="relative w-32 h-32">
        {/* Plant Growth Animation */}
        <svg
          width="128"
          height="128"
          viewBox="0 0 128 128"
          className="absolute inset-0 m-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Seed */}
          <circle
            className="seed fill-emerald-500"
            cx="64"
            cy="100"
            r="4"
            opacity="0"
            style={{
              animation: 'seedAppear 0.5s ease-out forwards',
            }}
          />
          
          {/* Stem growing */}
          <line
            className="stem stroke-emerald-500"
            x1="64"
            y1="96"
            x2="64"
            y2="64"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0"
            style={{
              animation: 'stemGrow 2s ease-out 0.5s forwards',
            }}
          />
          
          {/* Left leaf */}
          <path
            className="leaf-left fill-emerald-500"
            d="M 64 70 Q 50 70 45 65 Q 50 68 64 72 Z"
            opacity="0"
            style={{
              animation: 'leafLeftGrow 1s ease-out 2s forwards',
            }}
          />
          
          {/* Right leaf */}
          <path
            className="leaf-right fill-emerald-500"
            d="M 64 72 Q 78 72 83 67 Q 78 70 64 74 Z"
            opacity="0"
            style={{
              animation: 'leafRightGrow 1s ease-out 2.2s forwards',
            }}
          />
          
          {/* Top sprout/leaf */}
          <circle
            className="sprout fill-emerald-400"
            cx="64"
            cy="58"
            r="6"
            opacity="0"
            style={{
              animation: 'sproutGrow 1.5s ease-out 2.5s forwards',
            }}
          />
        </svg>
        
        {/* Pulsing glow effect */}
        <div
          className="absolute inset-0 m-auto w-24 h-24 bg-emerald-500/20 rounded-full blur-xl"
          style={{
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
      </div>
      
      {/* CSS Animations */}
      <style>{`
        @keyframes seedAppear {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes stemGrow {
          from {
            opacity: 0;
            stroke-dasharray: 0, 32;
          }
          to {
            opacity: 1;
            stroke-dasharray: 32, 0;
          }
        }
        
        @keyframes leafLeftGrow {
          from {
            opacity: 0;
            transform: scale(0) rotate(-45deg);
            transform-origin: 64px 71px;
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
            transform-origin: 64px 71px;
          }
        }
        
        @keyframes leafRightGrow {
          from {
            opacity: 0;
            transform: scale(0) rotate(45deg);
            transform-origin: 64px 73px;
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
            transform-origin: 64px 73px;
          }
        }
        
        @keyframes sproutGrow {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 0.6;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
