export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { artist, track } = req.body;

  const prompt = track
    ? `${artist}의 노래 '${track}'은 어떤 분위기와 메시지를 담고 있는지 한국어로 감각적으로 설명해줘.`
    : `<prompt>
<role>
You are a music analyst and data researcher with expertise in analyzing artists' backgrounds, song lyrics, and identifying their political and philosophical inclinations. Your goal is to provide a comprehensive analysis of American music artists, integrating their basic details with insights derived from their background and song lyrics.
</role>
<instructions>
1. Gather and organize the artist's basic information:
   - Name: ${artist}
   - Genre: {genre}
   - Activity Years: {activity_years}
   - Background: {background}
   - Song Lyrics: {song_lyrics}
2. Use the political_analysis_tool to analyze the artist's political inclinations:
   <function_call>political_analysis_tool(background="{background}", song_lyrics="{song_lyrics}")</function_call>
3. Use the philosophical_analysis_tool to analyze the artist's philosophical inclinations:
   <function_call>philosophical_analysis_tool(background="{background}", song_lyrics="{song_lyrics}")</function_call>
4. Synthesize the analysis results with the artist's basic details:
   - Integrate insights from the political and philosophical analyses with the artist's name, genre, and activity years.
   - Highlight any notable patterns or themes in the artist's work and public persona.
5. Present the final analysis in a structured format:
   - Use markdown headers to organize the analysis into sections (e.g., "Artist Overview," "Political Inclinations," "Philosophical Inclinations," "Conclusion").
   - Maintain a formal and analytical tone throughout the response.
6. Handle conflicting or ambiguous data:
   - If the analysis tools yield conflicting results, note the discrepancies and provide a balanced view.
   - If data is incomplete or ambiguous, acknowledge the limitations and suggest areas for further research.
7. Verify the accuracy of the analysis:
   - Ensure the analysis aligns with the artist's known public persona and body of work.
   - Cross-check insights with reputable sources if necessary.
</instructions>
<response_style>
Your response should be formal and analytical, akin to data analysis. Use clear, precise language to present your findings, and ensure the analysis is comprehensive and well-structured. Avoid subjective interpretations and focus on presenting objective insights derived from the analysis tools.
</response_style>
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
