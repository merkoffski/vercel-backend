export default async function handler(req, res) {
  const clientId = process.env.AIRTABLE_CLIENT_ID;
  const redirectUri = process.env.REDIRECT_URI;
  const scope = "data.records:read schema.bases:read";
  const state = "secure_state_token"; // In production, generate securely

  if (!clientId || !redirectUri) {
    return res.status(500).json({ error: "Missing AIRTABLE_CLIENT_ID or REDIRECT_URI" });
  }

  const authUrl = `https://airtable.com/oauth2/v1/authorize?` +
    `client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scope)}` +
    `&state=${encodeURIComponent(state)}`;

  if (req.query.debug === "true") {
    return res.status(200).json({ authUrl });
  }

  res.writeHead(302, { Location: authUrl });
  res.end();
}
