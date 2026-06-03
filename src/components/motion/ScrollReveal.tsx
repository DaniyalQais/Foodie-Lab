import { motion, useInView } from 'motion/react';
import { useRef, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { easeOut, fadeUp } from '../../lib/motionPresets';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'section' | 'article';
  id?: string;
}

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  as = 'div',
  id,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px -6% 0px' });
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const motionProps = {
    id,
    ref,
    className,
    variants: fadeUp,
    initial: 'hidden' as const,
    animate: inView ? ('visible' as const) : ('hidden' as const),
    transition: { ...easeOut, delay },
    style: { willChange: inView ? ('auto' as const) : ('transform, opacity' as const) },
    children,
  };

  if (as === 'section') return <motion.section {...motionProps} />;
  if (as === 'article') return <motion.article {...motionProps} />;
  return <motion.div {...motionProps} />;
}
