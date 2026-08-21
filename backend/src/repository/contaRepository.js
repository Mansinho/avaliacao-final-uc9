/**
 * Repositório em memória para Contas.
 * Isola o "armazenamento" do restante da aplicação — trocar para um banco
 * de dados real no futuro significa reescrever apenas este arquivo.
 */
const contas = [];

function salvar(conta) {
  contas.push(conta);
  return conta;
}

function listarTodas() {
  return [...contas];
}

function buscarPorId(id) {
  return contas.find((conta) => conta.id === id) || null;
}

function existe(id) {
  return contas.some((conta) => conta.id === id);
}

module.exports = { salvar, listarTodas, buscarPorId, existe };