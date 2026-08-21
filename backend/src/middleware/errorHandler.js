const ErroValidacao = require("../utils/erroValidacao");
const { registrarIncidente } = require("../utils/logger");

/**
 * Middleware de erro do Express (precisa ter 4 parâmetros para ser
 * reconhecido como error handler).
 *
 * Garante o requisito de negócio: "Entradas inválidas não devem provocar
 * encerramento inesperado da aplicação." Toda exceção lançada em qualquer
 * camada passa por aqui antes de virar uma resposta HTTP.
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  if (err instanceof ErroValidacao) {
    registrarIncidente({
      nivel: "WARN",
      mensagem: `Entrada inválida rejeitada: ${err.message}`,
      detalhes: {
        campo: err.campo,
        rota: `${req.method} ${req.originalUrl}`,
        corpoRecebido: req.body,
      },
    });

    return res.status(err.statusCode).json({
      sucesso: false,
      erro: err.message,
      campo: err.campo,
    });
  }

  // Qualquer erro não previsto (bug real) cai aqui. Antes da correção da
  // Etapa 4, era exatamente esse ramo que expunha a falha de conversão.
  registrarIncidente({
    nivel: "ERROR",
    mensagem: `Erro não tratado: ${err.message}`,
    detalhes: {
      rota: `${req.method} ${req.originalUrl}`,
      corpoRecebido: req.body,
      stack: err.stack,
    },
  });

  return res.status(500).json({
    sucesso: false,
    erro: "Ocorreu um erro interno ao processar a solicitação.",
  });
}

module.exports = errorHandler;
