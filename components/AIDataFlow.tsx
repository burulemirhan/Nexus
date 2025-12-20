import React, { useEffect, useRef } from 'react';

interface FarmSymbol {
  id: string;
  x: number;
  y: number;
  label: string;
}

const AIDataFlow: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
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

    const centerX = canvas.width / (2 * (window.devicePixelRatio || 1));
    const centerY = canvas.height / (2 * (window.devicePixelRatio || 1));

    const farmSymbols: FarmSymbol[] = [
      { id: 'vertical', x: 0.25, y: 0.3, label: 'Vertical' },
      { id: 'greenhouse', x: 0.75, y: 0.3, label: 'Greenhouse' },
      { id: 'field', x: 0.25, y: 0.7, label: 'Field' },
      { id: 'livestock', x: 0.75, y: 0.7, label: 'Livestock' },
    ];

    let time = 0;
    const flowSpeed = 0.002;
    const particleSpeed = 2;

    const drawFarmSymbol = (symbol: FarmSymbol, symbolX: number, symbolY: number) => {
      ctx.save();
      ctx.translate(symbolX, symbolY);
      
      // Outer circle with glow
      const gradient = ctx.createRadialGradient(0, 0, 15, 0, 0, 25);
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, 25, 0, Math.PI * 2);
      ctx.fill();
      
      // Outer circle border
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.stroke();
      
      // Inner pattern (farm icon - varies by type)
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      
      if (symbol.id === 'vertical' || symbol.id === 'greenhouse') {
        // Vertical/horizontal lines for vertical farm/greenhouse
        ctx.moveTo(-8, -8);
        ctx.lineTo(8, -8);
        ctx.moveTo(-8, 0);
        ctx.lineTo(8, 0);
        ctx.moveTo(-8, 8);
        ctx.lineTo(8, 8);
      } else if (symbol.id === 'field') {
        // Grid pattern for field
        ctx.moveTo(-8, -8);
        ctx.lineTo(8, -8);
        ctx.moveTo(-8, 0);
        ctx.lineTo(8, 0);
        ctx.moveTo(-8, 8);
        ctx.lineTo(8, 8);
        ctx.moveTo(-8, -8);
        ctx.lineTo(-8, 8);
        ctx.moveTo(0, -8);
        ctx.lineTo(0, 8);
        ctx.moveTo(8, -8);
        ctx.lineTo(8, 8);
      } else {
        // Circle pattern for livestock
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
      }
      ctx.stroke();
      
      ctx.restore();
    };

    const drawDataFlow = (fromX: number, fromY: number, toX: number, toY: number, progress: number) => {
      const x = fromX + (toX - fromX) * progress;
      const y = fromY + (toY - fromY) * progress;

      // Particle with trailing effect
      const size = 4 + Math.sin(progress * Math.PI * 2) * 1;
      
      // Outer glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 10);
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.6)');
      gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.3)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
      
      // Core particle
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      
      ctx.clearRect(0, 0, width, height);

      // Draw "E" letter in center (Tesla font style - bold, condensed)
      ctx.save();
      ctx.translate(centerX, centerY);
      
      // Outer glow
      ctx.shadowColor = 'rgba(16, 185, 129, 0.6)';
      ctx.shadowBlur = 30;
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 72px "Barlow Condensed", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('E', 0, 0);
      
      // Inner solid
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#10b981';
      ctx.fillText('E', 0, 0);
      
      ctx.restore();

      // Draw farm symbols and data flows
      farmSymbols.forEach((symbol, index) => {
        const symbolX = width * symbol.x;
        const symbolY = height * symbol.y;

        // Draw farm symbol
        drawFarmSymbol(symbol, symbolX, symbolY);

        // Draw data flow particles (multiple particles per connection)
        const phase = (time * flowSpeed + index * 0.25) % 1;
        for (let i = 0; i < 3; i++) {
          const particlePhase = (phase + i * 0.33) % 1;
          if (particlePhase > 0 && particlePhase < 0.9) {
            drawDataFlow(centerX, centerY, symbolX, symbolY, particlePhase);
          }
        }

        // Reverse flow
        const reversePhase = (time * flowSpeed + index * 0.25 + 0.5) % 1;
        for (let i = 0; i < 3; i++) {
          const particlePhase = (reversePhase + i * 0.33) % 1;
          if (particlePhase > 0 && particlePhase < 0.9) {
            drawDataFlow(symbolX, symbolY, centerX, centerY, particlePhase);
          }
        }
      });

      time += particleSpeed;
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block' }}
    />
  );
};

export default AIDataFlow;
