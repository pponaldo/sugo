import { useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine } from '@tsparticles/engine';
import type { MoodColor } from '../types';
import { GRADIENT_MAP, DEFAULT_GRADIENT } from '../constants';
import { getParticleConfig } from '../utils/particles';

interface MoodVisualProps {
  color: MoodColor;
  energy: number;
}

export default function MoodVisual({ color, energy }: MoodVisualProps) {
  const gradient = GRADIENT_MAP[color] || DEFAULT_GRADIENT;

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particleOptions = getParticleConfig(energy, color);

  return (
    <div
      className="fixed inset-0 -z-10 transition-all duration-1000"
      style={{
        background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
      }}
      aria-hidden="true"
    >
      <Particles
        id="mood-particles"
        init={particlesInit}
        options={particleOptions}
        className="absolute inset-0"
      />
    </div>
  );
}
