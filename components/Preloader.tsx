import React, { useEffect, useRef, useState } from 'react';

interface PreloaderProps {
  onDone: () => void;
  minDuration?: number; // Minimum duration in milliseconds
}

// Emerald green color palette
const EMERALD_PRIMARY = '#10b981'; // Emerald-500
const EMERALD_GLOW = '#34d399'; // Emerald-400 for glow
const EMERALD_DARK = '#059669'; // Emerald-600

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
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
  const easeInOutCubic = (t: number) => t < 0.5 
    ? 4 * t * t * t 
    : 1 - Math.pow(-2 * t + 2, 3) / 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size - ensure proper dimensions for mobile
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
    };
    
    resizeCanvas();
    const resizeHandler = () => resizeCanvas();
    window.addEventListener('resize', resizeHandler);

    // Reduced motion: simple pulse
    if (reducedMotion.current) {
      const animateReduced = () => {
        const elapsed = Date.now() - startTimeRef.current;
        const cycleDuration = 2000;
        const t = (elapsed % cycleDuration) / cycleDuration;
        
        const rect = canvas.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        
        ctx.clearRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        const pulseSize = 3 + Math.sin(t * Math.PI * 2) * 0.5;
        const opacity = 0.6 + Math.sin(t * Math.PI * 2) * 0.2;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = EMERALD_PRIMARY;
        ctx.globalAlpha = opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
        
        animationFrameRef.current = requestAnimationFrame(animateReduced);
      };
      
      animateReduced();
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        window.removeEventListener('resize', resizeHandler);
      };
    }

    // Animation timeline
    const totalDuration = 2500; // 2.5 seconds for full animation
    const linePhaseDuration = 1200; // Time for line to grow
    const leafPhaseDuration = 800; // Time for leaves to grow
    const pauseDuration = 500; // Pause before reset

    let animationStartTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - animationStartTime;
      const cycleProgress = (elapsed % totalDuration) / totalDuration;
      
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      ctx.clearRect(0, 0, width, height);
      
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Determine phase
      const linePhase = elapsed < linePhaseDuration;
      const leafPhase = elapsed >= linePhaseDuration && elapsed < (linePhaseDuration + leafPhaseDuration);
      const pausePhase = elapsed >= (linePhaseDuration + leafPhaseDuration);
      
      if (pausePhase) {
        // Reset animation
        if (elapsed >= totalDuration) {
          animationStartTime = Date.now();
        }
      }

      // Line parameters
      const maxLineLength = Math.min(width, height) * 0.25; // 25% of screen
      const lineProgress = linePhase 
        ? Math.min(1, elapsed / linePhaseDuration)
        : 1;
      
      // Leaf parameters
      const leafProgress = leafPhase
        ? Math.min(1, (elapsed - linePhaseDuration) / leafPhaseDuration)
        : (linePhase ? 0 : 1);
      
      const leafLength = maxLineLength * 0.8; // Leaves are 80% of line length
      const leafSpreadAngle = Math.PI * 0.4; // 72 degrees total spread (36 each side)

      // Draw central point (always visible)
      const pointOpacity = linePhase ? 0.6 + lineProgress * 0.4 : 1;
      ctx.save();
      ctx.globalAlpha = pointOpacity;

      // Point glow
      const pointGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, 6
      );
      pointGradient.addColorStop(0, `rgba(16, 185, 129, ${pointOpacity * 0.6})`);
      pointGradient.addColorStop(0.7, `rgba(16, 185, 129, ${pointOpacity * 0.2})`);
      pointGradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
      
      ctx.fillStyle = pointGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Point core
      ctx.fillStyle = EMERALD_PRIMARY;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw vertical line
      if (lineProgress > 0) {
        const easedLineProgress = easeOutCubic(lineProgress);
        const currentLineLength = maxLineLength * easedLineProgress;
        const lineTopY = centerY - currentLineLength;
        
        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.strokeStyle = EMERALD_PRIMARY;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 4;
        ctx.shadowColor = `rgba(16, 185, 129, 0.6)`;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX, lineTopY);
        ctx.stroke();
        ctx.restore();

        // Draw leaves if we're in the leaf phase
        if (leafProgress > 0) {
          const easedLeafProgress = easeOutCubic(leafProgress);
          const currentLeafLength = leafLength * easedLeafProgress;
          
          // Left leaf
          const leftLeafEndX = centerX - Math.sin(leafSpreadAngle) * currentLeafLength;
          const leftLeafEndY = lineTopY - Math.cos(leafSpreadAngle) * currentLeafLength;
          
          // Right leaf
          const rightLeafEndX = centerX + Math.sin(leafSpreadAngle) * currentLeafLength;
          const rightLeafEndY = lineTopY - Math.cos(leafSpreadAngle) * currentLeafLength;

          // Draw left leaf with elegant curve
          ctx.save();
          ctx.globalAlpha = 0.85 * easedLeafProgress;
          ctx.strokeStyle = EMERALD_PRIMARY;
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.shadowBlur = 3;
          ctx.shadowColor = `rgba(16, 185, 129, 0.5)`;
          
          // Create curved path for leaf (bezier curve for elegance)
          ctx.beginPath();
          ctx.moveTo(centerX, lineTopY);
          const leftControlX = centerX - Math.sin(leafSpreadAngle) * currentLeafLength * 0.5;
          const leftControlY = lineTopY - Math.cos(leafSpreadAngle) * currentLeafLength * 0.3;
          ctx.quadraticCurveTo(leftControlX, leftControlY, leftLeafEndX, leftLeafEndY);
          ctx.stroke();
          
          // Draw right leaf with elegant curve
          ctx.beginPath();
          ctx.moveTo(centerX, lineTopY);
          const rightControlX = centerX + Math.sin(leafSpreadAngle) * currentLeafLength * 0.5;
          const rightControlY = lineTopY - Math.cos(leafSpreadAngle) * currentLeafLength * 0.3;
          ctx.quadraticCurveTo(rightControlX, rightControlY, rightLeafEndX, rightLeafEndY);
          ctx.stroke();
          ctx.restore();

          // Add subtle leaf tip dots
          if (easedLeafProgress > 0.8) {
            ctx.save();
            ctx.globalAlpha = (easedLeafProgress - 0.8) / 0.2;
            
            // Left tip
            const leftTipGradient = ctx.createRadialGradient(
              leftLeafEndX, leftLeafEndY, 0,
              leftLeafEndX, leftLeafEndY, 4
            );
            leftTipGradient.addColorStop(0, `rgba(52, 211, 153, 0.8)`);
            leftTipGradient.addColorStop(1, 'rgba(52, 211, 153, 0)');
            ctx.fillStyle = leftTipGradient;
            ctx.beginPath();
            ctx.arc(leftLeafEndX, leftLeafEndY, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Right tip
            const rightTipGradient = ctx.createRadialGradient(
              rightLeafEndX, rightLeafEndY, 0,
              rightLeafEndX, rightLeafEndY, 4
            );
            rightTipGradient.addColorStop(0, `rgba(52, 211, 153, 0.8)`);
            rightTipGradient.addColorStop(1, 'rgba(52, 211, 153, 0)');
            ctx.fillStyle = rightTipGradient;
            ctx.beginPath();
            ctx.arc(rightLeafEndX, rightLeafEndY, 4, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  // Check if we should dismiss the preloader
  useEffect(() => {
    const checkDone = () => {
      const elapsed = Date.now() - startTimeRef.current;
      if (pageReady && elapsed >= minDuration) {
        setIsVisible(false);
        // Small delay for fade-out transition
        setTimeout(() => {
          onDone();
        }, 300);
      }
    };

    const interval = setInterval(checkDone, 50);
    return () => clearInterval(interval);
  }, [pageReady, minDuration, onDone]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black transition-opacity duration-300"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
        aria-hidden="true"
      />
    </div>
  );
};

export default Preloader;
