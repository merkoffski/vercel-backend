export default async function handler(req, res) {
  const token = "patBKToDXZ9amoYZu.9f2cd5d6f123218ccc801b9572f13c843d789a016fda5004c9348d4d7c4b91e2";
  const baseId = req.query.baseId;
  if (!baseId) {
    return res.status(400).json({ error: "Missing baseId" });
  }
  const response = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  const data = await response.json();
  res.status(200).json(data.tables);
}
