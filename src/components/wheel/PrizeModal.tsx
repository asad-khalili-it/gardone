'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from './Confetti';
import ShareButtons from '@/components/share/ShareButtons';

interface PrizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  prizeName: string;
  discountCode: string;
  storeName: string;
  shareUrl: string;
  colors?: string[];
}

export default function PrizeModal({
  isOpen,
  onClose,
  prizeName,
  discountCode,
  storeName,
  shareUrl,
  colors,
}: PrizeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Confetti */}
          <Confetti colors={colors} />

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-3xl overflow-hidden
                bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-background)]
                border border-white/10 shadow-2xl"
            >
              {/* Decorative top glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-[var(--color-accent)]/20 blur-3xl" />

              <div className="relative z-10 p-6 text-center">
                {/* Celebration emoji */}
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', damping: 10 }}
                  className="text-5xl mb-3"
                >
                  🎉
                </motion.div>

                {/* Header */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-extrabold mb-1"
                  style={{ color: 'var(--color-accent)' }}
                >
                  تبریک! 🎊
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/60 text-sm mb-5"
                >
                  شما برنده شدید!
                </motion.p>

                {/* Prize name */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4"
                >
                  <p className="text-3xl font-black mb-2" style={{ color: 'var(--color-primary)' }}>
                    {prizeName}
                  </p>
                  {discountCode && (
                    <div className="mt-3">
                      <p className="text-xs text-white/40 mb-1">کد تخفیف شما:</p>
                      <div
                        className="inline-block px-5 py-2 rounded-xl
                          bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30
                          font-mono font-bold text-lg tracking-widest"
                        style={{ color: 'var(--color-accent)' }}
                      >
                        {discountCode}
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Share section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <p className="text-xs text-white/40 mb-2">
                    با دوستات به اشتراک بذار:
                  </p>
                  <ShareButtons
                    storeName={storeName}
                    shareMessage={`من از ${storeName} جایزه "${prizeName}" بردم! 🎉`}
                    shareUrl={shareUrl}
                  />
                </motion.div>

                {/* Close button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  onClick={onClose}
                  className="mt-5 text-white/30 hover:text-white/60 text-sm transition-colors cursor-pointer"
                >
                  بستن ✕
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
