export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { artist, track } = req.body;

  const prompt = track
    ? `아티스트 ${artist}의 곡 '${track}'에 담긴 감정, 주제, 정치·철학적 메시지를 간략히 분석해줘. 가사: \${song_lyrics.slice(0, 400)} / 배경: \${background.slice(0, 400)}`
    : `아티스트 ${artist}의 정치적, 철학적 성향을 가사와 배경 기반으로 간단히 분석해줘. 주요 가사: \${song_lyrics.slice(0, 400)} / 배경: \${background.slice(0, 400)}`;

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
    console.error("OpenAI API 호출 오류:", error);
    res.status(500).json({ message: "정보 요청 중 오류가 발생했습니다." });
  }
}
