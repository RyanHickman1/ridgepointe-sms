export default async function handler(req, res) {
  const auth = req.headers.authorization || "";

  if (auth !== `Bearer ${process.env.API_SECRET}`) {
    return res.status(401).json({ ok: false, error: "unauthorized" });
  }

  const { caller_name, caller_phone, message, intent, urgency } = req.body || {};

  // Basic validation
  if (!caller_phone || !message) {
    return res.status(400).json({ ok: false, error: "missing_fields" });
  }

  // For now we’re not sending SMS yet — just confirming receipt.
  return res.status(200).json({
    ok: true,
    delivered: true,
    channel: "owner_notification",
    id: `mock_${Date.now()}`
  });
}
