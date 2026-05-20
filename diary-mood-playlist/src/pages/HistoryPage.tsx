import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllEntries, getEntriesByMonth } from '../utils/storage';
import CalendarView from '../components/CalendarView';
import DiaryCard from '../components/DiaryCard';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const allEntries = getAllEntries();

  const monthEntries = getEntriesByMonth(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1
  );

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const next = new Date(prev);
      if (direction === 'prev') {
        next.setMonth(next.getMonth() - 1);
      } else {
        next.setMonth(next.getMonth() + 1);
      }
      return next;
    });
  };

  const handleDateSelect = (id: string) => {
    navigate(`/history/${id}`);
  };

  if (allEntries.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-16 pb-20 px-4">
        <p className="text-gray-500 text-lg text-center mb-4">
          아직 기록이 없어. 오늘 첫 일기를 써볼까? ✨
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors"
        >
          일기 쓰러 가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-20 px-4">
      <div className="max-w-xl mx-auto space-y-6 mt-6">
        <h2 className="text-xl font-bold text-gray-800">📚 나의 기록</h2>

        {/* 캘린더 */}
        <CalendarView
          entries={monthEntries}
          currentMonth={currentMonth}
          onDateSelect={handleDateSelect}
          onMonthChange={handleMonthChange}
        />

        {/* 기록 리스트 */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-500">최근 기록</h3>
          {allEntries.map((entry) => (
            <DiaryCard
              key={entry.id}
              entry={entry}
              onClick={() => navigate(`/history/${entry.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
