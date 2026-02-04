import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

function makeId(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // KITA TERIMA 'original_urls' (LIST), BUKAN ZIP_URL LAGI
    const { photo_url, gif_url, video_url, original_urls } = req.body;

    const short_id = makeId(6);

    const { data, error } = await supabase
      .from('sessions')
      .insert([
        { 
          id: short_id, 
          photo_url, 
          gif_url, 
          video_url,
          original_urls: original_urls // Simpan Array ke JSONB
        }
      ]);

    if (error) throw error;

    return res.status(200).json({ success: true, id: short_id });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}