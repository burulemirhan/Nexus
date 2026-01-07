import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { SensorData, SetValues, ActionLog, PlantStage, ExternalConditions, ActuatorState, SimulationTime, CycleData } from '../types/index';
import { SyntheticDataGenerator } from '../lib/syntheticData';
import { AIAgent } from '../lib/aiAgent';
import { calculateVPD } from '../lib/vpdCalculator';
import { calculateYield, calculateQuality } from '../lib/yieldCalculator';
import { generateIstanbulClimate } from '../lib/istanbulClimate';
import SensorCard from '../components/SensorCard';
import CameraFeed from '../components/CameraFeed';
import ParameterControl from '../components/ParameterControl';
import ActionsLog from '../components/ActionsLog';
import ActuatorCard from '../components/ActuatorCard';
import CycleInfo from '../components/CycleInfo';
import TimeSpeedControl from '../components/TimeSpeedControl';
import HeroPage from '../components/HeroPage';
import { CropConfig } from '../types/crops';
import { useLanguage } from '../contexts/LanguageContext';

const initialTime: SimulationTime = { day: 0, hour: 6, minute: 0, cycleDay: 0 };
const initialExternal: ExternalConditions = generateIstanbulClimate(0, 6); // Istanbul climate at day 0, 6 AM
const NEXUS_URL = import.meta.env.MODE === 'development' ? 'http://localhost:3001' : 'https://nexusbiotech.org';

