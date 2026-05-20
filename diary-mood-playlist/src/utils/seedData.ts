import { STORAGE_KEY, DAY_NAMES } from '../constants';
import type { DiaryEntry } from '../types';

const sampleEntries: Omit<DiaryEntry, 'id' | 'dayOfWeek' | 'createdAt'>[] = [
  {
    date: '2026-05-05',
    diary: '오늘 아침에 일찍 일어나서 동네 공원을 산책했다. 공기가 너무 상쾌하고 벚꽃이 막 피기 시작했다. 카페에서 아이스 아메리카노 한 잔 사서 벤치에 앉아 마셨는데, 이런 소소한 순간이 진짜 행복하다고 느꼈다. 오후에는 친구한테 좋은 소식도 들었고, 오늘 하루 전체가 선물 같았다.',
    summary: '상쾌한 아침 산책과 카페에서의 여유, 친구의 좋은 소식까지 선물 같은 하루.',
    message: '이런 날이 있어서 다행이다. 작은 행복을 알아채는 너의 감각이 참 좋아. 내일도 좋은 하루가 될 거야.',
    mood: {
      energy: 0.8,
      valence: 0.9,
      vibe: '봄바람 타고 산책하는 오후',
      color: 'fresh-morning',
      searchQueries: ['봄 산책 플레이리스트', 'happy morning acoustic', '기분좋은 카페 음악'],
    },
    tracks: [
      { id: 'dQw4w9WgXcQ', title: 'Spring Walk - Acoustic Vibes', channel: 'Chill Music', thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { id: '9bZkp7q19f0', title: '봄날의 카페', channel: 'Korean Lofi', thumbnail: 'https://i.ytimg.com/vi/9bZkp7q19f0/mqdefault.jpg', youtubeUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0' },
      { id: 'kJQP7kiw5Fk', title: 'Morning Coffee Jazz', channel: 'Jazz Cafe', thumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/mqdefault.jpg', youtubeUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk' },
    ],
  },
  {
    date: '2026-05-08',
    diary: '아무것도 하기 싫은 하루였다. 아침부터 비가 오고 몸도 무겁고, 회사에서 계속 실수만 했다. 점심도 혼자 먹었는데 뭘 먹었는지도 기억이 안 난다. 집에 와서 침대에 누웠는데 눈물이 나올 것 같았다. 왜 이렇게 힘든 건지 모르겠다. 그냥 아무 생각 없이 쉬고 싶다.',
    summary: '비 오는 날, 실수 연속에 지친 하루. 혼자 점심 먹고 집에 와서 무기력하게 누움.',
    message: '힘든 날이었구나. 그래도 하루를 버텨낸 거잖아. 오늘은 그냥 쉬어도 돼. 내일은 조금 나을 거야.',
    mood: {
      energy: 0.2,
      valence: 0.15,
      vibe: '비 오는 창가에 기대어',
      color: 'rainy-day',
      searchQueries: ['비오는날 듣기좋은 노래', 'sad rainy day playlist', '우울할때 위로되는 음악'],
    },
    tracks: [
      { id: 'RgKAFK5djSk', title: '비 오는 날의 위로', channel: 'Mood Music', thumbnail: 'https://i.ytimg.com/vi/RgKAFK5djSk/mqdefault.jpg', youtubeUrl: 'https://www.youtube.com/watch?v=RgKAFK5djSk' },
      { id: 'bo_efYhYU2A', title: 'Rainy Day Melancholy', channel: 'Lo-fi Beats', thumbnail: 'https://i.ytimg.com/vi/bo_efYhYU2A/mqdefault.jpg', youtubeUrl: 'https://www.youtube.com/watch?v=bo_efYhYU2A' },
      { id: 'hT_nvWreIhg', title: '잠이 오지 않는 밤', channel: 'Korean Ballad', thumbnail: 'https://i.ytimg.com/vi/hT_nvWreIhg/mqdefault.jpg', youtubeUrl: 'https://www.youtube.com/watch?v=hT_nvWreIhg' },
    ],
  },
  {
    date: '2026-05-12',
    diary: '진짜 열받는 하루였다. 팀장이 내가 일주일 동안 준비한 기획안을 회의에서 대놓고 깎아내렸다. 다른 사람들 앞에서 그렇게 말할 필요가 있나? 퇴근하고 나서도 계속 그 장면이 떠올라서 운동을 하러 갔는데, 뛰고 나니까 좀 나아졌다. 그래도 아직 속이 부글부글한다.',
    summary: '회의에서 기획안이 깎여 분노한 하루. 퇴근 후 운동으로 풀었지만 아직 화가 남.',
    message: '그건 진짜 화날 만한 상황이었어. 운동으로 풀려고 한 거 잘했다. 네 노력은 네가 제일 잘 알잖아.',
    mood: {
      energy: 0.85,
      valence: 0.3,
      vibe: '퇴근 후 달리기',
      color: 'warm-sunset',
      searchQueries: ['운동할때 듣는 음악', 'angry workout playlist', '스트레스 해소 음악'],
    },
    tracks: [
      { id: 'fJ9rUzIMcZQ', title: 'Workout Rage Mix', channel: 'Gym Beats', thumbnail: 'https://i.ytimg.com/vi/fJ9rUzIMcZQ/mqdefault.jpg', youtubeUrl: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ' },
      { id: 'CevxZvSJLk8', title: '달려라 퇴근러', channel: 'Running Mix', thumbnail: 'https://i.ytimg.com/vi/CevxZvSJLk8/mqdefault.jpg', youtubeUrl: 'https://www.youtube.com/watch?v=CevxZvSJLk8' },
      { id: 'YQHsXMglC9A', title: 'Stress Relief Rock', channel: 'Rock Anthems', thumbnail: 'https://i.ytimg.com/vi/YQHsXMglC9A/mqdefault.jpg', youtubeUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A' },
    ],
  },
  {
    date: '2026-05-15',
    diary: '특별한 일 없이 조용히 보낸 하루. 재택근무라 편한 옷 입고 일하고, 점심에 라면 끓여 먹고, 오후에 잠깐 낮잠도 잤다. 저녁에는 넷플릭스로 다큐멘터리 하나 봤는데 꽤 재밌었다. 이런 날도 나쁘지 않다. 내일은 뭐 하지 생각하면서 이불 속에 들어왔다.',
    summary: '재택근무하며 조용히 보낸 하루. 라면, 낮잠, 넷플릭스로 편안한 저녁.',
    message: '아무것도 안 한 것 같아도 충분히 쉰 거야. 이런 날이 있어야 내일 또 힘낼 수 있어.',
    mood: {
      energy: 0.35,
      valence: 0.65,
      vibe: '이불 속 넷플릭스 타임',
      color: 'cozy-evening',
      searchQueries: ['편안한 저녁 음악', 'cozy evening lofi', '집에서 듣기 좋은 잔잔한 노래'],
    },
    tracks: [
      { id: 'lTRiuFIWV54', title: 'Cozy Night In', channel: 'Lofi Girl', thumbnail: 'https://i.ytimg.com/vi/lTRiuFIWV54/mqdefault.jpg', youtubeUrl: 'https://www.youtube.com/watch?v=lTRiuFIWV54' },
      { id: '5qap5aO4i9A', title: '잔잔한 밤 플레이리스트', channel: 'Night Vibes', thumbnail: 'https://i.ytimg.com/vi/5qap5aO4i9A/mqdefault.jpg', youtubeUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A' },
      { id: 'DWcJFNfaw9c', title: 'Evening Acoustic', channel: 'Chill Acoustic', thumbnail: 'https://i.ytimg.com/vi/DWcJFNfaw9c/mqdefault.jpg', youtubeUrl: 'https://www.youtube.com/watch?v=DWcJFNfaw9c' },
    ],
  },
  {
    date: '2026-05-18',
    diary: '오늘 옛날 사진을 정리하다가 대학교 때 친구들이랑 찍은 사진을 발견했다. 그때는 매일 만나서 밤새 수다 떨고 같이 밥 먹고 그랬는데, 지금은 다들 바빠서 연락도 뜸하다. 졸업한 지 벌써 5년이나 됐다니. 갑자기 그 시절이 너무 그립다. 다음 달에 한번 모임 잡아봐야겠다.',
    summary: '옛날 사진 정리하다 대학 친구들 사진 발견. 그 시절이 그리워 모임을 계획함.',
    message: '그리운 마음이 드는 건 그만큼 좋은 시간이었다는 거야. 연락해봐, 다들 반가워할 거야.',
    mood: {
      energy: 0.4,
      valence: 0.45,
      vibe: '옛 사진 속 그리운 밤',
      color: 'cool-night',
      searchQueries: ['그리운 날 듣는 노래', 'nostalgic korean songs', 'late night memories playlist'],
    },
    tracks: [
      { id: 'OPf0YbXqDm0', title: '그때 그 시절', channel: 'Korean Nostalgia', thumbnail: 'https://i.ytimg.com/vi/OPf0YbXqDm0/mqdefault.jpg', youtubeUrl: 'https://www.youtube.com/watch?v=OPf0YbXqDm0' },
      { id: 'JGwWNGJdvx8', title: 'Midnight Memories', channel: 'Night Owl', thumbnail: 'https://i.ytimg.com/vi/JGwWNGJdvx8/mqdefault.jpg', youtubeUrl: 'https://www.youtube.com/watch?v=JGwWNGJdvx8' },
      { id: 'pRpeEdMmmQ0', title: '추억의 노래 모음', channel: 'Retro Korea', thumbnail: 'https://i.ytimg.com/vi/pRpeEdMmmQ0/mqdefault.jpg', youtubeUrl: 'https://www.youtube.com/watch?v=pRpeEdMmmQ0' },
    ],
  },
];

export function seedSampleData(): void {
  const existing = localStorage.getItem(STORAGE_KEY);
  // 시드 데이터만 있는 경우(5개 이하) 갱신 허용
  if (existing) {
    const parsed = JSON.parse(existing);
    if (parsed.length > 5) return;
  }

  const entries: DiaryEntry[] = sampleEntries.map((entry) => {
    const date = new Date(entry.date + 'T12:00:00');
    return {
      ...entry,
      id: `${date.getTime()}`,
      dayOfWeek: DAY_NAMES[date.getDay()],
      createdAt: date.getTime(),
    };
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
