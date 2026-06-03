import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const PARTICLE_COUNT = 16;
const COLORS = ['#f5dcba', '#e05327', '#d97706', '#fbcfbf'];

interface Particle {
  x: number;
  y: number;
  r: number;
  color: string;
  vx: number;
  vy: number;
  phase: number;
}

export default function HeroParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let particles: Particle[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 4 + Math.random() * 8,
        color: COLORS[i % COLORS.length],
        vx: 0.15 + Math.random() * 0.2,
        vy: 0.12 + Math.random() * 0.18,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const tick = (time: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const t = time * 0.001;
      particles.forEach((p, i) => {
        const x = p.x + Math.sin(t * p.vx + p.phase) * 12;
        const y = p.y + Math.cos(t * p.vy + p.phase) * 10;

        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.28 + (i % 3) * 0.06;
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(tick);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement ?? canvas);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
      aria-hidden
    />
  );
}
