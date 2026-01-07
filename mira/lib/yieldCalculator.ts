import { PlantStage } from '../types/index';

/**
 * Calculate yield (grams) using a crop-aware curve:
 * - Very slow, near-linear growth in the first 1–2 weeks
 * - Moderate growth in the mid-phase
 * - Rapid (quasi-exponential) growth in the last 5–7 days
 * The curve is capped by targetYield and modulated by plant performance.
 */
export function calculateYield(
  day: number,
  plantStage: PlantStage,
  avgPhotosynthesis: number,
  avgStomata: number,
  optimalConditions: boolean,
  cycleLength: number,
  targetYield: number,
  cropId?: string
): number {
  // Guard rails
  const safeCycle = Math.max(1, cycleLength || 1);
  const safeTarget = Math.max(1, targetYield || 1);

  let fractionOfTarget = 0;

  // Special-case lettuce and basil:
  // - Linear growth until day 24 reaching ~55% of target (≈110g for 200g lettuce, ≈44g for 80g basil)
  // - Exponential (fast) growth from day 24 to harvest day 31
  if (cropId === 'lettuce' || cropId === 'basil') {
    const harvestDay = 31;
    const breakDay = 24;
    const breakFraction = 0.55; // 55% of target at day 24

    if (day <= 0) {
      fractionOfTarget = 0;
    } else if (day <= breakDay) {
      // Simple linear from 0 → 55% between day 0 and 24
      const p = day / breakDay;
      fractionOfTarget = breakFraction * p;
    } else if (day >= harvestDay) {
      fractionOfTarget = 1;
    } else {
      // Exponential-like ramp from 55% → 100% between day 24 and 31
      const t = (day - breakDay) / (harvestDay - breakDay); // 0..1
      const k = 3; // steepness
      const gain = (1 - Math.exp(-k * t)) / (1 - Math.exp(-k)); // normalized 0..1
      fractionOfTarget = breakFraction + (1 - breakFraction) * gain;
    }
  } else {
    // Generic curve for other crops (e.g., strawberries)
    // Define phase lengths
    // Early phase: first 1–2 weeks, capped so that at least last 5 days are reserved for fast growth
    const lastFastDays = Math.min(7, Math.max(5, Math.floor(safeCycle * 0.12))); // aim 5–7 days
    const earlyDays = Math.min(14, Math.max(7, Math.min(safeCycle - lastFastDays - 7, 14))); // 1–2 weeks
    const midDays = Math.max(0, safeCycle - earlyDays - lastFastDays);

    // Base curve (fraction of target) by piecewise phases:
    // - Early: very slow linear growth up to ~2% of target
    // - Mid: smooth ramp from ~2% → ~40% of target
    // - Late: fast rise approaching 100% with an exponential-like easing
    if (day <= 0) {
      fractionOfTarget = 0;
    } else if (day <= earlyDays) {
      const p = day / Math.max(1, earlyDays);
      fractionOfTarget = 0.02 * p; // up to 2% at end of early phase
    } else if (day <= earlyDays + midDays) {
      const p = (day - earlyDays) / Math.max(1, midDays); // 0..1
      // ease-in curve to ~40%
      fractionOfTarget = 0.02 + 0.38 * Math.pow(p, 1.2);
    } else {
      const dLate = Math.max(0, day - (earlyDays + midDays));
      const p = Math.min(1, dLate / Math.max(1, lastFastDays)); // 0..1 over lastFastDays
      // exponential-like approach from 40% → 100%
      const lateGain = 1 - Math.exp(-4 * p); // 0..~1
      fractionOfTarget = 0.40 + 0.60 * lateGain;
    }
  }

  // Performance multipliers
  // Encourage higher yield with better photosynthesis/stomata and optimal conditions
  let responseFactor = 1;
  if (avgPhotosynthesis > 15) responseFactor += 0.08;
  if (avgPhotosynthesis < 8) responseFactor -= 0.08;
  if (avgStomata > 70) responseFactor += 0.05;
  if (avgStomata < 40) responseFactor -= 0.05;
  if (optimalConditions) responseFactor += 0.05;
  responseFactor = Math.max(0.8, Math.min(1.2, responseFactor)); // clamp modestly

  const predicted = safeTarget * fractionOfTarget * responseFactor;
  return Math.max(0, Math.min(safeTarget, predicted));
}

/**
 * Calculate quality score (0-100) based on performance metrics
 */
export function calculateQuality(
  avgPhotosynthesis: number,
  avgStomata: number,
  optimalConditions: boolean,
  cycleDuration: number
): number {
  // Quality factors
  const photosynthesisScore = Math.min(40, (avgPhotosynthesis / 15) * 40); // Max 40 points
  const stomataScore = Math.min(30, (avgStomata / 80) * 30); // Max 30 points
  const conditionsScore = optimalConditions ? 20 : 10; // Max 20 points
  const efficiencyScore = Math.min(10, (120 / Math.max(cycleDuration, 1)) * 10); // Faster = better, max 10 points

  return Math.min(100, photosynthesisScore + stomataScore + conditionsScore + efficiencyScore);
}

