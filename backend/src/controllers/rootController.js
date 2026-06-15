function getRoot(req, res) {
  res.json({
    name: "GenAIHub API",
    status: "running",
    endpoints: {
      health: "GET /health",
      models: "GET /models",
      generate: "POST /generate",
    },
  });
}

module.exports = { getRoot };
