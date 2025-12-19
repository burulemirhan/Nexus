import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-nexus-dark">
      <div className="text-center">
        <div className="font-tesla font-bold text-4xl md:text-6xl text-white uppercase tracking-wider mb-4" style={{ fontFamily: 'Barlow' }}>
          NEXUS
        </div>
        <div className="w-32 h-1 bg-white/20 mx-auto mt-4 overflow-hidden rounded-full">
          <div className="h-full bg-emerald-500 animate-pulse" style={{ width: '60%' }} />
        </div>
        <p className="text-white/60 text-sm mt-4 font-tech">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
