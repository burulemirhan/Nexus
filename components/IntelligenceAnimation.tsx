import React, { useEffect, useRef, useState } from 'react';

interface DataFlow {
  id: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  progress: number;
  speed: number;
  opacity: number;
}

const IntelligenceAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [isVisible, setIsVisible] = useState(false);
  const dataFlowsRef = useRef<DataFlow[]>([]);
  const lastFlowTimeRef = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.2 }
    );

    const canvas = canvasRef.current;
    if (canvas) {
      observer.observe(canvas);
    }

    return () => {
      if (canvas) {
        observer.unobserve(canvas);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const centerX = canvas.width / (window.devicePixelRatio || 1) / 2;
    const centerY = canvas.height / (window.devicePixelRatio || 1) / 2;

    // Farm symbol positions (around the center E)
    const farmSymbols = [
      { x: centerX - 120, y: centerY - 80, type: 'vertical' },    // Top left - vertical farm
      { x: centerX + 120, y: centerY - 80, type: 'greenhouse' },  // Top right - greenhouse
      { x: centerX - 120, y: centerY + 80, type: 'field' },       // Bottom left - field
      { x: centerX + 120, y: centerY + 80, type: 'livestock' },   // Bottom right - livestock
    ];

    let animationId: number;

    const animate = (currentTime: number) => {
      if (!isVisible) return;

      ctx.clearRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));

      // Draw farm symbols
      farmSymbols.forEach((symbol) => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.arc(symbol.x, symbol.y, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Simple symbol representation
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1.5;
        if (symbol.type === 'vertical') {
          // Vertical lines
          ctx.beginPath();
          ctx.moveTo(symbol.x - 4, symbol.y - 6);
          ctx.lineTo(symbol.x - 4, symbol.y + 6);
          ctx.moveTo(symbol.x, symbol.y - 6);
          ctx.lineTo(symbol.x, symbol.y + 6);
          ctx.moveTo(symbol.x + 4, symbol.y - 6);
          ctx.lineTo(symbol.x + 4, symbol.y + 6);
          ctx.stroke();
        } else if (symbol.type === 'greenhouse') {
          // Dome shape
          ctx.beginPath();
          ctx.arc(symbol.x, symbol.y - 2, 8, Math.PI, 0, false);
          ctx.stroke();
        } else if (symbol.type === 'field') {
          // Horizontal lines
          ctx.beginPath();
          ctx.moveTo(symbol.x - 6, symbol.y - 4);
          ctx.lineTo(symbol.x + 6, symbol.y - 4);
          ctx.moveTo(symbol.x - 6, symbol.y);
          ctx.lineTo(symbol.x + 6, symbol.y);
          ctx.moveTo(symbol.x - 6, symbol.y + 4);
          ctx.lineTo(symbol.x + 6, symbol.y + 4);
          ctx.stroke();
        } else if (symbol.type === 'livestock') {
          // Animal symbol (simple shape)
          ctx.beginPath();
          ctx.ellipse(symbol.x, symbol.y, 6, 4, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Draw central E letter (Tesla font style) - larger and with better styling
      ctx.font = '900 100px Barlow Condensed';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#10b981'; // Emerald green
      
      // Add glow effect to E
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 30;
      ctx.fillText('E', centerX, centerY);
      ctx.shadowBlur = 0;
      
      // Draw E again for solid fill
      ctx.fillStyle = '#10b981';
      ctx.fillText('E', centerX, centerY);

      // Create new data flows periodically
      if (currentTime - lastFlowTimeRef.current > 1200) {
        const symbol = farmSymbols[Math.floor(Math.random() * farmSymbols.length)];
        const speed = 0.015 + Math.random() * 0.015;
        
        // Flow from E to symbol (command/data flow)
        dataFlowsRef.current.push({
          id: Date.now(),
          fromX: centerX,
          fromY: centerY,
          toX: symbol.x,
          toY: symbol.y,
          progress: 0,
          speed: speed,
          opacity: 0.9,
        });

        // Flow from symbol to E (sensor/data flow) - start slightly delayed
        dataFlowsRef.current.push({
          id: Date.now() + 1,
          fromX: symbol.x,
          fromY: symbol.y,
          toX: centerX,
          toY: centerY,
          progress: -0.2, // Start slightly behind (negative progress)
          speed: speed,
          opacity: 0.7,
        });

        lastFlowTimeRef.current = currentTime;
      }

      // Update and draw data flows
      dataFlowsRef.current = dataFlowsRef.current.filter((flow) => {
        if (flow.progress < 0) {
          flow.progress += flow.speed; // Only advance if started
        } else {
          flow.progress += flow.speed;
        }

        if (flow.progress >= 1 || flow.progress < -0.3) {
          return false;
        }

        // Skip drawing if not started yet
        if (flow.progress < 0) {
          return true;
        }

        const x = flow.fromX + (flow.toX - flow.fromX) * flow.progress;
        const y = flow.fromY + (flow.toY - flow.fromY) * flow.progress;
        
        // Fade out as it progresses
        const opacity = flow.opacity * (1 - flow.progress * 0.7);

        // Draw data particle with glow
        ctx.fillStyle = `rgba(16, 185, 129, ${opacity})`;
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw trail/connection line
        ctx.strokeStyle = `rgba(16, 185, 129, ${opacity * 0.4})`;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(flow.fromX, flow.fromY);
        ctx.lineTo(x, y);
        ctx.stroke();

        return true;
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isVisible]);

  return (
    <div className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
};

export default IntelligenceAnimation;
