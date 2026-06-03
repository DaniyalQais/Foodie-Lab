import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { pageTransition } from '../../lib/motionPresets';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export default function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
