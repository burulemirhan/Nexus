import React from 'react';
import ServicePage from './ServicePage';
import { useLanguage } from '../contexts/LanguageContext';

const DefenseProjects: React.FC = () => {
  const { language } = useLanguage();
  
  const featuresKey = language === 'tr' 
    ? ['service3.feature1', 'service3.feature2', 'service3.feature3', 'service3.feature4']
    : ['service3.feature1', 'service3.feature2', 'service3.feature3', 'service3.feature4'];
    
  const processKey = language === 'tr'
    ? ['service3.process1', 'service3.process2', 'service3.process3', 'service3.process4']
    : ['service3.process1', 'service3.process2', 'service3.process3', 'service3.process4'];

  // Map each feature to its image
  const featureImagesMap: Record<string, string> = {
    'service3.feature1': '/defense1.png',
    'service3.feature2': '/defense2.png',
    'service3.feature3': '/defense3.png',
    'service3.feature4': '/defense4.png',
  };

  return (
    <ServicePage
      titleKey="services.service3.title"
      subtitleKey="service3.subtitle"
      descriptionKey="service3.description"
      featuresKey={featuresKey}
      processKey={processKey}
      customBackground="white"
      heroBackgroundImage="/bg4.png"
      centerFeatures={true}
      hideCTATitle={true}
      featureImagesMap={featureImagesMap}
    />
  );
};

export default DefenseProjects;
