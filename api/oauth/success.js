export default function handler(req, res) {
  const token = req.query.token;
  if (!token) return res.status(400).send("Missing token");

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(`<h1>OAuth Successful</h1><p>Your token:</p><code>${token}</code>`);
}
