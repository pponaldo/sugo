# Design Document: diary-mood-playlist

## Overview

"오늘 하루, 수고했어"는 사용자가 자유 텍스트로 일기를 작성하면 AI가 하루를 요약하고, 위로 메시지를 생성하며, 분위기에 맞는 YouTube 음악 플레이리스트를 추천해주는 감성 웹앱이다. React 18 + Vite + TypeScript 기반 SPA로 구성되며, Vercel 서버리스 함수를 통해 Amazon Bedrock(Claude Opus 4.7)과 YouTube API를 안전하게 호출한다. 데이터는 localStorage에 저장되고, 감정 기반 비주얼(그라데이션 + 파티클)과 하단 고정 미니 플레이어를 제공한다.

## Architecture

React 18 SPA 클라이언트가 Vercel 서버리스 함수를 통해 외부 API(Amazon Bedrock, YouTube)와 통신한다. 클라이언트는 Vite로 빌드되고, 데이터는 localStorage에 저장된다.

```
┌─────────────────────────────────────────────────────────┐
│                    Client (React SPA)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │  Diary   │  │  Result  │  │ History  │  │ Detail  │ │
│  │  Input   │  │   Page   │  │   Page   │  │  Page   │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬────┘ │
│       │              │              │              │      │
│  ┌────┴──────────────┴──────────────┴──────────────┴───┐ │
│  │              Shared Components                       │ │
│  │  ┌────────────┐  ┌────────────┐  ┌───────────────┐ │ │
│  │  │ MiniPlayer │  │ MoodVisual │  │  Navigation   │ │ │
│  │  └────────────┘  └────────────┘  └───────────────┘ │ │
│  └─────────────────────────┬───────────────────────────┘ │
│                            │                              │
│  ┌─────────────────────────┴───────────────────────────┐ │
│  │              State & Storage Layer                   │ │
│  │  ┌──────────────┐  ┌─────────────────────────────┐ │ │
│  │  │ PlayerContext│  │  localStorage (DiaryEntry[]) │ │ │
│  │  └──────────────┘  └─────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────┘ │
└────────────────────────────┬─────────────────────────────┘
                             │ HTTPS
┌────────────────────────────┴─────────────────────────────┐
│              Vercel Serverless Functions                   │
│  ┌─────────────────┐       ┌──────────────────────────┐  │
│  │  /api/analyze   │       │  /api/youtube-search     │  │
│  │ (Bedrock proxy) │       │  (YouTube API proxy)     │  │
│  └────────┬────────┘       └────────────┬─────────────┘  │
└───────────┼─────────────────────────────┼────────────────┘
            │                             │
    ┌───────────┴──────────┐     ┌─────────┴──────────┐
    │  Amazon Bedrock      │     │  YouTube Data API   │
    │  (Claude Opus 4.7)   │     │  v3 Search          │
    └──────────────────────┘     └────────────────────┘
```

## Components and Interfaces

### Page Components

| Component | Route | Responsibility |
|-----------|-------|----------------|
| `DiaryInputPage` | `/` | 일기 작성 폼, 유효성 검사, 제출 및 로딩 상태 관리 |
| `ResultPage` | `/result/:id` | AI 분석 결과 표시, 플레이리스트 렌더링, 자동 저장 |
| `HistoryPage` | `/history` | 기록 리스트 + 캘린더 뷰 |
| `DetailPage` | `/history/:id` | 과거 기록 상세 보기 |

### Shared Components

| Component | Responsibility |
|-----------|----------------|
| `MiniPlayer` | 하단 고정 YouTube iframe 플레이어, 전역 재생 상태 관리 |
| `MoodVisual` | 배경 그라데이션 + tsparticles 파티클 애니메이션 |
| `Navigation` | 페이지 간 네비게이션 (일기 작성 / 기록) |
| `TrackList` | Track 목록 렌더링 (썸네일, 제목, 채널명) |
| `CalendarView` | 월별 캘린더 + 감정 색상 점 표시 |
| `DiaryCard` | History 리스트의 개별 카드 컴포넌트 |
| `LoadingAnimation` | AI 분석 중 감성 로딩 UI |

### Context Providers

