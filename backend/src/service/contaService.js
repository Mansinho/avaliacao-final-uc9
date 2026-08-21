const { v4: uuidv4 } = require("uuid");
const Conta = require("../model/conta");
const contaRepository = require("../repository/contaRepository");
const ErroValidacao = require("../utils/erroValidacao");

function cadastrarConta({ nome, saldoInicial }) {
  if (!nome || typeof nome !== "string" || !nome.trim()) {
    throw new ErroValidacao("A conta precisa de um nome.", "nome");
  }

  let saldo = 0;
  if (saldoInicial !== undefined && saldoInicial !== null) {
    saldo = Number(saldoInicial);
    if (Number.isNaN(saldo)) {
      throw new ErroValidacao("Saldo inicial inválido.", "saldoInicial");
    }
  }

  const conta = new Conta({ id: uuidv4(), nome: nome.trim(), saldoInicial: saldo });
  return contaRepository.salvar(conta);
}

function listarContas() {
  return contaRepository.listarTodas();
}

function buscarContaOuFalhar(id) {
  const conta = contaRepository.buscarPorId(id);
  if (!conta) {
    throw new ErroValidacao(`Conta com id "${id}" não encontrada.`, "contaId");
  }
  return conta;
}

module.exports = { cadastrarConta, listarContas, buscarContaOuFalhar };
