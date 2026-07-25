'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/themeContext';

interface ThemeToggleProps {
  /** 'icon' = icon-only pill (for sidebar), 'full' = icon + label */
  variant?: 'icon' | 'full';
  className?: string;
}

export default function ThemeToggle({ variant = 'icon', className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === 'dark' : true;

  if (variant === 'full') {
    return (
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium transition-all
          border border-transparent hover:border-white/10 hover:bg-white/5
          dark:text-zinc-300 text-zinc-600 hover:text-zinc-900 dark:hover:text-white
          ${className}`}
      >
        <div className="relative h-4 w-4 flex-shrink-0">
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.div
                key="moon"
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Moon className="h-4 w-4 text-indigo-400" />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Sun className="h-4 w-4 text-amber-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <span>{isDark ? 'Dark mode' : 'Light mode'}</span>
        {/* Toggle pill */}
        <div className={`ml-auto h-5 w-9 rounded-full border transition-all duration-300 flex items-center px-0.5 ${
          isDark
            ? 'bg-indigo-500/30 border-indigo-500/50'
            : 'bg-amber-400/30 border-amber-400/50'
        }`}>
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`h-3.5 w-3.5 rounded-full shadow ${
              isDark ? 'bg-indigo-400 ml-auto' : 'bg-amber-400'
            }`}
          />
        </div>
      </button>
    );
  }

  // icon-only variant
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`relative h-8 w-8 rounded-xl border border-white/10 flex items-center justify-center
        hover:border-white/20 hover:bg-white/5 transition-all duration-200 ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-3.5 w-3.5 text-indigo-400" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-3.5 w-3.5 text-amber-400" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
