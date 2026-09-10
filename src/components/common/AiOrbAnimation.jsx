import React, { useEffect, useRef, useState } from 'react';

export default function AiOrbAnimation() {
  const canvasRef = useRef(null);
  const [taskText, setTaskText] = useState('MONITOREO EN TIEMPO REAL...');
  const [isVisible, setIsVisible] = useState(true);
  
  const tasks = [
    "ANALIZANDO ANOMALÍAS...",
    "FILTRANDO LISTAS NEGRAS...",
    "RASTREANDO HONEYPOTS...",
    "ASEGURANDO PERÍMETRO...",
    "CORRELACIONANDO ATAQUES...",
    "MONITOREO EN TIEMPO REAL..."
  ];

  useEffect(() => {
    let taskIndex = 0;
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        taskIndex = (taskIndex + 1) % tasks.length;
        setTaskText(tasks[taskIndex]);
        setIsVisible(true);
      }, 500); 
      
    }, 3500);
    
    return () => clearInterval(interval);
  }, [tasks.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    let animationFrameId;
    let time = 0;

    canvas.width = 600;
    canvas.height = 600;
    
    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;

    const points = [];
    const radius = 280;
    const latitudeBands = 45;
    const longitudeBands = 45;

    for (let latNumber = 0; latNumber <= latitudeBands; latNumber++) {
      const theta = (latNumber * Math.PI) / latitudeBands;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let longNumber = 0; longNumber <= longitudeBands; longNumber++) {
        const phi = (longNumber * 2 * Math.PI) / longitudeBands;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const x = cosPhi * sinTheta;
        const y = cosTheta;
        const z = sinPhi * sinTheta;

        points.push({ x: x * radius, y: y * radius, z: z * radius, ox: x, oy: y, oz: z });
      }
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(13, 17, 23, 0.3)';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      const angleX = 0.15;
      const angleY = time * 0.0004;

      const sinX = Math.sin(angleX);
      const cosX = Math.cos(angleX);
      const sinY = Math.sin(angleY);
      const cosY = Math.cos(angleY);

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        let y1 = p.y * cosX - p.z * sinX;
        let z1 = p.y * sinX + p.z * cosX;

        let x2 = p.x * cosY + z1 * sinY;
        let z2 = -p.x * sinY + z1 * cosY;
        let y2 = y1;

        const fov = 600;
        const distance = fov + z2;

        if (distance <= 0) continue;

        const scale = fov / distance;
        const x2d = cx + x2 * scale;
        const y2d = cy + y2 * scale;

        const wave1 = Math.sin(p.oy * 5 + time * 0.003);
        const wave2 = Math.sin(p.ox * 3 + p.oz * 3 - time * 0.004);

        let pulse = (wave1 + wave2) * 0.5;
        pulse = Math.max(0, pulse);

        const depthAlpha = Math.max(0.05, (z2 + radius) / (radius * 2));
        const baseAlpha = 0.15;
        const finalAlpha = (baseAlpha + pulse * 0.85) * depthAlpha;

        const baseRadius = 1.2;
        const dotRadius = scale * (baseRadius + pulse * 1.5);

        ctx.beginPath();
        ctx.arc(x2d, y2d, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${finalAlpha})`; 
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
      time += 16;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto">
      <div className="relative w-full aspect-square rounded-full shadow-[0_0_50px_rgba(212,175,55,0.05)] overflow-hidden" 
           style={{ background: 'radial-gradient(circle at center, rgba(22, 27, 34, 0.4) 0%, rgba(13, 17, 23, 0) 70%)' }}>
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
      
      <div className="h-8 mt-6 flex items-center justify-center font-mono">
        <span 
          className={`text-hm-gold text-lg tracking-widest uppercase shadow-hm-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.8)] transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          {taskText}
        </span>
        <span className="inline-block w-3 h-5 bg-hm-gold ml-2 animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.8)]"></span>
      </div>
    </div>
  );
}