export default function Dashboard() {
  const { t, language, setLanguage } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState<CropConfig | null>(null);
  
  // Calculate initial values from selected crop
  const getInitialValues = useCallback((crop: CropConfig | null) => {
    if (!crop) return null;
    const initialVPD = calculateVPD(crop.initialSetValues.temperature, crop.initialSetValues.relativeHumidity);
    return {
      setValues: { ...crop.initialSetValues, vpd: initialVPD },
      plantStage: crop.initialStage,
      targetYield: crop.targetYield,
    };
  }, []);

  const initialValues = selectedCrop ? getInitialValues(selectedCrop) : null;
  
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [setValues, setSetValues] = useState<SetValues | null>(null);
  const [plantStage, setPlantStage] = useState<PlantStage | null>(null);
  const [simulationTime, setSimulationTime] = useState<SimulationTime>(initialTime);
  const [externalConditions, setExternalConditions] = useState<ExternalConditions>(initialExternal);
  
  // Log initial parameters as actions (initialize empty, populate in useEffect to avoid hydration errors)
  const [actions, setActions] = useState<ActionLog[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'control'>('dashboard');
  const [adjustingParams, setAdjustingParams] = useState<Set<keyof SensorData>>(new Set());
  const [cycleNumber, setCycleNumber] = useState(1);
  const [cycles, setCycles] = useState<CycleData[]>([]);
  const [currentCycle, setCurrentCycle] = useState<CycleData>({
    cycleNumber: 1,
    startDate: new Date(),
    cycleDay: 0,
  });
  const [yieldData, setYieldData] = useState({ current: 0, target: 180 });
  const [performanceHistory, setPerformanceHistory] = useState<{
    photosynthesis: number[];
    stomata: number[];
  }>({ photosynthesis: [], stomata: [] });
  const [timeSpeed, setTimeSpeed] = useState(1); // 1x = normal speed

  const dataGeneratorRef = useRef<SyntheticDataGenerator | null>(null);
  const aiAgentRef = useRef<AIAgent | null>(null);

  // Initialize simulation when crop is selected
  const handleCropSelect = useCallback((crop: CropConfig) => {
    const initialVPD = calculateVPD(crop.initialSetValues.temperature, crop.initialSetValues.relativeHumidity);
    const initialSetValuesWithVPD = { ...crop.initialSetValues, vpd: initialVPD };
    
    setSelectedCrop(crop);
    setSensorData(initialSetValuesWithVPD);
    setSetValues(initialSetValuesWithVPD);
    setPlantStage(crop.initialStage);
    setYieldData({ current: 0, target: crop.targetYield });
    setPerformanceHistory({ photosynthesis: [], stomata: [] });
    setSimulationTime(initialTime);
    setCurrentCycle({
      cycleNumber: 1,
      startDate: new Date(),
      cycleDay: 0,
    });
    setCycleNumber(1);
    setCycles([]);
    setActions([]);
    
    // Initialize data generator and AI agent with crop-specific settings
    dataGeneratorRef.current = new SyntheticDataGenerator(
      initialSetValuesWithVPD,
      crop.initialStage,
      initialExternal,
      initialTime
    );
    aiAgentRef.current = new AIAgent(crop.optimalRanges);
    
    // Log initial parameters
    const initialActions: ActionLog[] = Object.entries(initialSetValuesWithVPD)
      .filter(([key]) => key !== 'stomataOpenings' && key !== 'photosynthesisRate' && key !== 'vpd')
      .map(([key, value]) => ({
        id: `initial-${key}-${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
        parameter: key as keyof SensorData,
        oldValue: 0,
        newValue: value,
        reason: `Initial parameter setting for ${crop.name} - ${key}`,
        source: 'ai' as const,
      }));
    setActions(initialActions);
  }, []);

  // Calculate actuator states from set values and external conditions
  const actuatorStates = useMemo<ActuatorState>(() => {
    if (!setValues) {
      return {
        heatPump: 0,
        cooldown: 0,
        watersideEconomizer: 0,
        co2Valve: 0,
        chiller: 0,
        ecPump: 0,
        phPump: 0,
        ledDimmer: 0,
      };
    }
    const ext = externalConditions;
    const set = setValues;
    
    // Heat pump (dehumidify) - active when RH is high
    const heatPump = set.relativeHumidity > 75 ? Math.min(100, (set.relativeHumidity - 75) * 4) : 0;
    
    // Cooldown - active when temperature is high
    const cooldown = set.temperature > 24 ? Math.min(100, (set.temperature - 24) * 10) : 0;
    
    // Waterside economizer - active when external conditions are favorable for free cooling
    // Works best when: external temp is significantly lower than set temp AND external humidity is acceptable
    // Efficiency increases with larger temperature difference
    const tempDifference = set.temperature - ext.temperature;
    const humidityAcceptable = ext.relativeHumidity < 80; // Economizer works if external RH < 80%
    const favorableConditions = tempDifference > 3 && humidityAcceptable;
    
    let watersideEconomizer = 0;
    if (favorableConditions) {
      // Efficiency based on temperature difference (more difference = more efficient)
      // Also consider if we need cooling (set temp > optimal for stage)
      const efficiency = Math.min(100, tempDifference * 8); // Up to 100% efficiency
      watersideEconomizer = efficiency;
    } else if (tempDifference > 1 && humidityAcceptable) {
      // Partial efficiency when conditions are somewhat favorable
      watersideEconomizer = Math.min(50, tempDifference * 5);
    }
    
    // CO2 valve - based on CO2 set point
    const co2Valve = set.co2 > 400 ? Math.min(100, ((set.co2 - 400) / 16)) : 0;
    
    // Chiller - for solution temperature control
    const chiller = set.solutionTemperature > 22 ? Math.min(100, (set.solutionTemperature - 22) * 20) : 0;
    
    // EC pump - based on EC set point
    const ecPump = set.ec > 1.0 ? Math.min(100, ((set.ec - 1.0) / 0.04)) : 0;
    
    // pH pump - based on pH deviation from 6.0
    const phPump = Math.abs(set.ph - 6.0) > 0.1 ? Math.min(100, Math.abs(set.ph - 6.0) * 50) : 0;
    
    // LED dimmer - directly maps to PPFD (0-1000 PPFD = 0-100%)
    const ledDimmer = Math.min(100, (set.ppfd / 10));
    
    return {
      heatPump: Math.round(heatPump),
      cooldown: Math.round(cooldown),
      watersideEconomizer: Math.round(watersideEconomizer),
      co2Valve: Math.round(co2Valve),
      chiller: Math.round(chiller),
      ecPump: Math.round(ecPump),
      phPump: Math.round(phPump),
      ledDimmer: Math.round(ledDimmer),
    };
  }, [setValues, externalConditions]);

  const handleParameterUpdate = useCallback(
    (parameter: keyof SetValues, value: number) => {
      if (!setValues) return;
      
      const oldValue = setValues[parameter];
      
      // If updating temperature or RH, recalculate VPD
      let updatedValues: Partial<SetValues> = { [parameter]: value };
      if (parameter === 'temperature' || parameter === 'relativeHumidity') {
        const newTemp = parameter === 'temperature' ? value : setValues.temperature;
        const newRH = parameter === 'relativeHumidity' ? value : setValues.relativeHumidity;
        updatedValues.vpd = calculateVPD(newTemp, newRH);
      }
      
      setSetValues((prev) => (prev ? { ...prev, ...updatedValues } : prev));
      dataGeneratorRef.current?.updateSetValues(updatedValues);

      // For PPFD, update the sensor reading immediately to reflect real-time LED response
      if (parameter === 'ppfd') {
        setSensorData((prev) => (prev ? { ...prev, ppfd: value } : prev));
      }

      // Log manual action
      const action: ActionLog = {
        id: `manual-${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
        parameter: parameter as keyof SensorData,
        oldValue,
        newValue: value,
        reason: `Manual adjustment of ${parameter}`,
        source: 'manual',
      };
      setActions((prev) => [...prev, action]);
    },
    [setValues]
  );

  // Calculate gradual PPFD increase based on plant growth
  const calculateGradualPPFD = useCallback((day: number, stage: PlantStage['stage'], optimalPPFD: number, hour: number): number => {
    if (!selectedCrop) return 0;
    
    // PPFD starts at 0 and gradually increases after germination
    // Night time: PPFD should be 0 (6 PM - 6 AM)
    const isDaytime = hour >= 6 && hour < 18; // 6 AM to 6 PM = day, 6 PM to 6 AM = night
    
    if (!isDaytime) {
      return 0; // No light at night
    }
    
    // Determine germination period based on crop type
    const germinationDays = selectedCrop.id === 'strawberries' ? 7 : 2.5; // 2-3 days for lettuce/basil, 7 for strawberries
    
    if (day < germinationDays) {
      // Stay at 0 during germination
      return 0;
    }
    
    // Gradual increase after germination
    let targetPPFD = optimalPPFD;
    const daysSinceGermination = day - germinationDays;
    
    switch (stage) {
      case 'germination':
        // After germination period, start gradual increase
        // Increase over 5 days from germination end
        const germProgress = Math.min(1, daysSinceGermination / 5);
        const initialTarget = selectedCrop.optimalRanges.vegetative.ppfd || 0;
        return initialTarget * germProgress;
      case 'vegetative':
        // Continue gradual increase to vegetative target
        const vegDaysToReach = 7; // Reach target in 7 days after germination ends
        const vegProgress = Math.min(1, daysSinceGermination / vegDaysToReach);
        return targetPPFD * vegProgress;
      case 'flowering':
        // Transition from vegetative to flowering target
        const flowerDaysToReach = 5;
        const daysSinceVegetative = day - (germinationDays + 7);
        const flowerProgress = Math.min(1, daysSinceVegetative / flowerDaysToReach);
        const prevStagePPFD = selectedCrop.optimalRanges.vegetative.ppfd || 0;
        return prevStagePPFD + (targetPPFD - prevStagePPFD) * flowerProgress;
      case 'fruiting':
        // Only for strawberries - transition from flowering to fruiting target
        if (selectedCrop.id === 'strawberries') {
          const fruitDaysToReach = 5;
          const daysSinceFlowering = day - (germinationDays + 7 + 5);
          const fruitProgress = Math.min(1, daysSinceFlowering / fruitDaysToReach);
          const prevFlowerPPFD = selectedCrop.optimalRanges.flowering.ppfd || 0;
          return prevFlowerPPFD + (targetPPFD - prevFlowerPPFD) * fruitProgress;
        }
        // For lettuce/basil, use flowering PPFD (no fruiting stage)
        return selectedCrop.optimalRanges.flowering.ppfd || 0;
      case 'harvest':
        // Maintain or slightly reduce
        return targetPPFD;
      default:
        return 0;
    }
  }, [selectedCrop]);

  // Update plant stage based on day progression
  const updatePlantStage = useCallback((day: number, hour: number) => {
    if (!selectedCrop) return;
    
    // Determine germination period based on crop type
    const germinationDays = selectedCrop.id === 'strawberries' ? 7 : 2.5; // 2-3 days for lettuce/basil, 7 for strawberries
    
    let newStage: PlantStage['stage'] = 'germination';
    if (day < germinationDays) {
      newStage = 'germination';
    } else if (selectedCrop.id === 'strawberries') {
      // Strawberries have longer stages
      if (day < 30) {
        newStage = 'vegetative';
      } else if (day < 50) {
        newStage = 'flowering';
      } else if (day < 60) {
        newStage = 'fruiting';
      } else {
        newStage = 'harvest';
      }
    } else {
      // Lettuce and Basil: shorter cycle, 31 days max, no fruiting stage
      if (day < germinationDays + 20) {
        newStage = 'vegetative';
      } else if (day < germinationDays + 25) {
        newStage = 'flowering';
      } else {
        newStage = 'harvest'; // Skip fruiting, go directly to harvest
      }
    }
    
    if (newStage !== plantStage?.stage && selectedCrop && setValues) {
      const updatedStage: PlantStage = { stage: newStage, day };
      setPlantStage(updatedStage);
      dataGeneratorRef.current?.updatePlantStage(updatedStage);
      
      // Update set values based on crop-specific stage optimals
      const stageOptimal = selectedCrop.optimalRanges[newStage];
      const newTemp = stageOptimal.temperature || setValues.temperature;
      const newRH = stageOptimal.relativeHumidity || setValues.relativeHumidity;
      const newVPD = calculateVPD(newTemp, newRH);
      
      // Calculate gradual PPFD increase (considering day/night cycle)
      const optimalPPFD = stageOptimal.ppfd || 0;
      const gradualPPFD = calculateGradualPPFD(day, newStage, optimalPPFD, hour);
      
      // Calculate dynamic CO2 based on plant size (yield progress)
      const yieldProgress = yieldData.current / yieldData.target; // 0 to 1
      const baseCO2 = 450;
      const maxCO2 = selectedCrop.id === 'strawberries' ? 1200 : 800; // Higher for strawberries
      const dynamicCO2 = baseCO2 + (maxCO2 - baseCO2) * yieldProgress;
      
      setSetValues((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          ...stageOptimal,
          ppfd: gradualPPFD,
          co2: dynamicCO2,
          vpd: newVPD,
        };
      });
      dataGeneratorRef.current?.updateSetValues({ ...stageOptimal, ppfd: gradualPPFD, co2: dynamicCO2, vpd: newVPD });
    } else if (selectedCrop && setValues && plantStage) {
      // Update PPFD gradually even if stage hasn't changed (for day/night cycle)
      const stageOptimal = selectedCrop.optimalRanges[plantStage.stage];
      const optimalPPFD = stageOptimal.ppfd || 0;
      const gradualPPFD = calculateGradualPPFD(day, plantStage.stage, optimalPPFD, hour);
      
      if (Math.abs(setValues.ppfd - gradualPPFD) > 1) {
        setSetValues((prev) => {
          if (!prev) return null;
          return { ...prev, ppfd: gradualPPFD };
        });
        dataGeneratorRef.current?.updateSetValues({ ppfd: gradualPPFD });
      }
      
      // Update CO2 dynamically based on plant size (yield progress) to push photosynthesis
      // CO2 increases from base (450 ppm) to higher levels as plant grows
      const yieldProgress = yieldData.current / yieldData.target; // 0 to 1
      const baseCO2 = 450;
      const maxCO2 = selectedCrop.id === 'strawberries' ? 1200 : 800; // Higher for strawberries
      // CO2 increases linearly with plant size/yield progress
      const dynamicCO2 = baseCO2 + (maxCO2 - baseCO2) * yieldProgress;
      
      if (Math.abs(setValues.co2 - dynamicCO2) > 5) {
        setSetValues((prev) => {
          if (!prev) return null;
          return { ...prev, co2: dynamicCO2 };
        });
        dataGeneratorRef.current?.updateSetValues({ co2: dynamicCO2 });
      }
    }
  }, [plantStage, setValues, selectedCrop, calculateGradualPPFD, yieldData]);

  // Main simulation loop - only runs when crop is selected
  useEffect(() => {
    if (!selectedCrop || !sensorData || !setValues || !plantStage || !dataGeneratorRef.current || !aiAgentRef.current) {
      return;
    }
    
    const interval = setInterval(() => {
      // Progress time: 1 hour simulation = 3 seconds real time, 1 day = 72 seconds (1.2 minutes)
      setSimulationTime((prev) => {
        let newMinute = prev.minute;
        let newHour = prev.hour;
        let newDay = prev.day;
        let newCycleDay = prev.cycleDay;
        
        // Time progression: base is 1 hour per 3 seconds, multiplied by speed
        // With speed 1x: 1 hour = 3 seconds
        // With speed 200x: 200 hours = 3 seconds (8.33 days per update)
        const hoursPerUpdate = timeSpeed;
        const totalHours = newHour + hoursPerUpdate;
        const daysToAdd = Math.floor(totalHours / 24);
        newHour = Math.floor(totalHours % 24);
        newDay += daysToAdd;
        newCycleDay += daysToAdd;
        
        // Handle remaining minutes from fractional hours
        const remainingMinutes = (hoursPerUpdate % 1) * 60;
        newMinute += Math.floor(remainingMinutes);
        if (newMinute >= 60) {
          newMinute -= 60;
          newHour += 1;
          if (newHour >= 24) {
            newHour -= 24;
            newDay += 1;
            newCycleDay += 1;
          }
        }
        
        // Update simulation time in data generator
        dataGeneratorRef.current.updateSimulationTime({ day: newDay, hour: newHour, minute: newMinute });
        
        // Always update plant stage to gradually increase PPFD (considering day/night cycle)
        updatePlantStage(newDay, newHour);
        
        // Check if we crossed a day boundary (for stage updates and cycle checks)
        if (daysToAdd > 0) {
          
          // Update current cycle day
          setCurrentCycle((prev) => ({ ...prev, cycleDay: newCycleDay }));
          
          // Check for cycle completion (yield reached or max days)
          // For lettuce and basil, enforce 31-day max strictly
          const maxDays = selectedCrop 
            ? (selectedCrop.id === 'lettuce' || selectedCrop.id === 'basil') 
              ? selectedCrop.cycleLength // Strict 31 days for lettuce/basil
              : selectedCrop.cycleLength * 1.5 // Allow 50% over for strawberries
            : 200;
          if (yieldData.current >= yieldData.target || newDay >= maxDays) {
            // Complete cycle
            const avgPhotosynthesis = performanceHistory.photosynthesis.length > 0
              ? performanceHistory.photosynthesis.reduce((a, b) => a + b, 0) / performanceHistory.photosynthesis.length
              : 0;
            const avgStomata = performanceHistory.stomata.length > 0
              ? performanceHistory.stomata.reduce((a, b) => a + b, 0) / performanceHistory.stomata.length
              : 0;
            
            const completedCycle: CycleData = {
              ...currentCycle,
              endDate: new Date(),
              duration: newCycleDay,
              finalYield: yieldData.current,
              quality: calculateQuality(avgPhotosynthesis, avgStomata, true, newCycleDay),
              averagePhotosynthesis: avgPhotosynthesis,
              averageStomata: avgStomata,
            };
            
            setCycles((prev) => [...prev, completedCycle]);
            
            // Start new cycle with improved baseline (diminishing returns)
            const improvementFactor = Math.min(1.15, 1 + (cycles.length * 0.02)); // Max 15% improvement, diminishing
            const nextCycle: CycleData = {
              cycleNumber: cycleNumber + 1,
              startDate: new Date(),
              cycleDay: 0,
            };
            setCurrentCycle(nextCycle);
            setCycleNumber((prev) => prev + 1);
            const newTargetYield = selectedCrop 
              ? Math.min(selectedCrop.targetYield * 1.2, selectedCrop.targetYield * improvementFactor)
              : Math.min(200, 180 * improvementFactor);
            setYieldData({ current: 0, target: newTargetYield });
            setPerformanceHistory({ photosynthesis: [], stomata: [] });
            setPlantStage(selectedCrop ? selectedCrop.initialStage : { stage: 'germination', day: 0 });
            setSimulationTime({ day: 0, hour: 6, minute: 0, cycleDay: 0 });
            
            // Reset to crop-specific germination settings
            const germinationOptimal = selectedCrop ? selectedCrop.optimalRanges.germination : {
              temperature: 24,
              relativeHumidity: 85,
              co2: 400,
              ppfd: 100,
              ph: 6.0,
              ec: 0.8,
            };
            const germTemp = germinationOptimal.temperature || 24;
            const germRH = germinationOptimal.relativeHumidity || 85;
            const germinationValues = {
              ...germinationOptimal,
              vpd: calculateVPD(germTemp, germRH),
              airflowVelocity: setValues?.airflowVelocity || 1.5,
              solutionTemperature: setValues?.solutionTemperature || 20,
              stomataOpenings: 60,
              photosynthesisRate: 12,
            };
            setSetValues((prev) => {
              if (!prev) return null;
              return { ...prev, ...germinationValues };
            });
            dataGeneratorRef.current?.updateSetValues(germinationValues);
            dataGeneratorRef.current?.updatePlantStage(selectedCrop ? selectedCrop.initialStage : { stage: 'germination', day: 0 });
            
            return { day: 0, hour: 6, minute: 0, cycleDay: 0 };
          }
        }
        
        const newTime = { day: newDay, hour: newHour, minute: newMinute, cycleDay: newCycleDay };
        
        // Update external conditions based on Istanbul climate (using the new time, with variation)
        const newExternal = generateIstanbulClimate(newDay, newHour, true); // Add variation for realism
        setExternalConditions(newExternal);
        dataGeneratorRef.current.updateExternalConditions(newExternal);
        
        return newTime;
      });
      
      // Update sensor data
      const newSensorData = dataGeneratorRef.current.generateSensorData();
      setSensorData(newSensorData);
      
      // Track performance for yield calculation
      setPerformanceHistory((prev) => ({
        photosynthesis: [...prev.photosynthesis.slice(-100), newSensorData.photosynthesisRate],
        stomata: [...prev.stomata.slice(-100), newSensorData.stomataOpenings],
      }));
      
      // Calculate yield
      const avgPhotosynthesis = performanceHistory.photosynthesis.length > 0
        ? [...performanceHistory.photosynthesis, newSensorData.photosynthesisRate].reduce((a, b) => a + b, 0) / (performanceHistory.photosynthesis.length + 1)
        : newSensorData.photosynthesisRate;
      const avgStomata = performanceHistory.stomata.length > 0
        ? [...performanceHistory.stomata, newSensorData.stomataOpenings].reduce((a, b) => a + b, 0) / (performanceHistory.stomata.length + 1)
        : newSensorData.stomataOpenings;
      
      const optimalConditions = Math.abs(setValues.temperature - (plantStage.stage === 'germination' ? 24 : plantStage.stage === 'vegetative' ? 22 : 20)) < 2;
      const currentYield = calculateYield(
        simulationTime.day,
        plantStage,
        avgPhotosynthesis,
        avgStomata,
        optimalConditions,
        selectedCrop.cycleLength,
        yieldData.target,
        selectedCrop.id
      );
      setYieldData((prev) => ({ ...prev, current: currentYield }));

      // AI analysis and adjustment - check every update to maintain set values
      // AI should continuously monitor and adjust to keep sensor readings close to set values
      const adjustment = aiAgentRef.current.analyzeAndAdjust(
        newSensorData,
        setValues,
        plantStage,
        yieldData,
        simulationTime.cycleDay
      );

        if (adjustment) {
          // If adjusting temperature or RH, recalculate VPD
          let updatedValues: Partial<SetValues> = { [adjustment.parameter]: adjustment.newValue };
          if (adjustment.parameter === 'temperature' || adjustment.parameter === 'relativeHumidity') {
            const newTemp = adjustment.parameter === 'temperature' 
              ? adjustment.newValue 
              : setValues.temperature;
            const newRH = adjustment.parameter === 'relativeHumidity' 
              ? adjustment.newValue 
              : setValues.relativeHumidity;
            updatedValues.vpd = calculateVPD(newTemp, newRH);
          }
          
          setSetValues((prev) => {
            if (!prev) return null;
            return { ...prev, ...updatedValues };
          });
          dataGeneratorRef.current?.updateSetValues(updatedValues);
          setActions((prev) => [...prev, adjustment]);

          // Show adjusting animation
          setAdjustingParams((prev) => new Set(prev).add(adjustment.parameter));
          setTimeout(() => {
            setAdjustingParams((prev) => {
              const next = new Set(prev);
              next.delete(adjustment.parameter);
              return next;
            });
          }, 2000);
        }
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [
    selectedCrop,
    sensorData,
    setValues,
    plantStage,
    externalConditions,
    simulationTime,
    yieldData,
    performanceHistory,
    currentCycle,
    cycleNumber,
    cycles,
    updatePlantStage,
    timeSpeed,
  ]);

  // Show hero page if no crop is selected
  if (!selectedCrop) {
    return <HeroPage onCropSelect={handleCropSelect} />;
  }

  // Show dashboard if crop is selected
  if (!sensorData || !setValues || !plantStage) {
    return <div className="h-screen bg-dark-bg flex items-center justify-center text-dark-text">Loading...</div>;
  }

  return (
    <div className="h-screen bg-dark-bg flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-dark-border bg-dark-surface flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setSelectedCrop(null)}
                className="mira-app-button inline-flex items-center justify-center px-4 md:px-6 py-1.5 md:py-2 text-[10px] md:text-xs"
              >
                <span className="mira-app-button__label font-medium">
                  {t('nav.backMiraHome')}
                </span>
              </button>
              <div>
                <h1 className="text-lg font-bold text-dark-text">{t('mira.title')}</h1>
                <p className="text-[10px] text-dark-text-secondary">
                  {t('mira.subtitle')} - {t(`crop.${selectedCrop.id}`)} {t('dashboard.simulation')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-center border-l border-dark-border pl-4">
                <div className="text-[9px] text-dark-text-secondary leading-tight">
                  {t('dashboard.syntheticData')}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-2 bg-dark-surface border border-dark-border rounded-lg p-1">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-2 py-1 text-[10px] rounded transition-colors ${
                      language === 'en'
                        ? 'bg-accent text-dark-text font-medium'
                        : 'text-dark-text-secondary hover:text-dark-text'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage('tr')}
                    className={`px-2 py-1 text-[10px] rounded transition-colors ${
                      language === 'tr'
                        ? 'bg-accent text-dark-text font-medium'
                        : 'text-dark-text-secondary hover:text-dark-text'
                    }`}
                  >
                    TR
                  </button>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-dark-text-secondary">{t('dashboard.plantStage')}</div>
                  <div className="text-xs font-semibold text-dark-text capitalize">
                    {plantStage.stage} - {t('unit.days').slice(0, -1)} {plantStage.day}
                  </div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs and Time Speed Control */}
      <div className="border-b border-dark-border bg-dark-surface flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'dashboard'
                    ? 'text-dark-text border-b-2 border-accent'
                    : 'text-dark-text-secondary hover:text-dark-text'
                }`}
              >
                {t('dashboard.tabs.dashboard')}
              </button>
              <button
                onClick={() => setActiveTab('control')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'control'
                    ? 'text-dark-text border-b-2 border-accent'
                    : 'text-dark-text-secondary hover:text-dark-text'
                }`}
              >
                {t('dashboard.tabs.control')}
              </button>
            </div>
            <TimeSpeedControl speed={timeSpeed} onSpeedChange={setTimeSpeed} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-3 flex-1 overflow-hidden w-full">
        {activeTab === 'dashboard' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 h-full">
            {/* Left Column - Camera Feeds */}
            <div className="lg:col-span-2 space-y-3 h-full flex flex-col overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-shrink-0">
                <CameraFeed type="visual" />
                <CameraFeed type="ir" />
              </div>

              {/* External Conditions */}
              <div className="bg-dark-card border border-dark-border rounded-lg p-2 flex-shrink-0">
                <div className="text-[10px] font-medium text-dark-text-secondary mb-1">External Conditions</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-dark-text-secondary">Temp: </span>
                    <span className="text-dark-text">{externalConditions.temperature.toFixed(1)}°C</span>
                  </div>
                  <div>
                    <span className="text-dark-text-secondary">RH: </span>
                    <span className="text-dark-text">{externalConditions.relativeHumidity.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Sensor Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 flex-1 overflow-y-auto">
                <SensorCard
                  label="Temperature"
                  parameter="temperature"
                  currentValue={sensorData.temperature}
                  setValue={setValues.temperature}
                  unit="°C"
                  isAdjusting={adjustingParams.has('temperature')}
                />
                <SensorCard
                  label="Relative Humidity"
                  parameter="relativeHumidity"
                  currentValue={sensorData.relativeHumidity}
                  setValue={setValues.relativeHumidity}
                  unit="%"
                  isAdjusting={adjustingParams.has('relativeHumidity')}
                />
                <SensorCard
                  label="VPD (calc)"
                  parameter="vpd"
                  currentValue={sensorData.vpd}
                  setValue={setValues.vpd}
                  unit="kPa"
                  isAdjusting={false}
                />
                <SensorCard
                  label="CO₂"
                  parameter="co2"
                  currentValue={sensorData.co2}
                  setValue={setValues.co2}
                  unit="ppm"
                  isAdjusting={adjustingParams.has('co2')}
                />
                <SensorCard
                  label="PPFD"
                  parameter="ppfd"
                  currentValue={sensorData.ppfd}
                  setValue={setValues.ppfd}
                  unit="μmol/m²/s"
                  isAdjusting={adjustingParams.has('ppfd')}
                />
                <SensorCard
                  label="Airflow Velocity"
                  parameter="airflowVelocity"
                  currentValue={sensorData.airflowVelocity}
                  setValue={setValues.airflowVelocity}
                  unit="m/s"
                  isAdjusting={adjustingParams.has('airflowVelocity')}
                />
                <SensorCard
                  label="Solution Temperature"
                  parameter="solutionTemperature"
                  currentValue={sensorData.solutionTemperature}
                  setValue={setValues.solutionTemperature}
                  unit="°C"
                  isAdjusting={adjustingParams.has('solutionTemperature')}
                />
                <SensorCard
                  label="EC"
                  parameter="ec"
                  currentValue={sensorData.ec}
                  setValue={setValues.ec}
                  unit="mS/cm"
                  isAdjusting={adjustingParams.has('ec')}
                />
                <SensorCard
                  label="pH"
                  parameter="ph"
                  currentValue={sensorData.ph}
                  setValue={setValues.ph}
                  unit=""
                  isAdjusting={adjustingParams.has('ph')}
                />
                <SensorCard
                  label="Stomata Openings"
                  parameter="stomataOpenings"
                  currentValue={sensorData.stomataOpenings}
                  setValue={setValues.stomataOpenings}
                  unit="%"
                  isAdjusting={false}
                />
                <SensorCard
                  label="Photosynthesis Rate"
                  parameter="photosynthesisRate"
                  currentValue={sensorData.photosynthesisRate}
                  setValue={setValues.photosynthesisRate}
                  unit="μmol CO₂/m²/s"
                  isAdjusting={false}
                />
              </div>

              {/* Actuators */}
              <div className="flex-shrink-0">
                <div className="text-[10px] font-medium text-dark-text-secondary mb-2">{t('dashboard.actuators')}</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <ActuatorCard
                    label="Heat Pump"
                    value={actuatorStates.heatPump}
                    status={actuatorStates.heatPump > 0 ? 'active' : 'off'}
                    linkedParameter="RH"
                  />
                  <ActuatorCard
                    label="Cooldown"
                    value={actuatorStates.cooldown}
                    status={actuatorStates.cooldown > 0 ? 'active' : 'off'}
                    linkedParameter="Temp"
                  />
                  <ActuatorCard
                    label="Waterside Economizer"
                    value={actuatorStates.watersideEconomizer}
                    status={actuatorStates.watersideEconomizer > 30 ? 'active' : actuatorStates.watersideEconomizer > 0 ? 'idle' : 'off'}
                    linkedParameter="HVAC"
                  />
                  <ActuatorCard
                    label="CO₂ Valve"
                    value={actuatorStates.co2Valve}
                    status={actuatorStates.co2Valve > 0 ? 'active' : 'off'}
                    linkedParameter="CO₂"
                  />
                  <ActuatorCard
                    label="Chiller"
                    value={actuatorStates.chiller}
                    status={actuatorStates.chiller > 0 ? 'active' : 'off'}
                    linkedParameter="Sol. Temp"
                  />
                  <ActuatorCard
                    label="EC Pump"
                    value={actuatorStates.ecPump}
                    status={actuatorStates.ecPump > 0 ? 'active' : 'off'}
                    linkedParameter="EC"
                  />
                  <ActuatorCard
                    label="pH Pump"
                    value={actuatorStates.phPump}
                    status={actuatorStates.phPump > 0 ? 'active' : 'off'}
                    linkedParameter="pH"
                  />
                  <ActuatorCard
                    label="LED Dimmer"
                    value={actuatorStates.ledDimmer}
                    status={actuatorStates.ledDimmer > 0 ? 'active' : 'off'}
                    linkedParameter="PPFD"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Cycle Info & Actions Log */}
            <div className="lg:col-span-1 flex flex-col h-full min-h-0 gap-3">
              <CycleInfo
                currentCycle={currentCycle}
                simulationTime={simulationTime}
                plantStage={plantStage}
                yieldData={yieldData}
                cycles={cycles}
              />
              <div className="flex-1 min-h-0">
                <ActionsLog actions={actions} />
              </div>
            </div>
          </div>
        ) : (
          <ParameterControl setValues={setValues} onUpdate={handleParameterUpdate} />
        )}
      </main>
    </div>
  );
}

