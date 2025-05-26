export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const clientId = process.env.AIRTABLE_CLIENT_ID;
  const redirectUri = process.env.REDIRECT_URI;
  if (!clientId || !redirectUri) {
    return res.status(500).json({ error: 'OAuth client credentials are not configured.' });
  }

  const airtableAuthURL = `https://airtable.com/oauth2/v1/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;
  res.writeHead(302, { Location: airtableAuthURL });
  res.end();
}
