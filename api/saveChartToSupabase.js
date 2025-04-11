import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'POST only allowed' })
  }

  try {
    const dummy = [
      { title: 'Just Testing', artist: 'Supabase Bot', rank: 99 }
    ]

    const { error } = await supabase.from('chart_data').insert(dummy)

    if (error) {
      console.error('Supabase Insert Error:', error)
      return res.status(500).json({ message: 'Insert 실패', error })
    }

    return res.status(200).json({ message: '✅ 테스트 데이터 저장 완료!' })
  } catch (err) {
    console.error('서버 오류:', err)
    return res.status(500).json({ message: '서버 오류', error: err.message })
  }
}
