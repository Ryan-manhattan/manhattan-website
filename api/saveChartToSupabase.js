import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'POST only allowed' });
  }

  try {
    const response = await fetch("https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=a8c28adb3e8eed2a1078db8b1ba699cf&format=json");
    const data = await response.json();

    const topTracks = data.tracks.track.slice(0, 50).map((track, index) => ({
      title: track.name,
      artist: track.artist.name,
      rank: index + 1,
    }));

    const { error } = await supabase.from('chart_data').insert(topTracks);

    if (error) {
      console.error('Supabase Insert Error:', error);
      return res.status(500).json({ message: '저장 실패', error });
    }

    res.status(200).json({ message: '차트 저장 완료', count: topTracks.length });
  } catch (err) {
    console.error('Fetch Error:', err);
    res.status(500).json({ message: '차트 불러오기 실패', error: err.message });
  }
}
