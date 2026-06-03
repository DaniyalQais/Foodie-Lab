import type { ReactNode } from 'react';
import { MotionConfig } from 'motion/react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import AnimatedCursor from '../components/cursor/AnimatedCursor';

export default function MotionProvider({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion={reducedMotion ? 'always' : 'user'}>
      {children}
      <AnimatedCursor />
    </MotionConfig>
  );
}
