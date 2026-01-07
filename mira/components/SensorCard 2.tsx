import { SensorData } from '../types/index';
import AnimatedValue from './AnimatedValue';

interface SensorCardProps {
  label: string;
  parameter: keyof SensorData;
  currentValue: number;
  setValue: number;
  unit: string;
  isAdjusting?: boolean;
}

export default function SensorCard({
  label,
  parameter,
  currentValue,
  setValue,
  unit,
  isAdjusting = false,
}: SensorCardProps) {
  const deviation = Math.abs(currentValue - setValue);
  const deviationPercent = setValue !== 0 ? (deviation / Math.abs(setValue)) * 100 : 0;
  const isOutOfRange = deviationPercent > 5;

  return (
    <div
      className={`bg-dark-card border rounded-lg p-2 transition-all duration-300 h-16 flex flex-row items-center justify-between ${
        isAdjusting
          ? 'border-accent shadow-lg shadow-accent/20'
          : isOutOfRange
          ? 'border-red-500/50'
          : 'border-dark-border'
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <h3 className="text-[10px] font-medium text-dark-text-secondary truncate">{label}</h3>
          {isAdjusting && (
            <span className="text-[9px] text-accent animate-pulse flex-shrink-0 ml-1">Adjusting...</span>
          )}
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-base font-semibold text-dark-text">
            <AnimatedValue value={currentValue} decimals={1} />
          </span>
          <span className="text-[9px] text-dark-text-secondary">{unit}</span>
        </div>
      </div>
      <div className="flex flex-col items-end text-right ml-2 flex-shrink-0">
        <div className="text-[9px] text-dark-text-secondary mb-0.5">Set</div>
        <div
          className={`text-xs font-medium ${
            isAdjusting ? 'text-accent' : 'text-dark-text-secondary'
          }`}
        >
          <AnimatedValue value={setValue} decimals={1} />
        </div>
        {deviationPercent > 1 && (
          <div className="text-[8px] text-dark-text-secondary mt-0.5">
            ±{deviationPercent.toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  );
}

