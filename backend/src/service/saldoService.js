const contaService = require("./contaService");
const lancamentoRepository = require("../repository/lancamentoRepository");
const { TIPOS_LANCAMENTO } = require("../model/lancamento");

function calcularSaldo(contaId) {
  const conta = contaService.buscarContaOuFalhar(contaId);
  const lancamentos = lancamentoRepository.listarPorConta(contaId);

  const totalReceitas = lancamentos
    .filter((l) => l.tipo === TIPOS_LANCAMENTO.RECEITA)
    .reduce((soma, l) => soma + l.valor, 0);

  const totalDespesas = lancamentos
    .filter((l) => l.tipo === TIPOS_LANCAMENTO.DESPESA)
    .reduce((soma, l) => soma + l.valor, 0);

  const saldoAtual = conta.saldoInicial + totalReceitas - totalDespesas;

  return {
    contaId,
    nomeConta: conta.nome,
    saldoInicial: conta.saldoInicial,
    totalReceitas,
    totalDespesas,
    saldoAtual: Number(saldoAtual.toFixed(2)),
  };
}

module.exports = { calcularSaldo };
