import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { springSnappy } from '../../lib/motionPresets';

interface RevealCardProps {
  children: ReactNode;
  className?: string;
}

/** Interactive card with subtle hover lift (React Bits–style polish). */
export default function RevealCard({ children, className = '' }: RevealCardProps) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={`gpu-motion ${className}`}
      whileHover={{ y: -3, boxShadow: '0 12px 28px -12px rgba(224, 83, 39, 0.18)' }}
      whileTap={{ scale: 0.99 }}
      transition={springSnappy}
      data-cursor-hover
    >
      {children}
    </motion.div>
  );
}
