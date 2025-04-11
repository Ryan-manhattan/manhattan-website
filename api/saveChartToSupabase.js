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
    // ✅ 여기에 dummy 데이터 삽입
    const dummy = [
      { title: 'Test Song', artist: 'Test Artist', rank: 1 },
      { title: 'Another Song', artist: 'Someone Else', rank: 2 }
    ];

    const { error } = await supabase.from('chart_data').insert(dummy);

    if (error) {
      console.error('Supabase Insert Error:', error);
      return res.status(500).json({ message: 'Insert 실패', error });
    }

    res.status(200).json({ message: 'Dummy 차트 저장 성공!' });
  } catch (err) {
    res.status(500).json({ message: '서버 오류 발생', error: err.message });
  }
}
