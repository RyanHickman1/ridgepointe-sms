export default function handler(req, res) {
  const got = req.headers.authorization || null;
  const env = process.env.API_SECRET || null;

  // Don’t leak full secret; only show length + first 4 chars
  const envPreview = env ? `${env.slice(0, 4)}… (len ${env.length})` : null;
  const gotPreview = got ? `${got.slice(0, 10)}… (len ${got.length})` : null;

  const expected = env ? `Bearer ${env}` : null;

  if (!env) {
    return res.status(500).json({
      ok: false,
      error: "API_SECRET missing on server",
      envPreview
    });
  }

  if (got !== expected) {
    return res.status(401).json({
      ok: false,
      error: "unauthorized",
      gotPreview,
      envPreview,
      tip: "Header must be: Authorization: Bearer <API_SECRET>"
    });
  }

  return res.status(200).json({ ok: true });
}
