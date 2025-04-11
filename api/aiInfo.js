// api/aiInfo.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { artist, track } = req.body;

  const prompt = track
    ? `'${track}' by ${artist}에 대해 한국어로 설명해줘.`
    : `${artist}에 대해 한국어로 알려줘.`;

  try {
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
    const message = data.choices?.[0]?.message?.content;

    res.status(200).json({ message: message || "정보 없음" });
  } catch (error) {
    console.error("OpenAI API 오류:", error);
    res.status(500).json({ message: "OpenAI API 호출 실패" });
  }
}
