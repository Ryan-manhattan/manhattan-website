// netlify/functions/aiInfo.js
export async function handler(event) {
  const { artist, track } = JSON.parse(event.body);

  const prompt = track
    ? `'${track}' by ${artist}에 대해 한국어로 설명해줘.`
    : `${artist}에 대해 한국어로 알려줘.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const data = await response.json();
  const message = data.choices?.[0]?.message?.content || '정보를 찾을 수 없습니다.';

  return {
    statusCode: 200,
    body: JSON.stringify({ message })
  };
}
