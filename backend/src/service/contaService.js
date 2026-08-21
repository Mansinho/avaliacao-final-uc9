const { v4: uuidv4 } = require("uuid");
const Conta = require("../model/conta");
const contaRepository = require("../repository/contaRepository");
const ErroValidacao = require("../utils/erroValidacao");

/**
 * Converte a entrada bruta de "saldoInicial" para um número válido.
 *
 * CORREÇÃO (hotfix): a entrada pode chegar como number (ex: campo
 * vazio no frontend vira `saldoInicial || 0`, ou seja, o número 0) ou
 * como string, com ponto ou vírgula decimal (ex: "150.50" / "150,50").
 * Cada tipo é tratado explicitamente — nunca se assume um tipo
 * específico sem checagem.
 */
function converterSaldoInicial(saldoBruto) {
  if (saldoBruto === undefined || saldoBruto === null || saldoBruto === "") {
    return 0;
  }

  let saldoNormalizado;

  if (typeof saldoBruto === "number") {
    saldoNormalizado = saldoBruto;
  } else if (typeof saldoBruto === "string") {
    saldoNormalizado = saldoBruto.trim().replace(",", ".");
  } else {
    throw new ErroValidacao(
      `O saldo inicial deve ser texto ou número, mas foi recebido o tipo "${typeof saldoBruto}".`,
      "saldoInicial"
    );
  }

  const saldo = Number(saldoNormalizado);

  if (Number.isNaN(saldo) || !Number.isFinite(saldo)) {
    throw new ErroValidacao(
      `O saldo inicial "${saldoBruto}" não é um número válido.`,
      "saldoInicial"
    );
  }

  return saldo;
}

function cadastrarConta({ nome, saldoInicial }) {
  if (!nome || typeof nome !== "string" || !nome.trim()) {
    throw new ErroValidacao("A conta precisa de um nome.", "nome");
  }

  const saldo = converterSaldoInicial(saldoInicial);

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