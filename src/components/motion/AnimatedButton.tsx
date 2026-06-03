import { motion, type HTMLMotionProps } from 'motion/react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { springSnappy } from '../../lib/motionPresets';

type AnimatedButtonProps = HTMLMotionProps<'button'> & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

const variantClass: Record<NonNullable<AnimatedButtonProps['variant']>, string> = {
  primary:
    'bg-gradient-to-r from-terracotta-500 to-brand-600 text-white shadow-lg shadow-terracotta-500/15',
  secondary: 'border-2 border-brand-200 bg-white text-gray-700 hover:bg-brand-50',
  ghost: 'text-gray-600 hover:text-brand-600 hover:bg-brand-50/80',
};

export default function AnimatedButton({
  variant = 'primary',
  className = '',
  children,
  disabled,
  ...props
}: AnimatedButtonProps) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return (
      <button
        type="button"
        disabled={disabled}
        className={`rounded-xl font-semibold cursor-pointer ${variantClass[variant]} ${className}`}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  }

  return (
    <motion.button
      type="button"
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -2, scale: 1.01 }}
      whileTap={disabled ? undefined : { scale: 0.98, y: 0 }}
      transition={springSnappy}
      className={`rounded-xl font-semibold cursor-pointer will-change-transform ${variantClass[variant]} ${className}`}
      data-cursor-hover={disabled ? undefined : true}
      {...props}
    >
      {children}
    </motion.button>
  );
}
