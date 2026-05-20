# 🎵 오늘 하루, 수고했어 — Product Requirements Document

## 1. 개요

### 1.1 제품명
**오늘 하루, 수고했어** (Today, You Did Well)

### 1.2 한 줄 소개
일기를 쓰면 AI가 하루를 요약하고, 따뜻하게 위로해주고, 그 하루에 어울리는 플레이리스트를 만들어주는 감성 웹앱.

### 1.3 목표
- 사용자가 하루를 돌아보며 감정을 정리할 수 있는 공간 제공
- AI 기반 공감과 위로로 정서적 만족감 전달
- 하루의 맥락에 맞는 음악 추천으로 힐링 루틴 형성
- 매일 쓰고 싶어지는 리텐션 구조 설계

### 1.4 타겟 사용자
- 하루를 기록하고 싶지만 동기가 부족한 사람
- 음악을 좋아하지만 매번 뭘 들을지 고민하는 사람
- 가벼운 위로와 공감이 필요한 직장인/학생

---

## 2. 핵심 기능

### 2.1 일기 작성 (Diary Input)

| 항목 | 설명 |
|------|------|
| 입력 방식 | 자유 텍스트 (최소 10자, 최대 2000자) |
| 가이드 문구 | "오늘 하루를 편하게 들려줘. 길어도, 짧아도 괜찮아." |
| 제출 버튼 | "오늘의 음악 받기 🎵" |
| 로딩 상태 | AI 분석 중 감성 로딩 애니메이션 표시 |

### 2.2 AI 분석 (AI Analysis)

하나의 API 호출로 아래 세 가지를 동시에 생성:

#### 2.2.1 하루 요약
- 2~3문장으로 담백하게 정리
- 판단하지 않고 있는 그대로 요약

#### 2.2.2 위로/응원 메시지
- 2~3문장, 따뜻하고 진심 어린 톤
- 공감 먼저, 그 다음 응원
- 과하지 않게, 반말로 편하게

#### 2.2.3 음악 추천 파라미터 추출
```json
{
  "energy": 0.0~1.0,
  "valence": 0.0~1.0,
  "vibe": "플레이리스트 부제목",
  "color": "배경 색상 키워드",
  "searchQueries": ["검색 키워드1", "검색 키워드2", "검색 키워드3"]
}
```

### 2.3 플레이리스트 추천 (Playlist Recommendation)

| 항목 | 설명 |
|------|------|
| 데이터 소스 | YouTube Data API v3 — Search 엔드포인트 |
| 곡 수 | 10~12곡 |
| 표시 정보 | 썸네일, 영상 제목, 채널명 |
| 재생 | YouTube iframe 임베드 (전곡 재생 가능) |
| 인증 | API 키만 필요 (사용자 로그인 불필요) |

**추천 방식:**
- AI가 일기 분석 후 분위기에 맞는 검색 키워드 3개 생성
- 각 키워드로 YouTube 검색 (카테고리: Music, 4개씩)
- 결과를 합쳐서 중복 제거 후 10~12곡 표시

### 2.4 감성 비주얼 (Mood Visual)

| 요소 | 동작 |
|------|------|
| 배경 그라데이션 | AI가 반환한 color 키워드에 따라 색상 전환 |
| 파티클 애니메이션 | energy 값에 따라 속도/밀도 조절 |
| 전환 효과 | 결과 화면 진입 시 부드러운 fade-in |

**색상 매핑:**
- `warm-sunset` → 주황/분홍 그라데이션
- `cool-night` → 남색/보라 그라데이션
- `fresh-morning` → 하늘/민트 그라데이션
- `rainy-day` → 회색/청색 그라데이션
- `cozy-evening` → 갈색/주황 그라데이션

### 2.5 과거 기록 (History)

#### 2.5.1 기록 리스트
- 최근순 카드 형태로 표시
- 각 카드: 날짜, 요약 미리보기, 플레이리스트 부제목, 감정 색상 인디케이터

#### 2.5.2 캘린더 뷰
- 월별 캘린더에 일기 쓴 날 감정 색상 점 표시
- 날짜 클릭 시 해당 기록 상세로 이동

