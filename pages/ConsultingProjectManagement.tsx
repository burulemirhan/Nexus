import React from 'react';
import ServicePage from './ServicePage';
import { useLanguage } from '../contexts/LanguageContext';

const ConsultingProjectManagement: React.FC = () => {
  const { language } = useLanguage();
  
  const featuresKey = language === 'tr' 
    ? ['service4.feature1', 'service4.feature2', 'service4.feature3', 'service4.feature4']
    : ['service4.feature1', 'service4.feature2', 'service4.feature3', 'service4.feature4'];
    
  const processKey = language === 'tr'
    ? ['service4.process1', 'service4.process2', 'service4.process3', 'service4.process4']
    : ['service4.process1', 'service4.process2', 'service4.process3', 'service4.process4'];

  return (
    <ServicePage
      titleKey="services.service4.title"
      subtitleKey="service4.subtitle"
      descriptionKey="service4.description"
      featuresKey={featuresKey}
      processKey={processKey}
      customBackground="white"
      heroBackgroundImage="/bg5.png"
    />
  );
};

export default ConsultingProjectManagement;
