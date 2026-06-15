const express = require("express");
const cors = require("cors");
const config = require("./config");
const routes = require("./routes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const requestLogger = require("./middleware/requestLogger");

const app = express();

app.use(requestLogger);
app.use(
  cors({
    origin: config.corsOrigin,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
