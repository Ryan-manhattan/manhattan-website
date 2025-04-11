export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { artist, track } = req.body;

  const prompt = track
    ? `${artist}의 노래 '${track}'이 빌보드 차트 top 100에 처음 진입한 날짜를 알려줘.`
    : `${artist}의 이름, 국적, 나이를 단어로만 나열해줘.`;

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
