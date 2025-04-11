export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { artist, track } = req.body;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("❌ API 키가 설정되지 않았습니다.");
    return res.status(500).json({ message: "서버 설정 오류: API 키가 없습니다." });
  }

  const prompt = track
    ? `${artist}의 곡 "${track}"을 간단히 소개해줘.`
    : `${artist}는 어떤 음악을 하는 아티스트인지 짧게 설명해줘.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      }),
    });

    const data = await response.json();
    const message = data?.choices?.[0]?.message?.content?.trim();

    if (!message) {
      throw new Error("OpenAI 응답에서 message가 없습니다.");
    }

    res.status(200).json({ message });
  } catch (error) {
    console.error("❌ OpenAI API 오류:", error);
    res.status(500).json({ message: "정보 요청 중 오류가 발생했습니다." });
  }
}
