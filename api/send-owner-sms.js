export default function handler(req, res) {
  const auth = req.headers.authorization || "";
  if (auth !== `Bearer ${process.env.API_SECRET}`) {
    return res.status(401).json({ ok: false, error: "unauthorized" });
  }

  return res.status(200).json({
    ok: true,
    received: req.body ?? null
  });
}
