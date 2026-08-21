class Conta {
  constructor({ id, nome, saldoInicial = 0 }) {
    this.id = id;
    this.nome = nome;
    this.saldoInicial = saldoInicial;
    this.criadaEm = new Date().toISOString();
  }
}

module.exports = Conta;
