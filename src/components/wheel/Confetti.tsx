'use client';

import { useEffect } from 'react';

interface ConfettiProps {
  colors?: string[];
}

export default function Confetti({
  colors = ['#FF6B35', '#004E89', '#FFD700', '#00C49A', '#E74C3C', '#9B59B6'],
}: ConfettiProps) {
  useEffect(() => {
    let cancelled = false;

    const fireConfetti = async () => {
      const confetti = (await import('canvas-confetti')).default;
      if (cancelled) return;

      // First burst - center
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors,
        zIndex: 9999,
      });

      // Second burst - left side
      setTimeout(() => {
        if (cancelled) return;
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
          zIndex: 9999,
        });
      }, 200);

      // Third burst - right side
      setTimeout(() => {
        if (cancelled) return;
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
          zIndex: 9999,
        });
      }, 400);

      // Fourth burst - celebration shower
      setTimeout(() => {
        if (cancelled) return;
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.35 },
          colors,
          zIndex: 9999,
          gravity: 0.8,
          scalar: 1.2,
        });
      }, 700);
    };

    fireConfetti();

    return () => {
      cancelled = true;
    };
  }, [colors]);

  return null;
}
