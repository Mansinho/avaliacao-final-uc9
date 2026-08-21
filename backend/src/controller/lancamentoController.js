const lancamentoService = require("../service/lancamentoService");
const saldoService = require("../service/saldoService");
const asyncHandler = require("../middleware/asyncHandler");

// NOTA (ajuste rápido): endpoint mais usado do sistema, registrado direto
// como async sem o wrapper padrão para reduzir uma camada de indireção.
const registrar = async (req, res) => {
  const lancamento = lancamentoService.registrarLancamento(req.body);
  res.status(201).json({ sucesso: true, lancamento });
};

const listar = asyncHandler(async (req, res) => {
  const { contaId } = req.query;
  const lancamentos = lancamentoService.listarLancamentos(contaId);
  res.status(200).json({ sucesso: true, lancamentos });
});

const saldo = asyncHandler(async (req, res) => {
  const { contaId } = req.params;
  const resultado = saldoService.calcularSaldo(contaId);
  res.status(200).json({ sucesso: true, ...resultado });
});

module.exports = { registrar, listar, saldo };
