import React, { useMemo } from 'react';

interface FarmNode {
  id: string;
  type: 'Field' | 'Greenhouse' | 'Vertical Farm' | 'Livestock';
  x: number;
  y: number;
  label: string;
}

interface DataFlowAnimationProps {
  className?: string;
}

const DataFlowAnimation: React.FC<DataFlowAnimationProps> = ({ className }) => {
  const nodes: FarmNode[] = useMemo(() => [
    { id: '1', type: 'Field', x: 20, y: 30, label: 'Field' },
    { id: '2', type: 'Greenhouse', x: 80, y: 25, label: 'Greenhouse' },
    { id: '3', type: 'Vertical Farm', x: 25, y: 75, label: 'Vertical Farm' },
    { id: '4', type: 'Livestock', x: 75, y: 80, label: 'Livestock Farm' },
  ], []);

  const center = { x: 50, y: 55 };

  const getCurvePath = (startX: number, startY: number, endX: number, endY: number, index: number, reverse: boolean = false) => {
    const sX = reverse ? endX : startX;
    const sY = reverse ? endY : startY;
    const eX = reverse ? startX : endX;
    const eY = reverse ? startY : endY;

    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    
    const offsetScale = 12;
    const dx = endX - startX;
    const dy = endY - startY;
    const len = Math.sqrt(dx * dx + dy * dy);
    
    const px = -dy / len;
    const py = dx / len;
    
    const direction = index % 2 === 0 ? 1 : -1;
    const cpX = midX + px * offsetScale * direction;
    const cpY = midY + py * offsetScale * direction;

    return `M ${sX} ${sY} Q ${cpX} ${cpY} ${eX} ${eY}`;
  };

  return (
    <div className={`relative w-full h-full flex items-center justify-center p-6 ${className || ''}`}>
      {/* Performance: Removed SVG filter drop-shadow - expensive operation on animated elements */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        style={{ overflow: 'visible' }}
      >
        {/* Background Connections */}
        {nodes.map((node, i) => {
          const path = getCurvePath(center.x, center.y, node.x, node.y, i);
          const colors = ['#06b6d4', '#f59e0b', '#10b981', '#8b5cf6']; // Cyan, Amber, Emerald, Purple
          return (
            <path
              key={`path-${node.id}`}
              d={path}
              fill="none"
              stroke={colors[i]}
              strokeWidth="0.6"
              opacity="0.25"
              strokeDasharray="1,1"
            />
          );
        })}

        {/* Animated Data Pulses */}
        {nodes.map((node, i) => {
          const outboundPath = getCurvePath(center.x, center.y, node.x, node.y, i, false);
          const inboundPath = getCurvePath(center.x, center.y, node.x, node.y, i, true);
          const duration = 3 + i * 0.7;
          
          return (
            <React.Fragment key={`pulses-group-${node.id}`}>
              {/* Outbound Pulse (Center -> Node) */}
              {(() => {
                const colors = ['#06b6d4', '#f59e0b', '#10b981', '#8b5cf6']; // Cyan, Amber, Emerald, Purple
                const nodeColor = colors[i];
                return (
                  <>
                    {/* Main pulse */}
                    <circle r="1.0" fill={nodeColor}>
                      <animateMotion
                        dur={`${duration}s`}
                        repeatCount="indefinite"
                        path={outboundPath}
                        begin={`${i * 0.4}s`}
                        calcMode="spline"
                        keyTimes="0;0.5;1"
                        keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;1;0.8;0"
                        dur={`${duration}s`}
                        repeatCount="indefinite"
                        begin={`${i * 0.4}s`}
                        keyTimes="0;0.3;0.7;1"
                      />
                    </circle>
                    {/* Outer glow */}
                    <circle r="1.5" fill={nodeColor} opacity="0.4">
                      <animateMotion
                        dur={`${duration}s`}
                        repeatCount="indefinite"
                        path={outboundPath}
                        begin={`${i * 0.4}s`}
                        calcMode="spline"
                        keyTimes="0;0.5;1"
                        keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;0.6;0.3;0"
                        dur={`${duration}s`}
                        repeatCount="indefinite"
                        begin={`${i * 0.4}s`}
                        keyTimes="0;0.3;0.7;1"
                      />
                    </circle>

                    {/* Inbound Pulse (Node -> Center) */}
                    <circle r="0.9" fill={nodeColor} opacity="0.85">
                      <animateMotion
                        dur={`${duration * 1.2}s`}
                        repeatCount="indefinite"
                        path={inboundPath}
                        begin={`${(i * 0.4) + (duration / 2)}s`}
                        calcMode="spline"
                        keyTimes="0;0.5;1"
                        keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;0.9;0.7;0"
                        dur={`${duration * 1.2}s`}
                        repeatCount="indefinite"
                        begin={`${(i * 0.4) + (duration / 2)}s`}
                        keyTimes="0;0.3;0.7;1"
                      />
                    </circle>
                    {/* Inbound glow */}
                    <circle r="1.4" fill={nodeColor} opacity="0.3">
                      <animateMotion
                        dur={`${duration * 1.2}s`}
                        repeatCount="indefinite"
                        path={inboundPath}
                        begin={`${(i * 0.4) + (duration / 2)}s`}
                        calcMode="spline"
                        keyTimes="0;0.5;1"
                        keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;0.5;0.25;0"
                        dur={`${duration * 1.2}s`}
                        repeatCount="indefinite"
                        begin={`${(i * 0.4) + (duration / 2)}s`}
                        keyTimes="0;0.3;0.7;1"
                      />
                    </circle>
                  </>
                );
              })()}
            </React.Fragment>
          );
        })}

        {/* Central Nexus Node */}
        <g transform={`translate(${center.x - 4.5}, ${center.y - 4.5})`}>
          {/* Outer pulse ring */}
          <circle cx="4.5" cy="4.5" r="4.5" fill="#10b981" opacity="0.08">
            <animate
              attributeName="r"
              values="4.5;5.5;4.5"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.08;0.15;0.08"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          {/* Outer border */}
          <rect
            width="9"
            height="9"
            rx="1.8"
            fill="transparent"
            stroke="#10b981"
            strokeWidth="0.15"
            opacity="0.6"
          />
          {/* Inner border */}
          <rect
            x="1.5"
            y="1.5"
            width="6"
            height="6"
            rx="0.7"
            fill="none"
            stroke="#10b981"
            strokeWidth="0.35"
            opacity="0.8"
          />
          {/* Core circle */}
          <circle cx="4.5" cy="4.5" r="1.8" fill="#10b981" opacity="0.7">
            <animate
              attributeName="opacity"
              values="0.7;0.9;0.7"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          {/* Center dot */}
          <circle cx="4.5" cy="4.5" r="0.7" fill="#fff" />
          {/* Inner glow */}
          <circle cx="4.5" cy="4.5" r="0.4" fill="#10b981" opacity="0.9">
            <animate
              attributeName="opacity"
              values="0.9;1;0.9"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* Farm Nodes */}
        {nodes.map((node, i) => {
          const colors = ['#06b6d4', '#f59e0b', '#10b981', '#8b5cf6']; // Cyan, Amber, Emerald, Purple
          const nodeColor = colors[i];
          return (
            <g
              key={node.id}
              className="group"
              transform={`translate(${node.x}, ${node.y})`}
            >
              {/* Hit area */}
              <circle r="7" fill="transparent" />
              
              {/* Outer glow ring */}
              <circle
                r="5"
                fill={nodeColor}
                opacity="0.12"
                className="transition-opacity duration-500 group-hover:opacity-20"
              >
                <animate
                  attributeName="r"
                  values="5;5.5;5"
                  dur="4s"
                  repeatCount="indefinite"
                  begin={`${i * 0.5}s`}
                />
              </circle>
              {/* Middle ring */}
              <circle
                r="3.2"
                fill={nodeColor}
                opacity="0.2"
                className="transition-all duration-500"
              />
              {/* Core node */}
              <circle
                r="1.4"
                fill={nodeColor}
                className="opacity-95 group-hover:opacity-100 transition-opacity duration-300"
                style={{ filter: `drop-shadow(0 0 6px ${nodeColor})` }}
              >
                <animate
                  attributeName="opacity"
                  values="0.95;1;0.95"
                  dur="2s"
                  repeatCount="indefinite"
                  begin={`${i * 0.3}s`}
                />
              </circle>
              
              {/* Label text - smaller and positioned within bounds */}
              <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Text background for better readability */}
                <rect
                  x="-5"
                  y="5.8"
                  width="10"
                  height="2"
                  fill="#000"
                  fillOpacity="0.7"
                  rx="0.4"
                />
                <text
                  y="7.2"
                  fontSize="2"
                  fill="#e5e5e5"
                  textAnchor="middle"
                  className="font-light tracking-[0.12em] uppercase"
                  style={{ fontFamily: 'Barlow', fontWeight: '400' }}
                >
                  {node.label}
                </text>
              </g>

              {/* Icon */}
              <g transform="translate(-1.8, -1.8)" className="pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                {node.type === 'Field' && <path d="M 0.5 2.8 L 1.8 0.5 L 3.1 2.8" stroke={nodeColor} strokeWidth="0.3" fill="none" strokeLinecap="round" />}
                {node.type === 'Greenhouse' && <path d="M 0.5 2.8 L 0.5 2 L 1.8 0.5 L 3.1 2 L 3.1 2.8 Z" stroke={nodeColor} strokeWidth="0.3" fill="none" strokeLinecap="round" />}
                {node.type === 'Vertical Farm' && <path d="M 0.5 0.5 L 3.1 0.5 M 0.5 1.8 L 3.1 1.8 M 0.5 2.8 L 3.1 2.8" stroke={nodeColor} strokeWidth="0.3" fill="none" strokeLinecap="round" />}
                {node.type === 'Livestock' && <circle cx="1.8" cy="1.6" r="1.2" stroke={nodeColor} strokeWidth="0.3" fill="none" strokeLinecap="round" />}
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default DataFlowAnimation;

