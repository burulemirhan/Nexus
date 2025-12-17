import React, { useEffect, useState } from 'react';

interface AnimatedValueProps {
  value: number;
  unit?: string;
  fractionDigits?: number;
  duration?: number; // ms
}

const AnimatedValue: React.FC<AnimatedValueProps> = ({ 
  value, 
  unit = '', 
  fractionDigits = 0,
  duration = 1000 
}) => {
  const [displayValue, setDisplayValue] = useState<string>(value.toFixed(fractionDigits));
  
  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const startVal = parseFloat(displayValue);
    const endVal = value;
    
    // Characters to use for the "scramble" effect
    const chars = '0123456789';

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Slot machine effect: 
      // While progress < 1, random digits. 
      // Actually, for a smoother metric transition, usually we interpolate the number 
      // OR we just show random garbage then settle. 
      // Extropic style often scrambles digits.
      
      if (progress < 1) {
         // Calculate a transitional number
         const current = startVal + (endVal - startVal) * progress;
         
         // Scramble logic: randomly replace some digits of the current interpolated value
         const str = current.toFixed(fractionDigits);
         let scrambled = '';
         for (let i = 0; i < str.length; i++) {
            if (str[i] === '.' || Math.random() > 0.5) {
                scrambled += str[i];
            } else {
                scrambled += chars[Math.floor(Math.random() * chars.length)];
            }
         }
         setDisplayValue(scrambled);
         animationFrameId = requestAnimationFrame(animate);
      } else {
         setDisplayValue(endVal.toFixed(fractionDigits));
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [value, fractionDigits, duration]);

  return (
    <span className="tabular-nums">
      {displayValue}{unit}
    </span>
  );
};

export default AnimatedValue;