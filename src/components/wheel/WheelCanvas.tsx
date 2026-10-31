'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import type { Prize } from '@/lib/types';

interface WheelCanvasProps {
  prizes: Prize[];
  onSpinEnd: (prize: Prize) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
  spinDuration?: number;
}

// Easing function: deceleration curve
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// Select a winner based on probability weights
function selectWinner(prizes: Prize[]): number {
  const activePrizes = prizes.filter((p) => p.isActive);
  const totalWeight = activePrizes.reduce((sum, p) => sum + p.probability, 0);
  let random = Math.random() * totalWeight;
  for (let i = 0; i < activePrizes.length; i++) {
    random -= activePrizes[i].probability;
    if (random <= 0) {
      return prizes.indexOf(activePrizes[i]);
    }
  }
  return 0;
}

export default function WheelCanvas({
  prizes,
  onSpinEnd,
  isSpinning,
  setIsSpinning,
  spinDuration = 5000,
}: WheelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const animationRef = useRef<number>(0);
  const tickSoundRef = useRef<HTMLAudioElement | null>(null);
  const lastSegmentRef = useRef(-1);
  const [canvasSize, setCanvasSize] = useState(340);

  // Responsive canvas sizing
  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      if (w < 360) setCanvasSize(300);
      else if (w < 420) setCanvasSize(350);
      else if (w < 640) setCanvasSize(390);
      else setCanvasSize(440);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Synthesize Web Audio click sound
  const playTickSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {}
  }, []);

  const drawWheel = useCallback(
    (rotation: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const size = canvasSize;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      ctx.scale(dpr, dpr);

      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size / 2 - 20;
      const numPrizes = prizes.length;
      const arc = (2 * Math.PI) / numPrizes;

      ctx.clearRect(0, 0, size, size);

      // Outer glow
      ctx.save();
      ctx.shadowColor = 'rgba(255, 215, 0, 0.6)';
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 15, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.fill();
      ctx.restore();

      // Draw outer metallic ring (wider for bolder casino bulbs)
      const ringGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        radius - 5,
        centerX,
        centerY,
        radius + 18
      );
      ringGrad.addColorStop(0, '#B8860B');
      ringGrad.addColorStop(0.2, '#FFD700');
      ringGrad.addColorStop(0.5, '#FFF275');
      ringGrad.addColorStop(0.8, '#DAA520');
      ringGrad.addColorStop(1, '#8B6914');
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 14, 0, 2 * Math.PI);
      ctx.fillStyle = ringGrad;
      ctx.fill();

      // Outer ring border stroke
      ctx.save();
      ctx.strokeStyle = '#FFE066';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Draw bold LED bulbs around the border
      const numDots = 20;
      const bulbRadius = size > 380 ? 6.5 : 5.5; // visibly larger bulb size
      const trackRadius = radius + 5;

      for (let i = 0; i < numDots; i++) {
        const dotAngle = (i * 2 * Math.PI) / numDots + rotation * 0.15;
        const dotX = centerX + trackRadius * Math.cos(dotAngle);
        const dotY = centerY + trackRadius * Math.sin(dotAngle);

        // Bulb socket (dark metal rim around each bulb)
        ctx.save();
        ctx.beginPath();
        ctx.arc(dotX, dotY, bulbRadius + 2, 0, 2 * Math.PI);
        ctx.fillStyle = '#4a3800';
        ctx.fill();
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();

        // 3-phase animated blinking pattern for casino look
        const phase = (Math.floor(Date.now() / 250) + i) % 3;
        const isGoldLit = phase === 0;
        const isWhiteLit = phase === 1;

        ctx.save();
        ctx.beginPath();
        ctx.arc(dotX, dotY, bulbRadius, 0, 2 * Math.PI);

        if (isGoldLit) {
          ctx.shadowColor = '#FFE600';
          ctx.shadowBlur = 18;
          const bulbGrad = ctx.createRadialGradient(dotX - 1.5, dotY - 1.5, 0, dotX, dotY, bulbRadius);
          bulbGrad.addColorStop(0, '#FFFFFF');
          bulbGrad.addColorStop(0.4, '#FFF780');
          bulbGrad.addColorStop(0.8, '#FFD700');
          bulbGrad.addColorStop(1, '#FF9900');
          ctx.fillStyle = bulbGrad;
        } else if (isWhiteLit) {
          ctx.shadowColor = '#00F0FF';
          ctx.shadowBlur = 15;
          const bulbGrad = ctx.createRadialGradient(dotX - 1.5, dotY - 1.5, 0, dotX, dotY, bulbRadius);
          bulbGrad.addColorStop(0, '#FFFFFF');
          bulbGrad.addColorStop(0.4, '#E0FFFF');
          bulbGrad.addColorStop(1, '#00C8E6');
          ctx.fillStyle = bulbGrad;
        } else {
          // Dim state (still rich glass look)
          ctx.shadowColor = '#FFA500';
          ctx.shadowBlur = 6;
          const bulbGrad = ctx.createRadialGradient(dotX - 1, dotY - 1, 0, dotX, dotY, bulbRadius);
          bulbGrad.addColorStop(0, '#FFDB80');
          bulbGrad.addColorStop(1, '#996600');
          ctx.fillStyle = bulbGrad;
        }

        ctx.fill();
        ctx.restore();
      }

      // Draw segments
      for (let i = 0; i < numPrizes; i++) {
        const startAngle = rotation + i * arc;
        const endAngle = startAngle + arc;

        // Segment fill with gradient
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius - 4, startAngle, endAngle);
        ctx.closePath();

        const grad = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          radius
        );
        const baseColor = prizes[i].color;
        grad.addColorStop(0, lightenColor(baseColor, 30));
        grad.addColorStop(0.5, baseColor);
        grad.addColorStop(1, darkenColor(baseColor, 20));
        ctx.fillStyle = grad;
        ctx.fill();

        // Segment border
        ctx.strokeStyle = 'rgba(255,215,0,0.5)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + arc / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.max(11, size * 0.032)}px Vazirmatn, sans-serif`;
        ctx.shadowColor = 'rgba(0,0,0,0.7)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.fillText(prizes[i].label, radius - 18, 5);
        ctx.restore();
      }

      // Inner shadow ring
      const innerShadow = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.2,
        centerX,
        centerY,
        radius * 0.45
      );
      innerShadow.addColorStop(0, 'rgba(0,0,0,0.2)');
      innerShadow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.45, 0, 2 * Math.PI);
      ctx.fillStyle = innerShadow;
      ctx.fill();

      // Center circle - metallic look
      const centerRadius = size * 0.1;
      const centerGrad = ctx.createRadialGradient(
        centerX - 3,
        centerY - 3,
        0,
        centerX,
        centerY,
        centerRadius
      );
      centerGrad.addColorStop(0, '#FFD700');
      centerGrad.addColorStop(0.4, '#DAA520');
      centerGrad.addColorStop(0.8, '#B8860B');
      centerGrad.addColorStop(1, '#8B6914');

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(centerX, centerY, centerRadius, 0, 2 * Math.PI);
      ctx.fillStyle = centerGrad;
      ctx.fill();
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Draw pointer (triangle at top)
      const pointerSize = 18;
      ctx.save();
      ctx.shadowColor = 'rgba(255, 215, 0, 0.6)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - radius - 3);
      ctx.lineTo(centerX - pointerSize / 2, centerY - radius - pointerSize - 3);
      ctx.lineTo(centerX + pointerSize / 2, centerY - radius - pointerSize - 3);
      ctx.closePath();
      const pointerGrad = ctx.createLinearGradient(
        centerX,
        centerY - radius - pointerSize - 3,
        centerX,
        centerY - radius - 3
      );
      pointerGrad.addColorStop(0, '#FFD700');
      pointerGrad.addColorStop(1, '#FF6B35');
      ctx.fillStyle = pointerGrad;
      ctx.fill();
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    },
    [prizes, canvasSize]
  );

  // Initial draw & LED animation
  useEffect(() => {
    let ledFrame: number;
    const animateLEDs = () => {
      drawWheel(rotationRef.current);
      ledFrame = requestAnimationFrame(animateLEDs);
    };
    if (!isSpinning) {
      animateLEDs();
    }
    return () => cancelAnimationFrame(ledFrame);
  }, [drawWheel, isSpinning]);

  // Spin animation
  const spin = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    const winnerIndex = selectWinner(prizes);
    const numPrizes = prizes.length;
    const arc = (2 * Math.PI) / numPrizes;

    // Calculate target rotation:
    // The pointer is at the top (–π/2). We want the winning segment's center to align with the pointer.
    // Each segment i spans from i*arc to (i+1)*arc.
    // Center of winning segment = winnerIndex * arc + arc/2
    // We need: rotation + center = –π/2 + 2πk (mod 2π), pointer facing down toward segment
    // Actually the pointer points inward at the top, i.e. at angle -π/2.
    // For the segment center to be under the pointer: rotation + winnerIndex*arc + arc/2 ≡ -π/2 (mod 2π)
    // rotation = -π/2 - winnerIndex*arc - arc/2 - current rotation (mod 2π) + full_spins

    const fullSpins = 5 + Math.floor(Math.random() * 3); // 5-7 full rotations
    // Normalize current rotation so we always spin forward in full glory
    const currentNorm = ((rotationRef.current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    // Target pointer angle is at top: -π/2 (or 3π/2)
    // We want: (targetAngle + winnerCenter) % 2π = 3π/2
    const winnerCenter = winnerIndex * arc + arc / 2;
    let targetRelative = (3 * Math.PI / 2 - winnerCenter) % (2 * Math.PI);
    if (targetRelative < 0) targetRelative += 2 * Math.PI;

    // Additional forward delta from normalized current to target
    let forwardDelta = targetRelative - currentNorm;
    if (forwardDelta <= 0) forwardDelta += 2 * Math.PI;

    // Small jitter inside segment
    const jitter = (Math.random() - 0.5) * (arc * 0.4);
    const totalRotation = fullSpins * 2 * Math.PI + forwardDelta + jitter;

    const startRotation = rotationRef.current;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      const eased = easeOutCubic(progress);

      const currentRotation = startRotation + totalRotation * eased;
      rotationRef.current = currentRotation;

      // Tick sound
      const normalizedAngle =
        ((currentRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const currentSegment = Math.floor(normalizedAngle / arc) % numPrizes;
      if (currentSegment !== lastSegmentRef.current) {
        lastSegmentRef.current = currentSegment;
        playTickSound();
      }

      drawWheel(currentRotation);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        onSpinEnd(prizes[winnerIndex]);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [isSpinning, prizes, spinDuration, drawWheel, onSpinEnd, setIsSpinning]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  // Expose spin function via a global ref (the parent calls it)
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__wheelSpin = spin;
    return () => {
      delete (window as unknown as Record<string, unknown>).__wheelSpin;
    };
  }, [spin]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: canvasSize, height: canvasSize }}>
      <canvas
        ref={canvasRef}
        className="block"
        style={{ width: canvasSize, height: canvasSize }}
      />
    </div>
  );
}

// Utility: lighten a hex color
function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + Math.round(2.55 * percent));
  const g = Math.min(255, ((num >> 8) & 0x00ff) + Math.round(2.55 * percent));
  const b = Math.min(255, (num & 0x0000ff) + Math.round(2.55 * percent));
  return `rgb(${r},${g},${b})`;
}

// Utility: darken a hex color
function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - Math.round(2.55 * percent));
  const g = Math.max(0, ((num >> 8) & 0x00ff) - Math.round(2.55 * percent));
  const b = Math.max(0, (num & 0x0000ff) - Math.round(2.55 * percent));
  return `rgb(${r},${g},${b})`;
}
