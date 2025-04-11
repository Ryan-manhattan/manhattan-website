import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  try {
    const response = await fetch("https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=a8c28adb3e8eed2a1078db8b1ba699cf&format=json");
    const data = await response.json();
    const tracks = data.tracks?.track?.slice(0, 50) || [];

    const filePath = path.join(process.cwd(), 'public', 'data', 'chartData.json');
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify({ tracks }, null, 2));

    res.status(200).json({ message: 'Chart data saved successfully', count: tracks.length });
  } catch (error) {
    console.error("🔥 Error saving chart data:", error);
    res.status(500).json({ message: "Failed to fetch and save chart data." });
  }
}
