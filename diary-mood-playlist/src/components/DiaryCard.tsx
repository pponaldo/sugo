import type { DiaryEntry } from '../types';
import { GRADIENT_MAP } from '../constants';

interface DiaryCardProps {
  entry: DiaryEntry;
  onClick: () => void;
}

export default function DiaryCard({ entry, onClick }: DiaryCardProps) {
  const gradient = GRADIENT_MAP[entry.mood.color];

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex gap-3"
    >
      {/* 감정 색상 바 */}
      <div
        className="w-1 rounded-full flex-shrink-0"
        style={{
          background: `linear-gradient(to bottom, ${gradient.from}, ${gradient.to})`,
        }}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-800">
            📅 {entry.date} {entry.dayOfWeek}요일
          </span>
        </div>
        <p className="text-sm text-gray-600 truncate mb-1">{entry.summary}</p>
        <p className="text-xs text-gray-400">🎵 {entry.mood.vibe}</p>
      </div>
    </button>
  );
}
