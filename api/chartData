export default async function handler(req, res) {
  try {
    const response = await fetch("https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=a8c28adb3e8eed2a1078db8b1ba699cf&format=json");
    const data = await response.json();
    const tracks = data.tracks?.track?.slice(0, 50) || [];

    res.status(200).json({ tracks });
  } catch (error) {
    console.error("🔥 차트 API 오류:", error);
    res.status(500).json({ message: "차트 데이터를 불러오는 데 실패했습니다." });
  }
}
