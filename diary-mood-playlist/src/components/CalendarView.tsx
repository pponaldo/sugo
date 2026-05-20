import { useMemo } from 'react';
import type { DiaryEntry } from '../types';
import { GRADIENT_MAP } from '../constants';

interface CalendarViewProps {
  entries: DiaryEntry[];
  currentMonth: Date;
  onDateSelect: (date: string) => void;
  onMonthChange: (direction: 'prev' | 'next') => void;
}

export default function CalendarView({
  entries,
  currentMonth,
  onDateSelect,
  onMonthChange,
}: CalendarViewProps) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const entryMap = useMemo(() => {
    const map: Record<string, DiaryEntry> = {};
    entries.forEach((entry) => {
      map[entry.date] = entry;
    });
    return map;
  }, [entries]);

  const monthLabel = `${year}년 ${month + 1}월`;

  const days = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="h-10" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const entry = entryMap[dateStr];
    const gradient = entry ? GRADIENT_MAP[entry.mood.color] : null;

    days.push(
      <button
        key={day}
        onClick={() => entry && onDateSelect(entry.id)}
        disabled={!entry}
        className={`h-10 w-full rounded-lg flex items-center justify-center text-sm relative transition-all ${
          entry
            ? 'hover:ring-2 hover:ring-indigo-300 cursor-pointer'
            : 'text-gray-400 cursor-default'
        }`}
        aria-label={entry ? `${month + 1}월 ${day}일 기록 보기` : `${month + 1}월 ${day}일`}
      >
        {day}
        {gradient && (
          <span
            className="absolute bottom-1 w-2 h-2 rounded-full"
            style={{ backgroundColor: gradient.from }}
          />
        )}
      </button>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onMonthChange('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="이전 달"
        >
          ◀
        </button>
        <h3 className="font-semibold text-gray-800">{monthLabel}</h3>
        <button
          onClick={() => onMonthChange('next')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="다음 달"
        >
          ▶
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
          <div key={d} className="h-8 flex items-center justify-center font-medium">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{days}</div>
    </div>
  );
}
