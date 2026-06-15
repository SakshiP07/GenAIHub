const models = require("../models/modelData");

function getModels(req, res) {
  res.json(models);
}

module.exports = { getModels };
