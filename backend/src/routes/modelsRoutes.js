const express = require("express");
const { getModels } = require("../controllers/modelsController");

const router = express.Router();

router.get("/", getModels);

module.exports = router;
