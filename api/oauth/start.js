import crypto from 'crypto';

export default function handler(req, res) {
  const state = JSON.stringify({ codeVerifier: crypto.randomBytes(32).toString('hex') });
  const codeVerifier = JSON.parse(state).codeVerifier;
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
  const clientId = process.env.AIRTABLE_CLIENT_ID;
  const redirectUri = process.env.AIRTABLE_REDIRECT_URI;
  const scope = 'data.records:read schema.bases:read';

  const authUrl = `https://airtable.com/oauth2/v1/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(state)}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

  res.status(200).json({ authUrl });
}