| Context | Responsibility |
|---------|----------------|
| `PlayerContext` | 현재 재생 중인 Track, 재생/일시정지 상태, 트랙 전환 관리 |

## Data Models

### Core Data Types

```typescript
// 감정 분석 결과
interface MoodAnalysis {
  energy: number;       // 0.0 ~ 1.0
  valence: number;      // 0.0 ~ 1.0
  vibe: string;         // 플레이리스트 부제목
  color: MoodColor;     // 배경 색상 키워드
  searchQueries: [string, string, string]; // YouTube 검색 키워드 3개
}

// 지원되는 색상 키워드
type MoodColor = 'warm-sunset' | 'cool-night' | 'fresh-morning' | 'rainy-day' | 'cozy-evening';

// YouTube 트랙 정보
interface Track {
  id: string;           // YouTube 영상 ID
  title: string;        // 영상 제목
  channel: string;      // 채널명
  thumbnail: string;    // 썸네일 URL
  youtubeUrl: string;   // YouTube 링크
}

// 일기 기록 엔트리
interface DiaryEntry {
  id: string;           // 고유 ID (uuid 또는 date+timestamp)
  date: string;         // YYYY-MM-DD
  dayOfWeek: string;    // 월~일
  diary: string;        // 원본 일기 텍스트
  summary: string;      // AI 생성 요약
  message: string;      // AI 생성 위로 메시지
  mood: MoodAnalysis;   // 감정 분석 결과
  tracks: Track[];      // 추천된 곡 목록
  createdAt: number;    // Unix timestamp (ms)
}
```

### API Interfaces

```typescript
// /api/analyze 요청
interface AnalyzeRequest {
  diary: string;  // 10~2000자 일기 텍스트
}

// /api/analyze 응답
interface AnalyzeResponse {
  summary: string;
  message: string;
  mood: MoodAnalysis;
}

// /api/youtube-search 요청
interface YouTubeSearchRequest {
  queries: string[];  // 검색 키워드 배열 (3개)
}

// /api/youtube-search 응답
interface YouTubeSearchResponse {
  tracks: Track[];  // 중복 제거된 10~12곡
}
```

### Component Interfaces

```typescript
// MiniPlayer Props
interface MiniPlayerProps {
  // PlayerContext에서 상태를 가져오므로 props 없음
}

// PlayerContext 값
interface PlayerContextValue {
  currentTrack: Track | null;
  isPlaying: boolean;
  playlist: Track[];
  playTrack: (track: Track) => void;
  togglePlay: () => void;
}

// MoodVisual Props
interface MoodVisualProps {
  color: MoodColor;
  energy: number;
}

// TrackList Props
interface TrackListProps {
  tracks: Track[];
  onTrackSelect: (track: Track) => void;
}

// CalendarView Props
interface CalendarViewProps {
  entries: DiaryEntry[];
  currentMonth: Date;
  onDateSelect: (date: string) => void;
  onMonthChange: (direction: 'prev' | 'next') => void;
}

// DiaryCard Props
interface DiaryCardProps {
  entry: DiaryEntry;
  onClick: () => void;
}
```

## Color Mapping

```typescript
const GRADIENT_MAP: Record<MoodColor, { from: string; to: string }> = {
  'warm-sunset': { from: '#f97316', to: '#ec4899' },    // 주황 → 분홍
  'cool-night': { from: '#1e3a5f', to: '#7c3aed' },     // 남색 → 보라
  'fresh-morning': { from: '#38bdf8', to: '#6ee7b7' },   // 하늘 → 민트
  'rainy-day': { from: '#6b7280', to: '#3b82f6' },       // 회색 → 청색
  'cozy-evening': { from: '#92400e', to: '#f97316' },    // 갈색 → 주황
};
```

## Particle Configuration

```typescript
function getParticleConfig(energy: number): ParticleConfig {
  // energy 0.0~1.0 → 속도/밀도 매핑
  const speed = energy * 3;           // 0~3 범위
  const density = Math.floor(energy * 50) + 10;  // 10~60 범위

  return {
    particles: {
      number: { value: density },
      move: { speed },
      opacity: { value: 0.3 + energy * 0.4 },
      size: { value: 2 + energy * 3 },
    },
  };
}
```

## Storage Layer

