import React from 'react';
import ServicePage from './ServicePage';
import { useLanguage } from '../contexts/LanguageContext';

const TurnkeyProjects: React.FC = () => {
  const { language } = useLanguage();
  
  const featuresKey = language === 'tr' 
    ? ['service2.feature1', 'service2.feature2', 'service2.feature3', 'service2.feature4']
    : ['service2.feature1', 'service2.feature2', 'service2.feature3', 'service2.feature4'];
    
  const processKey = language === 'tr'
    ? ['service2.process1', 'service2.process2', 'service2.process3', 'service2.process4']
    : ['service2.process1', 'service2.process2', 'service2.process3', 'service2.process4'];

  return (
    <ServicePage
      titleKey="services.service2.title"
      subtitleKey="service2.subtitle"
      descriptionKey="service2.description"
      featuresKey={featuresKey}
      processKey={processKey}
      customBackground="white"
      heroBackgroundImage="/bg3.png"
    />
  );
};

export default TurnkeyProjects;
