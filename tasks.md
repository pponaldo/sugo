# ✅ 작업 목록 (Tasks)

## 완료된 작업

### Phase 1: 프로젝트 셋업
- [x] Vite + React 18 + TypeScript 프로젝트 생성
- [x] Tailwind CSS 설정
- [x] React Router v6 라우팅 구성
- [x] 프로젝트 구조 설계 (pages, components, utils, context)
- [x] TypeScript 타입 정의 (types.ts)
- [x] 상수 정의 (constants.ts)

### Phase 2: 일기 입력 UI
- [x] DiaryInputPage 구현
- [x] 텍스트 입력 영역 (textarea)
- [x] 글자 수 카운터 (실시간)
- [x] 입력 유효성 검사 (최소 10자, 최대 2000자)
- [x] 제출 버튼 활성화/비활성화
- [x] 로딩 애니메이션 (LoadingAnimation 컴포넌트)

### Phase 3: AI 연동
- [x] `/api/analyze` Vercel Serverless Function 구현
- [x] Amazon Bedrock Claude 모델 호출
- [x] 시스템 프롬프트 설계 (요약 + 위로 + 음악 파라미터)
- [x] AI 응답 마크다운 코드블록 제거 처리
- [x] 에러 핸들링 (자격 증명 미설정, API 에러)
- [x] 로컬 개발용 Express 서버 (server.ts) 구성
- [x] dotenv를 통한 환경변수 로드

### Phase 4: YouTube 연동
- [x] `/api/youtube-search` Vercel Serverless Function 구현
- [x] YouTube Data API v3 Search 호출
- [x] 키워드 3개 × 4결과 = 최대 12곡 수집
- [x] 중복 제거 (videoId 기준)
- [x] YouTube 검색 실패 시 graceful degradation

### Phase 5: 결과 화면
- [x] ResultPage 구현
- [x] 하루 요약 카드 표시
- [x] 위로 메시지 표시
- [x] TrackList 컴포넌트 (플레이리스트 목록)
- [x] 곡 클릭 시 재생 / 재클릭 시 일시정지
- [x] 재생/일시정지 아이콘 통일 (⏵/⏸)

### Phase 6: 감성 비주얼
- [x] MoodVisual 컴포넌트 구현
- [x] 감정 color에 따른 배경 그라데이션 (5가지)
- [x] tsparticles 파티클 애니메이션
- [x] initParticlesEngine 방식으로 엔진 초기화
- [x] energy 값에 따른 파티클 밀도/속도 조절

### Phase 7: 음악 재생
- [x] PlayerContext 구현 (전역 상태)
- [x] MiniPlayer 하단 고정 플레이어
- [x] YouTube iframe 임베드 재생
- [x] 재생/일시정지 토글 (MiniPlayer)
- [x] TrackList에서 재생 중인 곡 일시정지 기능 추가
- [x] 아이콘 스타일 통일 (⏵/⏸, 이모지 이질감 제거)

### Phase 8: 기록 관리
- [x] localStorage CRUD (storage.ts)
- [x] HistoryPage 구현
- [x] CalendarView 월별 캘린더 (감정 색상 점 표시)
- [x] DiaryCard 기록 카드 컴포넌트
- [x] DetailPage 기록 상세 보기
- [x] 월 이동 (이전/다음)

### Phase 9: 개발 환경 및 배포 준비
- [x] .gitignore 설정 (node_modules, .env, dist, tsconfig.tsbuildinfo)
- [x] TypeScript 빌드 에러 수정 (MoodVisual init prop, DiaryInputPage 타입)
- [x] 로컬 API 서버 구성 (Express + tsx + dotenv)
- [x] Vite proxy 설정 (/api → localhost:3001)
- [x] package.json scripts 추가 (server 명령)
- [x] 시드 데이터 구현 (seedData.ts, 5개 샘플 일기)
- [x] vercel.json 배포 설정

---

## 발견된 이슈 및 해결

| 이슈 | 원인 | 해결 |
|------|------|------|
| TypeScript 빌드 에러 (MoodVisual) | @tsparticles/react v3에서 `init` prop 미지원 | `initParticlesEngine` 방식으로 변경 |
| TypeScript 빌드 에러 (DiaryInputPage) | `tracks` 변수 implicit any | `Track[]` 타입 명시 |
| Bedrock IncompleteSignatureException | .env 값에 따옴표 포함 | 따옴표 없이 값만 입력하도록 안내 |
| Bedrock AccessDeniedException | 모델 접근 권한 없음 | 접근 가능한 모델로 변경 |
| Bedrock ValidationException | on-demand 호출 미지원 모델 | inference profile ID 사용 (us. 접두사) |
| AI 응답 JSON 파싱 실패 | Claude가 ```json 코드블록으로 감싸서 응답 | 파싱 전 마크다운 래퍼 제거 로직 추가 |
| 달력에 데이터 미표시 | 시드 데이터 연도가 2025년 (현재 2026년) | 2026년으로 수정 |
| 재생 버튼 이질감 | ▶️(컬러 이모지)와 ⏸(텍스트) 스타일 불일치 | 모두 텍스트 스타일(⏵/⏸)로 통일 |
| TrackList 스피커 아이콘 이질감 | 🔊 이모지 사용 | ⏸/⏵로 변경 + 일시정지 기능 추가 |

---

## 향후 작업 (Post-MVP)

- [ ] 감정 통계 (주간/월간 차트)
- [ ] 연속 기록 스트릭 표시
- [ ] 결과 이미지/링크 SNS 공유
- [ ] Supabase DB 연동 (멀티 디바이스)
- [ ] 매일 저녁 푸시 알림
- [ ] YouTube OAuth 연동 (플레이리스트 저장)
- [ ] 다국어 지원 (영어/일본어)
