import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { id, photo_url, gif_url, video_url, original_urls } = req.body;

    // Update data berdasarkan ID
    const { error } = await supabase
      .from('sessions')
      .update({ 
        photo_url, 
        gif_url, 
        video_url, 
        original_urls,
        status: 'ready' // Tandai selesai!
      })
      .eq('id', id);

    if (error) throw error;

    return res.status(200).json({ success: true });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}