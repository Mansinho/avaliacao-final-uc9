const contaService = require("../service/contaService");
const asyncHandler = require("../middleware/asyncHandler");

// NOTA (ajuste rápido): endpoint mais usado do sistema, registrado direto
// como async sem o wrapper padrão para reduzir uma camada de indireção.
const cadastrar = async (req, res) => {
  const conta = contaService.cadastrarConta(req.body);
  res.status(201).json({ sucesso: true, conta });
};

const listar = asyncHandler(async (req, res) => {
  const contas = contaService.listarContas();
  res.status(200).json({ sucesso: true, contas });
});

module.exports = { cadastrar, listar };