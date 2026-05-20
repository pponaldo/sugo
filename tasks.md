# Implementation Tasks

## Task 1: 프로젝트 초기 셋업
- [x] Vite + React 18 + TypeScript 프로젝트 생성
- [x] Tailwind CSS 설치 및 설정
- [x] React Router v6 설치 및 기본 라우팅 설정
- [x] tsparticles 설치
- [x] @aws-sdk/client-bedrock-runtime 설치
- [x] 프로젝트 폴더 구조 생성
- [x] 환경변수 파일(.env.example) 생성
- [x] TypeScript 타입 정의 (types.ts)

## Task 2: 공통 레이어 구현
- [x] localStorage 유틸리티 (storage.ts)
- [x] 입력 유효성 검사 유틸리티 (validation.ts)
- [x] 색상 매핑 상수 (constants.ts)
- [x] PlayerContext 구현
- [x] API 호출 유틸리티 (api.ts)

## Task 3: 일기 작성 페이지 (DiaryInputPage)
- [x] 텍스트 입력 영역 + 글자 수 카운터
- [x] 유효성 검사 (10~2000자)
- [x] 제출 버튼 활성화/비활성화
- [x] 로딩 애니메이션 컴포넌트

## Task 4: 서버리스 함수 구현
- [x] /api/analyze (Bedrock 프록시)
- [x] /api/youtube-search (YouTube 프록시)
- [x] 에러 핸들링 및 환경변수 검증

## Task 5: 결과 페이지 (ResultPage)
- [x] 하루 요약 카드
- [x] 위로 메시지 표시
- [x] TrackList 컴포넌트
- [x] 자동 저장 로직
- [x] 공유/다시쓰기 버튼

## Task 6: 감성 비주얼 (MoodVisual)
- [x] 배경 그라데이션 (color 매핑)
- [x] tsparticles 파티클 (energy 매핑)
- [x] fade-in 전환 효과

## Task 7: 하단 고정 미니 플레이어 (MiniPlayer)
- [x] YouTube iframe 임베드
- [x] 재생/일시정지 컨트롤
- [x] 트랙 정보 표시
- [x] 페이지 이동 시 재생 유지

## Task 8: 기록 페이지 (HistoryPage + DetailPage)
- [x] 기록 리스트 (DiaryCard)
- [x] 캘린더 뷰 (CalendarView)
- [x] 기록 상세 페이지
- [x] 빈 상태 안내 메시지

## Task 9: 네비게이션 및 마무리
- [x] Navigation 컴포넌트
- [x] 반응형 레이아웃 조정
- [x] 접근성 (ARIA, 키보드 네비게이션)
- [x] Vercel 배포 설정 (vercel.json)
