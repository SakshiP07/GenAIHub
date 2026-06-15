const app = require("./app");
const config = require("./config");

const server = app.listen(config.port, "0.0.0.0", () => {
  console.log(`GenAIHub API running on http://localhost:${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log("Endpoints:");
  console.log(`  GET  http://localhost:${config.port}/`);
  console.log(`  GET  http://localhost:${config.port}/health`);
  console.log(`  GET  http://localhost:${config.port}/models`);
  console.log(`  POST http://localhost:${config.port}/generate`);
  console.log("Waiting for requests...");
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `Port ${config.port} is already in use. Run: lsof -ti :${config.port} | xargs kill -9`
    );
  } else {
    console.error("Server error:", error.message);
  }
  process.exit(1);
});
