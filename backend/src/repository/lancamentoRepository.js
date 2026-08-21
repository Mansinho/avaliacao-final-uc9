/**
 * Repositório em memória para Lançamentos.
 */
const lancamentos = [];

function salvar(lancamento) {
  lancamentos.push(lancamento);
  return lancamento;
}

function listarTodos() {
  return [...lancamentos];
}

function listarPorConta(contaId) {
  return lancamentos.filter((lancamento) => lancamento.contaId === contaId);
}

module.exports = { salvar, listarTodos, listarPorConta };
