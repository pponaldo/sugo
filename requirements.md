# Requirements Document

## Introduction

"오늘 하루, 수고했어"는 사용자가 자유 텍스트로 일기를 작성하면 AI가 하루를 요약하고, 위로 메시지를 생성하며, 분위기에 맞는 YouTube 음악 플레이리스트를 추천해주는 감성 웹앱이다. 감정 기반 비주얼(그라데이션 배경, 파티클 애니메이션)과 과거 기록 열람 기능을 제공하며, 로그인 없이 localStorage 기반으로 동작하는 MVP이다.

## Glossary

- **Diary_Input_Page**: 사용자가 일기를 작성하고 제출하는 화면
- **Result_Page**: AI 분석 결과(요약, 위로 메시지, 플레이리스트)를 표시하는 화면
- **History_Page**: 과거 일기 기록을 리스트 및 캘린더 형태로 열람하는 화면
- **Detail_Page**: 특정 날짜의 기록 상세를 표시하는 화면
- **Analyze_API**: Amazon Bedrock(Claude Opus 4.7)을 호출하여 일기를 분석하는 Vercel 서버리스 함수 (/api/analyze)
- **YouTube_Search_API**: YouTube Data API v3를 호출하여 음악을 검색하는 Vercel 서버리스 함수 (/api/youtube-search)
- **Mini_Player**: 하단 고정 YouTube iframe 임베드 플레이어
- **Mood_Visual**: energy/color 값 기반 배경 그라데이션 및 파티클 애니메이션
- **DiaryEntry**: localStorage에 저장되는 일기 기록 데이터 객체
- **Track**: YouTube 영상 정보를 담는 데이터 객체 (id, title, channel, thumbnail, youtubeUrl)

## Requirements

### Requirement 1: 일기 작성

**User Story:** As a 사용자, I want 자유 텍스트로 하루를 기록할 수 있는 입력 화면을 사용하고 싶다, so that 하루를 돌아보며 감정을 정리할 수 있다.

#### Acceptance Criteria

1. THE Diary_Input_Page SHALL 중앙 정렬된 텍스트 입력 영역과 "오늘의 음악 받기 🎵" 제출 버튼을 표시한다.
2. THE Diary_Input_Page SHALL 가이드 문구 "오늘 하루를 편하게 들려줘. 길어도, 짧아도 괜찮아."를 placeholder로 표시한다.
3. WHILE 입력된 텍스트가 10자 미만인 상태, THE Diary_Input_Page SHALL 제출 버튼을 비활성화 상태로 유지한다.
4. WHILE 입력된 텍스트가 2000자를 초과한 상태, THE Diary_Input_Page SHALL 추가 입력을 차단하고 글자 수 초과 안내를 표시한다.
5. THE Diary_Input_Page SHALL 현재 입력된 글자 수를 실시간으로 표시한다.

### Requirement 2: AI 분석 요청

**User Story:** As a 사용자, I want 일기를 제출하면 AI가 자동으로 분석해주길 원한다, so that 별도 조작 없이 하루 요약과 위로 메시지, 음악 추천을 받을 수 있다.

#### Acceptance Criteria

1. WHEN 사용자가 제출 버튼을 클릭하면, THE Diary_Input_Page SHALL 감성 로딩 애니메이션을 표시하고 Analyze_API를 호출한다.
2. WHEN Analyze_API가 호출되면, THE Analyze_API SHALL 일기 텍스트를 Amazon Bedrock(Claude Opus 4.7)에 전달하여 하루 요약(2~3문장), 위로 메시지(2~3문장), 음악 추천 파라미터(energy, valence, vibe, color, searchQueries)를 단일 응답으로 반환한다.
3. THE Analyze_API SHALL API 키를 서버사이드 환경변수에서만 참조하고 클라이언트에 노출하지 않는다.
4. IF Analyze_API 호출이 실패하면, THEN THE Diary_Input_Page SHALL 로딩 애니메이션을 중단하고 사용자에게 재시도 안내 메시지를 표시한다.
5. WHEN Analyze_API가 3초 이내에 응답하지 않으면, THE Diary_Input_Page SHALL 로딩 상태를 유지하되 "조금만 기다려줘" 안내 문구를 추가 표시한다.

### Requirement 3: AI 분석 결과 표시

**User Story:** As a 사용자, I want AI가 분석한 하루 요약과 위로 메시지를 보고 싶다, so that 공감과 위로를 받으며 하루를 마무리할 수 있다.

#### Acceptance Criteria

