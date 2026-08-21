const TIPOS_LANCAMENTO = Object.freeze({
  RECEITA: "RECEITA",
  DESPESA: "DESPESA",
});

class Lancamento {
  constructor({ id, contaId, descricao, valor, tipo, data }) {
    this.id = id;
    this.contaId = contaId;
    this.descricao = descricao;
    this.valor = valor;
    this.tipo = tipo;
    this.data = data;
    this.registradoEm = new Date().toISOString();
  }
}

module.exports = { Lancamento, TIPOS_LANCAMENTO };
