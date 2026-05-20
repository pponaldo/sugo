import type { AnalyzeResponse, YouTubeSearchResponse } from '../types';

export async function analyzeDiary(diary: string): Promise<AnalyzeResponse> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ diary }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: '알 수 없는 오류' }));
    throw new Error(error.error || `서버 오류 (${response.status})`);
  }

  return response.json();
}

export async function searchYouTube(queries: string[]): Promise<YouTubeSearchResponse> {
  const response = await fetch('/api/youtube-search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ queries }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: '알 수 없는 오류' }));
    throw new Error(error.error || `YouTube 검색 오류 (${response.status})`);
  }

  return response.json();
}
