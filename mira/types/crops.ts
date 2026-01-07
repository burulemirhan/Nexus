import { SetValues, PlantStage } from './index';

export interface CropConfig {
  id: string;
  name: string;
  description: string;
  cycleLength: number; // days
  targetYield: number; // grams
  initialSetValues: SetValues;
  initialStage: PlantStage;
  optimalRanges: {
    germination: Partial<SetValues>;
    vegetative: Partial<SetValues>;
    flowering: Partial<SetValues>;
    fruiting: Partial<SetValues>;
    harvest: Partial<SetValues>;
  };
}

export const cropConfigs: Record<string, CropConfig> = {
  lettuce: {
    id: 'lettuce',
    name: 'Lettuce',
    description: 'Fast-growing leafy green, ideal for vertical farming',
    cycleLength: 31,
    targetYield: 200,
    initialSetValues: {
      temperature: 20,
      relativeHumidity: 70,
      vpd: 0.8,
      co2: 450,
      ppfd: 0,
      airflowVelocity: 1.2,
      solutionTemperature: 18,
      ec: 1.2,
      ph: 6.0,
      stomataOpenings: 60,
      photosynthesisRate: 12,
    },
    initialStage: { stage: 'germination', day: 0 },
    optimalRanges: {
      germination: { temperature: 20, relativeHumidity: 80, co2: 450, ppfd: 0, ph: 6.0, ec: 0.8 },
      vegetative: { temperature: 20, relativeHumidity: 70, co2: 450, ppfd: 200, ph: 6.0, ec: 1.2 },
      flowering: { temperature: 18, relativeHumidity: 65, co2: 450, ppfd: 300, ph: 6.0, ec: 1.0 },
      fruiting: { temperature: 18, relativeHumidity: 65, co2: 450, ppfd: 350, ph: 6.0, ec: 1.0 },
      harvest: { temperature: 18, relativeHumidity: 60, co2: 450, ppfd: 250, ph: 6.0, ec: 0.8 },
    },
  },
  basil: {
    id: 'basil',
    name: 'Basil',
    description: 'Aromatic herb requiring warm conditions and high light',
    cycleLength: 31,
    targetYield: 80,
    initialSetValues: {
      temperature: 24,
      relativeHumidity: 65,
      vpd: 1.0,
      co2: 450,
      ppfd: 0,
      airflowVelocity: 1.5,
      solutionTemperature: 22,
      ec: 1.8,
      ph: 6.2,
      stomataOpenings: 60,
      photosynthesisRate: 12,
    },
    initialStage: { stage: 'germination', day: 0 },
    optimalRanges: {
      germination: { temperature: 24, relativeHumidity: 80, co2: 450, ppfd: 0, ph: 6.2, ec: 1.0 },
      vegetative: { temperature: 24, relativeHumidity: 65, co2: 450, ppfd: 300, ph: 6.2, ec: 1.8 },
      flowering: { temperature: 22, relativeHumidity: 60, co2: 450, ppfd: 400, ph: 6.0, ec: 2.0 },
      fruiting: { temperature: 22, relativeHumidity: 60, co2: 450, ppfd: 450, ph: 6.0, ec: 2.0 },
      harvest: { temperature: 20, relativeHumidity: 55, co2: 450, ppfd: 200, ph: 6.0, ec: 1.0 },
    },
  },
  strawberries: {
    id: 'strawberries',
    name: 'Strawberries',
    description: 'Fruit crop requiring precise temperature and nutrient control',
    cycleLength: 65,
    targetYield: 200,
    initialSetValues: {
      temperature: 22,
      relativeHumidity: 70,
      vpd: 0.8,
      co2: 450,
      ppfd: 0,
      airflowVelocity: 1.8,
      solutionTemperature: 20,
      ec: 2.0,
      ph: 6.0,
      stomataOpenings: 60,
      photosynthesisRate: 12,
    },
    initialStage: { stage: 'germination', day: 0 },
    optimalRanges: {
      germination: { temperature: 22, relativeHumidity: 85, co2: 450, ppfd: 0, ph: 6.0, ec: 1.0 },
      vegetative: { temperature: 22, relativeHumidity: 70, co2: 450, ppfd: 250, ph: 6.0, ec: 2.0 },
      flowering: { temperature: 20, relativeHumidity: 65, co2: 450, ppfd: 400, ph: 6.0, ec: 2.2 },
      fruiting: { temperature: 20, relativeHumidity: 65, co2: 450, ppfd: 500, ph: 6.0, ec: 2.2 },
      harvest: { temperature: 18, relativeHumidity: 60, co2: 450, ppfd: 300, ph: 6.0, ec: 1.5 },
    },
  },
};

