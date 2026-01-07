import { useState } from 'react';

interface TimeSpeedControlProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export default function TimeSpeedControl({ speed, onSpeedChange }: TimeSpeedControlProps) {
  const minSpeed = 0.1;
  const maxSpeed = 200;
  const [localSpeed, setLocalSpeed] = useState(speed);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseFloat(e.target.value);
    setLocalSpeed(newSpeed);
    onSpeedChange(newSpeed);
  };

  // Logarithmic scale for better control at lower speeds
  const logValue = (value: number) => {
    return Math.log10(value / minSpeed) / Math.log10(maxSpeed / minSpeed);
  };

  const expValue = (normalized: number) => {
    return minSpeed * Math.pow(maxSpeed / minSpeed, normalized);
  };

  const normalizedValue = logValue(speed);

  // Preset speeds for quick selection (including high speeds)
  const presetSpeeds = [0.25, 0.5, 1, 2, 4, 8, 16, 25, 50, 100, 200];

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-2 flex items-center gap-3">
      <span className="text-[10px] text-dark-text-secondary whitespace-nowrap">Time Speed:</span>
      <div className="flex items-center gap-2 flex-1">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={normalizedValue}
          onChange={(e) => {
            const newSpeed = expValue(parseFloat(e.target.value));
            setLocalSpeed(newSpeed);
            onSpeedChange(newSpeed);
          }}
          className="flex-1 h-1 bg-dark-surface rounded-lg appearance-none cursor-pointer accent-accent"
          style={{
            background: `linear-gradient(to right, #10a37f 0%, #10a37f ${normalizedValue * 100}%, #3a3a3a ${normalizedValue * 100}%, #3a3a3a 100%)`,
          }}
        />
        <div className="flex items-center gap-1 min-w-[70px]">
          <span className="text-xs font-semibold text-dark-text">
            {speed >= 1 ? speed.toFixed(0) : speed.toFixed(1)}x
          </span>
        </div>
      </div>
      <div className="flex gap-1">
        {presetSpeeds.map((preset) => (
          <button
            key={preset}
            onClick={() => {
              setLocalSpeed(preset);
              onSpeedChange(preset);
            }}
            className={`px-1.5 py-0.5 rounded text-[9px] font-medium transition-colors ${
              Math.abs(speed - preset) < 0.1
                ? 'bg-accent text-white'
                : 'bg-dark-surface text-dark-text-secondary hover:bg-dark-border hover:text-dark-text'
            }`}
          >
            {preset}x
          </button>
        ))}
      </div>
    </div>
  );
}
