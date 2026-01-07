/**
 * Calculate VPD (Vapor Pressure Deficit) from temperature and relative humidity
 * VPD = (1 - RH/100) * SVP
 * where SVP (Saturated Vapor Pressure) is calculated using the Magnus formula
 */
export function calculateVPD(temperature: number, relativeHumidity: number): number {
  // Magnus formula for saturated vapor pressure (kPa)
  // SVP = 0.61094 * exp((17.625 * T) / (T + 243.04))
  const svp = 0.61094 * Math.exp((17.625 * temperature) / (temperature + 243.04));
  
  // VPD = (1 - RH/100) * SVP
  const vpd = (1 - relativeHumidity / 100) * svp;
  
  return Math.max(0, vpd); // Ensure non-negative
}

