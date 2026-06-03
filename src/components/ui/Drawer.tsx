import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { springSnappy } from '../../lib/motionPresets';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

/** Mobile-first bottom drawer (Animate UI–style). */
export default function Drawer({ open, onClose, title, children }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close drawer"
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="fixed inset-x-0 bottom-0 z-[51] max-h-[88vh] rounded-t-3xl bg-white border border-brand-100 shadow-2xl flex flex-col"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={springSnappy}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80 || info.velocity.y > 400) onClose();
            }}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>
            {title && (
              <div className="flex items-center justify-between px-4 pb-2">
                <h2 className="font-display font-bold text-gray-900">{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-gray-100 cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            )}
            <div className="overflow-y-auto px-4 pb-6 flex-1">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
