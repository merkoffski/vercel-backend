import axios from 'axios';

export default async function handler(req, res) {
  const { code, state } = req.query;
  const { codeVerifier } = JSON.parse(state);
  const redirectUri = process.env.AIRTABLE_REDIRECT_URI;
  const clientId = process.env.AIRTABLE_CLIENT_ID;
  const clientSecret = process.env.AIRTABLE_CLIENT_SECRET;

  try {
    const tokenRes = await axios.post('https://airtable.com/oauth2/v1/token', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        code_verifier: codeVerifier,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const tokenData = tokenRes.data;
    global.tokenData = tokenData; // In-memory storage

    res.redirect('/api/success');
  } catch (err) {
    res.status(500).json({ error: 'Failed to authenticate', tokenData: err.response?.data || err.message });
  }
}