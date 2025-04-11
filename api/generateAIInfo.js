import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const chartPath = path.join(process.cwd(), 'public', 'data', 'chartData.json');
  const aiPath = path.join(process.cwd(), 'public', 'data', 'aiInfo.json');

  if (!fs.existsSync(chartPath)) {
    return res.status(400).json({ message: 'Chart data file not found.' });
  }

  const raw = fs.readFileSync(chartPath);
  const { tracks } = JSON.parse(raw);

  const results = [];

  for (const track of tracks) {
    const prompt = `${track.artist.name}의 곡 \"${track.name}\"을 간단히 소개해줘.`;
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7
        })
      });

      const data = await res.json();
      const message = data?.choices?.[0]?.message?.content?.trim() || "";

      results.push({
        artist: track.artist.name,
        title: track.name,
        message
      });
    } catch (e) {
      results.push({ artist: track.artist.name, title: track.name, message: "(오류 발생)" });
    }
  }

  fs.mkdirSync(path.dirname(aiPath), { recursive: true });
  fs.writeFileSync(aiPath, JSON.stringify({ results }, null, 2));

  res.status(200).json({ message: "AI info 저장 완료", count: results.length });
}
