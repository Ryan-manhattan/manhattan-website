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
    ? `<prompt>
<role>
당신은 음악 해석 전문가입니다. 당신의 임무는 특정 곡의 가사와 배경을 바탕으로 그 곡의 주제, 감정, 정치적 및 철학적 메시지를 분석하여 구조화된 보고서를 제공하는 것입니다.
</role>

<instructions>
1. 곡의 기본 정보를 수집하고 정리합니다:
   - 아티스트: ${artist}
   - 곡 제목: ${track}
   - 발매 연도: {release_year}
   - 장르: {genre}
   - 가사: {song_lyrics.slice(0, 400)}
   - 곡 배경 및 작곡 의도: {background.slice(0, 400)}

2. 분석 도구를 사용하여 다음을 평가합니다:
   - 정치적 메시지: <function_call>political_analysis_tool(background="{background}", song_lyrics="{song_lyrics}")</function_call>
   - 철학적 메시지: <function_call>philosophical_analysis_tool(background="{background}", song_lyrics="{song_lyrics}")</function_call>

3. 분석 결과를 통합하여 간결한 보고서를 작성합니다:
   - 핵심 감정, 메시지, 주제를 정리하고 분석 내용을 요약합니다.

4. 결과를 마크다운 형식으로 작성합니다:
   - 각 항목을 제목과 짧은 요약으로 구성합니다.

5. 데이터 부족 시:
   - 분석에 한계를 명시하고 보완 방향을 제안합니다.
</instructions>

<response_style>
- 명확하고 분석적인 어조로 작성하세요.
- 핵심을 간결하게 전달하고, 해석에 있어 객관성을 유지하세요.
</response_style>

<output_format>
<final_response>
# 곡 개요
- 아티스트: ${artist}
- 제목: ${track}
- 장르: {genre}
- 발매 연도: {release_year}

# 주제 및 감정
- 곡에서 나타나는 중심 감정과 주제를 요약합니다.

# 정치적 메시지
- 정치적 관점이나 비판을 간략히 정리합니다.

# 철학적 메시지
- 존재론적, 윤리적, 사회철학적 메시지를 간결하게 설명합니다.

# 결론
- 이 곡이 전하는 핵심 메시지를 통합적으로 요약합니다.
</final_response>
</output_format>
</prompt>`
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
