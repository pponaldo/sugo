// 지원되는 색상 키워드
export type MoodColor =
  | 'warm-sunset'
  | 'cool-night'
  | 'fresh-morning'
  | 'rainy-day'
  | 'cozy-evening';

// 감정 분석 결과
export interface MoodAnalysis {
  energy: number; // 0.0 ~ 1.0
  valence: number; // 0.0 ~ 1.0
  vibe: string; // 플레이리스트 부제목
  color: MoodColor; // 배경 색상 키워드
  searchQueries: [string, string, string]; // YouTube 검색 키워드 3개
}

// YouTube 트랙 정보
export interface Track {
  id: string; // YouTube 영상 ID
  title: string; // 영상 제목
  channel: string; // 채널명
  thumbnail: string; // 썸네일 URL
  youtubeUrl: string; // YouTube 링크
}

// 일기 기록 엔트리
export interface DiaryEntry {
  id: string; // 고유 ID
  date: string; // YYYY-MM-DD
  dayOfWeek: string; // 월~일
  diary: string; // 원본 일기 텍스트
  summary: string; // AI 생성 요약
  message: string; // AI 생성 위로 메시지
  mood: MoodAnalysis; // 감정 분석 결과
  tracks: Track[]; // 추천된 곡 목록
  createdAt: number; // Unix timestamp (ms)
}

// /api/analyze 요청
export interface AnalyzeRequest {
  diary: string;
}

// /api/analyze 응답
export interface AnalyzeResponse {
  summary: string;
  message: string;
  mood: MoodAnalysis;
}

// /api/youtube-search 요청
export interface YouTubeSearchRequest {
  queries: string[];
}

// /api/youtube-search 응답
export interface YouTubeSearchResponse {
  tracks: Track[];
}

// PlayerContext 값
export interface PlayerContextValue {
  currentTrack: Track | null;
  isPlaying: boolean;
  playlist: Track[];
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  setPlaylist: (tracks: Track[]) => void;
}
