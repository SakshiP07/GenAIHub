const express = require("express");
const {
  getObservability,
  postDemo,
  getDemo,
} = require("../controllers/observabilityController");

const router = express.Router();

router.get("/", getObservability);
router.get("/demo", getDemo);
router.post("/demo", postDemo);

module.exports = router;
