import { createClient } from '@supabase/supabase-js';

// Setup Supabase (Ambil dari Environment Variables Vercel)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Fungsi buat bikin ID acak 6 karakter
function makeId(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export default async function handler(req, res) {
  // Hanya terima method POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { photo_url, gif_url, video_url, zip_url } = req.body;

    // 1. Generate ID Pendek Unik
    const short_id = makeId(6);

    // 2. Simpan ke Database Supabase
    const { data, error } = await supabase
      .from('sessions')
      .insert([
        { 
          id: short_id, 
          photo_url, 
          gif_url, 
          video_url, 
          zip_url 
        }
      ]);

    if (error) throw error;

    // 3. Balas ke Python: "Oke, ini ID nya"
    return res.status(200).json({ success: true, id: short_id });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}