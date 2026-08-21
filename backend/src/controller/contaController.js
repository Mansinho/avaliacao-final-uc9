const contaService = require("../service/contaService");
const asyncHandler = require("../middleware/asyncHandler");

const cadastrar = asyncHandler(async (req, res) => {
  const conta = contaService.cadastrarConta(req.body);
  res.status(201).json({ sucesso: true, conta });
});

const listar = asyncHandler(async (req, res) => {
  const contas = contaService.listarContas();
  res.status(200).json({ sucesso: true, contas });
});

module.exports = { cadastrar, listar };
