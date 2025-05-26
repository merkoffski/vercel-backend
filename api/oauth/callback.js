export default async function handler(req, res) {
  const code = req.query.code;
  if (!code) return res.status(400).json({ error: "Missing code from Airtable." });

  try {
    const response = await fetch("https://airtable.com/oauth2/v1/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.AIRTABLE_CLIENT_ID,
        client_secret: process.env.AIRTABLE_CLIENT_SECRET,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: process.env.REDIRECT_URI
      })
    });

    const tokenData = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: "Failed to authenticate", tokenData });
    }

    const token = tokenData.access_token;
    res.writeHead(302, { Location: `/api/oauth/success?token=${encodeURIComponent(token)}` });
    res.end();
  } catch (err) {
    res.status(500).json({ error: "OAuth callback failed", details: err });
  }
}
