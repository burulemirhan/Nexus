export type AnimationStep = 
  | 'REVEAL' 
  | 'OBSERVE' 
  | 'INTERPRET' 
  | 'GUIDE' 
  | 'VERIFY' 
  | 'OUTCOMES' 
  | 'IDLE';

export interface Quadrant {
  id: string;
  title: string;
  icons: string[];
}

export interface Pulse {
  id: string;
  path: string;
  delay: number;
  type: 'telemetry' | 'vision' | 'command';
}

