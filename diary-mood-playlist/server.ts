import 'dotenv/config';
import express from 'express';
import analyzeHandler from './api/analyze';
import youtubeSearchHandler from './api/youtube-search';

const app = express();
app.use(express.json());

// Vercel 핸들러를 Express로 어댑팅
app.post('/api/analyze', (req, res) => analyzeHandler(req as any, res as any));
app.post('/api/youtube-search', (req, res) => youtubeSearchHandler(req as any, res as any));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ API 서버 실행 중: http://localhost:${PORT}`);
});
