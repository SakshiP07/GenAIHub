const express = require("express");
const { getRoot } = require("../controllers/rootController");
const healthRoutes = require("./healthRoutes");
const modelsRoutes = require("./modelsRoutes");
const generateRoutes = require("./generateRoutes");
const observabilityRoutes = require("./observabilityRoutes");

const router = express.Router();

router.get("/", getRoot);
router.use("/health", healthRoutes);
router.use("/models", modelsRoutes);
router.use("/generate", generateRoutes);
router.use("/observability", observabilityRoutes);

module.exports = router;
