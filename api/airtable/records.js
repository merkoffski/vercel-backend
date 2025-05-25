export default async function handler(req, res) {
  const token = "patBKToDXZ9amoYZu.9f2cd5d6f123218ccc801b9572f13c843d789a016fda5004c9348d4d7c4b91e2";
  const baseId = "appLJzDto3H8RZQVb";
  const tableName = "Figma Base";

  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();
  res.status(200).json(data);
}
