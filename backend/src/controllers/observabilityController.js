const {
  getObservabilityData,
  startDemo,
  stopDemo,
  getDemoStatus,
} = require("../services/observabilityService");

function getObservability(req, res) {
  res.json(getObservabilityData());
}

function postDemo(req, res) {
  const action = req.body?.action;

  if (action === "start") {
    const status = startDemo();
    return res.json({
      ok: true,
      demoMode: status,
      data: getObservabilityData(),
    });
  }

  if (action === "stop") {
    const status = stopDemo();
    return res.json({
      ok: true,
      demoMode: status,
      data: getObservabilityData(),
    });
  }

  return res.status(400).json({
    error: { message: 'Invalid action. Use "start" or "stop".', status: 400 },
  });
}

function getDemo(req, res) {
  res.json({ demoMode: getDemoStatus() });
}

module.exports = {
  getObservability,
  postDemo,
  getDemo,
};
