'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SpinButtonProps {
  onClick: () => void;
  isSpinning: boolean;
  size?: number;
}

export default function SpinButton({
  onClick,
  isSpinning,
  size = 80,
}: SpinButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={isSpinning}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10
        rounded-full flex items-center justify-center
        cursor-pointer disabled:cursor-not-allowed
        shadow-2xl"
      style={{
        width: size,
        height: size,
        background: isSpinning
          ? 'linear-gradient(135deg, #666, #444)'
          : 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
        boxShadow: isSpinning
          ? '0 0 20px rgba(100,100,100,0.3)'
          : '0 0 30px rgba(255,107,53,0.5), 0 0 60px rgba(255,215,0,0.3)',
      }}
      animate={
        isSpinning
          ? { scale: [1, 0.95, 1], rotate: 360 }
          : {
              scale: [1, 1.08, 1],
              boxShadow: [
                '0 0 20px rgba(255,107,53,0.4), 0 0 40px rgba(255,215,0,0.2)',
                '0 0 35px rgba(255,107,53,0.7), 0 0 70px rgba(255,215,0,0.4)',
                '0 0 20px rgba(255,107,53,0.4), 0 0 40px rgba(255,215,0,0.2)',
              ],
            }
      }
      transition={
        isSpinning
          ? { duration: 1, repeat: Infinity, ease: 'linear' }
          : { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
      }
      whileHover={!isSpinning ? { scale: 1.12 } : undefined}
      whileTap={!isSpinning ? { scale: 0.95 } : undefined}
    >
      <span
        className="font-extrabold text-white select-none"
        style={{ fontSize: size * 0.18, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
      >
        {isSpinning ? '...' : 'بچرخون!'}
      </span>
    </motion.button>
  );
}
