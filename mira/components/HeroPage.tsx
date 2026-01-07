import { Link } from 'react-router-dom';
import { CropConfig } from '../types/crops';
import { cropConfigs } from '../types/crops';
import { calculateVPD } from '../lib/vpdCalculator';
import { useLanguage } from '../contexts/LanguageContext';

const NEXUS_URL = import.meta.env.MODE === 'development' ? 'http://localhost:3001' : 'https://nexusbiotech.org';

interface HeroPageProps {
  onCropSelect: (crop: CropConfig) => void;
}

export default function HeroPage({ onCropSelect }: HeroPageProps) {
  const { t, language, setLanguage } = useLanguage();
  const crops = Object.values(cropConfigs);

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-6xl w-full">
        {/* Top Bar: Back + Language Switcher */}
        <div className="flex items-center justify-between mb-4">
          <a
            href={NEXUS_URL}
            target="_top"
            rel="noopener noreferrer"
            className="mira-app-button inline-flex items-center justify-center px-4 md:px-6 py-1.5 md:py-2 text-[10px] md:text-xs"
          >
            <span className="mira-app-button__label font-medium">
              {t('nav.backMain')}
            </span>
          </a>
          <div className="flex gap-2 bg-dark-surface border border-dark-border rounded-lg p-1">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                language === 'en'
                  ? 'bg-accent text-dark-text font-medium'
                  : 'text-dark-text-secondary hover:text-dark-text'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('tr')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                language === 'tr'
                  ? 'bg-accent text-dark-text font-medium'
                  : 'text-dark-text-secondary hover:text-dark-text'
              }`}
            >
              TR
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-dark-text mb-4">{t('mira.title')}</h1>
          <p className="text-2xl text-accent mb-6">{t('mira.subtitle')}</p>
          <p className="text-lg text-dark-text-secondary max-w-3xl mx-auto leading-relaxed">
            {t('hero.description')}
          </p>
        </div>

        {/* Crop Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {crops.map((crop) => {
            const initialVPD = calculateVPD(
              crop.initialSetValues.temperature,
              crop.initialSetValues.relativeHumidity
            );
            const setValuesWithVPD = { ...crop.initialSetValues, vpd: initialVPD };

            const isUpcoming = crop.id === 'strawberries';

            return (
              <div
                key={crop.id}
                onClick={isUpcoming ? undefined : () => onCropSelect(crop)}
                className={`bg-dark-card border border-dark-border rounded-lg p-6 transition-all duration-300 group ${
                  isUpcoming
                    ? 'opacity-60 cursor-not-allowed'
                    : 'cursor-pointer hover:border-accent hover:shadow-lg hover:shadow-accent/20'
                }`}
              >
                <h2 className="text-2xl font-bold text-dark-text mb-2">{t(`crop.${crop.id}`)}</h2>
                <p className="text-sm text-dark-text-secondary mb-2">{t(`crop.${crop.id}.desc`)}</p>
                {isUpcoming && (
                  <p className="text-xs font-semibold text-accent mb-2">
                    {t('hero.upcoming')}
                  </p>
                )}
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-dark-text-secondary">{t('hero.cycleLength')}</span>
                    <span className="text-sm font-semibold text-dark-text">{crop.cycleLength} {t('unit.days')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-dark-text-secondary">{t('hero.targetYield')}</span>
                    <span className="text-sm font-semibold text-dark-text">{crop.targetYield}{t('unit.grams')}</span>
                  </div>
                </div>

                <div className="border-t border-dark-border pt-4">
                  <div className="text-xs text-dark-text-secondary mb-2">{t('hero.initialParams')}</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-dark-text-secondary">Temp: </span>
                      <span className="text-dark-text">{setValuesWithVPD.temperature}°C</span>
                    </div>
                    <div>
                      <span className="text-dark-text-secondary">RH: </span>
                      <span className="text-dark-text">{setValuesWithVPD.relativeHumidity}%</span>
                    </div>
                    <div>
                      <span className="text-dark-text-secondary">CO₂: </span>
                      <span className="text-dark-text">{setValuesWithVPD.co2}ppm</span>
                    </div>
                    <div>
                      <span className="text-dark-text-secondary">PPFD: </span>
                      <span className="text-dark-text">{setValuesWithVPD.ppfd}</span>
                    </div>
                    <div>
                      <span className="text-dark-text-secondary">EC: </span>
                      <span className="text-dark-text">{setValuesWithVPD.ec}mS/cm</span>
                    </div>
                    <div>
                      <span className="text-dark-text-secondary">pH: </span>
                      <span className="text-dark-text">{setValuesWithVPD.ph}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-dark-border">
                  <div className="text-center">
                    <span className="text-sm text-accent group-hover:text-accent-hover font-medium">
                      {isUpcoming ? t('hero.upcoming') : t('hero.selectToStart')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center text-xs text-dark-text-secondary">
          <p>{t('hero.selectCrop')}</p>
        </div>
      </div>
    </div>
  );
}
