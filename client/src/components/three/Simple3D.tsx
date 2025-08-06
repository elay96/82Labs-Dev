import { useRef, useEffect } from 'react';

export default function Simple3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.02;
      
      // Clear canvas
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw animated shapes simulating 3D
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Draw rotating polygons
      for (let i = 0; i < 3; i++) {
        const radius = 50 + i * 30;
        const sides = 6 + i * 2;
        const rotation = time * (i + 1) * 0.5;
        const alpha = 0.7 - i * 0.2;
        
        ctx.beginPath();
        for (let j = 0; j <= sides; j++) {
          const angle = (j / sides) * Math.PI * 2 + rotation;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius * 0.6; // Pseudo 3D effect
          
          if (j === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        const hue = (time * 30 + i * 120) % 360;
        ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // Draw floating particles
      for (let i = 0; i < 20; i++) {
        const angle = time * 0.5 + i * 0.3;
        const radius = 100 + Math.sin(time + i) * 50;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * 0.3;
        
        const size = 2 + Math.sin(time * 2 + i) * 1;
        const hue = (time * 60 + i * 30) % 360;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.8)`;
        ctx.fill();
      }
      
      animationId = requestAnimationFrame(animate);
    };

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="w-full h-[600px] lg:h-[800px] relative three-scene-container">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Overlay UI */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg backdrop-blur-sm">
        <h3 className="font-semibold mb-1">Animated 2D Scene</h3>
        <p className="text-sm opacity-80">Canvas-based animations with pseudo-3D effects</p>
      </div>
    </div>
  );
}