1. WHEN Analyze_API 응답이 성공적으로 수신되면, THE Result_Page SHALL 하루 요약 카드를 상단에, 위로 메시지를 중단에 강조된 타이포그래피로 표시한다.
2. THE Result_Page SHALL 하루 요약을 판단 없이 담백한 톤의 2~3문장으로 표시한다.
3. THE Result_Page SHALL 위로 메시지를 반말 톤의 따뜻한 2~3문장으로 표시한다.
4. WHEN Result_Page로 전환될 때, THE Result_Page SHALL fade-in 전환 효과를 적용한다.

### Requirement 4: YouTube 음악 검색 및 플레이리스트

**User Story:** As a 사용자, I want 하루 분위기에 맞는 음악 플레이리스트를 추천받고 싶다, so that 감정에 어울리는 음악을 들으며 힐링할 수 있다.

#### Acceptance Criteria

1. WHEN Analyze_API 응답의 searchQueries가 수신되면, THE YouTube_Search_API SHALL 각 키워드(3개)로 YouTube Data API v3 Search 엔드포인트를 호출하여 Music 카테고리(videoCategoryId=10) 영상을 키워드당 4개씩 검색한다.
2. THE YouTube_Search_API SHALL 검색 결과에서 중복 영상을 제거하고 10~12곡의 Track 목록을 반환한다.
3. THE YouTube_Search_API SHALL API 키를 서버사이드 환경변수에서만 참조하고 클라이언트에 노출하지 않는다.
4. THE Result_Page SHALL 각 Track의 썸네일, 영상 제목, 채널명을 리스트 형태로 표시한다.
5. WHEN 사용자가 Track을 선택하면, THE Mini_Player SHALL 해당 영상을 YouTube iframe으로 재생한다.
6. IF YouTube_Search_API 호출이 실패하거나 할당량이 초과되면, THEN THE Result_Page SHALL 음악 검색 실패 안내 메시지를 표시하고 나머지 결과(요약, 위로 메시지)는 정상 표시한다.

### Requirement 5: 하단 고정 미니 플레이어

**User Story:** As a 사용자, I want 음악을 들으면서 다른 화면을 탐색하고 싶다, so that 음악 재생이 중단되지 않고 앱을 자유롭게 사용할 수 있다.

#### Acceptance Criteria

1. WHEN 사용자가 Track을 선택하여 재생을 시작하면, THE Mini_Player SHALL 화면 하단에 고정된 상태로 YouTube iframe 플레이어를 표시한다.
2. WHILE Mini_Player가 재생 중인 상태, THE Mini_Player SHALL 사용자가 다른 페이지로 이동해도 재생을 유지한다.
3. THE Mini_Player SHALL 현재 재생 중인 영상 제목과 재생/일시정지 컨트롤을 표시한다.
4. WHEN 사용자가 플레이리스트의 다른 Track을 선택하면, THE Mini_Player SHALL 현재 재생을 중단하고 새로 선택된 영상으로 전환한다.

### Requirement 6: 감성 비주얼

**User Story:** As a 사용자, I want 분석 결과에 맞는 감성적인 배경 비주얼을 보고 싶다, so that 시각적으로도 감정에 몰입할 수 있다.

#### Acceptance Criteria

1. WHEN Result_Page가 표시될 때, THE Mood_Visual SHALL AI 응답의 color 값에 따라 배경 그라데이션을 적용한다.
2. THE Mood_Visual SHALL 다음 색상 매핑을 지원한다: warm-sunset(주황/분홍), cool-night(남색/보라), fresh-morning(하늘/민트), rainy-day(회색/청색), cozy-evening(갈색/주황).
3. WHEN Result_Page가 표시될 때, THE Mood_Visual SHALL AI 응답의 energy 값(0.0~1.0)에 따라 tsparticles 파티클 애니메이션의 속도와 밀도를 조절한다.
4. WHILE energy 값이 0.3 미만인 상태, THE Mood_Visual SHALL 파티클을 느리고 적은 밀도로 표시한다.
5. WHILE energy 값이 0.7 이상인 상태, THE Mood_Visual SHALL 파티클을 빠르고 높은 밀도로 표시한다.

### Requirement 7: 기록 저장

**User Story:** As a 사용자, I want 분석 결과가 자동으로 저장되길 원한다, so that 나중에 과거 기록을 다시 볼 수 있다.

#### Acceptance Criteria

1. WHEN AI 분석과 YouTube 검색이 완료되면, THE Result_Page SHALL DiaryEntry 객체를 localStorage에 자동 저장한다.
2. THE DiaryEntry SHALL 고유 ID, 날짜(YYYY-MM-DD), 요일, 원본 일기, 요약, 위로 메시지, mood 파라미터(energy, valence, vibe, color, searchQueries), Track 목록, 생성 타임스탬프를 포함한다.
3. IF 같은 날짜에 이미 기록이 존재하면, THEN THE Result_Page SHALL 새 기록을 추가 저장하여 하루에 여러 기록을 허용한다.

