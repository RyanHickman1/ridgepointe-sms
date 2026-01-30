import twilio from "twilio";

export default async function handler(req, res) {
  // Require Retell secret
  const auth = req.headers.authorization || "";
  if (auth !== `Bearer ${process.env.API_SECRET}`) {
    return res.status(401).json({ ok: false, error: "unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(200).json({ ok: true, note: "POST required" });
  }

  const { caller_name, caller_phone, message, intent, urgency } = req.body || {};

  if (!caller_phone || !message) {
    return res.status(400).json({ ok: false, error: "missing_fields" });
  }

  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  const smsBody =
`🔔 Ridgepointe AI Message
From: ${caller_name || "Unknown"}
Phone: ${caller_phone}
Intent: ${intent || "general"}
Urgency: ${urgency || "medium"}

Message:
${message}`.slice(0, 1500);

  try {
    const result = await client.messages.create({
      from: process.env.TWILIO_FROM_NUMBER,
      to: process.env.OWNER_PHONE,
      body: smsBody
    });

    return res.status(200).json({ ok: true, sent: true, sid: result.sid });
  } catch (e) {
    return res.status(500).json({
      ok: false,
      error: "twilio_failed",
      detail: String(e?.message || e)
    });
  }
}
