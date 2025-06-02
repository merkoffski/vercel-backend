import { serialize } from 'cookie';

export default async function handler(req, res) {
  try {
    const {
      AIRTABLE_CLIENT_ID,
      AIRTABLE_CLIENT_SECRET,
      AIRTABLE_REDIRECT_URI,
    } = process.env;

    const { code, state } = req.query;

    const storedState = req.cookies['state'];
    const storedVerifier = req.cookies['code_verifier'];

    if (!code) {
      return res.status(400).json({ error: 'Missing code from Airtable' });
    }

    if (!AIRTABLE_CLIENT_ID || !AIRTABLE_CLIENT_SECRET || !AIRTABLE_REDIRECT_URI) {
      return res.status(500).json({
        error: 'Missing environment variables',
        AIRTABLE_CLIENT_ID,
        AIRTABLE_CLIENT_SECRET: AIRTABLE_CLIENT_SECRET ? 'present' : 'missing',
        AIRTABLE_REDIRECT_URI,
      });
    }

    if (!storedVerifier) {
      return res.status(400).json({ error: 'Missing code_verifier cookie' });
    }

    if (state !== storedState) {
      return res.status(400).json({ error: 'Invalid state token' });
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
      console.error('Token exchange failed:', tokenData);
      return res.status(400).json({ error: 'Failed to authenticate', tokenData });
    }

    res.setHeader('Set-Cookie', serialize('access_token', tokenData.access_token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
    }));

    return res.redirect('/success');
  } catch (err) {
    console.error('Unexpected error in callback:', err);
    return res.status(500).json({ error: 'Unexpected server error', details: err.message });
  }
}
