import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'tr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    'mira.subtitle': 'Multimodel Intelligent Regulation Agent',
    'mira.title': 'MIRA',
    'hero.description': 'An intelligent AI agent that continuously monitors and optimizes environmental parameters in climate-controlled growing chambers. Using real-time sensor data, visual and thermal imaging, and plant response indicators, MIRA autonomously adjusts actuators to maintain optimal growing conditions, maximizing yield and quality while minimizing resource consumption.',
    'hero.selectCrop': 'Select a crop above to begin the AI-powered growing simulation',
    'hero.cycleLength': 'Cycle Length:',
    'hero.targetYield': 'Target Yield:',
    'hero.initialParams': 'Initial Parameters:',
    'hero.selectToStart': 'Select to Start Simulation →',
    'dashboard.simulation': 'Simulation',
    'dashboard.aiBiologicalCaretaker': 'AI Biological Caretaker',
    'dashboard.syntheticData': 'Sensor readings: Synthetic Data Model',
    'dashboard.plantStage': 'Plant Stage',
    'dashboard.tabs.dashboard': 'Dashboard',
    'dashboard.tabs.control': 'Parameter Control',
    'dashboard.externalConditions': 'External Conditions',
    'dashboard.actuators': 'Actuators',
    'dashboard.cycle': 'Cycle',
    'dashboard.duration': 'Duration:',
    'dashboard.time': 'Time:',
    'dashboard.stage': 'Stage:',
    'dashboard.yieldProgress': 'Yield Progress',
    'dashboard.cycleHistory': 'Cycle History',
    'dashboard.completed': 'Completed:',
    'dashboard.avgQuality': 'Avg Quality:',
    'dashboard.bestQuality': 'Best Quality:',
    'sensor.temperature': 'Temperature',
    'sensor.relativeHumidity': 'Relative Humidity',
    'sensor.vpd': 'VPD (calc)',
    'sensor.co2': 'CO₂',
    'sensor.ppfd': 'PPFD',
    'sensor.airflowVelocity': 'Airflow Velocity',
    'sensor.solutionTemperature': 'Solution Temperature',
    'sensor.ec': 'EC',
    'sensor.ph': 'pH',
    'sensor.stomataOpenings': 'Stomata Openings',
    'sensor.photosynthesisRate': 'Photosynthesis Rate',
    'actuator.heatPump': 'Heat Pump',
    'actuator.cooldown': 'Cooldown',
    'actuator.watersideEconomizer': 'Waterside Economizer',
    'actuator.co2Valve': 'CO₂ Valve',
    'actuator.chiller': 'Chiller',
    'actuator.ecPump': 'EC Pump',
    'actuator.phPump': 'pH Pump',
    'actuator.ledDimmer': 'LED Dimmer',
    'crop.lettuce': 'Lettuce',
    'crop.lettuce.desc': 'Fast-growing leafy green, ideal for vertical farming',
    'crop.basil': 'Basil',
    'crop.basil.desc': 'Aromatic herb requiring warm conditions and high light',
    'crop.strawberry': 'Strawberry',
    'crop.strawberry.desc': 'Fruit crop requiring precise temperature and nutrient control',
    'crop.strawberries': 'Strawberries',
    'hero.upcoming': 'Upcoming...',
    'unit.days': 'days',
    'unit.grams': 'g',
    'nav.backMain': 'Back to main site',
    'nav.backMiraHome': 'Back to MIRA main page',
  },
  tr: {
    'mira.subtitle': 'Çok Modelli Akıllı Düzenleme Ajanı',
    'mira.title': 'MIRA',
    'hero.description': 'İklim kontrollü yetiştirme odalarında çevresel parametreleri sürekli izleyen ve optimize eden akıllı bir AI ajanı. Gerçek zamanlı sensör verileri, görsel ve termal görüntüleme ve bitki tepki göstergelerini kullanarak, MIRA optimal yetiştirme koşullarını korumak için aktüatörleri bağımsız olarak ayarlar, verimi ve kaliteyi maksimize ederken kaynak tüketimini minimize eder.',
    'hero.selectCrop': 'AI destekli yetiştirme simülasyonunu başlatmak için yukarıdan bir ürün seçin',
    'hero.cycleLength': 'Döngü Süresi:',
    'hero.targetYield': 'Hedef Verim:',
    'hero.initialParams': 'Başlangıç Parametreleri:',
    'hero.selectToStart': 'Simülasyonu Başlatmak İçin Seç →',
    'dashboard.simulation': 'Simülasyon',
    'dashboard.aiBiologicalCaretaker': 'AI Biyolojik Bakıcı',
    'dashboard.syntheticData': 'Sensör okumaları: Sentetik Veri Modeli',
    'dashboard.plantStage': 'Bitki Aşaması',
    'dashboard.tabs.dashboard': 'Kontrol Paneli',
    'dashboard.tabs.control': 'Parametre Kontrolü',
    'dashboard.externalConditions': 'Dış Koşullar',
    'dashboard.actuators': 'Aktüatörler',
    'dashboard.cycle': 'Döngü',
    'dashboard.duration': 'Süre:',
    'dashboard.time': 'Zaman:',
    'dashboard.stage': 'Aşama:',
    'dashboard.yieldProgress': 'Verim İlerlemesi',
    'dashboard.cycleHistory': 'Döngü Geçmişi',
    'dashboard.completed': 'Tamamlanan:',
    'dashboard.avgQuality': 'Ort. Kalite:',
    'dashboard.bestQuality': 'En İyi Kalite:',
    'sensor.temperature': 'Sıcaklık',
    'sensor.relativeHumidity': 'Bağıl Nem',
    'sensor.vpd': 'VPD (hesaplanan)',
    'sensor.co2': 'CO₂',
    'sensor.ppfd': 'PPFD',
    'sensor.airflowVelocity': 'Hava Akış Hızı',
    'sensor.solutionTemperature': 'Çözelti Sıcaklığı',
    'sensor.ec': 'EC',
    'sensor.ph': 'pH',
    'sensor.stomataOpenings': 'Stoma Açıklıkları',
    'sensor.photosynthesisRate': 'Fotosentez Hızı',
    'actuator.heatPump': 'Isı Pompası',
    'actuator.cooldown': 'Soğutma',
    'actuator.watersideEconomizer': 'Su Tarafı Ekonomizer',
    'actuator.co2Valve': 'CO₂ Valfi',
    'actuator.chiller': 'Soğutucu',
    'actuator.ecPump': 'EC Pompası',
    'actuator.phPump': 'pH Pompası',
    'actuator.ledDimmer': 'LED Dimmer',
    'crop.lettuce': 'Marul',
    'crop.lettuce.desc': 'Hızlı büyüyen yapraklı yeşil, dikey tarım için ideal',
    'crop.basil': 'Fesleğen',
    'crop.basil.desc': 'Sıcak koşullar ve yüksek ışık gerektiren aromatik bitki',
    'crop.strawberry': 'Çilek',
    'crop.strawberry.desc': 'Hassas sıcaklık ve besin kontrolü gerektiren meyve ürünü',
    'crop.strawberries': 'Çilek',
    'hero.upcoming': 'Yakında...',
    'unit.days': 'gün',
    'unit.grams': 'g',
    'nav.backMain': 'Ana siteye dön',
    'nav.backMiraHome': 'MIRA ana sayfaya dön',
  },
};

export function MiraLanguageProvider({ children, initialLang }: { children: ReactNode; initialLang: 'tr' | 'en' }) {
  const [language, setLanguage] = useState<Language>(initialLang);

  useEffect(() => {
    // Update language when initialLang prop changes
    setLanguage(initialLang);
  }, [initialLang]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useMiraLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useMiraLanguage must be used within MiraLanguageProvider');
  }
  return context;
}

