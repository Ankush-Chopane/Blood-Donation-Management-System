export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 }
};

export const hoverLift = {
  whileHover: { y: -6, scale: 1.02 },
  transition: { type: 'spring', stiffness: 300 }
};

export const transitionSmooth = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.4
};
