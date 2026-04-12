export default async function handler(req, res) {
  // Allow CORS from our own frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'x-toggl-token');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const token = req.headers['x-toggl-token'];
  if (!token) { res.status(400).json({ error: 'No token' }); return; }

  // endpoint param: e.g. "me/projects?active=true" or "me/time_entries?start_date=..."
  const { endpoint } = req.query;
  if (!endpoint) { res.status(400).json({ error: 'No endpoint' }); return; }

  const togglUrl = 'https://api.track.toggl.com/api/v9/' + endpoint;

  try {
    const response = await fetch(togglUrl, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(token + ':api_token').toString('base64'),
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
