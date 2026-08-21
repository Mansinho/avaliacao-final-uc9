const { Router } = require("express");
const contaRoutes = require("./contaRoute");
const lancamentoRoutes = require("./lancamentoRoute");

const router = Router();

router.use("/contas", contaRoutes);
router.use("/lancamentos", lancamentoRoutes);

module.exports = router;
