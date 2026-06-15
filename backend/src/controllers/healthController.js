function getHealth(req, res) {
  res.json({ status: "healthy" });
}

module.exports = { getHealth };
