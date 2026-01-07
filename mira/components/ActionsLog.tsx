import { ActionLog } from '../types/index';
import { format } from 'date-fns';

interface ActionsLogProps {
  actions: ActionLog[];
}

export default function ActionsLog({ actions }: ActionsLogProps) {
  const parameterNames: Record<string, string> = {
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

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-3 w-full flex flex-col h-full min-h-0">
      <h2 className="text-sm font-semibold mb-2 text-dark-text flex-shrink-0">Actions Log</h2>
      <div className="flex-1 overflow-y-auto space-y-2 min-h-0 pr-2">
        {actions.length === 0 ? (
          <div className="text-center text-dark-text-secondary py-8 text-xs">
            No actions yet. AI will log adjustments here.
          </div>
        ) : (
          actions
            .slice()
            .reverse()
            .map((action) => (
              <div
                key={action.id}
                className={`bg-dark-surface border rounded-lg p-2 ${
                  action.source === 'ai'
                    ? 'border-accent/30'
                    : 'border-dark-border'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                        action.source === 'ai'
                          ? 'bg-accent/20 text-accent'
                          : 'bg-dark-border text-dark-text-secondary'
                      }`}
                    >
                      {action.source === 'ai' ? 'AI' : 'Manual'}
                    </span>
                    <span className="text-xs font-medium text-dark-text">
                      {parameterNames[action.parameter]}
                    </span>
                  </div>
                  <span className="text-xs text-dark-text-secondary">
                    {format(action.timestamp, 'MM/dd HH:mm:ss')}
                  </span>
                </div>
                <div className="text-xs text-dark-text-secondary mb-1">
                  {action.oldValue.toFixed(1)} → {action.newValue.toFixed(1)}
                </div>
                {action.reason && (
                  <div className="text-xs text-dark-text-secondary italic line-clamp-2">
                    {action.reason}
                  </div>
                )}
              </div>
            ))
        )}
      </div>
    </div>
  );
}
