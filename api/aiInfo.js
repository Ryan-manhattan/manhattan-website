// api/aiInfo.js
export default async function handler(req, res) {
  const { artist, track } = req.body;

  const prompt = track
    ? `'${track}' by ${artist}에 대해 한국어로 설명해줘.`
    : `${artist}에 대해 한국어로 알려줘.`;

  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await openaiRes.json();
  res.status(200).json({
    message: data.choices?.[0]?.message?.content || "정보 없음"
  });
}
