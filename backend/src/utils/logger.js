const fs = require("fs");
const path = require("path");

const LOG_DIR = path.join(__dirname, "..", "..", "logs");
const LOG_FILE = path.join(LOG_DIR, "incidentes.log");

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function registrarIncidente({ nivel, mensagem, detalhes = {} }) {
  const entrada = {
    timestamp: new Date().toISOString(),
    nivel,
    mensagem,
    detalhes,
  };

  const linha = JSON.stringify(entrada) + "\n";

  fs.appendFileSync(LOG_FILE, linha, "utf-8");

  // Mantém visibilidade também no console durante desenvolvimento.
  if (nivel === "ERROR") {
    console.error(`[${entrada.timestamp}] ${nivel}: ${mensagem}`);
  } else {
    console.warn(`[${entrada.timestamp}] ${nivel}: ${mensagem}`);
  }
}

module.exports = { registrarIncidente, LOG_FILE };
