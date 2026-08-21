const app = require("./app");
const { registrarIncidente } = require("./src/utils/logger");

const PORTA = process.env.PORT || 3000;

// Rede de segurança de última instância: mesmo que um erro escape do
// errorHandler central (por exemplo, uma rota assíncrona sem proteção,
// como o cadastro de conta hoje), o incidente é registrado em log ANTES
// de qualquer decisão sobre encerrar o processo — nunca falhando em
// silêncio.
process.on("unhandledRejection", (motivo) => {
  registrarIncidente({
    nivel: "ERROR",
    mensagem: "unhandledRejection capturada no nível do processo",
    detalhes: { motivo: motivo instanceof Error ? motivo.stack : motivo },
  });
});

process.on("uncaughtException", (erro) => {
  registrarIncidente({
    nivel: "ERROR",
    mensagem: "uncaughtException capturada no nível do processo",
    detalhes: { stack: erro.stack },
  });
});

app.listen(PORTA, () => {
  console.log(`Sistema Financeiro rodando em http://localhost:${PORTA}`);
});