import { useParams, useNavigate } from 'react-router-dom';
import { getEntryById } from '../utils/storage';
import MoodVisual from '../components/MoodVisual';
import TrackList from '../components/TrackList';

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const entry = id ? getEntryById(id) : null;

  if (!entry) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 pb-20 px-4">
        <div className="text-center">
          <p className="text-gray-500 text-lg">기록을 찾을 수 없어.</p>
          <button
            onClick={() => navigate('/history')}
            className="mt-4 text-indigo-500 hover:underline"
          >
            기록 목록으로
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-24 px-4 relative">
      <MoodVisual color={entry.mood.color} energy={entry.mood.energy} />

      <div className="max-w-xl mx-auto space-y-6 relative z-10">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={() => navigate('/history')}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="뒤로가기"
          >
            ← 뒤로
          </button>
          <span className="text-white font-medium">
            📅 {entry.date} {entry.dayOfWeek}요일
          </span>
        </div>

        {/* 원본 일기 */}
        <section className="bg-white/20 backdrop-blur-md rounded-2xl p-6">
          <h3 className="text-white/80 text-sm font-medium mb-2">📝 내가 쓴 일기</h3>
          <p className="text-white/90 leading-relaxed whitespace-pre-wrap">
            {entry.diary}
          </p>
        </section>

        {/* 하루 요약 */}
        <section className="bg-white/20 backdrop-blur-md rounded-2xl p-6">
          <h3 className="text-white/80 text-sm font-medium mb-2">📋 하루 요약</h3>
          <p className="text-white text-lg leading-relaxed">{entry.summary}</p>
        </section>

        {/* 위로 메시지 */}
        <section className="bg-white/20 backdrop-blur-md rounded-2xl p-6">
          <h3 className="text-white/80 text-sm font-medium mb-2">💬 한마디</h3>
          <p className="text-white text-xl font-medium leading-relaxed italic">
            "{entry.message}"
          </p>
        </section>

        {/* 플레이리스트 */}
        {entry.tracks.length > 0 && (
          <section className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <h3 className="text-white/80 text-sm font-medium mb-1">
              🎵 그날의 플레이리스트
            </h3>
            <p className="text-white/60 text-xs mb-4">{entry.mood.vibe}</p>
            <TrackList tracks={entry.tracks} />
          </section>
        )}
      </div>
    </div>
  );
}
