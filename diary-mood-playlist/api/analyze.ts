import type { VercelRequest, VercelResponse } from '@vercel/node';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const SYSTEM_PROMPT = `너는 사용자의 하루 일기를 읽고 세 가지를 해줘:

1. 하루 요약 (2~3문장, 담백하게, 판단하지 말고 있는 그대로 정리)
2. 위로/응원 메시지 (2~3문장, 따뜻하고 진심 어린 톤, 공감 먼저 그 다음 응원, 과하지 않게, 반말로 편하게)
3. 음악 추천 파라미터

반드시 아래 JSON 형식으로만 응답해:
{
  "summary": "하루 요약",
  "message": "위로 메시지",
  "mood": {
    "energy": 0.0~1.0,
    "valence": 0.0~1.0,
    "vibe": "플레이리스트 부제목 (예: 퇴근 후 소파에서)",
    "color": "warm-sunset | cool-night | fresh-morning | rainy-day | cozy-evening 중 하나",
    "searchQueries": ["YouTube 검색 키워드1", "키워드2", "키워드3"]
  }
}

규칙:
- searchQueries는 분위기에 맞는 음악을 YouTube에서 찾을 수 있는 검색어 3개
- 한국어와 영어 키워드를 섞어서 다양한 결과가 나오게
- color는 반드시 5개 중 하나만 선택
- JSON 외 다른 텍스트 없이 순수 JSON만 응답`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    return res.status(500).json({ error: '서버 설정 오류: AWS 자격 증명이 설정되지 않았습니다.' });
  }

  const { diary } = req.body as { diary?: string };
  if (!diary || diary.length < 10 || diary.length > 2000) {
    return res.status(400).json({ error: '일기는 10~2000자여야 합니다.' });
  }

  try {
    const client = new BedrockRuntimeClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: { accessKeyId, secretAccessKey },
    });

    const modelId = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-opus-4-7';

    const command = new InvokeModelCommand({
      modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: diary }],
      }),
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    let text = responseBody.content[0].text.trim();

    // 마크다운 코드블록 제거
    if (text.startsWith('```')) {
      text = text.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
    }

    const result = JSON.parse(text);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Bedrock API error:', error);
    return res.status(500).json({ error: 'AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
  }
}
