import axios from 'axios';

export default async function handler(req, res) {
  const { baseId } = req.query;
  try {
    const token = global.tokenData?.access_token;
    if (!token) throw new Error('Missing token');
    if (!baseId) throw new Error('Missing baseId');

    const result = await axios.get(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    res.status(200).json(result.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}