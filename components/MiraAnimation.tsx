import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Zap, 
  Waves,
  Activity,
  Cpu,
  Fan
} from 'lucide-react';
import { AnimationStep } from '../types';

const COLORS = {
  primary: '#14B8A6', // Teal 500
  highlight: '#F0FDFA', // Pearl
  cyan: '#22D3EE',
  violet: '#A78BFA',
  amber: '#F59E0B',
  gray: '#262626',
  idleStroke: '#888888', // Even clearer idle stroke
  idleText: '#D1D5DB',   // Clearer idle text (Gray 300)
  offWhite: '#FFFFFF'
};

const MiraAnimation: React.FC = () => {
  const [step, setStep] = useState<AnimationStep>('REVEAL');
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  // Timeline Control Logic
  useEffect(() => {
    const sequence = [
      { step: 'REVEAL', duration: 1500 },
      { step: 'OBSERVE', duration: 2500 },
      { step: 'INTERPRET', duration: 2500 },
      { step: 'GUIDE', duration: 2300 },
      { step: 'VERIFY', duration: 1700 },
      { step: 'OUTCOMES', duration: 1500 },
    ];

    let currentIdx = 0;
    let timer: number;
    const runCycle = () => {
      const { step: currentStep, duration } = sequence[currentIdx];
      setStep(currentStep as AnimationStep);
      
      timer = window.setTimeout(() => {
        currentIdx = (currentIdx + 1) % sequence.length;
        runCycle();
      }, duration);
    };

    runCycle();
    return () => clearTimeout(timer);
  }, []);

  const viewBox = "0 0 1000 562.5"; // 16:9 ratio

  // Elegant Plant Silhouette Path
  const plantPath = "M 500 450 C 500 400 500 350 500 300 M 500 420 C 530 400 560 380 540 340 C 520 300 500 340 500 340 M 500 420 C 470 400 440 380 460 340 C 480 300 500 340 500 340 M 500 380 C 540 360 580 320 550 280 C 520 240 500 300 500 300 M 500 380 C 460 360 420 320 450 280 C 480 240 500 300 500 300 M 500 330 C 520 290 530 250 510 220 C 490 190 500 240 500 240 M 500 330 C 480 290 470 250 490 220 C 510 190 500 240 500 240";

  return (
    <div className="w-full h-full relative group">
      {/* Interaction Layers */}
      <div className="absolute inset-0 z-20 grid grid-cols-4 grid-rows-2">
        <div 
          onMouseEnter={() => setHoveredFeature('sensing')} 
          onMouseLeave={() => setHoveredFeature(null)}
          className="cursor-crosshair"
        />
        <div className="col-span-2" />
        <div 
          onMouseEnter={() => setHoveredFeature('intelligence')} 
          onMouseLeave={() => setHoveredFeature(null)}
          className="row-span-2 cursor-crosshair"
        />
        <div 
          onMouseEnter={() => setHoveredFeature('control')} 
          onMouseLeave={() => setHoveredFeature(null)}
          className="cursor-crosshair"
        />
      </div>

      {/* Feature Labels Overlay */}
      <AnimatePresence mode="wait">
        {hoveredFeature && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-8 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 backdrop-blur-md"
          >
            <span className="text-teal-400 text-xs font-bold tracking-[0.4em] uppercase">
              {hoveredFeature === 'sensing' && 'Multimodal Sensing'}
              {hoveredFeature === 'intelligence' && 'Plant-State Intelligence'}
              {hoveredFeature === 'control' && 'Closed-Loop Regulation'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <svg 
        viewBox={viewBox} 
        className="w-full h-full" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <path id="path-telemetry-1" d="M 220 180 Q 350 200 450 250" />
          <path id="path-telemetry-2" d="M 220 220 Q 350 240 450 270" />
          <path id="path-vision" d="M 680 281 L 560 281" />
          <path id="path-regulation" d="M 450 310 Q 350 350 220 420" />
          
          <radialGradient id="hazeGradient">
            <stop offset="0%" stopColor={COLORS.primary} stopOpacity="0.4" />
            <stop offset="100%" stopColor={COLORS.primary} stopOpacity="0" />
          </radialGradient>

          <filter id="glow-heavy">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <filter id="glow-soft">
            <feGaussianBlur stdDeviation="1.8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Haze */}
        <motion.circle 
          cx="500" cy="281" r="300" 
          fill="url(#hazeGradient)" 
          animate={{ opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Infrastructure Paths */}
        <g stroke={COLORS.idleStroke} strokeWidth="0.75" strokeDasharray="3 6" opacity="0.4">
          <use href="#path-telemetry-1" />
          <use href="#path-telemetry-2" />
          <use href="#path-vision" />
          <use href="#path-regulation" />
        </g>

        {/* Central Core (MIRA) - Scaled Up */}
        <g id="mira-core" transform="translate(500, 281)">
          <motion.rect
            x="-45" y="-45" width="90" height="90" rx="16"
            stroke={COLORS.primary}
            strokeWidth="2"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              filter: step === 'INTERPRET' ? 'url(#glow-heavy)' : 'none'
            }}
            transition={{ duration: 1.5, ease: "circOut" }}
          />
          
          {/* Inner Grid */}
          <g opacity="0.6">
            <line x1="-22.5" y1="-45" x2="-22.5" y2="45" stroke={COLORS.primary} strokeWidth="0.75" />
            <line x1="22.5" y1="-45" x2="22.5" y2="45" stroke={COLORS.primary} strokeWidth="0.75" />
            <line x1="-45" y1="-22.5" x2="45" y2="-22.5" stroke={COLORS.primary} strokeWidth="0.75" />
            <line x1="-45" y1="22.5" x2="45" y2="22.5" stroke={COLORS.primary} strokeWidth="0.75" />
          </g>

          {/* Iris Ring - Closer to core */}
          <motion.circle
            r="60"
            stroke={COLORS.primary}
            strokeWidth="1.5"
            strokeDasharray="6 10"
            animate={{ 
              rotate: step === 'INTERPRET' || hoveredFeature === 'intelligence' ? 90 : 0,
              opacity: step === 'INTERPRET' ? 1 : 0.6,
              filter: step === 'INTERPRET' ? 'url(#glow-soft)' : 'none'
            }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />

          {/* MIRA Labels - Bigger */}
          <g transform="translate(0, 85)">
            <motion.text
              textAnchor="middle"
              fill={COLORS.offWhite}
              fontSize="18"
              fontWeight="700"
              letterSpacing="4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              MIRA
            </motion.text>
            <motion.text
              textAnchor="middle"
              fill={COLORS.idleText}
              fontSize="8"
              fontWeight="500"
              letterSpacing="1.5"
              y="16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              INTELLIGENT REGULATION AGENT
            </motion.text>
          </g>
        </g>

        {/* Outer Halo (Care Loop) - Smaller, tighter around MIRA */}
        <g id="halo" transform="translate(500, 281)">
          <motion.circle
            r="120"
            stroke={COLORS.primary}
            strokeWidth="1"
            strokeDasharray="2 20"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1, rotate: -360 }}
            transition={{ pathLength: { duration: 2.5 }, rotate: { duration: 45, repeat: Infinity, ease: "linear" } }}
          />
          
          {/* Loop Segment Labels */}
          {['OBSERVE', 'INTERPRET', 'GUIDE', 'VERIFY'].map((label, i) => {
            const angle = (i * 90) - 90;
            const radius = 145; // Tighter radius
            const x = radius * Math.cos((angle * Math.PI) / 180);
            const y = radius * Math.sin((angle * Math.PI) / 180);
            const isActive = step === label;

            return (
              <g key={label} transform={`translate(${x}, ${y})`}>
                <motion.text
                  textAnchor="middle"
                  fill={isActive ? COLORS.primary : COLORS.idleText}
                  fontSize="10"
                  fontWeight="800"
                  letterSpacing="3"
                  animate={{ 
                    scale: isActive ? 1.2 : 1,
                    opacity: 1,
                    filter: isActive ? 'url(#glow-soft)' : 'none'
                  }}
                >
                  {label}
                </motion.text>
                {isActive && (
                  <motion.line
                    x1="-20" y1="8" x2="20" y2="8"
                    stroke={COLORS.primary}
                    strokeWidth="2.5"
                    layoutId="underline"
                    filter="url(#glow-soft)"
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* Quadrant 1: Telemetry (Top Left) - Shifted and icons bigger */}
        <g transform="translate(140, 140)">
          <motion.text fill={COLORS.idleText} fontSize="12" fontWeight="700" letterSpacing="3" x="-20" y="-50">TELEMETRY</motion.text>
          <g>
            <g transform="translate(0, 0)">
              <IconWrapper isActive={step === 'OBSERVE'} delay={0} color={COLORS.primary}>
                <Thermometer size={24} strokeWidth={1.5} />
              </IconWrapper>
              <text fill={COLORS.idleText} fontSize="9" fontWeight="600" x="32" y="16">T</text>
            </g>
            <g transform="translate(80, 0)">
              <IconWrapper isActive={step === 'OBSERVE'} delay={0.1} color={COLORS.primary}>
                <Droplets size={24} strokeWidth={1.5} />
              </IconWrapper>
              <text fill={COLORS.idleText} fontSize="9" fontWeight="600" x="32" y="16">RH</text>
            </g>
            <g transform="translate(0, 60)">
              <IconWrapper isActive={step === 'OBSERVE'} delay={0.2} color={COLORS.primary}>
                <Wind size={24} strokeWidth={1.5} />
              </IconWrapper>
              <text fill={COLORS.idleText} fontSize="9" fontWeight="600" x="32" y="16">CO2</text>
            </g>
            <g transform="translate(80, 60)">
              <IconWrapper isActive={step === 'OBSERVE'} delay={0.3} color={COLORS.primary}>
                <Activity size={24} strokeWidth={1.5} />
              </IconWrapper>
              <text fill={COLORS.idleText} fontSize="9" fontWeight="600" x="32" y="16">VPD</text>
            </g>
          </g>
        </g>

        {/* Quadrant 2: Plant Sense (Right) - Elegant Silhouettes */}
        <g transform="translate(780, 281)">
          <motion.text fill={COLORS.idleText} textAnchor="middle" fontSize="12" fontWeight="700" letterSpacing="3" y="-150">PLANT SENSE (RGB / IR)</motion.text>
          
          {/* Plant Silhouette - Elegant & Clear */}
          <motion.g transform="translate(-500, -281)">
            <motion.path
              d={plantPath}
              stroke={COLORS.offWhite}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ 
                opacity: step === 'INTERPRET' || hoveredFeature === 'intelligence' ? 1 : 0.7,
                scale: step === 'INTERPRET' ? 1.03 : 1,
                filter: step === 'INTERPRET' ? 'url(#glow-soft)' : 'none'
              }}
            />
            {/* Shimmer Overlay */}
            <motion.path
              d={plantPath}
              stroke={COLORS.primary}
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 0], 
                opacity: (step === 'INTERPRET' || hoveredFeature === 'intelligence') ? 0.4 : 0 
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </motion.g>

          {/* Plant Labels */}
          <g transform="translate(85, 0)">
            <motion.text fill={isActiveStep(step, 'INTERPRET') ? COLORS.primary : COLORS.idleText} fontSize="10" fontWeight="600" y="-12">RGB FEEDBACK</motion.text>
            <motion.text fill={isActiveStep(step, 'INTERPRET') ? COLORS.primary : COLORS.idleText} fontSize="10" fontWeight="600" y="12">IR STATE: ACTIVE</motion.text>
          </g>
        </g>

        {/* Quadrant 3: Regulation (Bottom Left) - Icons bigger */}
        <g transform="translate(140, 440)">
          <motion.text fill={COLORS.idleText} fontSize="12" fontWeight="700" letterSpacing="3" x="-20" y="-20">REGULATION</motion.text>
          <g>
            <g transform="translate(0, 15)">
              <IconWrapper isActive={step === 'GUIDE'} delay={0} color={COLORS.primary}>
                <Zap size={24} strokeWidth={1.5} />
              </IconWrapper>
              <text fill={COLORS.idleText} fontSize="9" fontWeight="600" x="32" y="16">LED</text>
            </g>
            <g transform="translate(70, 15)">
              <IconWrapper isActive={step === 'GUIDE'} delay={0.1} color={COLORS.primary}>
                <Waves size={24} strokeWidth={1.5} />
              </IconWrapper>
              <text fill={COLORS.idleText} fontSize="9" fontWeight="600" x="32" y="16">PUMP</text>
            </g>
            <g transform="translate(140, 15)">
              <IconWrapper isActive={step === 'GUIDE'} delay={0.2} color={COLORS.primary}>
                <Fan size={24} strokeWidth={1.5} />
              </IconWrapper>
              <text fill={COLORS.idleText} fontSize="9" fontWeight="600" x="32" y="16">FAN</text>
            </g>
          </g>
        </g>

        {/* Animation Pulses */}
        {step === 'OBSERVE' && (
          <g>
            {[0, 0.4, 0.8].map(d => (
              <PulseCircle key={`tele-1-${d}`} pathId="#path-telemetry-1" delay={d} color={COLORS.primary} size={4} />
            ))}
            {[0.2, 0.6, 1].map(d => (
              <PulseCircle key={`tele-2-${d}`} pathId="#path-telemetry-2" delay={d} color={COLORS.primary} size={4} />
            ))}
          </g>
        )}

        {(step === 'INTERPRET' || hoveredFeature === 'intelligence') && (
          <g>
            {[0, 0.5, 1].map(d => (
              <PulseCircle key={`vision-${d}`} pathId="#path-vision" delay={d} color={COLORS.highlight} size={5} />
            ))}
          </g>
        )}

        {step === 'GUIDE' && (
          <g>
            {[0, 0.5, 1].map(d => (
              <PulseLine key={`guide-${d}`} pathId="#path-regulation" delay={d} color={COLORS.primary} />
            ))}
          </g>
        )}

        {/* Care Aura Field: VERIFY Phase */}
        <AnimatePresence>
          {step === 'VERIFY' && (
            <motion.path
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 0.4, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              d="M 500 281 C 550 150 680 150 820 281 C 680 412 550 412 500 281"
              fill={COLORS.highlight}
              filter="url(#glow-heavy)"
              transition={{ duration: 1 }}
            />
          )}
        </AnimatePresence>

        {/* Outcome Glyphs: OUTCOMES Phase */}
        {step === 'OUTCOMES' && (
          <g transform="translate(500, 281)">
            {[
              { text: "UNIFORMITY ↑", angle: -35 },
              { text: "QUALITY ↑", angle: 0 },
              { text: "WASTE ↓", angle: 35 }
            ].map((glyph, i) => {
              const r = 210;
              const rad = (glyph.angle * Math.PI) / 180;
              const x = r * Math.cos(rad);
              const y = r * Math.sin(rad);
              return (
                <motion.g
                  key={i}
                  initial={{ opacity: 0, x: x - 30, y }}
                  animate={{ opacity: 1, x, y }}
                  transition={{ delay: i * 0.25, duration: 0.8 }}
                >
                  <text 
                    fill={COLORS.primary} 
                    fontSize="12" 
                    fontWeight="900" 
                    letterSpacing="2"
                    filter="url(#glow-soft)"
                  >
                    {glyph.text}
                  </text>
                </motion.g>
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
};

// Helper Components
const IconWrapper: React.FC<{ children: React.ReactNode, isActive: boolean, delay: number, color: string }> = ({ children, isActive, delay, color }) => (
  <motion.g
    initial={{ opacity: 0.85 }}
    animate={{ 
      opacity: 1,
      scale: isActive ? 1.4 : 1,
      filter: isActive ? 'url(#glow-heavy)' : 'none',
      stroke: isActive ? color : COLORS.idleStroke
    }}
    transition={{ delay, duration: 0.4 }}
    stroke={isActive ? color : COLORS.idleStroke}
  >
    {children}
  </motion.g>
);

const PulseCircle: React.FC<{ pathId: string, delay: number, color: string, size?: number }> = ({ pathId, delay, color, size = 4 }) => (
  <motion.circle
    r={size}
    fill={color}
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 1, 0] }}
    transition={{ duration: 1.5, repeat: Infinity, delay, ease: "easeInOut" }}
    filter="url(#glow-soft)"
  >
    <animateMotion
      dur="1.5s"
      repeatCount="indefinite"
      begin={`${delay}s`}
      path={document.querySelector(pathId)?.getAttribute('d') || ''}
    />
  </motion.circle>
);

const PulseLine: React.FC<{ pathId: string, delay: number, color: string }> = ({ pathId, delay, color }) => (
  <motion.path
    d="M 0 0 L -20 0"
    stroke={color}
    strokeWidth="3.5"
    strokeLinecap="round"
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 1, 0] }}
    transition={{ duration: 1.5, repeat: Infinity, delay }}
    filter="url(#glow-soft)"
  >
    <animateMotion
      dur="1.5s"
      repeatCount="indefinite"
      rotate="auto"
      begin={`${delay}s`}
      path={document.querySelector(pathId)?.getAttribute('d') || ''}
    />
  </motion.path>
);

const isActiveStep = (current: string, target: string) => current === target;

export default MiraAnimation;

