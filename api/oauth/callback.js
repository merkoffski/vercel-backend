export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const code = req.query.code;
  if (!code) return res.status(400).send('Missing OAuth code.');

  try {
    const tokenResponse = await fetch('https://airtable.com/oauth2/v1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.AIRTABLE_CLIENT_ID || '',
        client_secret: process.env.AIRTABLE_CLIENT_SECRET || '',
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.REDIRECT_URI || ''
      })
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('Error exchanging code:', tokenData);
      return res.status(500).send('Failed to retrieve access token.');
    }

    const accessToken = tokenData.access_token;
    res.writeHead(302, { Location: `/api/oauth/success?token=${encodeURIComponent(accessToken)}` });
    res.end();
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).send('Server error during OAuth callback.');
  }
}
