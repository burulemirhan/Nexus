interface CameraFeedProps {
  type: 'visual' | 'ir';
}

export default function CameraFeed({ type }: CameraFeedProps) {
  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-medium text-dark-text-secondary">
          {type === 'visual' ? 'Visual Feed' : 'IR Thermal Feed'}
        </h3>
      </div>
      <div className="relative bg-black rounded overflow-hidden flex items-center justify-center" style={{ height: '120px' }}>
        <div className="text-center">
          <div className="text-2xl font-bold text-dark-text-secondary mb-1">UPCOMING</div>
          <div className="text-xs text-dark-text-secondary">
            {type === 'visual' ? 'Visual feed' : 'IR thermal feed'}
          </div>
        </div>
      </div>
    </div>
  );
}

