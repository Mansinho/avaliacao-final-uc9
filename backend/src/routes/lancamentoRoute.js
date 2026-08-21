const { Router } = require("express");
const lancamentoController = require("../controller/lancamentoController");

const router = Router();

router.post("/", lancamentoController.registrar);
router.get("/", lancamentoController.listar);
router.get("/saldo/:contaId", lancamentoController.saldo);

module.exports = router;
