import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useFinePointer } from '../../hooks/useFinePointer';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export default function AnimatedCursor() {
  const finePointer = useFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  const enabled = finePointer && !reducedMotion;
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 520, damping: 38, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 520, damping: 38, mass: 0.4 });

  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add('custom-cursor-active');

    const onMove = (e: MouseEvent) => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        x.set(e.clientX);
        y.set(e.clientY);
        if (!visible) setVisible(true);
      });
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest(
        'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor-hover]'
      );
      setHovering(!!interactive);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, visible, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-normal"
        style={{ x: springX, y: springY }}
        initial={false}
        animate={{
          opacity: visible ? 1 : 0,
          scale: hovering ? 1.55 : 1,
        }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="-translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-terracotta-500/80 bg-terracotta-500/20 will-change-transform"
          style={{ boxShadow: '0 0 0 1px rgba(224, 83, 39, 0.08)' }}
        />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9998]"
        style={{ x: springX, y: springY }}
        initial={false}
        animate={{
          opacity: visible ? 0.35 : 0,
          scale: hovering ? 2.2 : 1,
        }}
        transition={{ duration: 0.22 }}
      >
        <div className="-translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-terracotta-500/10 blur-[1px] will-change-transform" />
      </motion.div>
    </>
  );
}
