import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';

const Loader = () => {
  const [visible, setVisible] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => setVisible(false), 600);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-[rgba(6,12,22,0.84)] backdrop-blur-2xl"
          role="status"
          aria-label="Loading platform contents"
          initial={shouldReduceMotion ? false : { opacity: 1 }}
          exit={shouldReduceMotion ? {} : { opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <div className="glass-card premium-card flex min-w-[280px] flex-col items-center rounded-[2rem] px-10 py-12 text-center">
            <motion.div
              animate={shouldReduceMotion ? {} : { scale: [1, 1.08, 1], rotate: [0, -4, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="rounded-full bg-secondary/10 p-5 text-secondary shadow-[0_0_25px_rgba(239,35,60,0.35)]"
            >
              <FiHeart className="text-[2.5rem]" />
            </motion.div>
            <div className="my-6 h-[30px] w-[180px] text-secondary">
              <svg viewBox="0 0 100 20" className="h-full w-full" aria-hidden="true">
                <motion.path
                  d="M0,10 L35,10 L38,7 L42,13 L45,3 L49,17 L52,8 L56,12 L59,10 L100,10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0.7 }}
                  animate={shouldReduceMotion ? {} : { pathLength: 1, opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
                />
              </svg>
            </div>
            <p className="font-heading text-[1rem] font-semibold uppercase tracking-[0.32em] text-lightGray/80">
              Preparing Care Network
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default Loader;
