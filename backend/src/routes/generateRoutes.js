const express = require("express");
const { generateResponse } = require("../controllers/generateController");

const router = express.Router();

router.post("/", generateResponse);

module.exports = router;
