import type { VercelRequest, VercelResponse } from '@vercel/node';

interface YouTubeSearchItem {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: { medium: { url: string } };
  };
}

interface Track {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  youtubeUrl: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: '서버 설정 오류: YouTube API 키가 설정되지 않았습니다.' });
  }

  const { queries } = req.body as { queries?: string[] };
  if (!queries || !Array.isArray(queries) || queries.length === 0) {
    return res.status(400).json({ error: '검색 키워드가 필요합니다.' });
  }

  try {
    const allTracks: Track[] = [];

    for (const query of queries.slice(0, 3)) {
      const url = new URL('https://www.googleapis.com/youtube/v3/search');
      url.searchParams.set('part', 'snippet');
      url.searchParams.set('type', 'video');
      url.searchParams.set('videoCategoryId', '10');
      url.searchParams.set('q', query);
      url.searchParams.set('maxResults', '4');
      url.searchParams.set('key', apiKey);

      const response = await fetch(url.toString());

      if (!response.ok) {
        console.error(`YouTube API error for query "${query}":`, response.status);
        continue;
      }

      const data = await response.json();

      for (const item of (data.items ?? []) as YouTubeSearchItem[]) {
        allTracks.push({
          id: item.id.videoId,
          title: item.snippet.title,
          channel: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails.medium.url,
          youtubeUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        });
      }
    }

    // 중복 제거
    const seen = new Set<string>();
    const uniqueTracks = allTracks.filter((track) => {
      if (seen.has(track.id)) return false;
      seen.add(track.id);
      return true;
    });

    return res.status(200).json({ tracks: uniqueTracks.slice(0, 12) });
  } catch (error) {
    console.error('YouTube search error:', error);
    return res.status(500).json({ error: '음악 검색 중 오류가 발생했습니다.' });
  }
}
