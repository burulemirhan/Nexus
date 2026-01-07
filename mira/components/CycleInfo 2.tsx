import { SimulationTime, PlantStage, CycleData } from '../types/index';
import { format } from 'date-fns';

interface CycleInfoProps {
  currentCycle: CycleData;
  simulationTime: SimulationTime;
  plantStage: PlantStage;
  yieldData: { current: number; target: number };
  cycles: CycleData[];
}

export default function CycleInfo({
  currentCycle,
  simulationTime,
  plantStage,
  yieldData,
  cycles,
}: CycleInfoProps) {
  const yieldPercent = (yieldData.current / yieldData.target) * 100;
  const avgQuality = cycles.length > 0
    ? cycles.reduce((sum, c) => sum + (c.quality || 0), 0) / cycles.length
    : 0;
  const bestQuality = cycles.length > 0
    ? Math.max(...cycles.map((c) => c.quality || 0))
    : 0;

  const formatTime = (time: SimulationTime) => {
    const hourStr = time.hour.toString().padStart(2, '0');
    const minuteStr = time.minute.toString().padStart(2, '0');
    return `Day ${time.day} ${hourStr}:${minuteStr}`;
  };

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-3 flex flex-col gap-3 flex-shrink-0">
      <div>
        <h2 className="text-sm font-semibold mb-2 text-dark-text">Cycle {currentCycle.cycleNumber}</h2>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-dark-text-secondary">Duration:</span>
            <span className="text-dark-text">{simulationTime.cycleDay} days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-text-secondary">Time:</span>
            <span className="text-dark-text">{formatTime(simulationTime)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-text-secondary">Stage:</span>
            <span className="text-dark-text capitalize">{plantStage.stage}</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-dark-text-secondary">Yield Progress</span>
          <span className="text-xs text-dark-text">
            {yieldData.current.toFixed(1)} / {yieldData.target}g
          </span>
        </div>
        <div className="w-full bg-dark-surface rounded-full h-2 mb-1">
          <div
            className="bg-accent h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, yieldPercent)}%` }}
          />
        </div>
        <div className="text-[10px] text-dark-text-secondary text-right">
          {yieldPercent.toFixed(1)}%
        </div>
      </div>

      {cycles.length > 0 && (
        <div className="border-t border-dark-border pt-2">
          <div className="text-xs text-dark-text-secondary mb-1">Cycle History</div>
          <div className="space-y-1 text-[10px]">
            <div className="flex justify-between">
              <span className="text-dark-text-secondary">Completed:</span>
              <span className="text-dark-text">{cycles.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-text-secondary">Avg Quality:</span>
              <span className="text-dark-text">{avgQuality.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-text-secondary">Best Quality:</span>
              <span className="text-accent">{bestQuality.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

