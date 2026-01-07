interface ActuatorCardProps {
  label: string;
  value: number; // 0-100%
  status: 'active' | 'idle' | 'off';
  linkedParameter?: string;
}

export default function ActuatorCard({
  label,
  value,
  status,
  linkedParameter,
}: ActuatorCardProps) {
  const statusColors = {
    active: 'bg-green-500/20 border-green-500/50',
    idle: 'bg-yellow-500/20 border-yellow-500/50',
    off: 'bg-dark-border border-dark-border',
  };

  const statusText = {
    active: 'Active',
    idle: 'Idle',
    off: 'Off',
  };

  return (
    <div
      className={`bg-dark-card border rounded-lg p-2 h-20 flex flex-col transition-all duration-300 ${
        statusColors[status]
      }`}
    >
      <div className="flex items-center justify-between mb-1 flex-shrink-0">
        <h3 className="text-[10px] font-medium text-dark-text-secondary truncate">
          {label}
        </h3>
        <span
          className={`text-[9px] px-1.5 py-0.5 rounded ${
            status === 'active'
              ? 'bg-green-500/30 text-green-400'
              : status === 'idle'
              ? 'bg-yellow-500/30 text-yellow-400'
              : 'bg-dark-border text-dark-text-secondary'
          }`}
        >
          {statusText[status]}
        </span>
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-base font-semibold text-dark-text">
            {value.toFixed(0)}%
          </span>
        </div>
        {linkedParameter && (
          <div className="text-[9px] text-dark-text-secondary">
            → {linkedParameter}
          </div>
        )}
      </div>
    </div>
  );
}
