export interface SensorData {
  temperature: number; // °C
  relativeHumidity: number; // %
  vpd: number; // kPa (calculated from T and RH)
  co2: number; // ppm
  ppfd: number; // μmol/m²/s
  airflowVelocity: number; // m/s
  solutionTemperature: number; // °C
  ec: number; // mS/cm
  ph: number;
  stomataOpenings: number; // %
  photosynthesisRate: number; // μmol CO₂/m²/s
}

export interface ExternalConditions {
  temperature: number; // °C
  relativeHumidity: number; // %
}

export interface ActuatorState {
  heatPump: number; // 0-100% (dehumidify)
  cooldown: number; // 0-100% (cooling)
  watersideEconomizer: number; // 0-100% (HVAC efficiency)
  co2Valve: number; // 0-100% (CO2 injection)
  chiller: number; // 0-100% (solution cooling)
  ecPump: number; // 0-100% (EC adjustment)
  phPump: number; // 0-100% (pH adjustment)
  ledDimmer: number; // 0-100% (light intensity)
}

export interface SetValues {
  temperature: number;
  relativeHumidity: number;
  vpd: number; // Calculated, not directly set
  co2: number;
  ppfd: number;
  airflowVelocity: number;
  solutionTemperature: number;
  ec: number;
  ph: number;
  stomataOpenings: number;
  photosynthesisRate: number;
}

export interface ActionLog {
  id: string;
  timestamp: Date;
  parameter: keyof SensorData;
  oldValue: number;
  newValue: number;
  reason: string;
  source: 'ai' | 'manual';
}

export interface PlantStage {
  stage: 'germination' | 'vegetative' | 'flowering' | 'fruiting' | 'harvest';
  day: number;
}

export interface SimulationTime {
  day: number;
  hour: number;
  minute: number;
  cycleDay: number;
}

export interface CycleData {
  cycleNumber: number;
  startDate: Date;
  endDate?: Date;
  duration?: number; // days
  finalYield?: number; // grams
  quality?: number; // 0-100
  averagePhotosynthesis?: number;
  averageStomata?: number;
  cycleDay: number;
}

