export default async function handler(req, res) {
  const code = req.query.code;
  const stateEncoded = req.query.state;

  if (!code || !stateEncoded) {
    return res.status(400).json({ error: "Missing code or state" });
  }

  let codeVerifier;
  try {
    const state = JSON.parse(Buffer.from(stateEncoded, "base64").toString("utf-8"));
    codeVerifier = state.codeVerifier;
  } catch {
    return res.status(400).json({ error: "Invalid state encoding" });
  }

  try {
    const response = await fetch("https://airtable.com/oauth2/v1/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.AIRTABLE_CLIENT_ID,
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.REDIRECT_URI,
        code_verifier: codeVerifier
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
    res.status(500).json({ error: "Callback error", details: err });
  }
}
