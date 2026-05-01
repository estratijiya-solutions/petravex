import type { Variants } from 'framer-motion';

export const signatureEase = [0.4, 0, 0.2, 1] as const;

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: signatureEase } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: signatureEase } },
};

export const stagger = (childDelay = 0.1): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: childDelay } },
});

export const goldLineDraw: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 1.2, ease: signatureEase } },
};
