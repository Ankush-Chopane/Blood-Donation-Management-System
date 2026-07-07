import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const RouteTransition = ({ children }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18, filter: 'blur(8px)' }}
      animate={shouldReduceMotion ? {} : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={shouldReduceMotion ? {} : { opacity: 0, y: -18, filter: 'blur(8px)' }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.38, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default RouteTransition;
