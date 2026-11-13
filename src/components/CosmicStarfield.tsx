import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  color: string;
}

interface CosmicStarfieldProps {
  paused?: boolean;
}

export const CosmicStarfield: React.FC<CosmicStarfieldProps> = ({ paused = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener('resize', handleResize);

    const starCount = Math.floor((width * height) / 4500);
    const starColors = ['#ffffff', '#bae6fd', '#e0e7ff', '#fef08a', '#c084fc'];
    let stars: Star[] = [];

    const initStars = () => {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.8 + 0.4,
          opacity: Math.random() * 0.7 + 0.3,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinkleOffset: Math.random() * Math.PI * 2,
          color: starColors[Math.floor(Math.random() * starColors.length)],
        });
      }
    };

    initStars();

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / width - 0.5) * 15;
      mouseY = (e.clientY / height - 0.5) * 15;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let time = 0;

    const render = () => {
      if (pausedRef.current) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Deep space background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#04060c');
      bgGrad.addColorStop(0.5, '#070b16');
      bgGrad.addColorStop(1, '#050711');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Soft cosmic nebula clouds
      const nebula1 = ctx.createRadialGradient(
        width * 0.75 + mouseX * 2,
        height * 0.25 + mouseY * 2,
        20,
        width * 0.75,
        height * 0.25,
        Math.min(width, height) * 0.6
      );
      nebula1.addColorStop(0, 'rgba(124, 58, 237, 0.12)');
      nebula1.addColorStop(0.5, 'rgba(56, 189, 248, 0.06)');
      nebula1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, width, height);

      const nebula2 = ctx.createRadialGradient(
        width * 0.2 - mouseX,
        height * 0.7 - mouseY,
        10,
        width * 0.2,
        height * 0.7,
        Math.min(width, height) * 0.55
      );
      nebula2.addColorStop(0, 'rgba(14, 165, 233, 0.1)');
      nebula2.addColorStop(0.6, 'rgba(99, 102, 241, 0.04)');
      nebula2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, width, height);

      // Render stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        const currentOpacity =
          star.opacity * (0.6 + 0.4 * Math.sin(time * star.twinkleSpeed * 60 + star.twinkleOffset));

        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, currentOpacity));

        const posX = star.x + mouseX * (star.size * 0.3);
        const posY = star.y + mouseY * (star.size * 0.3);

        ctx.beginPath();
        ctx.arc(posX, posY, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Cross flare on bright stars
        if (star.size > 1.8 && currentOpacity > 0.7) {
          ctx.strokeStyle = star.color;
          ctx.lineWidth = 0.5;
          ctx.globalAlpha = currentOpacity * 0.4;
          ctx.beginPath();
          ctx.moveTo(posX - star.size * 2.5, posY);
          ctx.lineTo(posX + star.size * 2.5, posY);
          ctx.moveTo(posX, posY - star.size * 2.5);
          ctx.lineTo(posX, posY + star.size * 2.5);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
