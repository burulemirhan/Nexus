import React, { useEffect, useRef, useState } from 'react';

interface PreloaderProps {
  onDone: () => void;
  minDuration?: number; // Minimum duration in milliseconds
}

// Emerald green color palette
const EMERALD_PRIMARY = '#10b981'; // Emerald-500
const EMERALD_GLOW = '#34d399'; // Emerald-400 for glow
const EMERALD_DARK = '#059669'; // Emerald-600 for subtle variation

interface Node {
  distance: number; // Distance along branch from center (0-1)
  glowProgress: number; // 0-1 for glow animation when created
  age: number; // Time since creation
}

interface Branch {
  angle: number;
  length: number;
  maxLength: number;
  curve: number; // Base curvature factor
  wavePhase: number; // Phase for sine wave undulation
  waveAmplitude: number; // Amplitude of snake-like movement
  waveFrequency: number; // Frequency of undulation
  progress: number;
  nodes: Node[]; // Nodes along the branch
  endDotSize: number;
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

  // Generate deterministic branches with snake-like properties
  const generateBranches = (count: number, seed: number): Branch[] => {
    const random = seededRandom(seed);
    const branches: Branch[] = [];
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (random() - 0.5) * 0.3;
      const maxLength = 150 + random() * 100; // 150-250px
      const curve = (random() - 0.5) * 0.6; // More pronounced base curve
      const wavePhase = random() * Math.PI * 2; // Random phase for each branch
      const waveAmplitude = 15 + random() * 20; // 15-35px amplitude for snake movement
      const waveFrequency = 0.02 + random() * 0.03; // Frequency of undulation
      
      branches.push({
        angle,
        length: 0,
        maxLength,
        curve,
        wavePhase,
        waveAmplitude,
        waveFrequency,
        progress: 0,
        nodes: [],
        endDotSize: 0,
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

    // Full animation - slower for more organic feel
    const branchCount = 18; // More arms for richer network
    let branches = generateBranches(branchCount, 42); // Seed: 42
    const cycleDuration = 12000; // 12 seconds per cycle (half speed for very slow, natural growth)
    const growthPhase = 0.65; // First 65% is growth, rest is fade
    const nodeSpacing = 0.15; // Create a node every 15% of branch length

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

      // Easing functions - smoother, more organic
      const easeOutSine = (t: number) => Math.sin(t * Math.PI / 2);
      const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

      if (isGrowing) {
        const easedProgress = easeOutSine(phaseProgress); // Slower, more natural easing
        
        // Update branches
        branches.forEach((branch) => {
          branch.progress = easedProgress;
          branch.length = branch.maxLength * easedProgress;
          
          // Create nodes along the branch as it grows
          const currentNodeDistance = easedProgress;
          const shouldHaveNodes = Math.floor(currentNodeDistance / nodeSpacing);
          
          // Add new nodes when branch reaches node positions
          for (let i = 1; i <= shouldHaveNodes; i++) {
            const nodeDistance = i * nodeSpacing;
            if (nodeDistance <= easedProgress) {
              // Check if node already exists
              const existingNode = branch.nodes.find(n => 
                Math.abs(n.distance - nodeDistance) < 0.01
              );
              
              if (!existingNode) {
                // Create new node with glow animation
                branch.nodes.push({
                  distance: nodeDistance,
                  glowProgress: 0, // Start at 0 for glow effect
                  age: 0,
                });
              }
            }
          }
          
          // Update node glow animations
          branch.nodes.forEach((node) => {
            node.age += 0.016; // Roughly 60fps
            // Glow peaks quickly then fades
            if (node.age < 0.3) {
              node.glowProgress = Math.sin((node.age / 0.3) * Math.PI);
            } else {
              node.glowProgress = Math.max(0.3, 1 - (node.age - 0.3) * 0.5);
            }
          });
          
          // End dot appears when branch is fully grown
          if (easedProgress > 0.95) {
            branch.endDotSize = 3 * Math.min(1, (easedProgress - 0.95) / 0.05);
          }
        });
      } else {
        // Fade phase - keep branch lengths at max, but fade opacity
        branches.forEach((branch) => {
          branch.length = branch.maxLength;
          branch.progress = 1 - easeInOutSine(phaseProgress);
          branch.endDotSize = 3 * branch.progress;
          
          // Fade nodes
          branch.nodes.forEach((node) => {
            node.glowProgress *= branch.progress;
          });
        });
      }

      // Draw branches and dots
      branches.forEach((branch) => {
        if (branch.progress <= 0) return;

        const opacity = isGrowing 
          ? Math.min(1, branch.progress * 1.5)
          : branch.progress;

        if (opacity <= 0) return;

        // Calculate snake-like path with multiple curves
        const startX = centerX;
        const startY = centerY;
        const baseEndX = startX + Math.cos(branch.angle) * branch.length;
        const baseEndY = startY + Math.sin(branch.angle) * branch.length;
        
        // Create sinuous path using multiple points for snake-like movement
        const pathPoints: { x: number; y: number }[] = [];
        const numPoints = Math.max(20, Math.floor(branch.maxLength / 8)); // More points for smoother curves
        
        for (let i = 0; i <= numPoints; i++) {
          const t = i / numPoints; // 0 to 1 along branch
          const currentLength = branch.length * t;
          
          // Base direction
          const baseX = startX + Math.cos(branch.angle) * currentLength;
          const baseY = startY + Math.sin(branch.angle) * currentLength;
          
          // Add base curve (smooth arc)
          const perpAngle = branch.angle + Math.PI / 2;
          const curveOffset = branch.curve * currentLength * 0.4;
          const curvedX = baseX + Math.cos(perpAngle) * curveOffset;
          const curvedY = baseY + Math.sin(perpAngle) * curveOffset;
          
          // Add snake-like undulation (sine wave perpendicular to path)
          const wavePhase = branch.wavePhase + (currentLength * branch.waveFrequency);
          const waveOffset = Math.sin(wavePhase) * branch.waveAmplitude * t; // Amplitude grows with distance
          const finalX = curvedX + Math.cos(perpAngle) * waveOffset;
          const finalY = curvedY + Math.sin(perpAngle) * waveOffset;
          
          pathPoints.push({ x: finalX, y: finalY });
        }

        // Draw snake-like branch - white arms
        ctx.save();
        ctx.globalAlpha = opacity * 0.9;
        ctx.strokeStyle = '#ffffff'; // White arms
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowBlur = 3;
        ctx.shadowColor = `rgba(255, 255, 255, ${opacity * 0.3})`; // Soft white glow

        // Draw smooth path through points
        ctx.beginPath();
        ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
        
        for (let i = 1; i < pathPoints.length; i++) {
          const prev = pathPoints[i - 1];
          const curr = pathPoints[i];
          
          if (i === 1) {
            ctx.lineTo(curr.x, curr.y);
          } else {
            const prev2 = pathPoints[i - 2];
            // Smooth curve using quadratic bezier
            const cpX = prev.x;
            const cpY = prev.y;
            ctx.quadraticCurveTo(cpX, cpY, (prev.x + curr.x) / 2, (prev.y + curr.y) / 2);
          }
        }
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        ctx.restore();
        
        // Draw nodes along the path with glow
        branch.nodes.forEach((node) => {
          if (node.distance > branch.progress) return; // Only show nodes that have been reached
          
          const nodeT = node.distance / branch.progress;
          const nodeIndex = Math.floor(nodeT * (pathPoints.length - 1));
          const nodePoint = pathPoints[Math.min(nodeIndex, pathPoints.length - 1)];
          
          ctx.save();
          const nodeOpacity = opacity * node.glowProgress;
          ctx.globalAlpha = nodeOpacity;
          
          // Node glow - brighter when just created
          const glowSize = 4 + node.glowProgress * 6; // 4-10px glow
          const nodeGradient = ctx.createRadialGradient(
            nodePoint.x, nodePoint.y, 0,
            nodePoint.x, nodePoint.y, glowSize
          );
          nodeGradient.addColorStop(0, `rgba(255, 255, 255, ${node.glowProgress * 0.8})`);
          nodeGradient.addColorStop(0.5, `rgba(255, 255, 255, ${node.glowProgress * 0.3})`);
          nodeGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = nodeGradient;
          ctx.beginPath();
          ctx.arc(nodePoint.x, nodePoint.y, glowSize, 0, Math.PI * 2);
          ctx.fill();
          
          // Node core
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(nodePoint.x, nodePoint.y, 1.5 + node.glowProgress * 1, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.restore();
        });

        // Draw end dot - white (matching the arms) - at the end of the path
        if (branch.endDotSize > 0 && pathPoints.length > 0) {
          const endPoint = pathPoints[pathPoints.length - 1];
          ctx.save();
          const dotOpacity = opacity;
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
        branches = generateBranches(branchCount, 42);
      }
      
      // Clean up old nodes (keep only active ones)
      branches.forEach((branch) => {
        branch.nodes = branch.nodes.filter(node => node.distance <= branch.progress);
      });

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
