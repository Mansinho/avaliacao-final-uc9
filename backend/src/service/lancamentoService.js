const { v4: uuidv4 } = require("uuid");
const { Lancamento, TIPOS_LANCAMENTO } = require("../model/lancamento");
const lancamentoRepository = require("../repository/lancamentoRepository");
const contaService = require("./contaService");
const ErroValidacao = require("../utils/erroValidacao");
const { converterValorMonetario } = require("../utils/conversorMonetario");

function validarTipo(tipo) {
  const tipoNormalizado = String(tipo || "").toUpperCase().trim();
  if (!Object.values(TIPOS_LANCAMENTO).includes(tipoNormalizado)) {
    throw new ErroValidacao(
      `Tipo de lançamento inválido: "${tipo}". Use RECEITA ou DESPESA.`,
      "tipo"
    );
  }
  return tipoNormalizado;
}

function validarDescricao(descricao) {
  if (!descricao || typeof descricao !== "string" || !descricao.trim()) {
    throw new ErroValidacao("A descrição do lançamento é obrigatória.", "descricao");
  }
  return descricao.trim();
}

function validarData(data) {
  if (!data) {
    throw new ErroValidacao("A data do lançamento é obrigatória.", "data");
  }
  const dataConvertida = new Date(data);
  if (Number.isNaN(dataConvertida.getTime())) {
    throw new ErroValidacao(`Data inválida: "${data}".`, "data");
  }
  return data;
}

function registrarLancamento({ contaId, descricao, valor, tipo, data }) {
  contaService.buscarContaOuFalhar(contaId);

  const descricaoValidada = validarDescricao(descricao);
  const tipoValidado = validarTipo(tipo);
  const dataValidada = validarData(data);

  // Ponto crítico do sistema: conversão de uma entrada externa (string vinda
  // do formulário/JSON) para um valor numérico confiável.
  const valorConvertido = converterValorMonetario(valor);

  if (valorConvertido <= 0) {
    throw new ErroValidacao("O valor do lançamento deve ser maior que zero.", "valor");
  }

  const lancamento = new Lancamento({
    id: uuidv4(),
    contaId,
    descricao: descricaoValidada,
    valor: valorConvertido,
    tipo: tipoValidado,
    data: dataValidada,
  });

  return lancamentoRepository.salvar(lancamento);
}

function listarLancamentos(contaId) {
  if (contaId) {
    contaService.buscarContaOuFalhar(contaId);
    return lancamentoRepository.listarPorConta(contaId);
  }
  return lancamentoRepository.listarTodos();
}

module.exports = { registrarLancamento, listarLancamentos };
