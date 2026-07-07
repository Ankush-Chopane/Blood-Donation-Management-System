import React from 'react';
import { motion } from 'framer-motion';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle = ({ floating = false }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={`glass-card inline-flex items-center gap-3 rounded-full border px-4 py-3 text-sm font-semibold text-lightGray shadow-premium transition-colors ${floating ? 'fixed bottom-6 left-6 z-[70]' : ''}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-secondary">
        {isDark ? <FiSun /> : <FiMoon />}
      </span>
      <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
    </motion.button>
  );
};

export default ThemeToggle;
