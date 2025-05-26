import crypto from 'crypto'

export default async function handler(req, res) {
  const clientId = process.env.AIRTABLE_CLIENT_ID;
  const redirectUri = process.env.REDIRECT_URI;
  const scope = "data.records:read schema.bases:read";

  if (!clientId || !redirectUri) {
    return res.status(500).json({ error: "Missing env vars" });
  }

  const codeVerifier = crypto.randomBytes(32).toString("hex");
  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64")
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const state = Buffer.from(JSON.stringify({ codeVerifier })).toString("base64");

  const authUrl = `https://airtable.com/oauth2/v1/authorize?` +
    `client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scope)}` +
    `&state=${encodeURIComponent(state)}` +
    `&code_challenge=${codeChallenge}` +
    `&code_challenge_method=S256`;

  if (req.query.debug === "true") {
    return res.status(200).json({ authUrl });
  }

  res.writeHead(302, { Location: authUrl });
  res.end();
}
