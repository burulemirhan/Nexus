import { SensorData, SetValues, ActionLog, PlantStage } from '../types/index';
import { calculateVPD } from './vpdCalculator';

export class AIAgent {
  private optimalRanges: Record<PlantStage['stage'], Partial<SetValues>>;
  private learningHistory: Array<{
    sensorData: SensorData;
    setValues: SetValues;
    plantResponse: { stomataOpenings: number; photosynthesisRate: number };
    timestamp: Date;
  }> = [];

  constructor(optimalRanges?: Record<PlantStage['stage'], Partial<SetValues>>) {
    // Use provided optimal ranges or default ones
    this.optimalRanges = optimalRanges || {
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
  }

  analyzeAndAdjust(
    currentSensorData: SensorData,
    currentSetValues: SetValues,
    plantStage: PlantStage,
    yieldProgress?: { current: number; target: number },
    cycleDay?: number
  ): ActionLog | null {
    const optimal = this.optimalRanges[plantStage.stage];
    const adjustments: Array<{
      parameter: keyof SensorData;
      current: number;
      optimal: number;
      set: number;
      priority: number;
    }> = [];

    // Analyze parameters (excluding VPD which is calculated, and plant responses)
    const adjustableParams: Array<keyof SensorData> = [
      'temperature',
      'relativeHumidity',
      'co2',
      'ppfd',
      'airflowVelocity',
      'solutionTemperature',
      'ec',
      'ph',
    ];

    adjustableParams.forEach((param) => {
      const current = currentSensorData[param];
      const set = currentSetValues[param];
      const optimalValue = optimal[param];

      if (optimalValue !== undefined) {
        // CRITICAL: AI should maintain set values by responding to sensor deviations
        // Check if sensor reading deviates from SET value (not just optimal)
        const deviationFromSet = Math.abs(current - set);
        const deviationFromOptimal = Math.abs(current - optimalValue);
        const setDeviationFromOptimal = Math.abs(set - optimalValue);
        
        // Calculate priority based on deviation and plant response
        let priority = 0;
        
        // Increase priority if yield is behind schedule
        const yieldMultiplier = yieldProgress && cycleDay
          ? Math.max(1, 1 + ((yieldProgress.target - yieldProgress.current) / yieldProgress.target) * 2)
          : 1;
        
        // Priority 1: Sensor reading deviates from SET value (maintain set values)
        // This is the most important - AI should keep sensor readings close to set values
        if (deviationFromSet > set * 0.03 || deviationFromSet > 0.5) {
          // High priority if sensor is drifting from set value
          priority = Math.max(priority, deviationFromSet * 20 * yieldMultiplier);
        }
        
        // Priority 2: Set value deviates from optimal (optimize for plant stage)
        if (setDeviationFromOptimal > optimalValue * 0.05 && Math.abs(set - optimalValue) > 0.2) {
          // Medium priority to optimize set values
          if (deviationFromOptimal > setDeviationFromOptimal * 1.2) {
            priority = Math.max(priority, deviationFromOptimal * 15 * yieldMultiplier);
          } else {
            priority = Math.max(priority, setDeviationFromOptimal * 8 * yieldMultiplier);
          }
        }
        
        // Priority 3: Sensor reading deviates from optimal (even if set is close)
        if (deviationFromOptimal > optimalValue * 0.1 && deviationFromSet < set * 0.05) {
          // Lower priority - sensor is close to set but far from optimal
          priority = Math.max(priority, deviationFromOptimal * 6 * yieldMultiplier);
        }

        if (priority > 2) {
          adjustments.push({
            parameter: param,
            current,
            optimal: optimalValue,
            set,
            priority,
          });
        }
      }
    });

    // Check plant response indicators
    const lowPhotosynthesis = currentSensorData.photosynthesisRate < 8;
    const lowStomata = currentSensorData.stomataOpenings < 40;

    if (lowPhotosynthesis) {
      // Try to improve photosynthesis
      if (currentSetValues.co2 < optimal.co2! * 0.9) {
        adjustments.push({
          parameter: 'co2',
          current: currentSensorData.co2,
          optimal: optimal.co2!,
          set: currentSetValues.co2,
          priority: 15,
        });
      }
      if (currentSetValues.ppfd < optimal.ppfd! * 0.9) {
        adjustments.push({
          parameter: 'ppfd',
          current: currentSensorData.ppfd,
          optimal: optimal.ppfd!,
          set: currentSetValues.ppfd,
          priority: 12,
        });
      }
    }

    if (lowStomata) {
      // Try to improve stomata opening by adjusting T and RH (which affects VPD)
      const currentVPD = calculateVPD(currentSensorData.temperature, currentSensorData.relativeHumidity);
      const optimalVPD = optimal.vpd!;
      
      if (currentVPD > optimalVPD * 1.2) {
        // VPD too high - increase RH or decrease T
        if (currentSetValues.relativeHumidity < optimal.relativeHumidity! * 0.95) {
          adjustments.push({
            parameter: 'relativeHumidity',
            current: currentSensorData.relativeHumidity,
            optimal: optimal.relativeHumidity!,
            set: currentSetValues.relativeHumidity,
            priority: 12,
          });
        } else if (currentSetValues.temperature > optimal.temperature! * 1.05) {
          adjustments.push({
            parameter: 'temperature',
            current: currentSensorData.temperature,
            optimal: optimal.temperature!,
            set: currentSetValues.temperature,
            priority: 10,
          });
        }
      } else if (currentVPD < optimalVPD * 0.8) {
        // VPD too low - decrease RH or increase T
        if (currentSetValues.relativeHumidity > optimal.relativeHumidity! * 1.05) {
          adjustments.push({
            parameter: 'relativeHumidity',
            current: currentSensorData.relativeHumidity,
            optimal: optimal.relativeHumidity!,
            set: currentSetValues.relativeHumidity,
            priority: 10,
          });
        }
      }
    }

    // Sort by priority and make the highest priority adjustment
    adjustments.sort((a, b) => b.priority - a.priority);

    // Always make adjustments if there are any (AI should be continuously active)
    // Only add small randomness for very low priority adjustments
    if (adjustments.length > 0) {
      const adjustment = adjustments[0];
      // Only skip if priority is very low and random chance
      if (adjustment.priority < 5 && Math.random() > 0.2) {
        return null; // Skip very low priority adjustments 80% of the time
      }
      
      // Calculate new value - prioritize bringing sensor reading closer to set value
      let newValue: number;
      const deviationFromSet = Math.abs(adjustment.current - adjustment.set);
      
      if (deviationFromSet > adjustment.set * 0.03) {
        // Sensor is drifting from set value - adjust set value to compensate
        // Move set value towards current reading to reduce deviation
        const correction = (adjustment.current - adjustment.set) * 0.3; // 30% correction
        newValue = adjustment.set + correction;
      } else {
        // Sensor is close to set value - optimize towards optimal
        newValue = this.calculateNewValue(
          adjustment.set,
          adjustment.optimal,
          adjustment.current
        );
      }

      // Only return adjustment if there's a meaningful change (lowered threshold)
      if (Math.abs(newValue - adjustment.set) < 0.05) {
        return null; // No meaningful change
      }

      // Record learning
      this.learningHistory.push({
        sensorData: currentSensorData,
        setValues: currentSetValues,
        plantResponse: {
          stomataOpenings: currentSensorData.stomataOpenings,
          photosynthesisRate: currentSensorData.photosynthesisRate,
        },
        timestamp: new Date(),
      });

      const reason = this.generateReason(adjustment, plantStage);

      return {
        id: `ai-${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
        parameter: adjustment.parameter,
        oldValue: adjustment.set,
        newValue,
        reason,
        source: 'ai',
      };
    }

    return null;
  }

  private calculateNewValue(
    currentSet: number,
    optimal: number,
    currentSensor: number
  ): number {
    // Only adjust if there's a meaningful difference (lowered threshold)
    const difference = Math.abs(optimal - currentSet);
    if (difference < 0.2) {
      return currentSet; // No meaningful change
    }

    // Gradual adjustment towards optimal (10-20% step for more frequent smaller adjustments)
    const stepSize = 0.1 + Math.random() * 0.1; // Randomize step size slightly
    const direction = optimal > currentSet ? 1 : -1;
    const step = difference * stepSize;
    const newValue = currentSet + direction * step;
    
    // Clamp to reasonable bounds (within 50-150% of optimal)
    const clamped = Math.max(optimal * 0.5, Math.min(optimal * 1.5, newValue));
    
    // Round to 1 decimal place to avoid floating point issues
    return Math.round(clamped * 10) / 10;
  }

  private generateReason(
    adjustment: {
      parameter: keyof SensorData;
      current: number;
      optimal: number;
      set: number;
    },
    plantStage: PlantStage
  ): string {
    const paramNames: Record<keyof SensorData, string> = {
      temperature: 'Temperature',
      relativeHumidity: 'Relative Humidity',
      vpd: 'VPD',
      co2: 'CO₂',
      ppfd: 'PPFD',
      airflowVelocity: 'Airflow Velocity',
      solutionTemperature: 'Solution Temperature',
      ec: 'EC',
      ph: 'pH',
      stomataOpenings: 'Stomata Openings',
      photosynthesisRate: 'Photosynthesis Rate',
    };

    const reasons = [
      `Optimizing ${paramNames[adjustment.parameter]} for ${plantStage.stage} stage. Current reading (${adjustment.current.toFixed(1)}) deviates from optimal (${adjustment.optimal.toFixed(1)}).`,
      `Adjusting ${paramNames[adjustment.parameter]} to improve plant response. Target: ${adjustment.optimal.toFixed(1)}.`,
      `Fine-tuning ${paramNames[adjustment.parameter]} based on plant performance indicators.`,
      `Adapting ${paramNames[adjustment.parameter]} for optimal ${plantStage.stage} growth conditions.`,
    ];

    return reasons[Math.floor(Math.random() * reasons.length)];
  }
}

