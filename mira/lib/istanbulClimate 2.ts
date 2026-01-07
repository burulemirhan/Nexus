/**
 * Generate realistic external climate data for Istanbul, Turkey
 * Based on Istanbul's temperate climate with Mediterranean/Black Sea influence
 */

export interface ClimateData {
  temperature: number; // °C
  relativeHumidity: number; // %
}

/**
 * Calculate day of year (1-365) from simulation day
 */
function getDayOfYear(day: number): number {
  return (day % 365) + 1;
}

/**
 * Generate Istanbul climate data based on day of year and time of day
 * @param day - Simulation day number
 * @param hour - Hour of day (0-23)
 * @param addVariation - Whether to add random variation (default: false for SSR consistency)
 */
export function generateIstanbulClimate(
  day: number,
  hour: number,
  addVariation: boolean = false
): ClimateData {
  const dayOfYear = getDayOfYear(day);
  
  // Seasonal base temperatures (monthly averages for Istanbul)
  // Using sine wave approximation for smooth seasonal variation
  // Peak summer (July, day ~182): ~24°C
  // Peak winter (January, day ~15): ~6°C
  const seasonalBaseTemp = 15 + 9 * Math.sin((dayOfYear - 81) * (2 * Math.PI / 365));
  
  // Day/night temperature variation (Istanbul: ~6-8°C difference)
  const isDaytime = hour >= 6 && hour < 20;
  const dayProgress = isDaytime 
    ? (hour - 6) / 14 // 0 to 1 during day
    : hour < 6
    ? (hour + 18) / 14 // Night before 6 AM
    : 0; // Night after 8 PM
  
  // Temperature peaks around 2 PM (14:00), lowest around 4 AM
  const dayNightTempVariation = isDaytime
    ? Math.sin(dayProgress * Math.PI) * 4 // +4°C peak at midday
    : -4; // -4°C at night
  
  // Seasonal humidity (higher in winter, lower in summer)
  // Summer: ~65%, Winter: ~75%
  const seasonalBaseHumidity = 70 - 5 * Math.sin((dayOfYear - 81) * (2 * Math.PI / 365));
  
  // Day/night humidity variation (higher at night, lower during day)
  const dayNightHumidityVariation = isDaytime
    ? -8 + Math.sin(dayProgress * Math.PI) * 3 // Lower during day, varies
    : 10; // +10% at night
  
  // Add realistic variation only if requested (for client-side updates)
  const tempVariation = addVariation ? (Math.random() - 0.5) * 2 : 0; // ±1°C
  const humidityVariation = addVariation ? (Math.random() - 0.5) * 5 : 0; // ±2.5%
  
  const temperature = seasonalBaseTemp + dayNightTempVariation + tempVariation;
  const relativeHumidity = Math.max(45, Math.min(85, seasonalBaseHumidity + dayNightHumidityVariation + humidityVariation));
  
  return {
    temperature: Math.round(temperature * 10) / 10,
    relativeHumidity: Math.round(relativeHumidity * 10) / 10,
  };
}

