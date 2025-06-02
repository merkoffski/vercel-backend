import axios from 'axios';

export default async function handler(req, res) {
  try {
    const token = global.tokenData?.access_token;
    if (!token) throw new Error('Missing token');

    const result = await axios.get('https://api.airtable.com/v0/meta/bases', {
      headers: { Authorization: `Bearer ${token}` },
    });
    res.status(200).json(result.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}