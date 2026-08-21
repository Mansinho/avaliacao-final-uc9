const contaService = require("../service/contaService");
const asyncHandler = require("../middleware/asyncHandler");

// CORREÇÃO (hotfix): toda rota assíncrona precisa passar pelo asyncHandler
// para que exceções sejam encaminhadas ao errorHandler central via
// next(err), em vez de se tornarem unhandled promise rejections capazes
// de travar a requisição sem resposta.
const cadastrar = asyncHandler(async (req, res) => {
  const conta = contaService.cadastrarConta(req.body);
  res.status(201).json({ sucesso: true, conta });
});

const listar = asyncHandler(async (req, res) => {
  const contas = contaService.listarContas();
  res.status(200).json({ sucesso: true, contas });
});

module.exports = { cadastrar, listar };