#### 2.5.3 기록 상세
- 원본 일기, 하루 요약, 위로 메시지, 플레이리스트 전체 다시 보기
- 그날의 배경 비주얼 재현

#### 2.5.4 저장소
- MVP: localStorage
- 확장: Supabase 또는 Firebase (사용자 인증 시)

---

## 3. 사용자 플로우

```
[앱 진입]
    │
    ├─ [✏️ 오늘 일기] → 일기 작성 → AI 분석 (로딩) → 결과 화면
    │                                                  ├─ 하루 요약
    │                                                  ├─ 위로 메시지
    │                                                  ├─ 플레이리스트
    │                                                  └─ [공유/다시쓰기]
    │
    └─ [📚 지난 기록] → 기록 리스트/캘린더
                            │
                            └─ 카드 클릭 → 기록 상세 보기
```

---

## 4. 화면 설계

### 4.1 일기 작성 화면
- 중앙 정렬 텍스트 에어리어
- 부드러운 배경 (기본 그라데이션)
- 하단 제출 버튼
- 글자 수 카운터 (선택)

### 4.2 결과 화면 (단일 스크롤)
- 상단: 하루 요약 카드
- 중단: 위로 메시지 (약간 강조된 타이포그래피)
- 하단: 플레이리스트 목록 (썸네일 + 제목 + 임베드 재생)
- 배경: 감정 기반 그라데이션 + 파티클
- 하단 고정: 공유/다시쓰기 버튼

### 4.3 기록 리스트 화면
- 상단: 캘린더 (접기/펼치기 가능)
- 하단: 카드 리스트 (최근순)
- 각 카드 좌측에 감정 색상 바

### 4.4 기록 상세 화면
- 결과 화면과 동일한 레이아웃
- 상단에 날짜 + 뒤로가기 버튼 추가

---

## 5. 기술 스택

| 레이어 | 기술 | 선정 이유 |
|--------|------|-----------|
| 프레임워크 | React 18 + Vite | 빠른 개발, HMR, 경량 |
| 스타일링 | Tailwind CSS | 유틸리티 기반 빠른 UI 구현 |
| 라우팅 | React Router v6 | SPA 내 페이지 전환 |
| AI | Amazon Bedrock (Claude Opus 4.7) | AWS 네이티브, 최고 성능 모델 |
| 음악 | YouTube Data API v3 | API 키만으로 동작, 전곡 재생 가능 |
| 재생 | YouTube IFrame Player API | 임베드 플레이어, 로그인 불필요 |
| 파티클 | tsparticles | 설정 기반 파티클 효과 |
| 저장 | localStorage | MVP에 적합, 서버 불필요 |
| 배포 | Vercel | 원클릭 배포, 서버리스 함수 지원 |

---

## 6. API 설계

### 6.1 Amazon Bedrock 요청

**엔드포인트:** `/api/analyze` (Vercel serverless function)

**요청:**
```json
{
  "diary": "사용자가 작성한 일기 텍스트"
}
```

**내부 호출:** AWS SDK를 통해 Amazon Bedrock InvokeModel API 호출
- 모델: `anthropic.claude-opus-4-7`
- 리전: `us-east-1` (또는 환경변수로 설정)

**응답:**
```json
{
  "summary": "하루 요약 텍스트",
  "message": "위로/응원 메시지",
  "mood": {
    "energy": 0.45,
    "valence": 0.65,
    "vibe": "퇴근 후 소파에서",
    "color": "warm-sunset",
    "searchQueries": [
      "chill indie playlist 2024",
      "lo-fi evening acoustic",
      "잔잔한 인디 음악"
    ]
  }
}
```

**환경변수:**
- `AWS_ACCESS_KEY_ID` — AWS IAM 액세스 키
- `AWS_SECRET_ACCESS_KEY` — AWS IAM 시크릿 키
- `AWS_REGION` — Bedrock 리전 (기본값: us-east-1)
- `BEDROCK_MODEL_ID` — 모델 ID (기본값: anthropic.claude-opus-4-7)

### 6.2 YouTube 검색 요청

**엔드포인트:** `/api/youtube-search` (Vercel serverless function)

**내부 호출:**
```
GET https://www.googleapis.com/youtube/v3/search
  ?part=snippet
  &type=video
  &videoCategoryId=10    (Music 카테고리)
  &q={searchQuery}
  &maxResults=4
  &key={YOUTUBE_API_KEY}
```

