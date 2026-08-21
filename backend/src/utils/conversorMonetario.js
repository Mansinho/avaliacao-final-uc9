const ErroValidacao = require("./erroValidacao");

/**
 * Converte a entrada bruta de "valor" (que pode chegar como number,
 * string com ponto ou string com vírgula decimal) para um float válido.
 *
 * @param {*} valorBruto
 * @returns {number}
 * @throws {ErroValidacao} quando a entrada não representa um número válido
 */
function converterValorMonetario(valorBruto) {
  if (valorBruto === null || valorBruto === undefined || valorBruto === "") {
    throw new ErroValidacao("O valor do lançamento é obrigatório.", "valor");
  }

  // Ajuste rápido para aceitar vírgula decimal vinda do formulário
  // (ex: "150,50"). Assume-se que o valor sempre chega como string.
  const valorNormalizado = valorBruto.replace(",", ".");

  const valorConvertido = Number(valorNormalizado);

  if (typeof valorConvertido !== "number" || Number.isNaN(valorConvertido)) {
    throw new ErroValidacao(
      `O valor "${valorBruto}" não é um número válido.`,
      "valor"
    );
  }

  if (!Number.isFinite(valorConvertido)) {
    throw new ErroValidacao(
      `O valor "${valorBruto}" não é um número finito.`,
      "valor"
    );
  }

  return valorConvertido;
}

module.exports = { converterValorMonetario };
