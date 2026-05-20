import { useParams, useNavigate } from 'react-router-dom';
import { getEntryById } from '../utils/storage';
import MoodVisual from '../components/MoodVisual';
import TrackList from '../components/TrackList';

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const entry = id ? getEntryById(id) : null;

  if (!entry) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 pb-20 px-4">
        <div className="text-center">
          <p className="text-gray-500 text-lg">기록을 찾을 수 없어.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-indigo-500 hover:underline"
          >
            일기 쓰러 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-24 px-4 relative">
      <MoodVisual color={entry.mood.color} energy={entry.mood.energy} />

      <div className="max-w-xl mx-auto space-y-6 animate-fade-in relative z-10">
        {/* 하루 요약 */}
        <section className="bg-white/20 backdrop-blur-md rounded-2xl p-6 mt-6">
          <h3 className="text-white/80 text-sm font-medium mb-2">📋 오늘 하루 요약</h3>
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
              🎵 오늘의 플레이리스트
            </h3>
            <p className="text-white/60 text-xs mb-4">{entry.mood.vibe}</p>
            <TrackList tracks={entry.tracks} />
          </section>
        )}

        {entry.tracks.length === 0 && (
          <section className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center">
            <p className="text-white/70">
              음악 검색에 실패했어. 하지만 오늘의 요약과 메시지는 여기 있어 ✨
            </p>
          </section>
        )}

        {/* 액션 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-3 rounded-xl bg-white/20 text-white font-medium hover:bg-white/30 transition-colors"
          >
            📖 다시 쓰기
          </button>
          <button
            onClick={() => navigate('/history')}
            className="flex-1 py-3 rounded-xl bg-white/20 text-white font-medium hover:bg-white/30 transition-colors"
          >
            📚 기록 보기
          </button>
        </div>
      </div>
    </div>
  );
}
