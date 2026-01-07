import { useEffect, useState } from 'react';

interface AnimatedValueProps {
  value: number;
  decimals?: number;
  className?: string;
}

export default function AnimatedValue({ value, decimals = 1, className = '' }: AnimatedValueProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (Math.abs(displayValue - value) > 0.01) {
      setIsAnimating(true);
      const startValue = displayValue;
      const endValue = value;
      const duration = 1000; // 1 second animation
      const startTime = Date.now();

      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        
        const currentValue = startValue + (endValue - startValue) * easeOutCubic;
        setDisplayValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayValue(endValue);
          setIsAnimating(false);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [value, displayValue]);

  return (
    <span className={`transition-opacity duration-300 ${isAnimating ? 'opacity-70' : 'opacity-100'} ${className}`}>
      {displayValue.toFixed(decimals)}
    </span>
  );
}

