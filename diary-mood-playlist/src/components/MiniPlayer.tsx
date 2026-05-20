import { usePlayer } from '../context/PlayerContext';

export default function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlay } = usePlayer();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700 shadow-2xl">
      <div className="max-w-2xl mx-auto flex items-center gap-3 px-4 py-2">
        {/* YouTube iframe (숨김 재생) */}
        <div className="hidden">
          <iframe
            id="youtube-player"
            width="0"
            height="0"
            src={`https://www.youtube.com/embed/${currentTrack.id}?autoplay=${isPlaying ? 1 : 0}&enablejsapi=1`}
            allow="autoplay"
            title="YouTube player"
          />
        </div>

        {/* 트랙 정보 */}
        <img
          src={currentTrack.thumbnail}
          alt={`${currentTrack.title} 썸네일`}
          className="w-10 h-10 rounded-md object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">
            {currentTrack.title}
          </p>
          <p className="text-gray-400 text-xs truncate">
            {currentTrack.channel}
          </p>
        </div>

        {/* 컨트롤 */}
        <button
          onClick={togglePlay}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label={isPlaying ? '일시정지' : '재생'}
        >
          <span className="text-white text-lg">
            {isPlaying ? '⏸' : '▶️'}
          </span>
        </button>

        {/* YouTube에서 열기 */}
        <a
          href={currentTrack.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white text-xs transition-colors"
          aria-label="YouTube에서 열기"
        >
          🔗
        </a>
      </div>
    </div>
  );
}
