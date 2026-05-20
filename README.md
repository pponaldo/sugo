# 🎵 오늘 하루, 수고했어

일기를 쓰면 AI가 하루를 요약하고, 따뜻하게 위로해주고, 그 하루에 어울리는 음악 플레이리스트를 만들어주는 감성 웹앱입니다.

## 해결하려는 문제

하루를 기록하고 싶지만 동기가 부족한 사람, 매번 뭘 들을지 고민하는 사람, 가벼운 위로가 필요한 사람들을 위해 만들었습니다.

- **일기 쓰기의 허들을 낮추기** — 쓰면 바로 음악과 위로를 받으니까 매일 쓰고 싶어지는 구조
- **감정에 맞는 음악 추천** — 직접 검색하지 않아도 AI가 하루의 맥락을 읽고 어울리는 곡을 찾아줌
- **정서적 공감** — 판단 없이 하루를 요약하고, 과하지 않은 톤으로 위로와 응원을 전달

## 주요 기능

1. **일기 작성** — 자유 텍스트로 하루를 기록 (10~2000자)
2. **AI 감정 분석** — 일기를 읽고 하루 요약, 위로 메시지, 음악 추천 파라미터를 생성
3. **음악 플레이리스트** — AI가 생성한 키워드로 YouTube에서 10~12곡을 검색해 추천
4. **감성 비주얼** — 감정에 따라 배경 그라데이션과 파티클 애니메이션이 변화
5. **기록 관리** — 캘린더 뷰와 카드 리스트로 과거 기록을 다시 볼 수 있음

## 사용한 AI 도구

### Amazon Bedrock (Claude)
- 일기 텍스트를 분석하여 감정 요약, 위로 메시지, 음악 추천 파라미터를 한 번의 호출로 생성
- 시스템 프롬프트로 응답 형식(JSON)과 톤(따뜻하고 편한 반말)을 제어
- Vercel Serverless Function에서 AWS SDK를 통해 호출

### Kiro (AI IDE)
- 프로젝트 빌드 에러 수정, 로컬 개발 환경 구성, 코드 리팩토링 등 개발 전반에 활용
- TypeScript 타입 에러 해결, API 응답 파싱 버그 수정, 시드 데이터 생성 등을 대화형으로 진행

### YouTube Data API v3
- AI가 생성한 검색 키워드 3개로 음악 카테고리 영상을 검색
- 사용자 로그인 없이 API 키만으로 동작

## 기술 스택

| 레이어 | 기술 |
|--------|------|
| 프론트엔드 | React 18 + Vite + TypeScript |
| 스타일링 | Tailwind CSS |
| 라우팅 | React Router v6 |
| AI 분석 | Amazon Bedrock (Claude) |
| 음악 검색 | YouTube Data API v3 |
| 음악 재생 | YouTube IFrame Player |
| 파티클 효과 | tsparticles |
| 데이터 저장 | localStorage |
| 배포 | Vercel (Serverless Functions) |

## 로컬 실행 방법

```bash
cd diary-mood-playlist
npm install
```

`.env` 파일을 생성하고 환경변수를 설정합니다:

```
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=us.anthropic.claude-sonnet-4-20250514-v1:0
YOUTUBE_API_KEY=your-youtube-api-key
```

API 서버와 프론트엔드를 각각 실행합니다:

```bash
# 터미널 1: API 서버
npx tsx server.ts

# 터미널 2: 프론트엔드
npm run dev
```

브라우저에서 http://localhost:5173/ 에 접속합니다.

## 프로젝트 구조

```
diary-mood-playlist/
├── api/                    # Vercel Serverless Functions
│   ├── analyze.ts          # Bedrock AI 분석 엔드포인트
│   └── youtube-search.ts   # YouTube 검색 엔드포인트
├── src/
│   ├── components/         # UI 컴포넌트
│   ├── context/            # PlayerContext (음악 재생 상태)
│   ├── pages/              # 페이지 컴포넌트
│   ├── utils/              # API 호출, 스토리지, 유효성 검사
│   └── types.ts            # TypeScript 타입 정의
├── server.ts               # 로컬 개발용 Express API 서버
└── .env                    # 환경변수 (git 제외)
```
