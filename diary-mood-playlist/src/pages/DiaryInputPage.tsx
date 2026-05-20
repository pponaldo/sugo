import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateDiaryInput } from '../utils/validation';
import { analyzeDiary, searchYouTube } from '../utils/api';
import { saveEntry } from '../utils/storage';
import { DAY_NAMES, DIARY_MAX_LENGTH } from '../constants';
import LoadingAnimation from '../components/LoadingAnimation';
import type { DiaryEntry, Track } from '../types';

export default function DiaryInputPage() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const validation = validateDiaryInput(text);

  const handleSubmit = async () => {
    if (!validation.isValid) return;

    setIsLoading(true);
    setError(null);

    try {
      // 1. AI 분석
      const analysis = await analyzeDiary(text);

      // 2. YouTube 검색
      let tracks: Track[] = [];
      try {
        const ytResult = await searchYouTube(analysis.mood.searchQueries);
        tracks = ytResult.tracks;
      } catch {
        // YouTube 실패해도 나머지 결과는 보여줌
        console.warn('YouTube 검색 실패');
      }

      // 3. 엔트리 생성 및 저장
      const now = new Date();
      const entry: DiaryEntry = {
        id: `${now.getTime()}`,
        date: now.toISOString().split('T')[0],
        dayOfWeek: DAY_NAMES[now.getDay()],
        diary: text,
        summary: analysis.summary,
        message: analysis.message,
        mood: analysis.mood,
        tracks,
        createdAt: now.getTime(),
      };

      saveEntry(entry);
      navigate(`/result/${entry.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '분석 중 오류가 발생했어. 다시 시도해줘.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 pb-20 px-4">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-16 pb-20 px-4">
      <div className="w-full max-w-xl">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
          📖 오늘 하루를 들려줘
        </h2>
        <p className="text-gray-500 text-center text-sm mb-8">
          편하게 적어줘. 길어도, 짧아도 괜찮아.
        </p>

        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => {
              if (e.target.value.length <= DIARY_MAX_LENGTH) {
                setText(e.target.value);
              }
            }}
            placeholder="오늘 하루를 편하게 들려줘. 길어도, 짧아도 괜찮아."
            className="w-full h-64 p-5 rounded-2xl border border-gray-200 bg-white shadow-sm resize-none text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all"
            aria-label="일기 입력"
          />
          <div className="absolute bottom-3 right-4 text-xs text-gray-400">
            {validation.length} / {DIARY_MAX_LENGTH}
          </div>
        </div>

        {validation.isTooLong && (
          <p className="text-red-500 text-xs mt-2">최대 {DIARY_MAX_LENGTH}자까지 입력할 수 있어.</p>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!validation.isValid}
          className="w-full mt-6 py-4 rounded-2xl bg-indigo-500 text-white font-semibold text-lg shadow-lg hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
        >
          오늘의 음악 받기 🎵
        </button>

        {validation.isTooShort && text.length > 0 && (
          <p className="text-gray-400 text-xs text-center mt-2">
            조금만 더 적어줘 (최소 10자)
          </p>
        )}
      </div>
    </div>
  );
}
