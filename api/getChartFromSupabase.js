import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from('chart_data')
    .select('*')
    .order('rank', { ascending: true });

  if (error) {
    return res.status(500).json({ message: '데이터 가져오기 실패', error });
  }

  res.status(200).json(data);
}
