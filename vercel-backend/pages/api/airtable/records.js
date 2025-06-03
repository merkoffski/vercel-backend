import axios from 'axios';

export default async function handler(req, res) {
  const { baseId, table } = req.query;
  const token = req.cookies['airtable_token']; // token stored in cookie

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const response = await axios.get(\`https://api.airtable.com/v0/\${baseId}/\${table}\`, {
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}