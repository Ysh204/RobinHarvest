import type { Transition, Variants } from 'framer-motion'

/** Shared spring used for interactive elements. */
export const spring: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
}

export const softSpring: Transition = {
  type: 'spring',
  stiffness: 180,
  damping: 24,
}

export const pageVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: softSpring },
}

export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: spring },
  exit: { opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.15 } },
}

export const drawerVariants: Variants = {
  hidden: { y: '100%' },
  visible: { y: 0, transition: softSpring },
  exit: { y: '100%', transition: { duration: 0.2 } },
}

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}