**응답 가공:**
```json
{
  "tracks": [
    {
      "id": "YouTube 영상 ID",
      "title": "영상 제목",
      "channel": "채널명",
      "thumbnail": "썸네일 URL",
      "youtubeUrl": "https://www.youtube.com/watch?v=..."
    }
  ]
}
```

**할당량 관리:**
- 검색 1회 = 100 유닛
- 키워드 3개 × 검색 = 300 유닛/요청
- 일일 한도 10,000 유닛 → 하루 약 33명 처리 가능
- 초과 시 캐싱 또는 에러 메시지 표시

---

## 7. 데이터 모델

### 7.1 일기 엔트리 (DiaryEntry)

```typescript
interface DiaryEntry {
  id: string;                // 고유 ID (date + timestamp)
  date: string;              // YYYY-MM-DD
  dayOfWeek: string;         // 월~일
  diary: string;             // 원본 일기 텍스트
  summary: string;           // AI 생성 요약
  message: string;           // AI 생성 위로 메시지
  mood: {
    energy: number;          // 0.0 ~ 1.0
    valence: number;         // 0.0 ~ 1.0
    vibe: string;            // 플레이리스트 부제목
    color: string;           // 배경 색상 키워드
    searchQueries: string[]; // YouTube 검색에 사용된 키워드
  };
  tracks: Track[];           // 추천된 곡 목록
  createdAt: number;         // Unix timestamp
}

interface Track {
  id: string;                // YouTube 영상 ID
  title: string;             // 영상 제목
  channel: string;           // 채널명
  thumbnail: string;         // 썸네일 URL
  youtubeUrl: string;        // YouTube 링크
}
```

---

## 8. 비기능 요구사항

| 항목 | 요구사항 |
|------|----------|
| 반응형 | 모바일 우선, 데스크톱 대응 |
| 성능 | AI 응답 3초 이내, 페이지 로드 1초 이내 |
| 접근성 | 키보드 네비게이션, 스크린리더 호환 |
| 보안 | API 키 서버사이드 처리 (환경변수) |
| 브라우저 | Chrome, Safari, Firefox 최신 2버전 |
| API 할당량 | YouTube 일일 10,000 유닛 내 운영, 초과 시 graceful 에러 처리 |

---

## 9. 개발 일정 (3시간)

| 시간 | 마일스톤 | 산출물 |
|------|----------|--------|
| 0:00–0:20 | 프로젝트 셋업 | Vite + Tailwind + 라우팅 + 환경변수 |
| 0:20–0:50 | 일기 입력 UI | 작성 화면 완성 |
| 0:50–1:30 | AI 연동 | 서버리스 함수 + Bedrock 호출 + 결과 파싱 |
| 1:30–2:00 | YouTube 연동 | 검색 API + 곡 목록 렌더링 + iframe 재생 |
| 2:00–2:30 | 비주얼 | 그라데이션 배경 + 파티클 |
| 2:30–3:00 | 기록 기능 + 마무리 | localStorage 저장/조회 + 배포 |

---

## 10. 향후 확장 (Post-MVP)

| 기능 | 설명 |
|------|------|
| 감정 통계 | 주간/월간 감정 흐름 차트, 자주 듣는 장르 |
| 연속 기록 | 🔥 스트릭 표시, 동기부여 |
| 공유 | 결과를 이미지/링크로 SNS 공유 |
| 다국어 | 영어/일본어 지원 |
| DB 연동 | Supabase로 클라우드 저장 + 멀티 디바이스 |
| 알림 | 매일 저녁 "오늘 하루 어땠어?" 푸시 알림 |
| YouTube 플레이리스트 저장 | OAuth 연동 후 사용자 계정에 플레이리스트 생성 |

---

## 11. 성공 지표

| 지표 | 목표 |
|------|------|
| 일기 작성 완료율 | 작성 시작 대비 80% 이상 제출 |
| 재방문율 | 7일 내 3회 이상 재방문 |
| 평균 일기 길이 | 50자 이상 |
| 음악 재생율 | 결과 확인 후 50% 이상 1곡 이상 재생 |
