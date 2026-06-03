import { motion } from 'motion/react';
import { useId, useState, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

type BaseProps = {
  label: string;
  className?: string;
};

type InputProps = BaseProps & {
  as?: 'input';
} & InputHTMLAttributes<HTMLInputElement>;

type TextareaProps = BaseProps & {
  as: 'textarea';
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function AnimatedField(props: InputProps | TextareaProps) {
  const { label, className = '', as = 'input', ...fieldProps } = props;
  const id = useId();
  const [focused, setFocused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const fieldClass =
    'w-full px-3 py-2.5 rounded-xl border bg-white text-sm outline-none transition-colors duration-200';

  const borderMotion = reducedMotion
    ? focused
      ? 'border-terracotta-500 ring-1 ring-terracotta-500/30'
      : 'border-gray-200'
    : focused
      ? 'border-terracotta-500'
      : 'border-gray-200';

  const FieldTag = as === 'textarea' ? 'textarea' : 'input';

  return (
    <label htmlFor={id} className={`block space-y-1 ${className}`}>
      <motion.span
        className="text-xs font-medium text-gray-600 block"
        animate={focused && !reducedMotion ? { color: '#c2410c' } : { color: '#4b5563' }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.span>
      <motion.div
        animate={
          reducedMotion
            ? undefined
            : focused
              ? { scale: 1.005, boxShadow: '0 0 0 3px rgba(224, 83, 39, 0.12)' }
              : { scale: 1, boxShadow: '0 0 0 0px rgba(224, 83, 39, 0)' }
        }
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-xl"
      >
        <FieldTag
          id={id}
          className={`${fieldClass} ${borderMotion}`}
          onFocus={e => {
            setFocused(true);
            fieldProps.onFocus?.(e as never);
          }}
          onBlur={e => {
            setFocused(false);
            fieldProps.onBlur?.(e as never);
          }}
          {...(fieldProps as object)}
        />
      </motion.div>
    </label>
  );
}
