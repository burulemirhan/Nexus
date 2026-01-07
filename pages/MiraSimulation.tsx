import React from 'react';
import { LanguageProvider } from '../mira/contexts/LanguageContext';
import Dashboard from '../mira/pages/Dashboard';

interface MiraSimulationProps {
  lang: 'tr' | 'en';
}

const MiraSimulation: React.FC<MiraSimulationProps> = ({ lang }) => {
  return (
    <LanguageProvider defaultLanguage={lang}>
      <Dashboard />
    </LanguageProvider>
  );
};

export default MiraSimulation;
