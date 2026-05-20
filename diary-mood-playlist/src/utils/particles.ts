import type { MoodColor } from '../types';
import { GRADIENT_MAP } from '../constants';

export function getParticleConfig(energy: number, color: MoodColor) {
  const speed = energy * 3;
  const density = Math.floor(energy * 50) + 10;
  const gradient = GRADIENT_MAP[color];

  return {
    fullScreen: { enable: false },
    background: { color: { value: 'transparent' } },
    particles: {
      number: { value: density },
      move: {
        enable: true,
        speed,
        direction: 'none' as const,
        outModes: { default: 'out' as const },
      },
      opacity: { value: 0.3 + energy * 0.4 },
      size: { value: { min: 1, max: 2 + energy * 3 } },
      color: { value: [gradient.from, gradient.to] },
      shape: { type: 'circle' },
    },
    detectRetina: true,
  };
}
