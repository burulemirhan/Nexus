import React, { useEffect, useRef, useState } from 'react';

interface PreloaderProps {
  onDone: () => void;
  minDuration?: number;
}

// Emerald green color
const EMERALD_PRIMARY = '#10b981';
const EMERALD_GLOW = '#34d399';

const Preloader: React.FC<PreloaderProps> = ({ onDone, minDuration = 2000 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const [isVisible, setIsVisible] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  const reducedMotion = useRef(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion.current = mediaQuery.matches;
    
    const handleChange = (e: MediaQueryListEvent) => {
      reducedMotion.current = e.matches;
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Check if page is ready
  useEffect(() => {
    const checkPageReady = () => {
      if (document.readyState === 'complete') {
        setPageReady(true);
      } else {
        window.addEventListener('load', () => setPageReady(true), { once: true });
      }
    };
    
    checkPageReady();
  }, []);

  // Easing functions
  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  };

  const easeInOutCubic = (t: number): number => {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up canvas with device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Animation parameters
    const lineHeight = 120; // Height of vertical line
    const leafLength = 60; // Length of each leaf
    const leafAngle = Math.PI / 3; // 60 degrees for leaf angle
    const dotRadius = 4;
    const lineWidth = 2;
    const leafWidth = 2;

    let animationPhase = 0; // 0: dot, 1: line growing, 2: leaves growing, 3: fade out

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / minDuration, 1);
      
      // Clear canvas
      ctx.clearRect(0, 0, rect.width, rect.height);

      if (reducedMotion.current) {
        // Simple static dot with pulse for reduced motion
        ctx.save();
        ctx.fillStyle = EMERALD_PRIMARY;
        ctx.beginPath();
        ctx.arc(centerX, centerY, dotRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        // Determine animation phase
        if (progress < 0.15) {
          animationPhase = 0; // Dot phase
        } else if (progress < 0.5) {
          animationPhase = 1; // Line growing
        } else if (progress < 0.85) {
          animationPhase = 2; // Leaves growing
        } else {
          animationPhase = 3; // Fade out
        }

        const opacity = animationPhase === 3 
          ? 1 - easeInOutCubic((progress - 0.85) / 0.15)
          : 1;

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.strokeStyle = EMERALD_PRIMARY;
        ctx.fillStyle = EMERALD_PRIMARY;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowBlur = 8;
        ctx.shadowColor = EMERALD_GLOW;

        // Phase 0: Draw initial dot
        if (animationPhase >= 0) {
          const dotProgress = progress < 0.15 ? easeOutCubic(progress / 0.15) : 1;
          const currentDotRadius = dotRadius * dotProgress;
          ctx.beginPath();
          ctx.arc(centerX, centerY, currentDotRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Phase 1: Draw vertical line growing upward
        if (animationPhase >= 1) {
          const lineProgress = progress < 0.5 
            ? easeOutCubic((progress - 0.15) / 0.35)
            : 1;
          const currentLineHeight = lineHeight * lineProgress;
          
          ctx.lineWidth = lineWidth;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(centerX, centerY - currentLineHeight);
          ctx.stroke();
        }

        // Phase 2: Draw leaves branching to sides
        if (animationPhase >= 2) {
          const leafProgress = progress < 0.85
            ? easeOutCubic((progress - 0.5) / 0.35)
            : 1;

          const branchPointY = centerY - lineHeight;
          const currentLeafLength = leafLength * leafProgress;

          // Left leaf
          const leftLeafEndX = centerX - Math.cos(leafAngle) * currentLeafLength;
          const leftLeafEndY = branchPointY - Math.sin(leafAngle) * currentLeafLength;

          ctx.lineWidth = leafWidth;
          ctx.beginPath();
          ctx.moveTo(centerX, branchPointY);
          ctx.lineTo(leftLeafEndX, leftLeafEndY);
          ctx.stroke();

          // Right leaf
          const rightLeafEndX = centerX + Math.cos(leafAngle) * currentLeafLength;
          const rightLeafEndY = branchPointY - Math.sin(leafAngle) * currentLeafLength;

          ctx.beginPath();
          ctx.moveTo(centerX, branchPointY);
          ctx.lineTo(rightLeafEndX, rightLeafEndY);
          ctx.stroke();

          // Small dots at leaf ends
          if (leafProgress > 0.3) {
            const endDotRadius = 2.5 * Math.min(leafProgress / 0.3, 1);
            
            // Left leaf end dot
            ctx.beginPath();
            ctx.arc(leftLeafEndX, leftLeafEndY, endDotRadius, 0, Math.PI * 2);
            ctx.fill();

            // Right leaf end dot
            ctx.beginPath();
            ctx.arc(rightLeafEndX, rightLeafEndY, endDotRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.restore();
      }

      // Check if animation should complete
      if (pageReady && elapsed >= minDuration) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        setTimeout(() => {
          setIsVisible(false);
          onDone();
        }, 300);
        return;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [minDuration, pageReady, onDone]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] bg-black flex items-center justify-center"
      style={{ pointerEvents: 'none' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
    </div>
  );
};

export default Preloader;
