import { SetValues } from '../types/index';
import { useState } from 'react';

interface ParameterControlProps {
  setValues: SetValues;
  onUpdate: (parameter: keyof SetValues, value: number) => void;
}

const parameterConfig: Array<{
  key: keyof SetValues;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  readonly?: boolean;
}> = [
  { key: 'temperature', label: 'Temperature', unit: '°C', min: 15, max: 30, step: 0.5 },
  { key: 'relativeHumidity', label: 'Relative Humidity', unit: '%', min: 30, max: 95, step: 1 },
  { key: 'vpd', label: 'VPD (calculated)', unit: 'kPa', min: 0.1, max: 2.0, step: 0.1, readonly: true },
  { key: 'co2', label: 'CO₂', unit: 'ppm', min: 300, max: 2000, step: 50 },
  { key: 'ppfd', label: 'PPFD', unit: 'μmol/m²/s', min: 0, max: 1000, step: 10 },
  { key: 'airflowVelocity', label: 'Airflow Velocity', unit: 'm/s', min: 0, max: 5, step: 0.1 },
  { key: 'solutionTemperature', label: 'Solution Temperature', unit: '°C', min: 15, max: 30, step: 0.5 },
  { key: 'ec', label: 'EC', unit: 'mS/cm', min: 0.1, max: 5.0, step: 0.1 },
  { key: 'ph', label: 'pH', unit: '', min: 4.0, max: 8.0, step: 0.1 },
];

export default function ParameterControl({ setValues, onUpdate }: ParameterControlProps) {
  const [editing, setEditing] = useState<keyof SetValues | null>(null);
  const [tempValue, setTempValue] = useState<string>('');

  const handleStartEdit = (key: keyof SetValues) => {
    setEditing(key);
    setTempValue(setValues[key].toString());
  };

  const handleSave = (key: keyof SetValues) => {
    const numValue = parseFloat(tempValue);
    if (!isNaN(numValue)) {
      const config = parameterConfig.find((c) => c.key === key);
      if (config) {
        const clampedValue = Math.max(config.min, Math.min(config.max, numValue));
        onUpdate(key, clampedValue);
      }
    }
    setEditing(null);
  };

  const handleCancel = () => {
    setEditing(null);
    setTempValue('');
  };

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-dark-text">Parameter Control</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {parameterConfig.map((config) => {
          const value = setValues[config.key];
          const isEditing = editing === config.key;

          return (
            <div
              key={config.key}
              className="bg-dark-surface border border-dark-border rounded-lg p-4"
            >
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                {config.label}
              </label>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="number"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    min={config.min}
                    max={config.max}
                    step={config.step}
                    className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text focus:outline-none focus:border-accent"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSave(config.key);
                      if (e.key === 'Escape') handleCancel();
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(config.key)}
                      className="flex-1 bg-accent hover:bg-accent-hover text-white rounded px-3 py-1 text-sm transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 bg-dark-border hover:bg-dark-border/80 text-dark-text rounded px-3 py-1 text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-semibold text-dark-text">
                      {value.toFixed(config.key === 'ph' ? 1 : 1)}
                    </div>
                    <div className="text-xs text-dark-text-secondary">{config.unit}</div>
                  </div>
                  {!config.readonly && (
                    <button
                      onClick={() => handleStartEdit(config.key)}
                      className="text-accent hover:text-accent-hover text-sm font-medium transition-colors"
                    >
                      Edit
                    </button>
                  )}
                  {config.readonly && (
                    <span className="text-xs text-dark-text-secondary">Read-only</span>
                  )}
                </div>
              )}
              {!isEditing && !config.readonly && (
                <div className="mt-3">
                  <input
                    type="range"
                    min={config.min}
                    max={config.max}
                    step={config.step}
                    value={value}
                    onChange={(e) => onUpdate(config.key, parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-dark-text-secondary mt-1">
                    <span>{config.min}</span>
                    <span>{config.max}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
