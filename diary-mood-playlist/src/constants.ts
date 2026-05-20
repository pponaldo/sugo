import type { MoodColor } from './types';

export const GRADIENT_MAP: Record<MoodColor, { from: string; to: string }> = {
  'warm-sunset': { from: '#f97316', to: '#ec4899' },
  'cool-night': { from: '#1e3a5f', to: '#7c3aed' },
  'fresh-morning': { from: '#38bdf8', to: '#6ee7b7' },
  'rainy-day': { from: '#6b7280', to: '#3b82f6' },
  'cozy-evening': { from: '#92400e', to: '#f97316' },
};

export const DEFAULT_GRADIENT = { from: '#6366f1', to: '#8b5cf6' };

export const DIARY_MIN_LENGTH = 10;
export const DIARY_MAX_LENGTH = 2000;

export const STORAGE_KEY = 'diary-mood-playlist-entries';

export const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];
