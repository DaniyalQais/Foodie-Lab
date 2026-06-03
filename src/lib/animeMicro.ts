import { animate } from 'motion/react';

function reducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Polished success pulse for icons and badges (uses Motion — no animejs required). */
export function animateSuccessPop(el: HTMLElement | null) {
  if (!el || reducedMotion()) return;

  animate(
    el,
    { scale: [0.85, 1.06, 1], opacity: [0, 1, 1] },
    { duration: 0.68, ease: [0.22, 1, 0.36, 1] }
  );
}

/** Subtle hover lift for DOM elements */
export function animateHoverLift(el: HTMLElement, active: boolean) {
  if (reducedMotion()) return;

  animate(
    el,
    { y: active ? -2 : 0, scale: active ? 1.01 : 1 },
    { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
  );
}
