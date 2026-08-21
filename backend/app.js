const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./src/routes");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

// Serve o frontend vanilla estático diretamente pela API.
app.use(express.static(path.join(__dirname, "..", "frontend")));
app.use("/api", routes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ sucesso: true, status: "ok" });
});

// Precisa ser o último middleware registrado.
app.use(errorHandler);

module.exports = app;
