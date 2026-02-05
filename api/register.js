import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

function makeId(length) {
    let result = '';
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Tanpa huruf mirip angka
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export default async function handler(req, res) {
  // Python akan request ke sini
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const short_id = makeId(6);

    // Kita booking ID di database dengan status 'processing'
    const { error } = await supabase
      .from('sessions')
      .insert([{ id: short_id, status: 'processing' }]);

    if (error) throw error;

    // Kirim ID ke Python
    return res.status(200).json({ success: true, id: short_id });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}