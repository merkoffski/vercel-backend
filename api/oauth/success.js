export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = req.query.token;
  if (!token) return res.status(400).send('Access token not found.');

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Airtable OAuth Success</title>
    <style>
      body { font-family: Arial, sans-serif; background: #f7f7f7; padding: 2em; text-align: center; }
      .container { background: #fff; padding: 2em; margin: auto; max-width: 500px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
      h1 { color: #27ae60; }
      code { word-break: break-all; background: #eef; padding: 0.4em; border-radius: 4px; display: block; }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>OAuth Successful</h1>
      <p>Your Airtable access token is:</p>
      <code>${token}</code>
    </div>
  </body>
  </html>
  `;

  res.status(200).setHeader('Content-Type', 'text/html').send(htmlContent);
}
