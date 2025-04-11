export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { artist, track } = req.body;

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
   - 가사: {song_lyrics.slice(0, 400)
   - 곡 배경 및 작곡 의도: {background.slice(0, 400)

2. 분석 도구를 사용하여 다음을 평가합니다:
   - 정치적 메시지: <function_call>political_analysis_tool(background="{background.slice(0, 400)", song_lyrics="{song_lyrics.slice(0, 400)")</function_call>
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
- **아티스트**: ${artist}
- **제목**: ${track}
- **장르**: {genre}
- **발매 연도**: {release_year}

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

<reminder>
- 분석을 구조화하고 간결하게 작성하세요.
- 가사와 배경에 기반한 명확한 인사이트를 제공하세요.
</reminder>
</prompt>`
    : `<prompt>
<role>
당신은 음악 분석 전문가로, 아티스트의 배경과 가사를 분석하여 정치적, 철학적 성향을 파악합니다. 주어진 정보를 바탕으로 간결하고 명확한 아티스트 프로필을 제공합니다.
</role>

<instructions>
1. 아티스트의 기본 정보를 수집하고 정리합니다:
   - 이름: ${artist}
   - 장르: {genre}
   - 활동 기간: {activity_years}
   - 배경: {background}
   - 주요 가사: {song_lyrics}

2. 제공된 분석 도구를 사용하여 다음을 분석합니다:
   - 정치적 성향: <function_call>political_analysis_tool(background="{background}", song_lyrics="{song_lyrics}")</function_call>
   - 철학적 성향: <function_call>philosophical_analysis_tool(background="{background}", song_lyrics="{song_lyrics}")</function_call>

3. 분석 결과를 통합하여 명확하고 간결한 요약을 만듭니다:
   - 주요 특징과 테마를 명료하게 정리합니다.

4. 최종 결과를 마크다운 형식으로 작성합니다:
   - 각 섹션을 제목과 짧은 요약으로 구성합니다.

5. 데이터가 부족하거나 모호할 경우:
   - 한계를 명시하고 추가 분석이 필요한 사항을 제안합니다.

6. 결과의 정확성을 공개된 정보와 비교하여 검증합니다.
</instructions>

<response_style>
- 간결하고 정확한 표현을 사용하여 핵심적인 정보만 전달합니다.
- 객관적이고 분석적인 어조를 유지합니다.
</response_style>

<output_format>
다음 형식으로 결과를 출력합니다:

<final_response>
# 아티스트 개요
- **이름**: {name}
- **장르**: {genre}
- **활동 기간**: {activity_years}

# 정치적 성향
- 핵심 성향과 대표적 주제를 간략히 요약합니다.

# 철학적 성향
- 핵심 철학적 주제를 간략히 요약합니다.

# 종합 요약
- 아티스트 음악의 전반적인 정치적, 철학적 특징을 간단히 정리합니다.
</final_response>
</output_format>

<reminder>
- 정보를 간략하면서도 정확하게 표현하세요.
- 객관적인 분석을 유지하세요.
</reminder>
</prompt>`;

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
