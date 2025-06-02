import { serialize } from 'cookie';

export default async function handler(req, res) {
  const {
    AIRTABLE_CLIENT_ID,
    AIRTABLE_CLIENT_SECRET,
    AIRTABLE_REDIRECT_URI,
  } = process.env;

  const { code, state } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Missing code from Airtable' });
  }

  const storedState = req.cookies['state'];
  const storedVerifier = req.cookies['code_verifier'];

  if (state !== storedState || !storedVerifier) {
    return res.status(400).json({ error: 'Invalid state or missing verifier' });
  }

  const tokenRes = await fetch('https://airtable.com/oauth2/v1/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: AIRTABLE_CLIENT_ID,
      client_secret: AIRTABLE_CLIENT_SECRET,
      redirect_uri: AIRTABLE_REDIRECT_URI,
      code_verifier: storedVerifier,
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenRes.ok) {
    console.error('Token request failed:', tokenData);
    return res.status(400).json({ error: 'Failed to authenticate', tokenData });
  }

  // Store token securely (for this demo we'll use a cookie)
  res.setHeader('Set-Cookie', serialize('access_token', tokenData.access_token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 1 day
  }));

  return res.redirect('/success');
}