```typescript
const STORAGE_KEY = 'diary-mood-playlist-entries';

// 저장
function saveEntry(entry: DiaryEntry): void {
  const entries = getEntries();
  entries.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

// 전체 조회 (최근순)
function getEntries(): DiaryEntry[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return JSON.parse(raw).sort(
    (a: DiaryEntry, b: DiaryEntry) => b.createdAt - a.createdAt
  );
}

// ID로 조회
function getEntryById(id: string): DiaryEntry | null {
  const entries = getEntries();
  return entries.find(e => e.id === id) ?? null;
}

// 날짜별 조회
function getEntriesByMonth(year: number, month: number): DiaryEntry[] {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  return getEntries().filter(e => e.date.startsWith(prefix));
}
```

## Serverless Functions

### /api/analyze

```typescript
// api/analyze.ts (Vercel serverless function)
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    return res.status(500).json({ error: '서버 설정 오류: AWS 자격 증명이 설정되지 않았습니다.' });
  }

  const { diary } = req.body as { diary: string };
  if (!diary || diary.length < 10 || diary.length > 2000) {
    return res.status(400).json({ error: '일기는 10~2000자여야 합니다.' });
  }

  // Amazon Bedrock (Claude Opus 4.7) 호출
  const modelId = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-opus-4-7';

  const command = new InvokeModelCommand({
    modelId,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: diary },
      ],
    }),
  });

  const response = await bedrockClient.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  const result: AnalyzeResponse = JSON.parse(responseBody.content[0].text);

  return res.status(200).json(result);
}
```

**환경변수:**
- `AWS_ACCESS_KEY_ID` — AWS IAM 액세스 키
- `AWS_SECRET_ACCESS_KEY` — AWS IAM 시크릿 키
- `AWS_REGION` — Bedrock 리전 (기본값: us-east-1)
- `BEDROCK_MODEL_ID` — 사용할 모델 ID (기본값: anthropic.claude-opus-4-7)

### /api/youtube-search

```typescript
// api/youtube-search.ts (Vercel serverless function)
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: '서버 설정 오류: API 키가 설정되지 않았습니다.' });
  }

  const { queries } = req.body as { queries: string[] };

  // 각 키워드로 4개씩 검색
  const allTracks: Track[] = [];
  for (const query of queries) {
    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('type', 'video');
    url.searchParams.set('videoCategoryId', '10');
    url.searchParams.set('q', query);
    url.searchParams.set('maxResults', '4');
    url.searchParams.set('key', apiKey);

    const response = await fetch(url.toString());
    const data = await response.json();

    for (const item of data.items ?? []) {
      allTracks.push({
        id: item.id.videoId,
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.medium.url,
        youtubeUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      });
    }
  }

  // 중복 제거 (videoId 기준)
  const uniqueTracks = deduplicateTracks(allTracks);
  const tracks = uniqueTracks.slice(0, 12);

  return res.status(200).json({ tracks });
}

function deduplicateTracks(tracks: Track[]): Track[] {
  const seen = new Set<string>();
  return tracks.filter(track => {
    if (seen.has(track.id)) return false;
    seen.add(track.id);
    return true;
  });
}
```

## Input Validation

```typescript
const DIARY_MIN_LENGTH = 10;
const DIARY_MAX_LENGTH = 2000;

function validateDiaryInput(text: string): {
  isValid: boolean;
  isTooShort: boolean;
  isTooLong: boolean;
  length: number;
} {
  const length = text.length;
  return {
    isValid: length >= DIARY_MIN_LENGTH && length <= DIARY_MAX_LENGTH,
    isTooShort: length < DIARY_MIN_LENGTH,
    isTooLong: length > DIARY_MAX_LENGTH,
    length,
  };
}
```

## Routing Configuration

```typescript
import { createBrowserRouter, Navigate } from 'react-router-dom';

const router = createBrowserRouter([
  { path: '/', element: <DiaryInputPage /> },
  { path: '/result/:id', element: <ResultPage /> },
  { path: '/history', element: <HistoryPage /> },
  { path: '/history/:id', element: <DetailPage /> },
  { path: '*', element: <Navigate to="/" replace /> },
]);
```

## Error Handling

