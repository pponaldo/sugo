import type { Track } from '../types';
import { usePlayer } from '../context/PlayerContext';

interface TrackListProps {
  tracks: Track[];
}

export default function TrackList({ tracks }: TrackListProps) {
  const { playTrack, currentTrack, setPlaylist } = usePlayer();

  const handleTrackSelect = (track: Track) => {
    setPlaylist(tracks);
    playTrack(track);
  };

  return (
    <div className="space-y-3" role="list" aria-label="추천 플레이리스트">
      {tracks.map((track) => (
        <button
          key={track.id}
          onClick={() => handleTrackSelect(track)}
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/20 ${
            currentTrack?.id === track.id
              ? 'bg-white/30 ring-2 ring-white/50'
              : 'bg-white/10'
          }`}
          role="listitem"
          aria-label={`${track.title} - ${track.channel} 재생`}
        >
          <img
            src={track.thumbnail}
            alt={`${track.title} 썸네일`}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 text-left min-w-0">
            <p className="text-white text-sm font-medium truncate">{track.title}</p>
            <p className="text-white/70 text-xs truncate">{track.channel}</p>
          </div>
          <span className="text-white/60 text-lg flex-shrink-0">
            {currentTrack?.id === track.id ? '🔊' : '▶'}
          </span>
        </button>
      ))}
    </div>
  );
}
