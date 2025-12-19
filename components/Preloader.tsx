import React, { useEffect, useRef, useState } from 'react';

interface PreloaderProps {
  onDone: () => void;
  minDuration?: number; // Minimum duration in milliseconds
}

// Emerald green color palette
const EMERALD_PRIMARY = '#10b981'; // Emerald-500
const EMERALD_GLOW = '#34d399'; // Emerald-400 for glow
const EMERALD_DARK = '#059669'; // Emerald-600 for subtle variation

interface Point {
  x: number;
  y: number;
}

interface Branch {
  angle: number;
  length: number;
  maxLength: number;
  progress: number;
  dotProgress: number;
  endDotSize: number;
  waypoints: Point[]; // Snake-like path waypoints
}

const Preloader: React.FC<PreloaderProps> = ({ onDone, minDuration = 2000 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const cycleStartTimeRef = useRef<number>(Date.now());
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

  // Deterministic random number generator (seeded)
  const seededRandom = (seed: number) => {
    let value = seed;
    return () => {
      value = (value * 9301 + 49297) % 233280;
      return value / 233280;
    };
  };

  // Generate snake-like path waypoints with direction changes
  const generateSnakePath = (
    centerX: number,
    centerY: number,
    baseAngle: number,
    maxLength: number,
    random: () => number
  ): Point[] => {
    const waypoints: Point[] = [];
    const segmentCount = 5 + Math.floor(random() * 4); // 5-8 segments for snake-like movement
    const segmentLength = maxLength / segmentCount;
    
    let currentX = centerX;
    let currentY = centerY;
    let currentAngle = baseAngle;
    
    // Add starting point
    waypoints.push({ x: currentX, y: currentY });
    
    for (let i = 0; i < segmentCount; i++) {
      // Change direction slightly for each segment (snake-like movement)
      const angleChange = (random() - 0.5) * 0.6; // -0.3 to 0.3 radians
      currentAngle += angleChange;
      
      // Calculate next point
      currentX += Math.cos(currentAngle) * segmentLength;
      currentY += Math.sin(currentAngle) * segmentLength;
      
      waypoints.push({ x: currentX, y: currentY });
    }
    
    return waypoints;
  };

  // Generate deterministic branches with snake-like paths
  const generateBranches = (count: number, seed: number, centerX: number, centerY: number): Branch[] => {
    const random = seededRandom(seed);
    const branches: Branch[] = [];
    
    for (let i = 0; i < count; i++) {
      const baseAngle = (i / count) * Math.PI * 2 + (random() - 0.5) * 0.3;
      const maxLength = 150 + random() * 100; // 150-250px (longer arms)
      const waypoints = generateSnakePath(centerX, centerY, baseAngle, maxLength, random);
      
      branches.push({
        angle: baseAngle,
        length: 0,
        maxLength,
        progress: 0,
        dotProgress: 0,
        endDotSize: 0,
        waypoints,
      });
    }
    
    return branches;
  };

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
      
      // Set actual canvas size in physical pixels
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      
      // Scale context to match device pixel ratio for crisp rendering
      ctx.scale(dpr, dpr);
      
      // Set display size in CSS pixels
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
    };
    
    resizeCanvas();
    const resizeHandler = () => {
      resizeCanvas();
      // Ensure animation continues after resize
      if (!animationFrameRef.current) {
        cycleStartTimeRef.current = Date.now();
      }
    };
    window.addEventListener('resize', resizeHandler);

    // Reduced motion: simple pulse
    if (reducedMotion.current) {
      const animateReduced = () => {
        const elapsed = Date.now() - cycleStartTimeRef.current;
        const cycleDuration = 2000;
        const t = (elapsed % cycleDuration) / cycleDuration;
        
        const rect = canvas.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        
        // Clear using logical pixels (ctx is already scaled)
        ctx.clearRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        const pulseSize = 4 + Math.sin(t * Math.PI * 2) * 0.5;
        const opacity = 0.6 + Math.sin(t * Math.PI * 2) * 0.2;
        
        // Central dot with gentle pulse
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = EMERALD_PRIMARY;
        ctx.globalAlpha = opacity;
        ctx.fill();
        
        // Halo
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseSize * 3);
        gradient.addColorStop(0, `rgba(16, 185, 129, ${opacity * 0.3})`);
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseSize * 3, 0, Math.PI * 2);
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

    // Full animation
    const branchCount = 18; // More arms for richer network
    let branches: Branch[] = [];
    const cycleDuration = 5000; // 5 seconds per cycle (growth + fade) - slower growth
    const growthPhase = 0.6; // First 60% is growth, rest is fade
    
    // Initialize branches with center coordinates
    const initializeBranches = () => {
      const rect = canvas.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      branches = generateBranches(branchCount, 42, centerX, centerY);
    };
    
    initializeBranches();

    const animate = () => {
      const elapsed = Date.now() - cycleStartTimeRef.current;
      const cycleProgress = (elapsed % cycleDuration) / cycleDuration;
      const isGrowing = cycleProgress < growthPhase;
      const phaseProgress = isGrowing 
        ? cycleProgress / growthPhase 
        : (cycleProgress - growthPhase) / (1 - growthPhase);

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      // Clear using logical pixels (ctx is already scaled)
      ctx.clearRect(0, 0, width, height);
      
      const centerX = width / 2;
      const centerY = height / 2;

      // Easing functions for smooth motion
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const easeInOutCubic = (t: number) => t < 0.5 
        ? 4 * t * t * t 
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

      if (isGrowing) {
        const easedProgress = easeOutCubic(phaseProgress);
        
        // Update branches
        branches.forEach((branch) => {
          branch.progress = easedProgress;
          branch.length = branch.maxLength * easedProgress;
          
          // Dot appears when branch is 75% grown
          if (easedProgress > 0.75) {
            branch.dotProgress = Math.min(1, (easedProgress - 0.75) / 0.25);
            branch.endDotSize = 3 * easeOutCubic(branch.dotProgress);
          }
        });
      } else {
        // Fade phase - keep branch lengths at max, but fade opacity
        branches.forEach((branch) => {
          branch.length = branch.maxLength;
          branch.progress = 1 - easeInOutCubic(phaseProgress);
          branch.dotProgress = branch.progress;
          branch.endDotSize = 3 * branch.dotProgress;
        });
      }

      // Draw branches and dots with snake-like path
      branches.forEach((branch) => {
        if (branch.progress <= 0) return;

        const opacity = isGrowing 
          ? Math.min(1, branch.progress * 1.5)
          : branch.progress;

        if (opacity <= 0) return;

        // Calculate how many waypoints should be visible based on progress
        const totalWaypoints = branch.waypoints.length;
        const visibleWaypoints = Math.max(2, Math.ceil(totalWaypoints * branch.progress));
        
        // Draw snake-like path segment by segment
        ctx.save();
        ctx.globalAlpha = opacity * 0.9;
        ctx.strokeStyle = '#ffffff'; // White arms
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowBlur = 3;
        ctx.shadowColor = `rgba(255, 255, 255, ${opacity * 0.3})`; // Soft white glow

        ctx.beginPath();
        
        // Start from first waypoint (center)
        const startPoint = branch.waypoints[0];
        ctx.moveTo(startPoint.x, startPoint.y);
        
        // Draw smooth curves between waypoints (snake-like movement)
        for (let i = 1; i < visibleWaypoints; i++) {
          const currentPoint = branch.waypoints[i];
          const prevPoint = branch.waypoints[i - 1];
          
          if (i === visibleWaypoints - 1 && visibleWaypoints < totalWaypoints) {
            // For the last visible segment, interpolate to show partial growth
            const nextPoint = branch.waypoints[i];
            const segmentProgress = (branch.progress * totalWaypoints) - (i - 1);
            const segmentProgressClamped = Math.min(1, Math.max(0, segmentProgress));
            
            const interpolatedX = prevPoint.x + (nextPoint.x - prevPoint.x) * segmentProgressClamped;
            const interpolatedY = prevPoint.y + (nextPoint.y - prevPoint.y) * segmentProgressClamped;
            
            // Use quadratic curve for smooth snake-like movement
            if (i > 1) {
              const controlX = prevPoint.x;
              const controlY = prevPoint.y;
              ctx.quadraticCurveTo(controlX, controlY, interpolatedX, interpolatedY);
            } else {
              ctx.lineTo(interpolatedX, interpolatedY);
            }
          } else {
            // Use quadratic curve for smooth transitions
            if (i > 1) {
              const controlX = prevPoint.x;
              const controlY = prevPoint.y;
              ctx.quadraticCurveTo(controlX, controlY, currentPoint.x, currentPoint.y);
            } else {
              ctx.lineTo(currentPoint.x, currentPoint.y);
            }
          }
        }
        
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.restore();

        // Draw end dot - white (matching the arms)
        if (branch.dotProgress > 0 && branch.endDotSize > 0 && visibleWaypoints >= totalWaypoints) {
          const endPoint = branch.waypoints[branch.waypoints.length - 1];
          ctx.save();
          const dotOpacity = opacity * branch.dotProgress;
          ctx.globalAlpha = dotOpacity;

          // Dot halo - white
          const dotGradient = ctx.createRadialGradient(
            endPoint.x, endPoint.y, 0,
            endPoint.x, endPoint.y, branch.endDotSize * 2.5
          );
          dotGradient.addColorStop(0, `rgba(255, 255, 255, ${dotOpacity * 0.4})`);
          dotGradient.addColorStop(0.6, `rgba(255, 255, 255, ${dotOpacity * 0.15})`);
          dotGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = dotGradient;
          ctx.beginPath();
          ctx.arc(endPoint.x, endPoint.y, branch.endDotSize * 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Dot core - white
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(endPoint.x, endPoint.y, branch.endDotSize, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.restore();
        }
      });

      // Draw central dot (always visible during growth, fades during fade phase)
      const centralDotOpacity = isGrowing ? 1 : Math.max(0.3, 1 - easeInOutCubic(phaseProgress));
      if (centralDotOpacity > 0) {
        ctx.save();
        ctx.globalAlpha = centralDotOpacity;

        // Central dot halo
        const centerGradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, 8
        );
        centerGradient.addColorStop(0, `rgba(52, 211, 153, ${centralDotOpacity * 0.5})`);
        centerGradient.addColorStop(0.7, `rgba(16, 185, 129, ${centralDotOpacity * 0.2})`);
        centerGradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
        
        ctx.fillStyle = centerGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
        ctx.fill();

        // Central dot core
        ctx.fillStyle = EMERALD_PRIMARY;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 2.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }

      // Reset cycle if we've faded completely - ensure continuous looping
      if (!isGrowing && phaseProgress >= 1) {
        cycleStartTimeRef.current = Date.now();
        branches = generateBranches(branchCount, 42, centerX, centerY);
      }

      // Always continue animation loop - never stop until component unmounts
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

    const interval = setInterval(checkDone, 50); // Check every 50ms
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
