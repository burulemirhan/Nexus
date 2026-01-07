import { SensorData, SetValues, PlantStage, ExternalConditions } from '../types/index';
import { calculateVPD } from './vpdCalculator';
import { generateIstanbulClimate } from './istanbulClimate';

// Optimal ranges for different plant stages
const optimalRanges: Record<PlantStage['stage'], Partial<SetValues>> = {
  germination: {
    temperature: 24,
    relativeHumidity: 85,
    vpd: 0.3,
    co2: 400,
    ppfd: 100,
    ph: 6.0,
    ec: 0.8,
  },
  vegetative: {
    temperature: 22,
    relativeHumidity: 70,
    vpd: 0.8,
    co2: 800,
    ppfd: 400,
    ph: 6.2,
    ec: 1.5,
  },
  flowering: {
    temperature: 20,
    relativeHumidity: 60,
    vpd: 1.0,
    co2: 1000,
    ppfd: 600,
    ph: 6.0,
    ec: 2.0,
  },
  fruiting: {
    temperature: 22,
    relativeHumidity: 65,
    vpd: 0.9,
    co2: 1200,
    ppfd: 700,
    ph: 6.2,
    ec: 2.2,
  },
  harvest: {
    temperature: 20,
    relativeHumidity: 55,
    vpd: 1.1,
    co2: 400,
    ppfd: 200,
    ph: 6.0,
    ec: 1.0,
  },
};

export class SyntheticDataGenerator {
  private setValues: SetValues;
  private plantStage: PlantStage;
  private externalConditions: ExternalConditions;
  private simulationTime: { day: number; hour: number; minute: number };
  private time: number = 0;

  constructor(
    initialSetValues: SetValues,
    initialStage: PlantStage = { stage: 'vegetative', day: 1 },
    initialExternal: ExternalConditions = { temperature: 15, relativeHumidity: 60 },
    initialTime: { day: number; hour: number; minute: number } = { day: 0, hour: 6, minute: 0 }
  ) {
    this.setValues = { ...initialSetValues };
    this.plantStage = initialStage;
    this.externalConditions = initialExternal;
    this.simulationTime = initialTime;
  }

  updateSimulationTime(time: { day: number; hour: number; minute: number }) {
    this.simulationTime = time;
  }

  updateSetValues(newValues: Partial<SetValues>) {
    this.setValues = { ...this.setValues, ...newValues };
  }

  updatePlantStage(stage: PlantStage) {
    this.plantStage = stage;
  }

  updateExternalConditions(conditions: Partial<ExternalConditions>) {
    this.externalConditions = { ...this.externalConditions, ...conditions };
  }

  generateExternalConditions(): ExternalConditions {
    // Generate Istanbul climate based on simulation time
    return generateIstanbulClimate(this.simulationTime.day, this.simulationTime.hour);
  }

  getExternalConditions(): ExternalConditions {
    return { ...this.externalConditions };
  }

  generateSensorData(): SensorData {
    this.time += 0.1;
    
    const optimal = optimalRanges[this.plantStage.stage];
    const set = this.setValues;
    
    // Day/night cycle effects (6 AM - 6 PM = day, 6 PM - 6 AM = night)
    const isDaytime = this.simulationTime.hour >= 6 && this.simulationTime.hour < 18;
    const dayProgress = isDaytime 
      ? (this.simulationTime.hour - 6) / 14 // 0 to 1 during day
      : this.simulationTime.hour < 6
      ? (this.simulationTime.hour + 18) / 14 // Night before 6 AM
      : 0; // Night after 8 PM
    
    // Temperature variation: cooler at night, warmer during day
    // Day: slightly warmer (+1-2°C), Night: cooler (-2-3°C)
    const dayNightTempOffset = isDaytime 
      ? Math.sin(dayProgress * Math.PI) * 1.5 // +1.5°C peak at midday
      : -2.5; // -2.5°C at night
    
    // Humidity variation: higher at night, lower during day
    // Day: lower RH (-5-8%), Night: higher RH (+8-10%)
    const dayNightHumidityOffset = isDaytime
      ? -6 + Math.sin(dayProgress * Math.PI) * 2 // Lower during day, varies
      : 9; // +9% at night
    
    // Generate realistic sensor data with some variation and drift
    const noise = () => (Math.random() - 0.5) * 0.1;
    const drift = () => Math.sin(this.time * 0.01) * 0.05;
    const variation = (value: number, variance: number) => 
      value + (Math.random() - 0.5) * variance + drift();

    // PPFD is controlled by LED dimming, should be 0 at night
    // Day time: 6 AM - 6 PM (12 hours), Night: 6 PM - 6 AM (12 hours)
    const ppfdBase = isDaytime ? set.ppfd : 0; // 0 at night, full set value during day
    const ppfdVariation = ppfdBase + (Math.random() - 0.5) * 1; // Reduced variation for stability

    // Generate temperature and humidity with day/night variation
    const baseTemperature = set.temperature + dayNightTempOffset;
    const baseHumidity = set.relativeHumidity + dayNightHumidityOffset;
    const temperature = variation(baseTemperature, 1.5);
    const relativeHumidity = Math.max(30, Math.min(95, variation(baseHumidity, 5)));
    
    // Calculate VPD from temperature and relative humidity
    const vpd = calculateVPD(temperature, relativeHumidity);

    return {
      temperature,
      relativeHumidity,
      vpd, // Calculated from T and RH
      co2: Math.max(300, variation(set.co2, 50)),
      ppfd: Math.max(0, ppfdVariation),
      airflowVelocity: variation(set.airflowVelocity, 0.2),
      solutionTemperature: variation(set.solutionTemperature, 1.0),
      ec: Math.max(0.1, variation(set.ec, 0.2)),
      ph: Math.max(4.0, Math.min(8.0, variation(set.ph, 0.2))),
      stomataOpenings: Math.max(0, Math.min(100, variation(
        this.calculateStomataOpenings(set, optimal), 10
      ))),
      photosynthesisRate: Math.max(0, variation(
        this.calculatePhotosynthesisRate(set, optimal), 2
      )),
    };
  }

  private calculateStomataOpenings(set: SetValues, optimal: Partial<SetValues>): number {
    // Stomata opening depends on VPD, humidity, and light
    let base = 60;
    if (optimal.vpd && Math.abs(set.vpd - optimal.vpd) < 0.2) base += 20;
    if (optimal.relativeHumidity && Math.abs(set.relativeHumidity - optimal.relativeHumidity) < 10) base += 10;
    if (optimal.ppfd && set.ppfd > optimal.ppfd * 0.8) base += 10;
    return Math.min(100, base);
  }

  private calculatePhotosynthesisRate(set: SetValues, optimal: Partial<SetValues>): number {
    // Photosynthesis depends on CO2, light, and temperature
    let rate = 10;
    if (optimal.co2 && set.co2 > optimal.co2 * 0.9) rate += 5;
    if (optimal.ppfd && set.ppfd > optimal.ppfd * 0.8) rate += 8;
    if (optimal.temperature && Math.abs(set.temperature - optimal.temperature) < 2) rate += 5;
    return rate;
  }

  getSetValues(): SetValues {
    return { ...this.setValues };
  }

  getPlantStage(): PlantStage {
    return { ...this.plantStage };
  }
}

