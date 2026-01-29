import twilio from "twilio";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Simple auth check
  if (req.headers.authorization !== `Bearer ${process.env.API_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { caller_name, caller_phone, message, intent, urgency } = req.body;

  const client = twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  const smsBody =
`🔔 Ridgepointe AI Message
From: ${caller_name || "Unknown"}
Phone: ${caller_phone}
Intent: ${intent}
Urgency: ${urgency}

Message:
${message}`;

  try {
    const result = await client.messages.create({
      body: smsBody,
      from: process.env.TWILIO_NUMBER,
      to: process.env.OWNER_PHONE
    });

    return res.json({ ok: true, sid: result.sid });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false });
  }
}