| Scenario | Handling |
|----------|----------|
| Analyze API 실패 | 로딩 중단, 재시도 안내 메시지 표시 |
| Analyze API 3초 초과 | "조금만 기다려줘" 추가 문구 표시, 로딩 유지 |
| YouTube API 실패/할당량 초과 | 음악 섹션에 에러 메시지, 나머지 결과 정상 표시 |
| 환경변수 미설정 | 500 상태 코드 + 설정 오류 메시지 반환 |
| localStorage 용량 초과 | 가장 오래된 기록 삭제 안내 또는 에러 메시지 |
| 잘못된 라우트 접근 | 루트(/)로 리다이렉트 |

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Input Length Validation

For any string of length less than 10, the submit button SHALL be disabled. For any string of length greater than 2000, additional input SHALL be blocked. For any string of length between 10 and 2000 (inclusive), the submit button SHALL be enabled.

**Validates: Requirements 1.3, 1.4**

### Property 2: Character Count Accuracy

For any input string, the displayed character count SHALL equal the actual length of the string.

**Validates: Requirements 1.5**

### Property 3: Analyze API Response Structure

For any valid diary text (10~2000 characters), the Analyze API response SHALL contain a summary (string), message (string), and mood object with energy (number 0.0~1.0), valence (number 0.0~1.0), vibe (string), color (valid MoodColor), and searchQueries (array of 3 strings).

**Validates: Requirements 2.2**

### Property 4: Track Deduplication

For any array of Track objects returned from YouTube search (potentially containing duplicates by video ID), the deduplication function SHALL return a list where all track IDs are unique and the result length is between 0 and 12.

**Validates: Requirements 4.2**

### Property 5: Track Display Completeness

For any valid Track object, the rendered track item SHALL display the thumbnail image, video title, and channel name.

**Validates: Requirements 4.4**

### Property 6: Player State Persistence Across Navigation

For any active playback state (current track and playing status), navigating to any valid route SHALL preserve the current track and playback state in the MiniPlayer.

**Validates: Requirements 5.2**

### Property 7: Mini Player Track Info Display

For any Track set as the current playing track, the MiniPlayer SHALL display that track's title and provide play/pause controls.

**Validates: Requirements 5.3**

### Property 8: Color-to-Gradient Mapping

For any valid MoodColor value, the MoodVisual component SHALL apply the corresponding gradient colors as defined in the GRADIENT_MAP (warm-sunset→주황/분홍, cool-night→남색/보라, fresh-morning→하늘/민트, rainy-day→회색/청색, cozy-evening→갈색/주황).

**Validates: Requirements 6.1, 6.2**

### Property 9: Energy-to-Particle Configuration

For any energy value in the range [0.0, 1.0], the particle configuration SHALL produce speed and density values that increase monotonically with energy. Specifically: energy < 0.3 SHALL produce low speed and low density; energy >= 0.7 SHALL produce high speed and high density.

**Validates: Requirements 6.3, 6.4, 6.5**

### Property 10: DiaryEntry Save Round-Trip

For any valid DiaryEntry object saved to localStorage, retrieving it by ID SHALL return an object containing all required fields (id, date, dayOfWeek, diary, summary, message, mood, tracks, createdAt) with values equal to the original. Multiple entries saved on the same date SHALL all be retrievable without overwriting.

**Validates: Requirements 7.1, 7.2, 7.3**

### Property 11: History List Chronological Ordering

For any collection of DiaryEntry objects in localStorage, the History page SHALL display them in descending order by createdAt timestamp (most recent first).

**Validates: Requirements 8.1**

### Property 12: Calendar Date-Color Mapping

For any set of DiaryEntry objects within a given month, the calendar view SHALL display a colored indicator on each date that has an entry, using the color value from that entry's mood.

**Validates: Requirements 8.2**

### Property 13: Detail Page Data Completeness

For any DiaryEntry retrieved by ID, the Detail page SHALL display the original diary text, summary, message, all tracks, and reproduce the mood visual (color gradient + energy particles).

**Validates: Requirements 8.4**

### Property 14: Invalid Route Redirect

For any path that does not match a defined route (/, /result/:id, /history, /history/:id), the application SHALL redirect to the root path (/).

**Validates: Requirements 10.5**
