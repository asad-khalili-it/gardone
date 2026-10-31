'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label.replace(/\s+/g, '-');

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-white/80 mb-1.5 mr-1"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          dir="rtl"
          className={`
            w-full px-4 py-3 rounded-xl
            bg-white/10 backdrop-blur-sm
            border border-white/20
            text-white placeholder-white/30
            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/60
            focus:border-[var(--color-primary)]
            transition-all duration-200
            ${icon ? 'pr-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500/60' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-xs mt-1.5 mr-1"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}

export { Input };

