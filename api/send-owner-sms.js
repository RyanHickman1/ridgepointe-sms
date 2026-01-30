module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(200).send("OK (use POST for JSON)");
  }
  return res.status(200).json({ ok: true, received: req.body });
};
