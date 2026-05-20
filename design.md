# 🎨 설계 문서 (Design Document)

## 1. 시스템 아키텍처

```
┌─────────────────────────────────────────────────────┐
│                    Client (Browser)                   │
│  React 18 + Vite + Tailwind CSS + React Router v6   │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │DiaryInput│  │  Result  │  │  History/Calendar │  │
│  │  Page    │  │  Page    │  │      Page         │  │
│  └────┬─────┘  └──────────┘  └──────────────────┘  │
│       │                                              │
│       │  POST /api/analyze                           │
│       │  POST /api/youtube-search                    │
└───────┼──────────────────────────────────────────────┘
        │
        ▼ (Vite proxy → localhost:3001)
┌─────────────────────────────────────────────────────┐
│              API Server (Express + tsx)               │
│                                                      │
│  ┌────────────────┐    ┌─────────────────────────┐  │
│  │ /api/analyze   │    │ /api/youtube-search     │  │
│  │                │    │                         │  │
│  │ AWS Bedrock    │    │ YouTube Data API v3     │  │
│  │ Claude Model   │    │ (Search endpoint)       │  │
│  └────────────────┘    └─────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### 로컬 개발 환경
- **프론트엔드**: Vite dev server (localhost:5173)
- **API 서버**: Express + tsx (localhost:3001)
- Vite의 proxy 설정으로 `/api` 요청을 API 서버로 전달

### 프로덕션 환경 (Vercel)
- 프론트엔드: Vite 빌드 결과물 정적 호스팅
- API: `api/` 폴더의 Vercel Serverless Functions로 자동 배포

---

## 2. 컴포넌트 구조

```
src/
├── main.tsx                    # 앱 진입점 + 시드 데이터 초기화
├── App.tsx                     # 라우팅 설정
├── pages/
│   ├── DiaryInputPage.tsx      # 일기 작성 페이지
│   ├── ResultPage.tsx          # AI 분석 결과 + 플레이리스트
│   ├── HistoryPage.tsx         # 기록 리스트 + 캘린더
│   └── DetailPage.tsx          # 기록 상세 보기
├── components/
│   ├── CalendarView.tsx        # 월별 캘린더 (감정 색상 점)
│   ├── DiaryCard.tsx           # 기록 카드 컴포넌트
│   ├── LoadingAnimation.tsx    # AI 분석 중 로딩 UI
│   ├── MiniPlayer.tsx          # 하단 고정 음악 플레이어
│   ├── MoodVisual.tsx          # 배경 그라데이션 + 파티클
│   ├── Navigation.tsx          # 하단 네비게이션 바
│   └── TrackList.tsx           # 플레이리스트 목록
├── context/
│   └── PlayerContext.tsx       # 음악 재생 상태 관리
├── utils/
│   ├── api.ts                  # API 호출 함수
│   ├── storage.ts              # localStorage CRUD
│   ├── particles.ts            # 파티클 설정 생성
│   ├── seedData.ts             # 샘플 데이터 초기화
│   └── validation.ts           # 입력 유효성 검사
├── types.ts                    # TypeScript 타입 정의
├── constants.ts                # 상수 (색상 맵, 키 등)
└── index.css                   # Tailwind 기본 스타일
```

---

## 3. 상태 관리

### PlayerContext (전역)
- `currentTrack`: 현재 재생 중인 트랙
- `isPlaying`: 재생/일시정지 상태
- `playlist`: 현재 플레이리스트
- `playTrack(track)`: 트랙 재생 시작
- `togglePlay()`: 재생/일시정지 토글
- `setPlaylist(tracks)`: 플레이리스트 설정

### 로컬 상태
- 각 페이지에서 `useState`로 관리
- 일기 텍스트, 로딩 상태, 에러 메시지, 현재 월 등

### 데이터 저장
- `localStorage` 키: `diary-mood-playlist-entries`
- JSON 배열로 DiaryEntry[] 저장
- `createdAt` 기준 내림차순 정렬

---

## 4. API 설계 상세

### POST /api/analyze

**요청 본문:**
```json
{ "diary": "일기 텍스트 (10~2000자)" }
```

**처리 흐름:**
1. 입력 유효성 검사 (길이 체크)
2. AWS 자격 증명 확인
3. Bedrock InvokeModel 호출 (Claude, anthropic_version: bedrock-2023-05-31)
4. 응답 텍스트에서 마크다운 코드블록 제거 (```json ... ```)
5. JSON 파싱 후 클라이언트에 반환

**에러 응답:**
- 400: 입력 유효성 실패
- 405: POST 외 메서드
- 500: AWS 자격 증명 미설정 또는 Bedrock API 에러

### POST /api/youtube-search

**요청 본문:**
```json
{ "queries": ["키워드1", "키워드2", "키워드3"] }
```

**처리 흐름:**
1. 키워드 배열 유효성 검사
2. 각 키워드로 YouTube Search API 호출 (최대 3개, 각 4결과)
3. 결과 합산 후 중복 제거 (videoId 기준)
4. 최대 12곡으로 제한하여 반환

---

## 5. UI/UX 설계 결정

### 색상 시스템
| 감정 키워드 | 그라데이션 (from → to) |
|---|---|
| warm-sunset | #f97316 → #ec4899 |
| cool-night | #1e3a5f → #7c3aed |
| fresh-morning | #38bdf8 → #6ee7b7 |
| rainy-day | #6b7280 → #3b82f6 |
| cozy-evening | #92400e → #f97316 |

### 재생 컨트롤 아이콘
- 재생: `⏵` (텍스트 스타일 삼각형)
- 일시정지: `⏸` (텍스트 스타일 이중 바)
- MiniPlayer와 TrackList에서 동일한 아이콘 스타일 사용

### 파티클 효과
- `initParticlesEngine`으로 엔진 초기화 (@tsparticles/react에서 import)
- energy 값에 따라 파티클 수, 속도, 크기 동적 조절

---

## 6. 로컬 개발 서버 구조

```typescript
// server.ts
import 'dotenv/config';       // .env 파일 로드
import express from 'express';
import analyzeHandler from './api/analyze';
import youtubeSearchHandler from './api/youtube-search';

// Vercel 핸들러를 Express 라우트로 어댑팅
app.post('/api/analyze', analyzeHandler);
app.post('/api/youtube-search', youtubeSearchHandler);
// 포트 3001에서 실행
```

이 구조를 통해 Vercel Serverless Functions 코드를 수정 없이 로컬에서도 실행 가능.