### Requirement 8: 과거 기록 열람

**User Story:** As a 사용자, I want 과거에 작성한 일기와 추천받은 플레이리스트를 다시 보고 싶다, so that 지난 감정을 돌아보고 그때의 음악을 다시 들을 수 있다.

#### Acceptance Criteria

1. THE History_Page SHALL 저장된 DiaryEntry 목록을 최근순 카드 형태로 표시하며, 각 카드에 날짜, 요약 미리보기, 플레이리스트 부제목(vibe), 감정 색상 인디케이터를 포함한다.
2. THE History_Page SHALL 월별 캘린더 뷰를 제공하며, 일기를 작성한 날짜에 해당 color 값 기반 색상 점을 표시한다.
3. WHEN 사용자가 캘린더의 날짜 또는 카드를 선택하면, THE History_Page SHALL 해당 기록의 Detail_Page로 이동한다.
4. THE Detail_Page SHALL 원본 일기, 하루 요약, 위로 메시지, 전체 Track 목록을 표시하고 해당 날의 Mood_Visual을 재현한다.
5. IF 저장된 기록이 없으면, THEN THE History_Page SHALL "아직 기록이 없어. 오늘 첫 일기를 써볼까?" 안내 메시지를 표시한다.

### Requirement 9: 반응형 레이아웃

**User Story:** As a 사용자, I want 모바일과 데스크톱 모두에서 편하게 사용하고 싶다, so that 어떤 기기에서든 일기를 쓰고 음악을 들을 수 있다.

#### Acceptance Criteria

1. THE Diary_Input_Page SHALL 모바일(320px 이상)과 데스크톱(1024px 이상) 화면 너비에 맞게 레이아웃을 조정한다.
2. THE Result_Page SHALL 모바일 환경에서 단일 컬럼 스크롤 레이아웃으로 표시한다.
3. THE Mini_Player SHALL 모바일과 데스크톱 모두에서 화면 하단에 고정되어 콘텐츠를 가리지 않도록 하단 여백을 확보한다.

### Requirement 10: 라우팅 및 네비게이션

**User Story:** As a 사용자, I want 일기 작성 화면과 기록 화면을 쉽게 오갈 수 있다, so that 원하는 기능에 빠르게 접근할 수 있다.

#### Acceptance Criteria

1. THE Diary_Input_Page SHALL React Router v6 기반으로 루트 경로(/)에서 접근 가능하다.
2. THE History_Page SHALL /history 경로에서 접근 가능하다.
3. THE Detail_Page SHALL /history/:id 경로에서 접근 가능하다.
4. THE Result_Page SHALL /result/:id 경로에서 접근 가능하다.
5. WHEN 사용자가 존재하지 않는 경로에 접근하면, THE Diary_Input_Page SHALL 루트 경로로 리다이렉트한다.

### Requirement 11: 접근성

**User Story:** As a 키보드 사용자 또는 스크린리더 사용자, I want 앱의 모든 기능을 보조 기술로 사용할 수 있다, so that 장애 여부와 관계없이 서비스를 이용할 수 있다.

#### Acceptance Criteria

1. THE Diary_Input_Page SHALL 모든 인터랙티브 요소에 키보드 포커스 및 탭 네비게이션을 지원한다.
2. THE Result_Page SHALL 하루 요약, 위로 메시지, Track 목록에 적절한 ARIA 레이블과 시맨틱 HTML 태그를 적용한다.
3. THE Mini_Player SHALL 재생/일시정지 버튼에 aria-label을 제공한다.
4. THE Mood_Visual SHALL 파티클 애니메이션에 aria-hidden="true"를 적용하여 스크린리더가 무시하도록 한다.

### Requirement 12: 보안 및 API 키 보호

**User Story:** As a 개발자, I want API 키가 클라이언트에 노출되지 않길 원한다, so that 악의적 사용으로 인한 비용 발생을 방지할 수 있다.

#### Acceptance Criteria

1. THE Analyze_API SHALL AWS 자격 증명(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)을 Vercel 환경변수에서만 참조한다.
2. THE YouTube_Search_API SHALL YouTube API 키를 Vercel 환경변수(YOUTUBE_API_KEY)에서만 참조한다.
3. IF 환경변수가 설정되지 않은 상태에서 API가 호출되면, THEN THE Analyze_API SHALL 500 상태 코드와 설정 오류 메시지를 반환한다.
4. IF 환경변수가 설정되지 않은 상태에서 API가 호출되면, THEN THE YouTube_Search_API SHALL 500 상태 코드와 설정 오류 메시지를 반환한다.
